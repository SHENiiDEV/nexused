<?php

namespace App\Services\Billing\Gateways;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CorefyGateway implements PaymentGatewayInterface
{
    protected string $secretKey;
    protected string $commerceId;

    public function __construct()
    {
        $this->secretKey = config('services.corefy.secret_key', env('COREFY_SECRET_KEY', 'nexus_corefy_sec_994821'));
        $this->commerceId = config('services.corefy.commerce_id', env('COREFY_COMMERCE_ID', 'com_nexus_eu'));
    }

    public function getName(): string
    {
        return 'corefy';
    }

    public function initiatePayment(Transaction $transaction, array $params = []): array
    {
        // Corefy payment session preparation
        $paymentUrl = route('checkout.process', ['gateway' => 'corefy', 'ref' => $transaction->transaction_ref]);

        return [
            'gateway' => 'corefy',
            'redirect_url' => $paymentUrl,
            'reference' => $transaction->transaction_ref,
            'client_token' => 'cf_tok_' . bin2hex(random_bytes(16)),
        ];
    }

    public function verifySignature(Request $request): bool
    {
        $signature = $request->header('X-Signature') ?? $request->header('Signature') ?? $request->input('signature');
        if (empty($signature)) {
            Log::warning('[CorefyGateway] Webhook missing signature header');
            return false;
        }

        $rawPayload = $request->getContent();
        if (empty($rawPayload)) {
            $rawPayload = json_encode($request->all());
        }

        $expectedSignature = hash_hmac('sha256', $rawPayload, $this->secretKey);

        return hash_equals($expectedSignature, (string)$signature);
    }

    public function processWebhook(Request $request): array
    {
        $data = $request->all();
        $statusRaw = strtolower($data['status'] ?? $data['event'] ?? 'pending');

        $status = match ($statusRaw) {
            'success', 'completed', 'paid', 'payment.success' => 'completed',
            'failed', 'rejected', 'payment.failed' => 'failed',
            default => 'pending',
        };

        return [
            'status' => $status,
            'transaction_ref' => (string)($data['reference'] ?? $data['transaction_ref'] ?? $data['order_id'] ?? ''),
            'amount' => (float)($data['amount'] ?? 0.0),
            'currency' => strtoupper((string)($data['currency'] ?? 'EUR')),
            'metadata' => $data,
        ];
    }

    public function refund(Transaction $transaction, float $amount): bool
    {
        Log::info("[CorefyGateway] Initiating refund of {$amount} EUR for {$transaction->transaction_ref}");
        return true;
    }
}
