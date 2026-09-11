<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    public function test_can_login_with_admin_username(): void
    {
        // Ensure an admin user exists
        $admin = User::firstOrCreate(
            ['email' => 'admin@nexused.test'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        $response = $this->post('/login', [
            'email' => 'admin',
            'password' => 'password',
        ]);

        $response->assertRedirect(route('admin.generator'));
        $this->assertAuthenticatedAs($admin);
    }

    public function test_admin_user_can_access_admin_generator_and_transactions(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@nexused.test'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        $responseGen = $this->actingAs($admin)->get('/admin/generator');
        $responseGen->assertStatus(200);

        $responseTx = $this->actingAs($admin)->get('/admin/transactions');
        $responseTx->assertStatus(200);
    }

    public function test_student_user_is_forbidden_from_admin_area(): void
    {
        $student = User::firstOrCreate(
            ['email' => 'student.regular@test.com'],
            [
                'name' => 'Student Regular',
                'password' => Hash::make('password'),
                'role' => 'student',
            ]
        );

        $response = $this->actingAs($student)->get('/admin/generator');
        $response->assertStatus(403);

        $responseTx = $this->actingAs($student)->get('/admin/transactions');
        $responseTx->assertStatus(403);
    }

    public function test_unauthenticated_user_redirected_to_login(): void
    {
        $response = $this->get('/admin/generator');
        $response->assertRedirect('/login');
    }
}
