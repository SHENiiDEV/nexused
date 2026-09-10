<?php

namespace App\Jobs\Ai;

use App\Events\CourseGenerationProgress;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\QuizOption;
use App\Services\Ai\OpenAiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateQuiz implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public int $lessonId
    ) {}

    public function handle(OpenAiService $aiService): void
    {
        $lesson = Lesson::with('module.course')->findOrFail($this->lessonId);
        $course = $lesson->module->course;

        $systemPrompt = <<<PROMPT
You are a senior technical examiner and psychometric assessment author.
Based on the provided lesson content, generate 3 to 4 rigorous multiple-choice questions in JSON format:
{
  "questions": [
    {
      "question_text": "string",
      "explanation": "Detailed explanation of why the correct answer is right and why the detractors are wrong.",
      "options": [
        {"option_text": "string", "is_correct": false},
        {"option_text": "string", "is_correct": true},
        {"option_text": "string", "is_correct": false},
        {"option_text": "string", "is_correct": false}
      ]
    }
  ]
}
IMPORTANT: Exactly one option per question must have is_correct: true. Each question must have 4 options.
PROMPT;

        $userPrompt = "Analyze this lesson content and generate comprehension quiz questions:\n\n" . substr($lesson->content, 0, 4000);

        $data = $aiService->generateJson($systemPrompt, $userPrompt);

        $order = 1;
        foreach ($data['questions'] ?? [] as $qData) {
            $quiz = Quiz::create([
                'lesson_id' => $lesson->id,
                'question_text' => $qData['question_text'] ?? "Question {$order}",
                'explanation' => $qData['explanation'] ?? null,
                'order' => $order++,
            ]);

            $optOrder = 1;
            $hasCorrect = false;
            foreach ($qData['options'] ?? [] as $opt) {
                $isCorrect = (bool)($opt['is_correct'] ?? false);
                if ($isCorrect && !$hasCorrect) {
                    $hasCorrect = true;
                } elseif ($isCorrect && $hasCorrect) {
                    $isCorrect = false; // ensure exactly one
                }

                QuizOption::create([
                    'quiz_id' => $quiz->id,
                    'option_text' => $opt['option_text'] ?? "Option {$optOrder}",
                    'is_correct' => $isCorrect,
                    'order' => $optOrder++,
                ]);
            }

            // Fallback if no option was marked correct
            if (!$hasCorrect && $quiz->options()->count() > 0) {
                $firstOpt = $quiz->options()->first();
                $firstOpt->update(['is_correct' => true]);
            }
        }

        $course->update([
            'generation_step' => "Generated interactive quizzes for '{$lesson->title}'",
            'generation_progress' => min(95, $course->generation_progress + 3),
        ]);

        event(new CourseGenerationProgress(
            $course->id,
            $course->generation_progress,
            'Quizzes Generated',
            "Created assessment questions and explanations for: {$lesson->title}"
        ));
    }
}
