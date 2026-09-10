<?php

namespace App\Contracts;

use App\Models\Transaction;
use Illuminate\Http\Request;

interface PaymentGatewayInterface
{
    /**
     * Get gateway identifier (e.g. 'corefy', 'cardaq', 'apple_pay', 'mock')
     */
    public function getName(): string;

    /**
     * Initiate payment checkout flow
     */
    public function initiatePayment(Transaction $transaction, array $params = []): array;

    /**
     * Verify webhook signature with HMAC-SHA256
     */
    public function verifySignature(Request $request): bool;

    /**
     * Process incoming webhook and extract standardized result
     *
     * @return array{
     *     status: 'completed'|'failed'|'pending',
     *     transaction_ref: string,
     *     amount: float,
     *     currency: string,
     *     metadata: array
     * }
     */
    public function processWebhook(Request $request): array;

    /**
     * Refund a transaction
     */
    public function refund(Transaction $transaction, float $amount): bool;
}
