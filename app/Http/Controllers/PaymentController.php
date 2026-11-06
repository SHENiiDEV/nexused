<?php

namespace App\Http\Controllers;

use App\Mail\CoursePurchasedEmail;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Order;
use App\Models\Transaction;
use App\Models\User;
use App\Services\Audit\AuditLogger;
use App\Services\Billing\B2BInvoiceService;
use App\Services\Billing\Gateways\CorefyGateway;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class PaymentController extends Controller
{
    /**
     * Resolve the current authenticated user from session, cookie, or local fallback.
     */
    protected function resolveUser(Request $request): ?User
    {
        if ($user = auth()->user()) {
            return $user;
        }

        $sessionCookie = $request->cookie('runevault.session')
            ?? $request->cookie(config('session.cookie'))
            ?? $request->header('X-Session-Token');

        if (! empty($sessionCookie) && $sessionCookie !== 'ВАШ_SESSION_TOKEN') {
            $session = DB::table('sessions')->where('id', $sessionCookie)->first();
            if ($session && $session->user_id) {
                $user = User::find($session->user_id);
                if ($user) {
                    auth()->login($user);

                    return $user;
                }
            }
        }

        // In local / testing environment, fallback to first student user if session placeholder is used
        if (app()->environment('local', 'testing')) {
            $fallback = User::firstWhere('role', 'student') ?? User::first();
            if ($fallback) {
                auth()->login($fallback);

                return $fallback;
            }
        }

        return null;
    }

    /**
     * 1. Wallet Top-Up
     * POST /api/wallet/topup
     */
    public function topup(Request $request, CorefyGateway $gateway): JsonResponse
    {
        $user = $this->resolveUser($request);
        if (! $user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.5',
            'currency' => 'nullable|string|size:3',
        ]);

        $amount = round((float) $validated['amount'], 2);
        $currency = strtoupper($validated['currency'] ?? 'EUR');
        $reference = 'TOPUP-'.strtoupper(Str::random(9));

        $transaction = Transaction::create([
            'user_id' => $user->id,
            'amount' => $amount,
            'currency' => $currency,
            'payment_gateway' => 'corefy',
            'status' => 'pending',
            'transaction_ref' => $reference,
            'metadata' => [
                'type' => 'wallet_topup',
                'plan_title' => 'Wallet Top-Up',
            ],
        ]);

        $init = $gateway->initiatePayment($transaction, ['type' => 'wallet_topup']);

        $transaction->metadata = array_merge($transaction->metadata ?? [], [
            'cpi' => $init['cpi'] ?? null,
            'hpp_url' => $init['hppUrl'] ?? null,
        ]);
        $transaction->save();

        AuditLogger::record('wallet.topup_initiated', 'Transaction', $transaction->id, [
            'amount' => $amount,
            'reference' => $reference,
        ], $user->id);

        return response()->json([
            'ok' => true,
            'reference' => $reference,
            'hppUrl' => $init['hppUrl'],
        ]);
    }

    /**
     * 2. Checkout Card Payment
     * POST /api/checkout
     */
    public function checkout(Request $request, CorefyGateway $gateway): JsonResponse
    {
        $user = $this->resolveUser($request);
        if (! $user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'cart' => 'required|array|min:1',
            'paymentMethod' => 'nullable|string',
        ]);

        $cart = $validated['cart'];
        $paymentMethod = $validated['paymentMethod'] ?? 'card';

        $totalAmount = 0.00;
        $firstCourseId = null;

        foreach ($cart as $item) {
            $course = isset($item['id']) ? Course::find($item['id']) : null;
            $qty = (int) ($item['quantity'] ?? 1);
            if ($course) {
                $totalAmount += ((float) $course->price) * $qty;
                if (! $firstCourseId) {
                    $firstCourseId = $course->id;
                }
            } else {
                $price = (float) ($item['price'] ?? 15.00);
                $totalAmount += $price * $qty;
            }
        }

        if ($totalAmount <= 0) {
            $totalAmount = 15.00;
        }

        $reference = 'RV-'.strtoupper(Str::random(7));

        $order = Order::create([
            'user_id' => $user->id,
            'reference' => $reference,
            'status' => 'pending',
            'amount' => $totalAmount,
            'currency' => 'EUR',
            'payment_method' => $paymentMethod,
            'cart' => $cart,
        ]);

        $transaction = Transaction::create([
            'user_id' => $user->id,
            'course_id' => $firstCourseId,
            'amount' => $totalAmount,
            'currency' => 'EUR',
            'payment_gateway' => 'corefy',
            'status' => 'pending',
            'transaction_ref' => $reference,
            'metadata' => [
                'type' => 'checkout_order',
                'order_id' => $order->id,
                'cart' => $cart,
                'plan_title' => 'Checkout Order #'.$order->id,
            ],
        ]);

        $init = $gateway->initiatePayment($transaction, ['type' => 'checkout']);

        $order->hpp_url = $init['hppUrl'];
        $order->save();

        $transaction->metadata = array_merge($transaction->metadata ?? [], [
            'cpi' => $init['cpi'] ?? null,
            'hpp_url' => $init['hppUrl'] ?? null,
        ]);
        $transaction->save();

        AuditLogger::record('order.checkout_initiated', 'Order', $order->id, [
            'amount' => $totalAmount,
            'reference' => $reference,
            'payment_method' => $paymentMethod,
        ], $user->id);

        return response()->json([
            'reference' => $reference,
            'hppUrl' => $init['hppUrl'],
            'orderId' => $order->id,
        ]);
    }

    /**
     * 3. Incoming Webhook from Corefy / Sterling-Pay
     * POST /payments/corefy/webhook
     */
    public function webhook(
        Request $request,
        CorefyGateway $gateway,
        B2BInvoiceService $invoiceService
    ): JsonResponse {
        // 1. Signature Verification
        if (! $gateway->verifySignature($request)) {
            Log::warning('[PaymentWebhook] Corefy HMAC/SHA1 signature mismatch', [
                'ip' => $request->ip(),
                'signature' => $request->header('X-Signature') ?? $request->header('Signature'),
            ]);

            return response()->json(['error' => 'Invalid HMAC Signature'], 401);
        }

        // 2. Parse Webhook
        $parsed = $gateway->processWebhook($request);
        $ref = $parsed['transaction_ref'];

        $transaction = Transaction::where('transaction_ref', $ref)->first();
        $order = Order::where('reference', $ref)->first();

        if (! $transaction && ! $order) {
            Log::warning("[PaymentWebhook] Neither transaction nor order found for reference: {$ref}");

            return response()->json(['error' => 'Transaction not found'], 404);
        }

        $signatureHeader = $request->header('X-Signature') ?? $request->header('Signature') ?? 'VERIFIED';
        if ($transaction) {
            $transaction->signature = $signatureHeader;
        }

        $isProcessed = ($parsed['status'] === 'completed');
        $isFailed = ($parsed['status'] === 'failed');

        if ($isProcessed) {
            if ($transaction && $transaction->status !== 'completed' && $transaction->status !== 'processed') {
                $transaction->status = 'processed';
                $transaction->save();
            }

            $user = $transaction?->user ?? $order?->user;
            $isTopup = str_starts_with($ref, 'TOPUP-') || (($transaction?->metadata['type'] ?? '') === 'wallet_topup');

            if ($isTopup && $user) {
                $amountToCredit = $parsed['amount'] > 0 ? $parsed['amount'] : (float) ($transaction?->amount ?? 0);
                $user->increment('balance', $amountToCredit);

                AuditLogger::record('wallet.topup_credited', 'User', $user->id, [
                    'amount' => $amountToCredit,
                    'reference' => $ref,
                ], $user->id);
            }

            if ($order || str_starts_with($ref, 'RV-') || (($transaction?->metadata['type'] ?? '') === 'checkout_order')) {
                if ($order && $order->status !== 'paid') {
                    $order->status = 'paid';
                    $order->paid_at = now();
                    $order->trade_offer_id = 'trade_'.Str::random(12);
                    $order->trade_offer_status = 'created';
                    $order->save();

                    AuditLogger::record('order.steam_trade_offer_created', 'Order', $order->id, [
                        'reference' => $ref,
                        'trade_offer_id' => $order->trade_offer_id,
                    ], $order->user_id);
                }

                // Grant course enrollment if transaction contains a course
                if ($user && $transaction?->course_id) {
                    Enrollment::firstOrCreate([
                        'user_id' => $user->id,
                        'course_id' => $transaction->course_id,
                    ]);
                }

                // Generate invoice and send confirmation email with invoice attached
                if ($transaction && $user && $user->email) {
                    try {
                        $invoice = $invoiceService->getOrCreateInvoice($transaction);
                        Mail::to($user->email)->send(new CoursePurchasedEmail(
                            $transaction,
                            $user,
                            $transaction->course,
                            $invoice
                        ));
                    } catch (\Throwable $e) {
                        Log::error('[PaymentWebhook] Failed sending purchase email: '.$e->getMessage());
                    }
                }
            }
        } elseif ($isFailed) {
            if ($transaction) {
                $transaction->status = 'process_failed';
                $transaction->save();
            }
            if ($order) {
                $order->status = 'process_failed';
                $order->save();
            }
            AuditLogger::record('payment.failed', 'Transaction', $transaction?->id, [
                'reference' => $ref,
                'resolution' => $parsed['resolution'] ?? null,
            ]);
        }

        return response()->json([
            'status' => 'ok',
            'reference_id' => $ref,
        ]);
    }

    /**
     * 4. Check Payment Status (Polling API)
     * GET /api/payments/orders/{ref}/status
     */
    public function status(string $ref): JsonResponse
    {
        $transaction = Transaction::where('transaction_ref', $ref)->first();
        $order = Order::where('reference', $ref)->first();

        if (! $transaction && ! $order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        $isTopup = str_starts_with($ref, 'TOPUP-') || (($transaction?->metadata['type'] ?? '') === 'wallet_topup');

        $statusRaw = $order?->status ?? $transaction?->status ?? 'pending';
        $normalizedStatus = match ($statusRaw) {
            'paid', 'completed', 'processed' => 'processed',
            'process_failed', 'failed', 'declined' => 'process_failed',
            default => 'pending',
        };

        $amount = (float) ($order?->amount ?? $transaction?->amount ?? 0);
        $amountCents = (int) round($amount * 100);
        $currency = $order?->currency ?? $transaction?->currency ?? 'EUR';

        $user = $order?->user ?? $transaction?->user;
        $completedAt = in_array($normalizedStatus, ['processed', 'completed'])
            ? ($order?->paid_at?->toISOString() ?? $transaction?->updated_at?->toISOString() ?? now()->toISOString())
            : null;

        $type = $isTopup ? 'wallet_topup' : 'card_payment';
        $planTitle = $isTopup
            ? 'Wallet Top-Up'
            : ($transaction?->metadata['plan_title'] ?? ($order ? 'Order #'.$order->id : 'Card Payment'));

        $orderReference = $isTopup ? null : ($order?->reference ?? $ref);

        return response()->json([
            'transactionRef' => $transaction?->transaction_ref ?? $ref,
            'status' => $normalizedStatus,
            'type' => $type,
            'planTitle' => $planTitle,
            'amountCents' => $amountCents,
            'currency' => $currency,
            'customerEmail' => $user?->email ?? 'customer@example.com',
            'completedAt' => $completedAt,
            'orderReference' => $orderReference,
        ]);
    }

    /**
     * 5. Download PDF invoice
     * GET /api/payments/orders/{ref}/invoice?email={email}
     */
    public function invoice(
        Request $request,
        string $ref,
        B2BInvoiceService $invoiceService
    ): HttpResponse {
        $transaction = Transaction::where('transaction_ref', $ref)->first();
        $order = Order::where('reference', $ref)->first();

        if (! $transaction && ! $order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        $user = $order?->user ?? $transaction?->user;
        $email = $request->query('email');

        if ($email && $user && strtolower(trim($email)) !== strtolower(trim($user->email))) {
            return response()->json(['error' => 'Email verification mismatch for this invoice'], 403);
        }

        if (! $transaction && $order) {
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'amount' => $order->amount,
                'currency' => $order->currency,
                'payment_gateway' => 'corefy',
                'status' => $order->status === 'paid' ? 'completed' : 'pending',
                'transaction_ref' => $order->reference,
                'metadata' => [
                    'type' => 'checkout_order',
                    'order_id' => $order->id,
                    'plan_title' => 'Order #'.$order->id,
                ],
            ]);
        }

        $inv = $invoiceService->getOrCreateInvoice($transaction);
        $pdfContent = $invoiceService->generatePdfInvoice($inv);

        return response($pdfContent, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "attachment; filename=\"invoice-{$ref}.pdf\"",
        ]);
    }

    /**
     * 6. Return page for HPP redirect
     * GET /payment/return?ref=...
     */
    public function returnPage(Request $request): Response
    {
        $ref = (string) $request->query('ref');

        return Inertia::render('Payment/Return', [
            'reference' => $ref,
        ]);
    }
}
