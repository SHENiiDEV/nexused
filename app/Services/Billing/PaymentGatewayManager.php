<?php

namespace App\Services\Billing;

use App\Contracts\PaymentGatewayInterface;
use App\Services\Billing\Gateways\ApplePayGateway;
use App\Services\Billing\Gateways\CardaqGateway;
use App\Services\Billing\Gateways\CorefyGateway;
use App\Services\Billing\Gateways\MockGateway;
use InvalidArgumentException;

class PaymentGatewayManager
{
    /**
     * @var array<string, PaymentGatewayInterface>
     */
    protected array $drivers = [];

    public function __construct()
    {
        $this->register('corefy', new CorefyGateway());
        $this->register('cardaq', new CardaqGateway());
        $this->register('apple_pay', new ApplePayGateway());
        $this->register('mock', new MockGateway());
    }

    public function register(string $name, PaymentGatewayInterface $driver): self
    {
        $this->drivers[strtolower($name)] = $driver;
        return $this;
    }

    public function driver(?string $name = null): PaymentGatewayInterface
    {
        $name = strtolower($name ?? 'mock');

        if (!isset($this->drivers[$name])) {
            throw new InvalidArgumentException("Unsupported payment gateway driver: [{$name}]");
        }

        return $this->drivers[$name];
    }

    /**
     * Get list of available active gateways
     */
    public function getAvailableGateways(): array
    {
        return [
            [
                'id' => 'corefy',
                'name' => 'Corefy Payment Hub',
                'description' => 'Multi-currency processing with SEPA, Visa, Mastercard, and localized banking.',
                'badge' => 'Enterprise Ready',
            ],
            [
                'id' => 'cardaq',
                'name' => 'Cardaq Acquiring',
                'description' => 'Direct European acquiring with 3D-Secure 2.2 and instant tokenization.',
                'badge' => 'High Approval',
            ],
            [
                'id' => 'apple_pay',
                'name' => 'Apple Pay',
                'description' => 'Frictionless one-touch biometric checkout for Safari and iOS devices.',
                'badge' => '1-Click Pay',
            ],
            [
                'id' => 'mock',
                'name' => 'Sandbox Instant Test',
                'description' => 'Simulate instant authorization, webhook delivery, and HMAC verification.',
                'badge' => 'Test Mode',
            ],
        ];
    }
}
