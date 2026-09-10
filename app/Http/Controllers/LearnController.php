<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\QuizOption;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LearnController extends Controller
{
    /**
     * SPA Course Player
     */
    public function player(string $courseSlug, ?string $lessonSlug = null): Response|RedirectResponse
    {
        $user = auth()->user();

        $course = Course::where('slug', $courseSlug)
            ->with(['modules.lessons.quizzes.options'])
            ->firstOrFail();

        // Check or auto-enroll if user is owner / admin or has enrollment
        $enrollment = Enrollment::firstOrCreate(
            ['user_id' => $user->id, 'course_id' => $course->id],
            ['company_id' => $user->company_id]
        );

        $allLessons = $course->modules->flatMap->lessons;
        if ($allLessons->isEmpty()) {
            return redirect()->route('courses.show', $courseSlug);
        }

        $currentLesson = null;
        if ($lessonSlug) {
            $currentLesson = $allLessons->firstWhere('slug', $lessonSlug);
        }

        if (!$currentLesson) {
            // Find first uncompleted lesson, or default to first
            $completedIds = LessonProgress::where('user_id', $user->id)
                ->whereIn('lesson_id', $allLessons->pluck('id'))
                ->where('is_completed', true)
                ->pluck('lesson_id')
                ->toArray();

            $currentLesson = $allLessons->first(fn($l) => !in_array($l->id, $completedIds)) ?? $allLessons->first();
        }

        $completedLessonIds = LessonProgress::where('user_id', $user->id)
            ->whereIn('lesson_id', $allLessons->pluck('id'))
            ->where('is_completed', true)
            ->pluck('lesson_id')
            ->toArray();

        // Attempts for current lesson quizzes
        $quizAttempts = QuizAttempt::where('user_id', $user->id)
            ->whereIn('quiz_id', $currentLesson->quizzes->pluck('id'))
            ->get()
            ->keyBy('quiz_id');

        return Inertia::render('Learn/Player', [
            'course' => $course,
            'currentLesson' => $currentLesson,
            'completedLessonIds' => $completedLessonIds,
            'quizAttempts' => $quizAttempts,
            'enrollment' => $enrollment,
        ]);
    }

    /**
     * Mark lesson completed
     */
    public function completeLesson(Request $request, Lesson $lesson): JsonResponse
    {
        $user = auth()->user();

        $progress = LessonProgress::updateOrCreate(
            ['user_id' => $user->id, 'lesson_id' => $lesson->id],
            ['is_completed' => true, 'completed_at' => now()]
        );

        $course = $lesson->module->course;
        $totalLessons = Lesson::whereHas('module', fn($q) => $q->where('course_id', $course->id))->count();
        $completedCount = LessonProgress::where('user_id', $user->id)
            ->whereHas('lesson.module', fn($q) => $q->where('course_id', $course->id))
            ->where('is_completed', true)
            ->count();

        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        $isCourseCompleted = false;
        $certificateCode = null;

        if ($completedCount >= $totalLessons && $enrollment) {
            if (!$enrollment->completed_at) {
                $certificateCode = 'CERT-' . strtoupper(Str::random(10));
                $enrollment->update([
                    'completed_at' => now(),
                    'certificate_code' => $certificateCode,
                ]);
            } else {
                $certificateCode = $enrollment->certificate_code;
            }
            $isCourseCompleted = true;
        }

        return response()->json([
            'success' => true,
            'completed_lesson_id' => $lesson->id,
            'completed_count' => $completedCount,
            'total_lessons' => $totalLessons,
            'is_course_completed' => $isCourseCompleted,
            'certificate_code' => $certificateCode,
        ]);
    }

    /**
     * Submit quiz answer with instant feedback & explanation
     */
    public function submitQuiz(Request $request, Quiz $quiz): JsonResponse
    {
        $request->validate([
            'quiz_option_id' => 'required|exists:quiz_options,id',
        ]);

        $user = auth()->user();
        $selectedOption = QuizOption::where('quiz_id', $quiz->id)
            ->where('id', $request->input('quiz_option_id'))
            ->firstOrFail();

        $correctOption = QuizOption::where('quiz_id', $quiz->id)
            ->where('is_correct', true)
            ->first();

        $attempt = QuizAttempt::updateOrCreate(
            ['user_id' => $user->id, 'quiz_id' => $quiz->id],
            [
                'quiz_option_id' => $selectedOption->id,
                'is_correct' => $selectedOption->is_correct,
            ]
        );

        return response()->json([
            'is_correct' => $selectedOption->is_correct,
            'selected_option_id' => $selectedOption->id,
            'correct_option_id' => $correctOption?->id,
            'explanation' => $quiz->explanation,
        ]);
    }

    /**
     * Certificate verification and display
     */
    public function certificate(string $code): Response
    {
        $enrollment = Enrollment::where('certificate_code', $code)
            ->with(['user', 'course'])
            ->firstOrFail();

        return Inertia::render('Learn/Certificate', [
            'enrollment' => $enrollment,
        ]);
    }
}
