<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Course;
use App\Models\Invoice;
use App\Models\Transaction;
use App\Models\User;
use App\Services\Billing\B2BInvoiceService;
use Tests\TestCase;

class B2BInvoiceTest extends TestCase
{
    public function test_ubl_supplier_uses_uk_identity_without_an_unconfigured_vat_number(): void
    {
        config(['company.vat_number' => null]);
        $invoice = new Invoice([
            'invoice_number' => 'UK-SUPPLIER-TEST',
            'amount' => 100,
            'tax_amount' => 0,
            'currency' => 'GBP',
        ]);

        $xml = (new B2BInvoiceService)->generateUblXml($invoice, []);

        $document = new \DOMDocument;
        $this->assertTrue($document->loadXML($xml));
        $xpath = new \DOMXPath($document);
        $xpath->registerNamespace('cac', 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2');
        $xpath->registerNamespace('cbc', 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2');
        $supplier = '//cac:AccountingSupplierParty/cac:Party';
        $this->assertSame('TRUE CENTRIC LTD', $xpath->evaluate("string({$supplier}/cac:PartyLegalEntity/cbc:RegistrationName)"));
        $this->assertSame('15642952', $xpath->evaluate("string({$supplier}/cac:PartyLegalEntity/cbc:CompanyID)"));
        $this->assertSame('20 Wenlock Road', $xpath->evaluate("string({$supplier}/cac:PostalAddress/cbc:StreetName)"));
        $this->assertSame('London', $xpath->evaluate("string({$supplier}/cac:PostalAddress/cbc:CityName)"));
        $this->assertSame('N1 7GU', $xpath->evaluate("string({$supplier}/cac:PostalAddress/cbc:PostalZone)"));
        $this->assertSame('GB', $xpath->evaluate("string({$supplier}/cac:PostalAddress/cac:Country/cbc:IdentificationCode)"));
        $this->assertSame(0, $xpath->query("{$supplier}/cac:PartyTaxScheme")->length);
        $this->assertSame(0, $xpath->query("{$supplier}/cbc:EndpointID")->length);
    }

    public function test_ubl_supplier_includes_only_the_configured_vat_number(): void
    {
        config(['company.vat_number' => 'GB123456789']);
        $invoice = new Invoice([
            'invoice_number' => 'UK-VAT-TEST',
            'amount' => 100,
            'tax_amount' => 0,
            'currency' => 'GBP',
        ]);

        $xml = (new B2BInvoiceService)->generateUblXml($invoice, []);

        $document = new \DOMDocument;
        $this->assertTrue($document->loadXML($xml));
        $xpath = new \DOMXPath($document);
        $xpath->registerNamespace('cac', 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2');
        $xpath->registerNamespace('cbc', 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2');
        $this->assertSame('GB123456789', $xpath->evaluate('string(//cac:AccountingSupplierParty/cac:Party/cac:PartyTaxScheme/cbc:CompanyID)'));
    }

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
            'transaction_ref' => 'TXN-TEST-INV-'.rand(100, 999),
        ]);

        $service = new B2BInvoiceService;
        $invoice = $service->createInvoice(
            $company,
            $corporate,
            $transaction,
            'Corporate Architecture Team Package (10 Seats)',
            10
        );

        $this->assertNotNull($invoice->invoice_number);
        $this->assertEquals(1190.00, (float) $invoice->amount);
        $this->assertEquals(190.00, (float) $invoice->tax_amount);
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

    public function test_b2c_invoice_generation_and_html_render(): void
    {
        $student = User::firstWhere('role', 'student') ?? User::factory()->create(['role' => 'student']);
        $course = Course::first() ?? Course::create([
            'creator_id' => $student->id,
            'title' => 'Kubernetes Production Engineering',
            'slug' => 'k8s-prod',
            'price' => 50.00,
            'status' => 'published',
            'estimated_hours' => 10,
        ]);

        $transaction = Transaction::create([
            'user_id' => $student->id,
            'course_id' => $course->id,
            'amount' => 50.00,
            'currency' => 'EUR',
            'payment_gateway' => 'cardaq',
            'status' => 'completed',
            'transaction_ref' => 'TXN-B2C-'.rand(100, 999),
            'metadata' => ['type' => 'b2c_course'],
        ]);

        $service = new B2BInvoiceService;
        $invoice = $service->createB2cInvoice($student, $transaction, $course);

        $this->assertNotNull($invoice->invoice_number);
        $this->assertStringStartsWith('NEX-INV-', $invoice->invoice_number);
        $this->assertEquals(50.00, (float) $invoice->amount);
        $this->assertGreaterThan(0, (float) $invoice->tax_amount);

        $html = $service->renderHtmlInvoice($invoice);
        $this->assertStringContainsString('TAX INVOICE', $html);
        $this->assertStringContainsString($invoice->invoice_number, $html);
        $this->assertStringContainsString('NexusEd Global', $html);
        $this->assertStringContainsString('15642952', $html);
        $this->assertStringContainsString('TRUE CENTRIC LTD', $html);
        $this->assertStringContainsString('20 Wenlock Road', $html);
        $this->assertStringNotContainsString('DE309482104', $html);

        $pdfBinary = $service->generatePdfInvoice($invoice);
        $this->assertNotEmpty($pdfBinary);
        $this->assertStringStartsWith('%PDF-', $pdfBinary);
    }
}
