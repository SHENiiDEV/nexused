<?php

namespace App\Jobs\Ai;

use App\Events\CourseGenerationProgress;
use App\Models\Course;
use App\Models\Lesson;
use App\Services\Ai\OpenAiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateLessonContent implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public int $lessonId,
        public ?string $previousLessonContext = null
    ) {}

    public function handle(OpenAiService $aiService): void
    {
        $lesson = Lesson::with('module.course')->findOrFail($this->lessonId);
        $course = $lesson->module->course;

        $systemPrompt = <<<PROMPT
You are a distinguished computer science educator and principal engineer.
Write an in-depth, production-grade educational lesson in GitHub-flavored Markdown.
Structure your lesson with:
- Engaging introduction explaining why this concept matters in production
- Clear architectural diagram or ASCII art workflow
- Step-by-step technical explanation with production-grade code snippets
- Common pitfalls, edge cases, and security / performance considerations
- Practical summary and key takeaways
Never use fluff. Keep tone rigorous, practical, and crystal clear.
PROMPT;

        $userPrompt = "Course: '{$course->title}'\nModule: '{$lesson->module->title}'\nLesson: '{$lesson->title}'\n";
        if ($this->previousLessonContext) {
            $userPrompt .= "Previous Lesson Context: '{$this->previousLessonContext}'\n";
        }
        $userPrompt .= "Generate complete lesson markdown longform with code examples.";

        $markdown = $aiService->generateText($systemPrompt, $userPrompt);

        $lesson->content = $markdown;
        $lesson->save();

        // Calculate progress dynamically
        $totalLessons = Lesson::whereHas('module', fn($q) => $q->where('course_id', $course->id))->count();
        $completedLessons = Lesson::whereHas('module', fn($q) => $q->where('course_id', $course->id))
            ->where('content', 'not like', '%Draft content generating%')
            ->count();

        $progress = min(75, 25 + (int)(($completedLessons / max(1, $totalLessons)) * 50));

        $course->update([
            'generation_step' => "Generated content for '{$lesson->title}'",
            'generation_progress' => $progress,
        ]);

        event(new CourseGenerationProgress(
            $course->id,
            $progress,
            'Lesson Content Generated',
            "Completed longform markdown content and code examples for: {$lesson->title}"
        ));
    }
}
