<?php

namespace App\Http\Controllers;

use App\Mail\CoursePurchasedEmail;
use App\Models\Enrollment;
use App\Models\Transaction;
use App\Services\Audit\AuditLogger;
use App\Services\Billing\B2BInvoiceService;
use App\Services\Billing\PaymentGatewayManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class WebhookController extends Controller
{
    public function handle(
        Request $request,
        string $gateway,
        PaymentGatewayManager $gatewayManager,
        B2BInvoiceService $invoiceService
    ): JsonResponse {
        Log::info("[Webhook] Ingress received for gateway: {$gateway}", [
            'ip' => $request->ip(),
            'headers' => $request->headers->all(),
        ]);

        try {
            $driver = $gatewayManager->driver($gateway);
        } catch (\Throwable $e) {
            AuditLogger::record('webhook.unknown_gateway', 'Webhook', null, [
                'gateway' => $gateway,
                'ip' => $request->ip(),
            ]);

            return response()->json(['error' => "Unsupported gateway: {$gateway}"], 400);
        }

        // 1. Mandatory HMAC Signature Verification
        $isValidSignature = $driver->verifySignature($request);

        if (!$isValidSignature) {
            AuditLogger::record('webhook.signature_failed', 'Webhook', null, [
                'gateway' => $gateway,
                'headers' => $request->headers->all(),
                'ip' => $request->ip(),
            ]);

            Log::warning("[Webhook] HMAC Signature validation failed for gateway: {$gateway}");

            return response()->json(['error' => 'Invalid HMAC Signature'], 401);
        }

        // 2. Process Webhook Payload
        $result = $driver->processWebhook($request);

        $transaction = Transaction::where('transaction_ref', $result['transaction_ref'])->first();

        if (!$transaction) {
            AuditLogger::record('webhook.transaction_not_found', 'Webhook', null, [
                'gateway' => $gateway,
                'ref' => $result['transaction_ref'],
            ]);

            return response()->json(['error' => 'Transaction not found'], 404);
        }

        // Store received signature on transaction
        $signature = $request->header('X-Signature') ?? $request->header('Signature') ?? 'HMAC-SHA256-VERIFIED';
        $transaction->signature = $signature;

        if ($result['status'] === 'completed' && $transaction->status !== 'completed') {
            $transaction->status = 'completed';
            $transaction->save();

            // Grant enrollment if course
            if ($transaction->course_id) {
                Enrollment::firstOrCreate([
                    'user_id' => $transaction->user_id,
                    'course_id' => $transaction->course_id,
                ]);
            }

            // Create B2B Invoice if corporate
            if ($transaction->company_id || ($transaction->metadata['type'] ?? '') === 'b2b_license') {
                $company = $transaction->company;
                if ($company) {
                    $seats = $transaction->metadata['seats'] ?? 10;
                    $company->increment('max_seats', $seats);

                    $invoiceService->createInvoice(
                        $company,
                        $transaction->user,
                        $transaction,
                        $transaction->metadata['course_title'] ?? 'Corporate Training License',
                        $seats
                    );
                }
            }

            AuditLogger::record('webhook.transaction_settled', 'Transaction', $transaction->id, [
                'gateway' => $gateway,
                'amount' => $transaction->amount,
                'ref' => $transaction->transaction_ref,
            ], $transaction->user_id);

            // Dispatch Confirmation / Receipt Email
            try {
                if ($transaction->user && $transaction->user->email) {
                    Mail::to($transaction->user->email)->send(new CoursePurchasedEmail(
                        $transaction,
                        $transaction->user,
                        $transaction->course
                    ));
                }
            } catch (\Throwable $e) {
                Log::error("[Email] Failed to send webhook course purchased email: " . $e->getMessage());
            }

        } elseif ($result['status'] === 'failed') {
            $transaction->status = 'failed';
            $transaction->save();

            AuditLogger::record('webhook.transaction_failed', 'Transaction', $transaction->id, [
                'gateway' => $gateway,
                'ref' => $transaction->transaction_ref,
            ], $transaction->user_id);
        }

        return response()->json([
            'status' => 'acknowledged',
            'transaction_status' => $transaction->status,
            'reference' => $transaction->transaction_ref,
        ]);
    }
}
