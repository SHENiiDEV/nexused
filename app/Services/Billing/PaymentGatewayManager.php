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
        $cardaq = new CardaqGateway();
        $this->register('credit_card', $cardaq);
        $this->register('cardaq', $cardaq);
        $this->register('corefy', new CorefyGateway());
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
        $name = strtolower($name ?? 'credit_card');

        if ($name === 'credit_card') {
            // Default to Cardaq or Mock
            return $this->drivers['credit_card'] ?? $this->drivers['mock'];
        }

        if (!isset($this->drivers[$name])) {
            throw new InvalidArgumentException("Unsupported payment gateway driver: [{$name}]");
        }

        return $this->drivers[$name];
    }

    /**
     * Get list of available active gateways - strictly Credit Card for checkout
     */
    public function getAvailableGateways(): array
    {
        return [
            [
                'id' => 'credit_card',
                'name' => 'Credit Card',
                'description' => 'Secure Visa, Mastercard & American Express processing with 3D-Secure 2.2.',
                'badge' => 'Instant & Secure',
            ],
        ];
    }
}
