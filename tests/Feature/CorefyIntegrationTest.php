<?php

namespace Tests\Feature;

use App\Mail\CoursePurchasedEmail;
use App\Models\Course;
use App\Models\Order;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class CorefyIntegrationTest extends TestCase
{
    protected function calculateSignature(string $secret, string $body): string
    {
        return base64_encode(sha1($secret.$body.$secret, true));
    }

    public function test_1_wallet_topup_creates_invoice_and_returns_hpp_url(): void
    {
        $user = User::firstWhere('role', 'student') ?? User::first();

        $response = $this->actingAs($user)->postJson('/api/wallet/topup', [
            'amount' => 25.00,
            'currency' => 'EUR',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'ok',
            'reference',
            'hppUrl',
        ]);

        $json = $response->json();
        $this->assertTrue($json['ok']);
        $this->assertStringStartsWith('TOPUP-', $json['reference']);
        $this->assertStringStartsWith('https://api.sterling-pay.com/redirect/hpp/?cpi=', $json['hppUrl']);

        $transaction = Transaction::where('transaction_ref', $json['reference'])->first();
        $this->assertNotNull($transaction);
        $this->assertEquals(25.00, (float) $transaction->amount);
        $this->assertEquals('EUR', $transaction->currency);
        $this->assertEquals('pending', $transaction->status);
        $this->assertEquals('wallet_topup', $transaction->metadata['type']);
    }

    public function test_2_checkout_card_payment_creates_order_and_pending_transaction(): void
    {
        $user = User::firstWhere('role', 'student') ?? User::first();
        $course = Course::first();

        $response = $this->actingAs($user)->postJson('/api/checkout', [
            'cart' => [
                ['id' => $course?->id ?? 1, 'quantity' => 1],
            ],
            'paymentMethod' => 'card',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'reference',
            'hppUrl',
            'orderId',
        ]);

        $json = $response->json();
        $this->assertStringStartsWith('RV-', $json['reference']);
        $this->assertStringStartsWith('https://api.sterling-pay.com/redirect/hpp/?cpi=', $json['hppUrl']);
        $this->assertIsInt($json['orderId']);

        $order = Order::find($json['orderId']);
        $this->assertNotNull($order);
        $this->assertEquals($json['reference'], $order->reference);
        $this->assertEquals('pending', $order->status);

        $transaction = Transaction::where('transaction_ref', $json['reference'])->first();
        $this->assertNotNull($transaction);
        $this->assertEquals('pending', $transaction->status);
    }

    public function test_3_1_webhook_processed_for_wallet_topup_credits_balance(): void
    {
        $secret = config('services.corefy.webhook_secret', 'your_webhook_secret');
        $user = User::firstWhere('role', 'student') ?? User::first();
        $initialBalance = (float) $user->balance;

        $reference = 'TOPUP-'.strtoupper(fake()->bothify('??#??#?#'));

        Transaction::create([
            'user_id' => $user->id,
            'amount' => 25.00,
            'currency' => 'EUR',
            'payment_gateway' => 'corefy',
            'status' => 'pending',
            'transaction_ref' => $reference,
            'metadata' => [
                'type' => 'wallet_topup',
                'plan_title' => 'Wallet Top-Up',
            ],
        ]);

        $body = json_encode([
            'data' => [
                'id' => 'cpi_test_001',
                'type' => 'payment-invoices',
                'attributes' => [
                    'reference_id' => $reference,
                    'amount' => 25.00,
                    'processed_amount' => 25.00,
                    'currency' => 'EUR',
                    'status' => 'processed',
                    'test_mode' => false,
                    'resolution' => 'ok',
                ],
            ],
        ], JSON_UNESCAPED_SLASHES);

        $signature = $this->calculateSignature($secret, $body);

        $response = $this->call(
            'POST',
            '/payments/corefy/webhook',
            [],
            [],
            [],
            [
                'HTTP_X_SIGNATURE' => $signature,
                'CONTENT_TYPE' => 'application/json',
            ],
            $body
        );

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'ok',
            'reference_id' => $reference,
        ]);

        $user->refresh();
        $this->assertEquals($initialBalance + 25.00, (float) $user->balance);

        $transaction = Transaction::where('transaction_ref', $reference)->first();
        $this->assertEquals('processed', $transaction->status);
    }

    public function test_3_1_webhook_processed_for_order_marks_paid_creates_trade_offer_and_sends_email(): void
    {
        Mail::fake();

        $secret = config('services.corefy.webhook_secret', 'your_webhook_secret');
        $user = User::firstWhere('role', 'student') ?? User::first();
        $course = Course::first();

        $reference = 'RV-'.strtoupper(fake()->bothify('?#??#?#'));

        $order = Order::create([
            'user_id' => $user->id,
            'reference' => $reference,
            'status' => 'pending',
            'amount' => 15.00,
            'currency' => 'EUR',
            'payment_method' => 'card',
        ]);

        $transaction = Transaction::create([
            'user_id' => $user->id,
            'course_id' => $course?->id,
            'amount' => 15.00,
            'currency' => 'EUR',
            'payment_gateway' => 'corefy',
            'status' => 'pending',
            'transaction_ref' => $reference,
            'metadata' => [
                'type' => 'checkout_order',
                'order_id' => $order->id,
                'plan_title' => 'Checkout Order #'.$order->id,
            ],
        ]);

        $body = json_encode([
            'data' => [
                'id' => 'cpi_test_order_001',
                'type' => 'payment-invoices',
                'attributes' => [
                    'reference_id' => $reference,
                    'amount' => 15.00,
                    'processed_amount' => 15.00,
                    'currency' => 'EUR',
                    'status' => 'processed',
                    'test_mode' => false,
                    'resolution' => 'ok',
                ],
            ],
        ], JSON_UNESCAPED_SLASHES);

        $signature = $this->calculateSignature($secret, $body);

        $response = $this->call(
            'POST',
            '/payments/corefy/webhook',
            [],
            [],
            [],
            [
                'HTTP_X_SIGNATURE' => $signature,
                'CONTENT_TYPE' => 'application/json',
            ],
            $body
        );

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'ok',
            'reference_id' => $reference,
        ]);

        $order->refresh();
        $this->assertEquals('paid', $order->status);
        $this->assertNotNull($order->trade_offer_id);
        $this->assertEquals('created', $order->trade_offer_status);

        $transaction->refresh();
        $this->assertEquals('processed', $transaction->status);

        Mail::assertQueued(CoursePurchasedEmail::class);
    }

    public function test_3_2_webhook_process_failed_marks_transaction_and_order_failed(): void
    {
        $secret = config('services.corefy.webhook_secret', 'your_webhook_secret');
        $user = User::firstWhere('role', 'student') ?? User::first();

        $reference = 'RV-'.strtoupper(fake()->bothify('?#??#?#'));

        $order = Order::create([
            'user_id' => $user->id,
            'reference' => $reference,
            'status' => 'pending',
            'amount' => 15.00,
            'currency' => 'EUR',
            'payment_method' => 'card',
        ]);

        $transaction = Transaction::create([
            'user_id' => $user->id,
            'amount' => 15.00,
            'currency' => 'EUR',
            'payment_gateway' => 'corefy',
            'status' => 'pending',
            'transaction_ref' => $reference,
            'metadata' => [
                'type' => 'checkout_order',
                'order_id' => $order->id,
            ],
        ]);

        $body = json_encode([
            'data' => [
                'id' => 'cpi_fail_001',
                'type' => 'payment-invoices',
                'attributes' => [
                    'reference_id' => $reference,
                    'amount' => 15.00,
                    'currency' => 'EUR',
                    'status' => 'process_failed',
                    'resolution' => 'declined_by_issuer',
                ],
            ],
        ], JSON_UNESCAPED_SLASHES);

        $signature = $this->calculateSignature($secret, $body);

        $response = $this->call(
            'POST',
            '/payments/corefy/webhook',
            [],
            [],
            [],
            [
                'HTTP_X_SIGNATURE' => $signature,
                'CONTENT_TYPE' => 'application/json',
            ],
            $body
        );

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'ok',
            'reference_id' => $reference,
        ]);

        $order->refresh();
        $this->assertEquals('process_failed', $order->status);

        $transaction->refresh();
        $this->assertEquals('process_failed', $transaction->status);
    }

    public function test_webhook_rejects_invalid_signature(): void
    {
        $body = json_encode(['data' => ['attributes' => ['reference_id' => 'TOPUP-FAKE']]]);

        $response = $this->call(
            'POST',
            '/payments/corefy/webhook',
            [],
            [],
            [],
            [
                'HTTP_X_SIGNATURE' => 'invalid_tampered_signature',
                'CONTENT_TYPE' => 'application/json',
            ],
            $body
        );

        $response->assertStatus(401);
    }

    public function test_4_payment_status_polling_endpoint_returns_expected_json(): void
    {
        $user = User::firstWhere('role', 'student') ?? User::first();
        $reference = 'TOPUP-A9FYKQUT8';

        Transaction::create([
            'user_id' => $user->id,
            'amount' => 25.00,
            'currency' => 'EUR',
            'payment_gateway' => 'corefy',
            'status' => 'processed',
            'transaction_ref' => $reference,
            'metadata' => [
                'type' => 'wallet_topup',
                'plan_title' => 'Wallet Top-Up',
            ],
        ]);

        $response = $this->getJson("/api/payments/orders/{$reference}/status");

        $response->assertStatus(200);
        $response->assertJson([
            'transactionRef' => 'TOPUP-A9FYKQUT8',
            'status' => 'processed',
            'type' => 'wallet_topup',
            'planTitle' => 'Wallet Top-Up',
            'amountCents' => 2500,
            'currency' => 'EUR',
            'customerEmail' => $user->email,
            'orderReference' => null,
        ]);
        $response->assertJsonStructure([
            'completedAt',
        ]);
    }

    public function test_5_pdf_invoice_download_for_order(): void
    {
        $user = User::firstWhere('role', 'student') ?? User::first();
        $course = Course::first();
        $reference = 'RV-4B29A7X';

        $order = Order::create([
            'user_id' => $user->id,
            'reference' => $reference,
            'status' => 'paid',
            'amount' => 15.00,
            'currency' => 'EUR',
            'payment_method' => 'card',
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'course_id' => $course?->id,
            'amount' => 15.00,
            'currency' => 'EUR',
            'payment_gateway' => 'corefy',
            'status' => 'completed',
            'transaction_ref' => $reference,
            'metadata' => [
                'type' => 'checkout_order',
                'order_id' => $order->id,
                'plan_title' => 'Order #'.$order->id,
            ],
        ]);

        $response = $this->get("/api/payments/orders/{$reference}/invoice?email=".urlencode($user->email));

        $response->assertStatus(200);
        $this->assertEquals('application/pdf', $response->headers->get('Content-Type'));
        $this->assertStringContainsString("invoice-{$reference}.pdf", $response->headers->get('Content-Disposition') ?? '');

        // Verify PDF magic bytes %PDF-
        $this->assertStringStartsWith('%PDF-', $response->getContent());
    }
}
