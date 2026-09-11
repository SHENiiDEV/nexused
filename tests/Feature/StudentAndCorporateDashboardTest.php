<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\LessonProgress;
use App\Models\User;
use Tests\TestCase;

class StudentAndCorporateDashboardTest extends TestCase
{
    public function test_guest_cannot_access_student_dashboard(): void
    {
        $response = $this->get('/dashboard');
        $response->assertRedirect('/login');
    }

    public function test_student_can_view_dashboard_with_gamification_levels(): void
    {
        $user = User::factory()->create([
            'role' => 'student',
            'xp' => 1500,
            'streak_days' => 4,
        ]);

        $response = $this->actingAs($user)->get('/dashboard');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Student/Dashboard')
            ->has('gamification')
            ->where('gamification.level', 3) // 1500 XP is Level 3 (Systems Architect)
            ->where('gamification.rank_title', 'Systems Architect')
            ->has('coursesInProgress')
            ->has('completedCertificates')
        );
    }

    public function test_corporate_dashboard_redirects_if_user_has_no_company(): void
    {
        $user = User::factory()->create([
            'role' => 'corporate',
            'company_id' => null,
        ]);

        $response = $this->actingAs($user)->get('/corporate/dashboard');
        $response->assertRedirect('/dashboard');
        $response->assertSessionHas('error');
    }

    public function test_corporate_dashboard_accessible_when_user_has_company(): void
    {
        $company = Company::create([
            'name' => 'TechCorp Solutions',
            'vat_number' => 'DE123456789',
            'billing_email' => 'admin@techcorp.de',
            'country_code' => 'DE',
            'max_seats' => 15,
            'used_seats' => 1,
        ]);

        $user = User::factory()->create([
            'role' => 'corporate',
            'company_id' => $company->id,
        ]);

        $response = $this->actingAs($user)->get('/corporate/dashboard');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Corporate/Dashboard')
            ->where('company.name', 'TechCorp Solutions')
            ->has('availableUsers')
        );
    }

    public function test_corporate_admin_can_add_existing_platform_user_to_roster(): void
    {
        $company = Company::create([
            'name' => 'CloudCorp Enterprise',
            'vat_number' => 'DE987654321',
            'billing_email' => 'corp@cloudcorp.de',
            'country_code' => 'DE',
            'max_seats' => 5,
            'used_seats' => 1,
        ]);

        $admin = User::factory()->create([
            'role' => 'corporate',
            'company_id' => $company->id,
        ]);

        $platformStudent = User::factory()->create([
            'name' => 'Alice',
            'email' => 'alice.dev@nexus.test',
            'role' => 'student',
            'company_id' => null,
        ]);

        $course = Course::first() ?? Course::factory()->create(['status' => 'published']);

        $response = $this->actingAs($admin)->post('/corporate/add-platform-user', [
            'user_id' => $platformStudent->id,
            'course_id' => $course->id,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $platformStudent->refresh();
        $this->assertEquals($company->id, $platformStudent->company_id);

        $company->refresh();
        $this->assertEquals(2, $company->used_seats);

        $enrollment = Enrollment::where('user_id', $platformStudent->id)
            ->where('course_id', $course->id)
            ->first();
        $this->assertNotNull($enrollment);
    }
}
