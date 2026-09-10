<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\User;
use Tests\TestCase;

class CoursePlayerTest extends TestCase
{
    public function test_course_player_accessible_for_authenticated_student(): void
    {
        $student = User::firstWhere('role', 'student');
        $course = Course::first();

        $response = $this->actingAs($student)
            ->get("/learn/{$course->slug}");

        $response->assertStatus(200);
    }

    public function test_student_can_complete_lesson_via_api(): void
    {
        $student = User::firstWhere('role', 'student');
        $lesson = Lesson::first();

        $response = $this->actingAs($student)
            ->postJson("/learn/lessons/{$lesson->id}/complete");

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);
    }

    public function test_student_can_submit_quiz_and_receive_instant_explanation(): void
    {
        $student = User::firstWhere('role', 'student');
        $quiz = Quiz::first();
        $this->assertNotNull($quiz);

        $correctOption = $quiz->options()->where('is_correct', true)->first();
        $this->assertNotNull($correctOption);

        $response = $this->actingAs($student)
            ->postJson("/learn/quizzes/{$quiz->id}/submit", [
                'quiz_option_id' => $correctOption->id,
            ]);

        $response->assertStatus(200);
        $response->assertJson([
            'is_correct' => true,
            'selected_option_id' => $correctOption->id,
        ]);
        $this->assertNotEmpty($response->json('explanation'));
    }
}
