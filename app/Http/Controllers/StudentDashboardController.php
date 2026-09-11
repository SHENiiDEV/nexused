<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\LessonProgress;
use App\Services\Gamification\GamificationService;
use Inertia\Inertia;
use Inertia\Response;

class StudentDashboardController extends Controller
{
    public function index(GamificationService $gamificationService): Response
    {
        $user = auth()->user();

        // 1. Gamification stats & levels
        $gamification = $gamificationService->getUserStats($user);

        // 2. Fetch all user enrollments with course details
        $enrollments = Enrollment::where('user_id', $user->id)
            ->with(['course.modules.lessons'])
            ->latest()
            ->get();

        $coursesInProgress = [];
        $completedCertificates = [];

        foreach ($enrollments as $enrollment) {
            $course = $enrollment->course;
            if (!$course) {
                continue;
            }

            // Calculate total lessons in course
            $allLessons = $course->modules->flatMap->lessons;
            $totalLessonsCount = $allLessons->count();

            // Calculate completed lessons in this course
            $lessonIds = $allLessons->pluck('id');
            $completedLessonIds = LessonProgress::where('user_id', $user->id)
                ->whereIn('lesson_id', $lessonIds)
                ->where('is_completed', true)
                ->pluck('lesson_id')
                ->toArray();

            $completedCount = count($completedLessonIds);
            $progressPercent = $totalLessonsCount > 0
                ? round(($completedCount / $totalLessonsCount) * 100)
                : 0;

            // Find next uncompleted lesson to resume
            $nextLesson = $allLessons->first(fn ($lesson) => !in_array($lesson->id, $completedLessonIds))
                ?? $allLessons->first();

            $courseCard = [
                'enrollment_id' => $enrollment->id,
                'course_id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'category' => $course->category,
                'level' => $course->level,
                'duration_hours' => $course->duration_hours,
                'thumbnail_url' => $course->thumbnail_url,
                'total_lessons' => $totalLessonsCount,
                'completed_lessons' => $completedCount,
                'progress_percent' => $progressPercent,
                'next_lesson_slug' => $nextLesson ? $nextLesson->slug : null,
                'next_lesson_title' => $nextLesson ? $nextLesson->title : 'Start Course',
                'enrolled_at' => $enrollment->created_at->format('M d, Y'),
                'is_completed' => !empty($enrollment->completed_at),
                'completed_at' => $enrollment->completed_at ? $enrollment->completed_at->format('M d, Y') : null,
                'certificate_code' => $enrollment->certificate_code,
            ];

            if ($enrollment->completed_at && $enrollment->certificate_code) {
                $completedCertificates[] = $courseCard;
            } else {
                $coursesInProgress[] = $courseCard;
            }
        }

        // 3. Recommended courses (published courses user is not enrolled in)
        $enrolledCourseIds = $enrollments->pluck('course_id');
        $recommendedCourses = Course::where('status', 'published')
            ->whereNotIn('id', $enrolledCourseIds)
            ->take(3)
            ->get()
            ->map(fn ($c) => [
                'id' => $c->id,
                'title' => $c->title,
                'slug' => $c->slug,
                'category' => $c->category,
                'level' => $c->level,
                'duration_hours' => $c->duration_hours,
                'price' => $c->price,
                'thumbnail_url' => $c->thumbnail_url,
            ]);

        return Inertia::render('Student/Dashboard', [
            'gamification' => $gamification,
            'coursesInProgress' => $coursesInProgress,
            'completedCertificates' => $completedCertificates,
            'recommendedCourses' => $recommendedCourses,
        ]);
    }
}
