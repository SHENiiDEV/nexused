<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Services\Billing\PaymentGatewayManager;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Course::where('status', 'published')->withCount(['modules', 'lessons']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('topic', 'like', "%{$search}%");
            });
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float)$request->input('max_price'));
        }

        $courses = $query->latest()->get();

        $enrolledCourseIds = [];
        if (auth()->check()) {
            $enrolledCourseIds = Enrollment::where('user_id', auth()->id())->pluck('course_id')->toArray();
        }

        return Inertia::render('Courses/Index', [
            'courses' => $courses,
            'filters' => $request->only(['search', 'max_price']),
            'enrolledCourseIds' => $enrolledCourseIds,
        ]);
    }

    public function show(string $slug, PaymentGatewayManager $gatewayManager): Response
    {
        $course = Course::where('slug', $slug)
            ->with(['modules.lessons' => function ($q) {
                $q->select('id', 'module_id', 'title', 'slug', 'type', 'duration_minutes', 'order');
            }, 'creator:id,name'])
            ->firstOrFail();

        $isEnrolled = false;
        $completedLessonsCount = 0;

        if (auth()->check()) {
            $enrollment = Enrollment::where('user_id', auth()->id())
                ->where('course_id', $course->id)
                ->first();

            $isEnrolled = (bool)$enrollment;

            if ($isEnrolled) {
                $lessonIds = $course->modules->flatMap->lessons->pluck('id');
                $completedLessonsCount = auth()->user()->lessonProgress()
                    ->whereIn('lesson_id', $lessonIds)
                    ->where('is_completed', true)
                    ->count();
            }
        }

        return Inertia::render('Courses/Show', [
            'course' => $course,
            'isEnrolled' => $isEnrolled,
            'completedLessonsCount' => $completedLessonsCount,
            'availableGateways' => $gatewayManager->getAvailableGateways(),
        ]);
    }
}
