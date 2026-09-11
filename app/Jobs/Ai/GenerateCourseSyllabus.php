<?php

namespace App\Jobs\Ai;

use App\Events\CourseGenerationProgress;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Module;
use App\Services\Ai\OpenAiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Str;

class GenerateCourseSyllabus implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public int $courseId
    ) {}

    public function handle(OpenAiService $aiService): void
    {
        $course = Course::findOrFail($this->courseId);

        $course->update([
            'status' => 'generating',
            'generation_step' => 'Generating Course Syllabus & Structure with AI...',
            'generation_progress' => 15,
        ]);

        event(new CourseGenerationProgress(
            $course->id,
            15,
            'Generating Syllabus',
            "Analyzing topic '{$course->topic}' and generating curriculum outline..."
        ));

        $systemPrompt = <<<PROMPT
You are an elite instructional designer and senior technical architect.
Generate a structured course curriculum in JSON with the exact format:
{
  "course_title": "string",
  "description": "string",
  "target_audience": "string",
  "estimated_hours": 6,
  "modules": [
    {
      "title": "string",
      "description": "string",
      "lessons": [
        {"title": "string", "type": "text", "duration_minutes": 15},
        {"title": "string", "type": "interactive", "duration_minutes": 20}
      ]
    }
  ]
}
Each course must have 3 modules, and each module must have 2 to 3 lessons.
PROMPT;

        $userPrompt = "Generate comprehensive syllabus for topic: '{$course->topic}', desired retail price: €{$course->price}.";

        $data = $aiService->generateJson($systemPrompt, $userPrompt);

        if (!empty($data['description'])) {
            $course->description = $data['description'];
        }
        if (!empty($data['target_audience'])) {
            $course->target_audience = $data['target_audience'];
        }
        if (!empty($data['estimated_hours'])) {
            $course->estimated_hours = $data['estimated_hours'];
        }
        $course->generation_step = 'Saving Modules and Lesson Outlines...';
        $course->generation_progress = 25;
        $course->save();

        \App\Services\Ai\CourseThumbnailGenerator::generate($course);

        event(new CourseGenerationProgress(
            $course->id,
            25,
            'Syllabus Created',
            "Generated structure with " . count($data['modules'] ?? []) . " modules. Creating draft lessons..."
        ));

        $moduleOrder = 1;
        $chainJobs = [];
        $previousLessonTitle = null;
        $modules = array_slice($data['modules'] ?? [], 0, 3);

        foreach ($modules as $modData) {
            $module = Module::create([
                'course_id' => $course->id,
                'title' => $modData['title'] ?? "Module {$moduleOrder}",
                'description' => $modData['description'] ?? null,
                'order' => $moduleOrder++,
            ]);

            $lessonOrder = 1;
            $lessons = array_slice($modData['lessons'] ?? [], 0, 3);
            foreach ($lessons as $lesData) {
                $lesson = Lesson::create([
                    'module_id' => $module->id,
                    'title' => $lesData['title'] ?? "Lesson {$lessonOrder}",
                    'slug' => Str::slug($lesData['title'] ?? "lesson-{$lessonOrder}") . '-' . Str::random(5),
                    'type' => $lesData['type'] ?? 'text',
                    'order' => $lessonOrder++,
                    'duration_minutes' => $lesData['duration_minutes'] ?? 15,
                    'content' => "# {$lesData['title']}\n\n*Draft content generating...*",
                ]);

                // Append chained jobs for each lesson
                $chainJobs[] = new GenerateLessonContent($lesson->id, $previousLessonTitle);
                $chainJobs[] = new GenerateQuiz($lesson->id);

                $previousLessonTitle = $lesson->title;
            }
        }

        // Append final completion job
        $chainJobs[] = new FinalizeCourseGeneration($course->id);

        // Dispatch chain
        Bus::chain($chainJobs)->dispatch();
    }
}
