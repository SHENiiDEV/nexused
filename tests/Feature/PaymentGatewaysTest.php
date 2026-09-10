<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Transaction;
use App\Models\User;
use App\Services\Billing\PaymentGatewayManager;
use Tests\TestCase;

class PaymentGatewaysTest extends TestCase
{
    public function test_gateway_manager_resolves_all_supported_drivers(): void
    {
        $manager = new PaymentGatewayManager();

        $this->assertEquals('corefy', $manager->driver('corefy')->getName());
        $this->assertEquals('cardaq', $manager->driver('cardaq')->getName());
        $this->assertEquals('apple_pay', $manager->driver('apple_pay')->getName());
        $this->assertEquals('mock', $manager->driver('mock')->getName());
    }

    public function test_webhook_rejects_invalid_hmac_signature(): void
    {
        $response = $this->postJson('/webhooks/corefy', [
            'reference' => 'TXN-FAKE-123',
            'status' => 'completed',
            'amount' => 89.0,
        ], [
            'X-Signature' => 'invalid_tampered_signature_hash',
        ]);

        $response->assertStatus(401);
        $response->assertJson(['error' => 'Invalid HMAC Signature']);
    }

    public function test_webhook_processes_valid_hmac_signature_and_completes_transaction(): void
    {
        $student = User::firstWhere('role', 'student');
        $course = Course::first();

        $transaction = Transaction::create([
            'user_id' => $student->id,
            'course_id' => $course->id,
            'amount' => 89.00,
            'currency' => 'EUR',
            'payment_gateway' => 'corefy',
            'status' => 'pending',
            'transaction_ref' => 'TXN-VERIF-' . rand(10000, 99999),
        ]);

        $payload = json_encode([
            'reference' => $transaction->transaction_ref,
            'status' => 'completed',
            'amount' => 89.00,
            'currency' => 'EUR',
        ]);

        $secret = config('services.corefy.secret_key', env('COREFY_SECRET_KEY', 'nexus_corefy_sec_994821'));
        $validSignature = hash_hmac('sha256', $payload, $secret);

        $response = $this->call(
            'POST',
            '/webhooks/corefy',
            [],
            [],
            [],
            [
                'HTTP_X_SIGNATURE' => $validSignature,
                'CONTENT_TYPE' => 'application/json',
            ],
            $payload
        );

        $response->assertStatus(200);

        $transaction->refresh();
        $this->assertEquals('completed', $transaction->status);
    }
}
