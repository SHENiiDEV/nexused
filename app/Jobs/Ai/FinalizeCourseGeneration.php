<?php

namespace App\Jobs\Ai;

use App\Events\CourseGenerationCompleted;
use App\Events\CourseGenerationProgress;
use App\Models\Course;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class FinalizeCourseGeneration implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public int $courseId
    ) {}

    public function handle(): void
    {
        $course = Course::findOrFail($this->courseId);

        $course->update([
            'status' => 'published',
            'generation_step' => 'Course Generation Completed Successfully',
            'generation_progress' => 100,
        ]);

        event(new CourseGenerationProgress(
            $course->id,
            100,
            'Complete',
            "Course '{$course->title}' is now fully compiled, reviewed, and published to the catalog."
        ));

        event(new CourseGenerationCompleted(
            $course->id,
            $course->title,
            $course->slug
        ));
    }
}
