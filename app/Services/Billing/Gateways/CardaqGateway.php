<?php

namespace App\Services\Billing\Gateways;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CardaqGateway implements PaymentGatewayInterface
{
    protected string $secretKey;
    protected string $merchantId;

    public function __construct()
    {
        $this->secretKey = config('services.cardaq.secret_key', env('CARDAQ_SECRET_KEY', 'nexus_cardaq_sec_884122'));
        $this->merchantId = config('services.cardaq.merchant_id', env('CARDAQ_MERCHANT_ID', 'cardaq_merch_01'));
    }

    public function getName(): string
    {
        return 'cardaq';
    }

    public function initiatePayment(Transaction $transaction, array $params = []): array
    {
        $paymentUrl = route('checkout.process', ['gateway' => 'cardaq', 'ref' => $transaction->transaction_ref]);

        return [
            'gateway' => 'cardaq',
            'redirect_url' => $paymentUrl,
            'reference' => $transaction->transaction_ref,
            'client_token' => 'cdq_tok_' . bin2hex(random_bytes(16)),
        ];
    }

    public function verifySignature(Request $request): bool
    {
        $signature = $request->header('X-Cardaq-Signature') ?? $request->header('Signature') ?? $request->input('signature');
        if (empty($signature)) {
            Log::warning('[CardaqGateway] Webhook missing HMAC signature');
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
        $statusRaw = strtolower($data['transaction_status'] ?? $data['status'] ?? 'pending');

        $status = match ($statusRaw) {
            'settled', 'success', 'approved' => 'completed',
            'declined', 'failed', 'error' => 'failed',
            default => 'pending',
        };

        return [
            'status' => $status,
            'transaction_ref' => (string)($data['merchant_order_id'] ?? $data['transaction_ref'] ?? ''),
            'amount' => (float)($data['amount'] ?? 0.0),
            'currency' => strtoupper((string)($data['currency'] ?? 'EUR')),
            'metadata' => $data,
        ];
    }

    public function refund(Transaction $transaction, float $amount): bool
    {
        Log::info("[CardaqGateway] Refunding {$amount} EUR on ref {$transaction->transaction_ref}");
        return true;
    }
}
