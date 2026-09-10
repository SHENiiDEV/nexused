<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Transaction;
use App\Services\Audit\AuditLogger;
use App\Services\Billing\B2BInvoiceService;
use App\Services\Billing\PaymentGatewayManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    public function checkout(Request $request, PaymentGatewayManager $gatewayManager): JsonResponse
    {
        $validated = $request->validate([
            'course_id' => 'nullable|exists:courses,id',
            'type' => 'required|in:b2c_course,b2b_license',
            'gateway' => 'required|string',
            'seats' => 'nullable|integer|min:5|max:100',
        ]);

        $user = auth()->user();
        $course = null;
        $amount = 0.00;
        $companyId = null;

        if ($validated['type'] === 'b2c_course') {
            $course = Course::findOrFail($validated['course_id']);
            $amount = (float)$course->price;
        } else {
            // B2B Corporate license purchase
            $seats = $validated['seats'] ?? 10;
            $basePrice = $validated['course_id'] ? (float)Course::findOrFail($validated['course_id'])->price : 49.00;
            $amount = min(2000.00, round($basePrice * $seats * 0.75, 2)); // 25% corporate volume discount, capped at €2000
            $companyId = $user->company_id;
        }

        $transactionRef = 'TXN-' . strtoupper(Str::random(12));

        $transaction = Transaction::create([
            'user_id' => $user->id,
            'course_id' => $course?->id,
            'company_id' => $companyId,
            'amount' => $amount,
            'currency' => 'EUR',
            'payment_gateway' => $validated['gateway'],
            'status' => 'pending',
            'transaction_ref' => $transactionRef,
            'metadata' => [
                'type' => $validated['type'],
                'seats' => $validated['seats'] ?? null,
                'course_title' => $course?->title ?? 'Corporate All-Access License',
            ],
        ]);

        AuditLogger::record('transaction.initiated', 'Transaction', $transaction->id, [
            'amount' => $amount,
            'gateway' => $validated['gateway'],
            'reference' => $transactionRef,
        ]);

        $driver = $gatewayManager->driver($validated['gateway']);
        $initResult = $driver->initiatePayment($transaction, ['type' => $validated['type']]);

        return response()->json([
            'success' => true,
            'transaction_ref' => $transactionRef,
            'amount' => $amount,
            'currency' => 'EUR',
            'init' => $initResult,
        ]);
    }

    /**
     * Simulated / Interactive Checkout Payment Process Page
     */
    public function process(Request $request, string $gateway, string $ref): Response|RedirectResponse
    {
        $transaction = Transaction::where('transaction_ref', $ref)->firstOrFail();

        return Inertia::render('Billing/Process', [
            'transaction' => $transaction,
            'gateway' => $gateway,
        ]);
    }

    /**
     * Direct sandbox / mock payment completion
     */
    public function completeMockPayment(
        Request $request,
        Transaction $transaction,
        B2BInvoiceService $invoiceService
    ): JsonResponse {
        if ($transaction->status === 'completed') {
            return response()->json(['success' => true, 'already_completed' => true]);
        }

        $transaction->status = 'completed';
        $transaction->save();

        // If B2C: enroll student
        if ($transaction->course_id) {
            Enrollment::firstOrCreate([
                'user_id' => $transaction->user_id,
                'course_id' => $transaction->course_id,
            ]);
        }

        // If B2B: create company invoice & expand company seats
        if ($transaction->company_id || ($transaction->metadata['type'] ?? '') === 'b2b_license') {
            $company = $transaction->company ?? auth()->user()->company;
            if ($company) {
                $seatsToAdd = $transaction->metadata['seats'] ?? 10;
                $company->max_seats += $seatsToAdd;
                $company->save();

                $invoiceService->createInvoice(
                    $company,
                    $transaction->user,
                    $transaction,
                    $transaction->metadata['course_title'] ?? 'Corporate Training Package',
                    $seatsToAdd
                );
            }
        }

        AuditLogger::record('transaction.completed', 'Transaction', $transaction->id, [
            'reference' => $transaction->transaction_ref,
            'amount' => $transaction->amount,
        ]);

        return response()->json([
            'success' => true,
            'status' => 'completed',
            'course_slug' => $transaction->course?->slug,
        ]);
    }
}
