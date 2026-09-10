<?php

namespace App\Http\Controllers;

use App\Jobs\Ai\GenerateCourseSyllabus;
use App\Models\AuditLog;
use App\Models\Course;
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
}
