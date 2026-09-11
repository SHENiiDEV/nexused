<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    public function test_registration_page_loads_successfully(): void
    {
        $response = $this->get('/register');
        $response->assertStatus(200);
    }

    public function test_user_can_register_with_complete_profile_address_and_terms(): void
    {
        $response = $this->post('/register', [
            'name' => 'John',
            'surname' => 'Doe',
            'email' => 'john.doe.testing@example.com',
            'phone' => '+49 151 98765432',
            'date_of_birth' => '1992-05-14',
            'address_street' => 'Unter den Linden 77',
            'address_city' => 'Berlin',
            'address_country' => 'Germany',
            'address_postcode' => '10117',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
            'terms' => 'on',
            'role' => 'student',
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertAuthenticated();

        $user = User::where('email', 'john.doe.testing@example.com')->first();
        $this->assertNotNull($user);
        $this->assertEquals('John', $user->name);
        $this->assertEquals('Doe', $user->surname);
        $this->assertEquals('+49 151 98765432', $user->phone);
        $this->assertEquals('1992-05-14', $user->date_of_birth->format('Y-m-d'));
        $this->assertEquals('Unter den Linden 77', $user->address_street);
        $this->assertEquals('Berlin', $user->address_city);
        $this->assertEquals('Germany', $user->address_country);
        $this->assertEquals('10117', $user->address_postcode);
        $this->assertTrue($user->terms_accepted);
        $this->assertNotNull($user->terms_accepted_at);
    }

    public function test_registration_rejects_excluded_sanctioned_countries(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test',
            'surname' => 'User',
            'email' => 'restricted.user@example.com',
            'phone' => '+1234567890',
            'date_of_birth' => '1990-01-01',
            'address_street' => 'Sample Street 1',
            'address_city' => 'Damascus',
            'address_country' => 'Syria', // Excluded country
            'address_postcode' => '0000',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'terms' => 'on',
            'role' => 'student',
        ]);

        $response->assertSessionHasErrors('address_country');
        $this->assertGuest();
    }

    public function test_registration_requires_terms_acceptance(): void
    {
        $response = $this->post('/register', [
            'name' => 'Jane',
            'surname' => 'Smith',
            'email' => 'jane.smith@example.com',
            'phone' => '+44 20 7946 0912',
            'date_of_birth' => '1995-11-20',
            'address_street' => 'Baker Street 221B',
            'address_city' => 'London',
            'address_country' => 'United Kingdom',
            'address_postcode' => 'NW1 6XE',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            // 'terms' omitted
            'role' => 'student',
        ]);

        $response->assertSessionHasErrors('terms');
        $this->assertGuest();
    }
}
