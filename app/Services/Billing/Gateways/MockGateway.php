<?php

namespace App\Services\Billing\Gateways;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Transaction;
use Illuminate\Http\Request;

class MockGateway implements PaymentGatewayInterface
{
    protected string $secretKey = 'mock_sandbox_secret_key';

    public function getName(): string
    {
        return 'mock';
    }

    public function initiatePayment(Transaction $transaction, array $params = []): array
    {
        return [
            'gateway' => 'mock',
            'redirect_url' => route('checkout.process', ['gateway' => 'mock', 'ref' => $transaction->transaction_ref]),
            'reference' => $transaction->transaction_ref,
            'client_token' => 'sandbox_tok_' . bin2hex(random_bytes(8)),
            'sandbox' => true,
        ];
    }

    public function verifySignature(Request $request): bool
    {
        $signature = $request->header('X-Signature') ?? $request->input('signature');
        if (empty($signature)) {
            // For testing sandbox convenience, accept sandbox_ok or valid hmac
            return $request->input('sandbox_mode') === 'test';
        }

        $rawPayload = $request->getContent();
        if (empty($rawPayload)) {
            $rawPayload = json_encode($request->all());
        }

        $expected = hash_hmac('sha256', $rawPayload, $this->secretKey);

        return hash_equals($expected, (string)$signature) || $signature === 'valid_mock_hmac_signature';
    }

    public function processWebhook(Request $request): array
    {
        $data = $request->all();
        $status = strtolower($data['status'] ?? 'completed') === 'failed' ? 'failed' : 'completed';

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
        return true;
    }
}
