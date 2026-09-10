<?php

namespace App\Services\Billing\Gateways;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ApplePayGateway implements PaymentGatewayInterface
{
    protected string $merchantIdentifier;
    protected string $sharedSecret;

    public function __construct()
    {
        $this->merchantIdentifier = config('services.applepay.merchant_id', env('APPLEPAY_MERCHANT_ID', 'merchant.com.nexused.pay'));
        $this->sharedSecret = config('services.applepay.shared_secret', env('APPLEPAY_SHARED_SECRET', 'applepay_sec_991283'));
    }

    public function getName(): string
    {
        return 'apple_pay';
    }

    public function initiatePayment(Transaction $transaction, array $params = []): array
    {
        return [
            'gateway' => 'apple_pay',
            'merchant_identifier' => $this->merchantIdentifier,
            'country_code' => 'DE',
            'currency_code' => $transaction->currency,
            'total' => [
                'label' => 'NexusEd Educational Course',
                'amount' => number_format((float)$transaction->amount, 2, '.', ''),
            ],
            'reference' => $transaction->transaction_ref,
        ];
    }

    public function verifySignature(Request $request): bool
    {
        $signature = $request->header('X-ApplePay-Signature') ?? $request->header('Signature') ?? $request->input('signature');
        if (empty($signature)) {
            return false;
        }

        $rawPayload = $request->getContent();
        if (empty($rawPayload)) {
            $rawPayload = json_encode($request->all());
        }

        $expectedSignature = hash_hmac('sha256', $rawPayload, $this->sharedSecret);

        return hash_equals($expectedSignature, (string)$signature);
    }

    public function processWebhook(Request $request): array
    {
        $data = $request->all();
        $status = ($data['status'] ?? '') === 'AUTHORIZED' ? 'completed' : 'failed';

        return [
            'status' => $status,
            'transaction_ref' => (string)($data['transaction_ref'] ?? $data['reference'] ?? ''),
            'amount' => (float)($data['amount'] ?? 0.0),
            'currency' => strtoupper((string)($data['currency'] ?? 'EUR')),
            'metadata' => $data,
        ];
    }

    public function refund(Transaction $transaction, float $amount): bool
    {
        Log::info("[ApplePayGateway] Refund {$amount} EUR on {$transaction->transaction_ref}");
        return true;
    }
}
