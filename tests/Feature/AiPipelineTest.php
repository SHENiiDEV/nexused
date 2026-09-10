<?php

namespace Tests\Feature;

use App\Jobs\Ai\GenerateCourseSyllabus;
use App\Jobs\Ai\GenerateLessonContent;
use App\Jobs\Ai\GenerateQuiz;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;
use App\Services\Ai\OpenAiService;
use Tests\TestCase;

class AiPipelineTest extends TestCase
{
    public function test_ai_syllabus_generator_job_creates_modules_and_lessons(): void
    {
        $admin = User::firstWhere('role', 'admin') ?? User::factory()->create(['role' => 'admin']);

        $course = Course::create([
            'creator_id' => $admin->id,
            'title' => 'Advanced Microservices Architecture',
            'slug' => 'advanced-microservices-test',
            'topic' => 'Microservices Architecture',
            'price' => 79.00,
            'status' => 'generating',
            'generation_step' => 'Initial',
            'generation_progress' => 5,
        ]);

        $aiService = new OpenAiService();
        $job = new GenerateCourseSyllabus($course->id);
        $job->handle($aiService);

        $course->refresh();

        $this->assertGreaterThan(0, $course->modules()->count());
        $this->assertGreaterThan(0, $course->lessons()->count());
        // In sync queue, the entire chain completes through FinalizeCourseGeneration
        $this->assertEquals(100, $course->generation_progress);
        $this->assertEquals('published', $course->status);
    }

    public function test_ai_lesson_content_generation_populates_markdown(): void
    {
        $admin = User::firstWhere('role', 'admin');
        $course = Course::create([
            'creator_id' => $admin->id,
            'title' => 'Test Course For Lesson AI',
            'slug' => 'test-course-lesson-ai',
            'topic' => 'Go Concurrency',
            'price' => 50.00,
        ]);

        $module = Module::create([
            'course_id' => $course->id,
            'title' => 'Test Module',
            'order' => 1,
        ]);

        $lesson = Lesson::create([
            'module_id' => $module->id,
            'title' => 'Goroutines and Channels',
            'slug' => 'goroutines-and-channels',
            'content' => 'Draft content generating...',
            'order' => 1,
        ]);

        $aiService = new OpenAiService();
        $job = new GenerateLessonContent($lesson->id);
        $job->handle($aiService);

        $lesson->refresh();

        $this->assertNotEquals('Draft content generating...', $lesson->content);
        $this->assertStringContainsString('#', $lesson->content);
    }

    public function test_ai_quiz_generation_creates_questions_with_one_correct_option(): void
    {
        $lesson = Lesson::first();
        $this->assertNotNull($lesson);

        $aiService = new OpenAiService();
        $job = new GenerateQuiz($lesson->id);
        $job->handle($aiService);

        $quizzes = $lesson->quizzes()->latest()->take(3)->get();
        $this->assertNotEmpty($quizzes);

        foreach ($quizzes as $quiz) {
            $this->assertNotEmpty($quiz->question_text);
            $correctOptions = $quiz->options()->where('is_correct', true)->count();
            $this->assertEquals(1, $correctOptions, "Quiz {$quiz->id} must have exactly one correct option");
        }
    }
}
