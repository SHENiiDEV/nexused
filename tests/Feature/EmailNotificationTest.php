<?php

namespace Tests\Feature;

use App\Mail\CoursePurchasedEmail;
use App\Mail\WelcomeEmail;
use App\Models\Course;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class EmailNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_welcome_email_is_dispatched_on_user_registration(): void
    {
        Mail::fake();

        $response = $this->post('/register', [
            'name' => 'Alice',
            'surname' => 'Smith',
            'email' => 'alice.smith@example.com',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
            'phone' => '+44 7700 900077',
            'date_of_birth' => '1995-04-12',
            'address_street' => '10 Downing Street',
            'address_city' => 'London',
            'address_country' => 'United Kingdom',
            'address_postcode' => 'SW1A 2AA',
            'terms' => '1',
            'role' => 'student',
        ]);

        $response->assertRedirect(route('student.dashboard'));

        Mail::assertQueued(WelcomeEmail::class, function ($mail) {
            return $mail->hasTo('alice.smith@example.com') &&
                   $mail->user->email === 'alice.smith@example.com';
        });
    }

    public function test_course_purchased_email_is_dispatched_on_mock_payment_completion(): void
    {
        Mail::fake();

        $user = User::factory()->create([
            'email' => 'buyer@example.com',
            'name' => 'Bob Buyer',
        ]);

        $course = Course::create([
            'creator_id' => $user->id,
            'title' => 'Advanced Go Microservices',
            'slug' => 'advanced-go-microservices',
            'category' => 'Development',
            'difficulty' => 'advanced',
            'price' => 49.00,
            'status' => 'published',
            'estimated_hours' => 12,
            'overview' => 'Build high throughput distributed systems in Go.',
        ]);

        $transaction = Transaction::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'amount' => 49.00,
            'currency' => 'EUR',
            'payment_gateway' => 'cardaq',
            'status' => 'pending',
            'transaction_ref' => 'TXN-TEST123456',
            'metadata' => [
                'type' => 'b2c_course',
                'course_title' => $course->title,
            ],
        ]);

        $this->actingAs($user);

        $response = $this->postJson("/checkout/transactions/{$transaction->id}/complete-mock");

        $response->assertStatus(200);
        $response->assertJson(['success' => true, 'status' => 'completed']);

        Mail::assertQueued(CoursePurchasedEmail::class, function ($mail) use ($user, $transaction) {
            return $mail->hasTo('buyer@example.com') &&
                   $mail->transaction->id === $transaction->id;
        });
    }

    public function test_welcome_email_view_renders_properly(): void
    {
        $user = User::factory()->make([
            'name' => 'John',
            'surname' => 'Doe',
            'email' => 'john.doe@example.com',
            'role' => 'student',
        ]);

        $mailable = new WelcomeEmail($user);
        $html = $mailable->render();

        $this->assertStringContainsString('Welcome to NexusEd, John!', $html);
        $this->assertStringContainsString('john.doe@example.com', $html);
        $this->assertStringContainsString('NexusEd Global', $html);
        $this->assertStringContainsString('HRB 248910 B', $html);
    }

    public function test_course_purchased_email_view_renders_properly(): void
    {
        $user = User::factory()->make([
            'name' => 'Jane',
            'surname' => 'Miller',
            'email' => 'jane.miller@example.com',
        ]);

        $course = new Course([
            'title' => 'Cloud Architecture Masterclass',
            'category' => 'Cloud & DevOps',
            'difficulty' => 'intermediate',
            'slug' => 'cloud-architecture-masterclass',
            'price' => 59.00,
        ]);

        $transaction = new Transaction([
            'amount' => 59.00,
            'currency' => 'EUR',
            'payment_gateway' => 'apple_pay',
            'transaction_ref' => 'TXN-TESTCONFIRM',
            'metadata' => ['course_title' => 'Cloud Architecture Masterclass'],
        ]);

        $mailable = new CoursePurchasedEmail($transaction, $user, $course);
        $html = $mailable->render();

        $this->assertStringContainsString('Order Confirmation', $html);
        $this->assertStringContainsString('Jane', $html);
        $this->assertStringContainsString('TXN-TESTCONFIRM', $html);
        $this->assertStringContainsString('59.00 EUR', $html);
        $this->assertStringContainsString('Cloud Architecture Masterclass', $html);
    }
}
