<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Invoice;
use App\Models\Transaction;
use App\Models\User;
use App\Services\Billing\B2BInvoiceService;
use Tests\TestCase;

class B2BInvoiceTest extends TestCase
{
    public function test_b2b_invoice_generation_computes_tax_and_creates_record(): void
    {
        $company = Company::first();
        $corporate = User::firstWhere('role', 'corporate');

        $transaction = Transaction::create([
            'user_id' => $corporate->id,
            'company_id' => $company->id,
            'amount' => 1000.00,
            'currency' => 'EUR',
            'payment_gateway' => 'corefy',
            'status' => 'completed',
            'transaction_ref' => 'TXN-TEST-INV-' . rand(100, 999),
        ]);

        $service = new B2BInvoiceService();
        $invoice = $service->createInvoice(
            $company,
            $corporate,
            $transaction,
            'Corporate Architecture Team Package (10 Seats)',
            10
        );

        $this->assertNotNull($invoice->invoice_number);
        $this->assertEquals(1190.00, (float)$invoice->amount);
        $this->assertEquals(190.00, (float)$invoice->tax_amount);
        $this->assertNotEmpty($invoice->ubl_xml);
        $this->assertStringContainsString('urn:oasis:names:specification:ubl:schema:xsd:Invoice-2', $invoice->ubl_xml);
    }

    public function test_peppol_ubl_export_endpoint_returns_valid_xml(): void
    {
        $corporate = User::firstWhere('role', 'corporate');
        $invoice = Invoice::first();
        $this->assertNotNull($invoice);

        $response = $this->actingAs($corporate)
            ->get("/corporate/invoices/{$invoice->id}/ubl");

        $response->assertStatus(200);
        $this->assertStringContainsString('xml', $response->headers->get('content-type'));
        $this->assertStringContainsString('<cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0</cbc:CustomizationID>', $response->getContent());
    }
}
