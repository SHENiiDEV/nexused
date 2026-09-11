<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class CourseImportTest extends TestCase
{
    public function test_admin_can_download_course_json_template(): void
    {
        $admin = User::firstWhere('role', 'admin') ?? User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->getJson(route('admin.courses.template'));

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'title',
            'topic',
            'price',
            'estimated_hours',
            'description',
            'target_audience',
            'modules' => [
                '*' => [
                    'title',
                    'description',
                    'lessons' => [
                        '*' => [
                            'title',
                            'type',
                            'duration_minutes',
                            'content',
                            'quizzes',
                        ],
                    ],
                ],
            ],
        ]);
    }

    public function test_admin_can_import_course_via_json_payload(): void
    {
        $admin = User::firstWhere('role', 'admin') ?? User::factory()->create(['role' => 'admin']);

        $payload = [
            'title' => 'Kubernetes Production Engineering',
            'topic' => 'DevOps',
            'price' => 89.00,
            'estimated_hours' => 12,
            'description' => 'Comprehensive enterprise Kubernetes course.',
            'target_audience' => 'DevOps & Site Reliability Engineers',
            'modules' => [
                [
                    'title' => 'Core Control Plane',
                    'description' => 'Architecture of kube-apiserver, etcd, and controllers.',
                    'lessons' => [
                        [
                            'title' => 'etcd Quorum & Raft Protocol',
                            'type' => 'text',
                            'duration_minutes' => 20,
                            'content' => "# etcd Deep Dive\n\nHow raft consensus works in Kubernetes.",
                            'quizzes' => [
                                [
                                    'question_text' => 'What is the minimal node count for an etcd cluster that tolerates 1 node failure?',
                                    'explanation' => 'A 3-node cluster quorum is (3/2)+1 = 2, tolerating 1 failure.',
                                    'options' => [
                                        ['option_text' => '2 nodes', 'is_correct' => false],
                                        ['option_text' => '3 nodes', 'is_correct' => true],
                                        ['option_text' => '1 node', 'is_correct' => false],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $response = $this->actingAs($admin)->postJson(route('admin.courses.import'), [
            'json_payload' => json_encode($payload),
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'title' => 'Kubernetes Production Engineering',
        ]);

        $courseId = $response->json('course_id');
        $course = Course::with(['modules.lessons.quizzes.options'])->find($courseId);

        $this->assertNotNull($course);
        $this->assertEquals('Kubernetes Production Engineering', $course->title);
        $this->assertCount(1, $course->modules);
        $this->assertCount(1, $course->modules->first()->lessons);
        $this->assertCount(1, $course->modules->first()->lessons->first()->quizzes);
        $this->assertCount(3, $course->modules->first()->lessons->first()->quizzes->first()->options);
        $this->assertNotNull($course->thumbnail_url);
        $this->assertStringContainsString('/thumbnails/', $course->thumbnail_url);
    }
}
