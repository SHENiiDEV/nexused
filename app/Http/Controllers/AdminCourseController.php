<?php

namespace App\Http\Controllers;

use App\Jobs\Ai\GenerateCourseSyllabus;
use App\Models\AuditLog;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\Quiz;
use App\Models\QuizOption;
use App\Models\Transaction;
use App\Services\Audit\AuditLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminCourseController extends Controller
{
    public function generator(): Response
    {
        $courses = Course::withCount(['modules', 'lessons'])->latest()->take(10)->get();

        return Inertia::render('Admin/CourseGenerator', [
            'recentCourses' => $courses,
        ]);
    }

    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'topic' => 'required|string|min:3|max:200',
            'price' => 'required|numeric|min:0|max:2000',
            'target_audience' => 'nullable|string|max:200',
            'estimated_hours' => 'nullable|integer|min:1|max:50',
        ]);

        $user = auth()->user();

        $course = Course::create([
            'creator_id' => $user->id,
            'title' => $validated['topic'],
            'slug' => Str::slug($validated['topic']) . '-' . Str::random(5),
            'topic' => $validated['topic'],
            'price' => $validated['price'],
            'target_audience' => $validated['target_audience'] ?? 'Engineers & Tech Professionals',
            'estimated_hours' => $validated['estimated_hours'] ?? 5,
            'status' => 'generating',
            'generation_step' => 'Queued for AI Generation Pipeline',
            'generation_progress' => 5,
        ]);

        AuditLogger::record('course.generation_started', 'Course', $course->id, [
            'topic' => $course->topic,
            'price' => $course->price,
        ]);

        // Dispatch Job Chaining Pipeline
        GenerateCourseSyllabus::dispatch($course->id);

        return response()->json([
            'success' => true,
            'course_id' => $course->id,
            'course_slug' => $course->slug,
            'status' => $course->status,
            'progress' => $course->generation_progress,
            'step' => $course->generation_step,
        ]);
    }

    public function status(Course $course): JsonResponse
    {
        $modulesCount = $course->modules()->count();
        $lessonsCount = $course->lessons()->count();
        $completedLessonsCount = $course->lessons()->where('content', 'not like', '%Draft content generating%')->count();

        return response()->json([
            'id' => $course->id,
            'title' => $course->title,
            'slug' => $course->slug,
            'status' => $course->status,
            'generation_progress' => $course->generation_progress,
            'generation_step' => $course->generation_step,
            'modules_count' => $modulesCount,
            'lessons_count' => $lessonsCount,
            'completed_lessons_count' => $completedLessonsCount,
            'view_url' => route('courses.show', $course->slug),
        ]);
    }

    public function transactions(): Response
    {
        $transactions = Transaction::with(['user', 'course', 'company'])
            ->latest()
            ->paginate(15);

        $auditLogs = AuditLog::with('user')
            ->latest('id')
            ->take(30)
            ->get();

        return Inertia::render('Admin/Transactions', [
            'transactions' => $transactions,
            'auditLogs' => $auditLogs,
        ]);
    }

    public function import(Request $request): JsonResponse
    {
        $payload = null;

        if ($request->hasFile('course_file')) {
            $file = $request->file('course_file');
            $content = file_get_contents($file->getRealPath());
            $payload = json_decode($content, true);
        } elseif ($request->filled('json_payload')) {
            $payload = json_decode($request->input('json_payload'), true);
        }

        if (!is_array($payload) || empty($payload['title'])) {
            return response()->json(['error' => 'Invalid JSON structure. Ensure "title" and "modules" exist.'], 422);
        }

        $user = auth()->user();

        $course = Course::create([
            'creator_id' => $user->id,
            'title' => $payload['title'],
            'slug' => Str::slug($payload['title']) . '-' . Str::random(5),
            'description' => $payload['description'] ?? 'Imported course curriculum.',
            'topic' => $payload['topic'] ?? 'Technology',
            'price' => (float)($payload['price'] ?? 49.00),
            'target_audience' => $payload['target_audience'] ?? 'Engineers & Professionals',
            'estimated_hours' => (int)($payload['estimated_hours'] ?? 5),
            'status' => 'published',
            'generation_step' => 'Imported via JSON File',
            'generation_progress' => 100,
        ]);

        $modOrder = 1;
        foreach ($payload['modules'] ?? [] as $m) {
            $module = Module::create([
                'course_id' => $course->id,
                'title' => $m['title'] ?? "Module {$modOrder}",
                'description' => $m['description'] ?? null,
                'order' => $modOrder++,
            ]);

            $lesOrder = 1;
            foreach ($m['lessons'] ?? [] as $l) {
                $lesson = Lesson::create([
                    'module_id' => $module->id,
                    'title' => $l['title'] ?? "Lesson {$lesOrder}",
                    'slug' => Str::slug($l['title'] ?? "lesson-{$lesOrder}") . '-' . Str::random(4),
                    'content' => $l['content'] ?? "# {$l['title']}\n\nLesson notes.",
                    'type' => $l['type'] ?? 'text',
                    'order' => $lesOrder++,
                    'duration_minutes' => (int)($l['duration_minutes'] ?? 15),
                ]);

                $qOrder = 1;
                foreach ($l['quizzes'] ?? [] as $q) {
                    $quiz = Quiz::create([
                        'lesson_id' => $lesson->id,
                        'question_text' => $q['question_text'] ?? "Question {$qOrder}",
                        'explanation' => $q['explanation'] ?? null,
                        'order' => $qOrder++,
                    ]);

                    $optOrder = 1;
                    $hasCorrect = false;
                    foreach ($q['options'] ?? [] as $opt) {
                        $isCorrect = (bool)($opt['is_correct'] ?? false);
                        if ($isCorrect && !$hasCorrect) {
                            $hasCorrect = true;
                        } elseif ($isCorrect && $hasCorrect) {
                            $isCorrect = false;
                        }

                        QuizOption::create([
                            'quiz_id' => $quiz->id,
                            'option_text' => $opt['option_text'] ?? "Option {$optOrder}",
                            'is_correct' => $isCorrect,
                            'order' => $optOrder++,
                        ]);
                    }

                    if (!$hasCorrect && $quiz->options()->count() > 0) {
                        $quiz->options()->first()->update(['is_correct' => true]);
                    }
                }
            }
        }

        \App\Services\Ai\CourseThumbnailGenerator::generate($course);

        AuditLogger::record('course.imported', 'Course', $course->id, [
            'title' => $course->title,
            'modules' => count($payload['modules'] ?? []),
        ]);

        return response()->json([
            'success' => true,
            'course_id' => $course->id,
            'slug' => $course->slug,
            'title' => $course->title,
            'view_url' => route('courses.show', $course->slug),
        ]);
    }

    public function downloadTemplate(): JsonResponse
    {
        $template = [
            'title' => 'Sample Masterclass Title',
            'topic' => 'Cloud & AI',
            'price' => 49.00,
            'estimated_hours' => 6,
            'description' => 'Detailed course overview and learning objectives.',
            'target_audience' => 'Software Engineers & Architects',
            'modules' => [
                [
                    'title' => 'Module 1: Foundations',
                    'description' => 'Introduction to core concepts.',
                    'lessons' => [
                        [
                            'title' => 'Lesson 1.1: Core Invariants',
                            'type' => 'text',
                            'duration_minutes' => 15,
                            'content' => "# Introduction\n\nLesson content in **Markdown** format with code:\n\n```go\nfunc main() {\n    fmt.Println(\"Hello World\")\n}\n```",
                            'quizzes' => [
                                [
                                    'question_text' => 'What is the primary benefit of idempotency?',
                                    'explanation' => 'It prevents duplicate state mutations upon retry.',
                                    'options' => [
                                        ['option_text' => 'Bypasses TLS encryption', 'is_correct' => false],
                                        ['option_text' => 'Ensures retry safety with zero duplicate mutations', 'is_correct' => true],
                                        ['option_text' => 'Compresses database size', 'is_correct' => false],
                                        ['option_text' => 'Speeds up client browser loading', 'is_correct' => false],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        return response()->json($template);
    }
}
