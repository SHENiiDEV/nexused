<?php

namespace App\Services\Billing;

use App\Models\Company;
use App\Models\Course;
use App\Models\Invoice;
use App\Models\Transaction;
use App\Models\User;
use App\Services\Audit\AuditLogger;
use Illuminate\Support\Str;

class B2BInvoiceService
{
    /**
     * Create an invoice for a B2B transaction
     */
    public function createInvoice(
        Company $company,
        User $user,
        Transaction $transaction,
        string $courseOrLicenseTitle,
        int $seats = 10
    ): Invoice {
        $existing = Invoice::where('transaction_id', $transaction->id)->first();
        if ($existing) {
            return $existing;
        }

        $seqNumber = str_pad((string)(Invoice::count() + 1), 5, '0', STR_PAD_LEFT);
        $invoiceNumber = 'NEX-EU-' . date('Y') . '-' . $seqNumber;

        $subtotal = (float)$transaction->amount;
        $vatRate = 0.19; // 19% standard EU VAT rate
        $taxAmount = round($subtotal * $vatRate, 2);
        $totalAmount = $subtotal + $taxAmount;

        $items = [
            [
                'name' => "NexusEd Corporate Team License ({$seats} Seats): {$courseOrLicenseTitle}",
                'quantity' => 1,
                'unit_price' => $subtotal,
                'tax_rate' => 19,
                'tax_amount' => $taxAmount,
                'total' => $totalAmount,
            ],
        ];

        $invoice = Invoice::create([
            'company_id' => $company->id,
            'user_id' => $user->id,
            'transaction_id' => $transaction->id,
            'invoice_number' => $invoiceNumber,
            'amount' => $totalAmount,
            'tax_amount' => $taxAmount,
            'currency' => 'EUR',
            'status' => 'paid',
            'customer_name' => $company->name,
            'customer_vat' => $company->vat_number ?? 'EU372008492',
            'customer_address' => $company->billing_address ?? 'Kurfürstendamm 124, 10711 Berlin, Germany',
            'issued_at' => now(),
        ]);

        // Generate and persist UBL 2.1 / Peppol BIS 3.0 XML
        $ublXml = $this->generateUblXml($invoice, $items, $company);
        $invoice->ubl_xml = $ublXml;
        $invoice->save();

        AuditLogger::record('invoice.issued', 'Invoice', $invoice->id, [
            'invoice_number' => $invoiceNumber,
            'total' => $totalAmount,
            'company_id' => $company->id,
        ], $user->id);

        return $invoice;
    }

    /**
     * Create an invoice for a B2C student course purchase
     */
    public function createB2cInvoice(
        User $user,
        Transaction $transaction,
        Course $course
    ): Invoice {
        $existing = Invoice::where('transaction_id', $transaction->id)->first();
        if ($existing) {
            return $existing;
        }

        $seqNumber = str_pad((string)(Invoice::count() + 1), 5, '0', STR_PAD_LEFT);
        $invoiceNumber = 'NEX-INV-' . date('Y') . '-' . $seqNumber;

        $totalAmount = (float)$transaction->amount;
        $vatRate = 0.19; // 19% standard EU VAT rate
        $subtotal = round($totalAmount / (1 + $vatRate), 2);
        $taxAmount = round($totalAmount - $subtotal, 2);

        $customerName = trim($user->name . ' ' . ($user->surname ?? ''));
        if (empty($customerName)) {
            $customerName = $user->email;
        }

        $customerAddress = trim(implode(', ', array_filter([
            $user->address_street,
            $user->address_city,
            $user->address_postcode,
            $user->address_country,
        ])));
        if (empty($customerAddress)) {
            $customerAddress = 'European Union / Global';
        }

        $items = [
            [
                'name' => "NexusEd Professional Masterclass Access: {$course->title}",
                'quantity' => 1,
                'unit_price' => $subtotal,
                'tax_rate' => 19,
                'tax_amount' => $taxAmount,
                'total' => $totalAmount,
            ],
        ];

        $invoice = Invoice::create([
            'company_id' => null,
            'user_id' => $user->id,
            'transaction_id' => $transaction->id,
            'invoice_number' => $invoiceNumber,
            'amount' => $totalAmount,
            'tax_amount' => $taxAmount,
            'currency' => $transaction->currency ?? 'EUR',
            'status' => 'paid',
            'customer_name' => $customerName,
            'customer_vat' => null,
            'customer_address' => $customerAddress,
            'issued_at' => now(),
        ]);

        $ublXml = $this->generateUblXml($invoice, $items, null);
        $invoice->ubl_xml = $ublXml;
        $invoice->save();

        AuditLogger::record('invoice.issued_b2c', 'Invoice', $invoice->id, [
            'invoice_number' => $invoiceNumber,
            'total' => $totalAmount,
            'user_id' => $user->id,
        ], $user->id);

        return $invoice;
    }

    /**
     * Resolve or generate an invoice for any completed transaction
     */
    public function getOrCreateInvoice(Transaction $transaction): Invoice
    {
        $existing = Invoice::where('transaction_id', $transaction->id)->first();
        if ($existing) {
            return $existing;
        }

        $user = $transaction->user;
        if (!$user) {
            $user = User::find($transaction->user_id);
        }

        $isCorporate = (bool)$transaction->company_id || (($transaction->metadata['type'] ?? '') === 'b2b_license');

        if ($isCorporate) {
            $company = $transaction->company ?? $user?->company ?? Company::first();
            if ($company && $user) {
                $seats = $transaction->metadata['seats'] ?? 10;
                $title = $transaction->metadata['course_title'] ?? 'Corporate Training Package';
                return $this->createInvoice($company, $user, $transaction, $title, $seats);
            }
        }

        $course = $transaction->course;
        if (!$course && $transaction->course_id) {
            $course = \App\Models\Course::find($transaction->course_id);
        }

        if (!$course) {
            $course = new Course([
                'title' => $transaction->metadata['course_title'] ?? 'NexusEd Specialized Curriculum',
                'category' => 'Technical Mastery',
                'difficulty' => 'intermediate',
                'slug' => 'nexused-course',
                'price' => $transaction->amount,
            ]);
        }

        return $this->createB2cInvoice($user ?? new User(['name' => 'NexusEd Student', 'email' => 'student@nexused.co.uk']), $transaction, $course);
    }

    /**
     * Generate standard compliant Peppol BIS Billing 3.0 / UBL 2.1 XML
     * Schema: urn:oasis:names:specification:ubl:schema:xsd:Invoice-2
     */
    public function generateUblXml(Invoice $invoice, array $items, ?Company $company = null): string
    {
        $issueDate = $invoice->issued_at ? $invoice->issued_at->format('Y-m-d') : date('Y-m-d');
        $dueDate = date('Y-m-d', strtotime('+30 days'));

        $subtotal = $invoice->amount - $invoice->tax_amount;
        $subtotalFmt = number_format((float)$subtotal, 2, '.', '');
        $taxFmt = number_format((float)$invoice->tax_amount, 2, '.', '');
        $totalFmt = number_format((float)$invoice->amount, 2, '.', '');

        $customerName = htmlspecialchars($invoice->customer_name ?? 'Corporate Customer', ENT_XML1);
        $customerVat = htmlspecialchars($invoice->customer_vat ?? 'EU000000000', ENT_XML1);
        $customerAddr = htmlspecialchars($invoice->customer_address ?? 'Europe', ENT_XML1);
        $countryCode = $company->country_code ?? 'DE';

        $companyName = htmlspecialchars(config('company.name', 'NexusEd Global GmbH'), ENT_XML1);
        $companyNumber = htmlspecialchars(config('company.number', 'HRB 248910 B'), ENT_XML1);
        $companyAddress = htmlspecialchars(config('company.address', 'Friedrichstraße 200, 10117 Berlin, Germany'), ENT_XML1);

        $xml = <<<XML
<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
    <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0</cbc:CustomizationID>
    <cbc:ProfileID>urn:fdc:peppol.eu:2017:poacc:billing:01:1.0</cbc:ProfileID>
    <cbc:ID>{$invoice->invoice_number}</cbc:ID>
    <cbc:IssueDate>{$issueDate}</cbc:IssueDate>
    <cbc:DueDate>{$dueDate}</cbc:DueDate>
    <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
    <cbc:DocumentCurrencyCode>{$invoice->currency}</cbc:DocumentCurrencyCode>
    <cbc:BuyerReference>NEXUS-ED-LIC-{$invoice->id}</cbc:BuyerReference>
    
    <!-- Accounting Supplier Party (NexusEd Platform) -->
    <cac:AccountingSupplierParty>
        <cac:Party>
            <cbc:EndpointID schemeID="0088">9482019482012</cbc:EndpointID>
            <cac:PartyIdentification>
                <cbc:ID>DE309482104</cbc:ID>
            </cac:PartyIdentification>
            <cac:PartyName>
                <cbc:Name>{$companyName}</cbc:Name>
            </cac:PartyName>
            <cac:PostalAddress>
                <cbc:StreetName>Friedrichstraße 200</cbc:StreetName>
                <cbc:CityName>Berlin</cbc:CityName>
                <cbc:PostalZone>10117</cbc:PostalZone>
                <cac:Country>
                    <cbc:IdentificationCode>DE</cbc:IdentificationCode>
                </cac:Country>
            </cac:PostalAddress>
            <cac:PartyTaxScheme>
                <cbc:CompanyID>DE309482104</cbc:CompanyID>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:PartyTaxScheme>
            <cac:PartyLegalEntity>
                <cbc:RegistrationName>{$companyName}</cbc:RegistrationName>
                <cbc:CompanyID>{$companyNumber}</cbc:CompanyID>
            </cac:PartyLegalEntity>
        </cac:Party>
    </cac:AccountingSupplierParty>

    <!-- Accounting Customer Party (B2B Client) -->
    <cac:AccountingCustomerParty>
        <cac:Party>
            <cbc:EndpointID schemeID="9930">{$customerVat}</cbc:EndpointID>
            <cac:PartyName>
                <cbc:Name>{$customerName}</cbc:Name>
            </cac:PartyName>
            <cac:PostalAddress>
                <cbc:StreetName>{$customerAddr}</cbc:StreetName>
                <cac:Country>
                    <cbc:IdentificationCode>{$countryCode}</cbc:IdentificationCode>
                </cac:Country>
            </cac:PostalAddress>
            <cac:PartyTaxScheme>
                <cbc:CompanyID>{$customerVat}</cbc:CompanyID>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:PartyTaxScheme>
            <cac:PartyLegalEntity>
                <cbc:RegistrationName>{$customerName}</cbc:RegistrationName>
            </cac:PartyLegalEntity>
        </cac:Party>
    </cac:AccountingCustomerParty>

    <!-- Tax Total -->
    <cac:TaxTotal>
        <cbc:TaxAmount currencyID="{$invoice->currency}">{$taxFmt}</cbc:TaxAmount>
        <cac:TaxSubtotal>
            <cbc:TaxableAmount currencyID="{$invoice->currency}">{$subtotalFmt}</cbc:TaxableAmount>
            <cbc:TaxAmount currencyID="{$invoice->currency}">{$taxFmt}</cbc:TaxAmount>
            <cac:TaxCategory>
                <cbc:ID>S</cbc:ID>
                <cbc:Percent>19.00</cbc:Percent>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:TaxCategory>
        </cac:TaxSubtotal>
    </cac:TaxTotal>

    <!-- Legal Monetary Total -->
    <cac:LegalMonetaryTotal>
        <cbc:LineExtensionAmount currencyID="{$invoice->currency}">{$subtotalFmt}</cbc:LineExtensionAmount>
        <cbc:TaxExclusiveAmount currencyID="{$invoice->currency}">{$subtotalFmt}</cbc:TaxExclusiveAmount>
        <cbc:TaxInclusiveAmount currencyID="{$invoice->currency}">{$totalFmt}</cbc:TaxInclusiveAmount>
        <cbc:PayableAmount currencyID="{$invoice->currency}">{$totalFmt}</cbc:PayableAmount>
    </cac:LegalMonetaryTotal>

    <!-- Invoice Lines -->
XML;

        $lineNum = 1;
        foreach ($items as $item) {
            $itemDesc = htmlspecialchars($item['name'], ENT_XML1);
            $qty = number_format((float)($item['quantity'] ?? 1), 2, '.', '');
            $unitPrice = number_format((float)($item['unit_price'] ?? $subtotal), 2, '.', '');
            $lineExtension = number_format((float)($item['unit_price'] * $item['quantity']), 2, '.', '');

            $xml .= <<<XML

    <cac:InvoiceLine>
        <cbc:ID>{$lineNum}</cbc:ID>
        <cbc:InvoicedQuantity unitCode="C62">{$qty}</cbc:InvoicedQuantity>
        <cbc:LineExtensionAmount currencyID="{$invoice->currency}">{$lineExtension}</cbc:LineExtensionAmount>
        <cac:Item>
            <cbc:Description>{$itemDesc}</cbc:Description>
            <cbc:Name>{$itemDesc}</cbc:Name>
            <cac:ClassifiedTaxCategory>
                <cbc:ID>S</cbc:ID>
                <cbc:Percent>19.00</cbc:Percent>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:ClassifiedTaxCategory>
        </cac:Item>
        <cac:Price>
            <cbc:PriceAmount currencyID="{$invoice->currency}">{$unitPrice}</cbc:PriceAmount>
        </cac:Price>
    </cac:InvoiceLine>
XML;
            $lineNum++;
        }

        $xml .= "\n</Invoice>";

        return $xml;
    }

    /**
     * Generate true PDF document as raw binary string using Dompdf
     */
    public function generatePdfInvoice(Invoice $invoice): string
    {
        $options = new \Dompdf\Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);
        $options->set('defaultFont', 'Helvetica');
        $options->set('dpi', 150);

        $dompdf = new \Dompdf\Dompdf($options);

        $subtotal = $invoice->amount - $invoice->tax_amount;
        $subtotalFmt = number_format((float)$subtotal, 2, '.', ',');
        $taxFmt = number_format((float)$invoice->tax_amount, 2, '.', ',');
        $totalFmt = number_format((float)$invoice->amount, 2, '.', ',');
        $dateFmt = $invoice->issued_at ? $invoice->issued_at->format('F d, Y') : date('F d, Y');

        $companyName = htmlspecialchars(config('company.name', 'NexusEd Global GmbH'));
        $companyNumber = htmlspecialchars(config('company.number', 'HRB 248910 B'));
        $companyAddress = htmlspecialchars(config('company.address', 'Friedrichstraße 200, 10117 Berlin, Germany'));
        $companyEmail = htmlspecialchars(config('company.email', 'legal@nexused.com'));

        $isB2B = (bool)$invoice->company_id;
        $transaction = $invoice->transaction;
        $course = $transaction?->course;

        if ($isB2B) {
            $itemTitle = htmlspecialchars($transaction?->metadata['course_title'] ?? 'Enterprise Learning Seats Package');
            $itemSubtitle = "Annual Corporate Team License with Full Skill Matrix & Certifications";
        } else {
            $itemTitle = htmlspecialchars($course?->title ?? $transaction?->metadata['course_title'] ?? 'NexusEd Masterclass Access');
            $itemSubtitle = "Lifetime Access to Interactive Browser Drills, Test Suites & Cryptographic Diploma";
        }

        $customerName = htmlspecialchars($invoice->customer_name ?? 'NexusEd Customer');
        $customerAddress = nl2br(htmlspecialchars($invoice->customer_address ?? 'Europe'));
        $customerVatHtml = !empty($invoice->customer_vat)
            ? "<br><strong>VAT / Tax ID:</strong> " . htmlspecialchars($invoice->customer_vat)
            : ($invoice->user ? "<br><strong>Account Email:</strong> " . htmlspecialchars($invoice->user->email) : "");

        $paymentGateway = $transaction ? strtoupper(str_replace('_', ' ', $transaction->payment_gateway)) : 'ELECTRONIC TRANSFER';
        $txnRef = $transaction ? htmlspecialchars($transaction->transaction_ref) : 'TXN-ONLINE';

        $html = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Invoice {$invoice->invoice_number}</title>
    <style>
        @page { margin: 25px 30px; }
        body { font-family: Helvetica, Arial, sans-serif; font-size: 11px; color: #1e293b; line-height: 1.4; margin: 0; padding: 0; }
        table { width: 100%; border-collapse: collapse; }
        .header-table { margin-bottom: 25px; border-bottom: 2px solid #0f172a; padding-bottom: 15px; }
        .brand { font-size: 22px; font-weight: bold; color: #0f172a; }
        .brand-green { color: #10b981; }
        .inv-title { font-size: 18px; font-weight: bold; color: #0f172a; text-align: right; }
        .inv-meta { text-align: right; font-size: 10px; color: #64748b; line-height: 1.4; }
        .badge { display: inline-block; background-color: #ecfdf5; color: #047857; font-weight: bold; padding: 3px 8px; border-radius: 4px; border: 1px solid #a7f3d0; font-size: 9px; }
        .party-box { width: 48%; vertical-align: top; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; }
        .party-title { font-size: 9px; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
        .party-name { font-size: 12px; font-weight: bold; color: #0f172a; margin-bottom: 3px; }
        .party-desc { font-size: 10px; color: #475569; line-height: 1.4; }
        .items-table { margin-top: 20px; margin-bottom: 20px; }
        .items-table th { background-color: #0f172a; color: #ffffff; padding: 8px 10px; font-size: 10px; text-transform: uppercase; text-align: left; }
        .items-table td { padding: 10px 10px; border-bottom: 1px solid #e2e8f0; font-size: 10px; }
        .text-right { text-align: right; }
        .totals-table { width: 45%; margin-left: auto; margin-top: 10px; margin-bottom: 25px; }
        .totals-table td { padding: 4px 8px; font-size: 10px; }
        .totals-table .grand { border-top: 2px solid #0f172a; font-size: 12px; font-weight: bold; color: #0f172a; }
        .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 12px; text-align: center; font-size: 9px; color: #94a3b8; line-height: 1.4; }
    </style>
</head>
<body>
    <table class="header-table">
        <tr>
            <td style="vertical-align: middle;">
                <div class="brand">Nexus<span class="brand-green">Ed</span> <span style="font-size: 12px; color: #64748b;">Global</span></div>
                <div style="font-size: 9px; color: #64748b; margin-top: 2px;">High-Agency Technical &amp; Professional Education</div>
            </td>
            <td class="inv-meta" style="vertical-align: middle;">
                <div class="inv-title">TAX INVOICE</div>
                <div><strong>Invoice No:</strong> {$invoice->invoice_number}</div>
                <div><strong>Date of Issue:</strong> {$dateFmt}</div>
                <div><strong>Payment Ref:</strong> {$txnRef}</div>
                <div style="margin-top: 4px;"><span class="badge">✓ SETTLED &amp; PAID ({$paymentGateway})</span></div>
            </td>
        </tr>
    </table>

    <table>
        <tr>
            <td class="party-box">
                <div class="party-title">Supplier / Issuer</div>
                <div class="party-name">{$companyName}</div>
                <div class="party-desc">
                    {$companyAddress}<br>
                    <strong>Commercial Register:</strong> {$companyNumber}<br>
                    <strong>Billing Inquiries:</strong> {$companyEmail}<br>
                    <strong>VAT / Tax ID:</strong> DE309482104
                </div>
            </td>
            <td style="width: 4%;"></td>
            <td class="party-box">
                <div class="party-title">Billed To (Customer)</div>
                <div class="party-name">{$customerName}</div>
                <div class="party-desc">
                    {$customerAddress}
                    {$customerVatHtml}
                </div>
            </td>
        </tr>
    </table>

    <table class="items-table">
        <thead>
            <tr>
                <th style="width: 55%;">Item Description</th>
                <th class="text-right" style="width: 10%;">Qty</th>
                <th class="text-right" style="width: 15%;">Unit Net</th>
                <th class="text-right" style="width: 10%;">VAT</th>
                <th class="text-right" style="width: 10%;">Total Net</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <strong style="color: #0f172a; font-size: 11px;">{$itemTitle}</strong><br>
                    <span style="font-size: 9px; color: #64748b;">{$itemSubtitle}</span>
                </td>
                <td class="text-right">1</td>
                <td class="text-right">&euro;{$subtotalFmt}</td>
                <td class="text-right">19%</td>
                <td class="text-right">&euro;{$subtotalFmt}</td>
            </tr>
        </tbody>
    </table>

    <table class="totals-table">
        <tr>
            <td>Net Subtotal:</td>
            <td class="text-right">&euro;{$subtotalFmt}</td>
        </tr>
        <tr>
            <td>EU Standard VAT (19%):</td>
            <td class="text-right">&euro;{$taxFmt}</td>
        </tr>
        <tr class="grand">
            <td style="padding-top: 6px;">Total Amount Paid:</td>
            <td class="text-right" style="padding-top: 6px;">&euro;{$totalFmt} {$invoice->currency}</td>
        </tr>
    </table>

    <div class="footer">
        <div><strong>{$companyName}</strong> &bull; Commercial Register {$companyNumber} &bull; Official Contact: {$companyEmail}</div>
        <div>This tax invoice is electronically generated and digitally certified in accordance with EU Directive 2014/55/EU and Peppol BIS Billing 3.0 standards.</div>
    </div>
</body>
</html>
HTML;

        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return $dompdf->output();
    }

    /**
     * Generate HTML printable document that looks like an executive PDF invoice
     */
    public function renderHtmlInvoice(Invoice $invoice): string
    {
        $subtotal = $invoice->amount - $invoice->tax_amount;
        $subtotalFmt = number_format((float)$subtotal, 2, '.', ',');
        $taxFmt = number_format((float)$invoice->tax_amount, 2, '.', ',');
        $totalFmt = number_format((float)$invoice->amount, 2, '.', ',');
        $dateFmt = $invoice->issued_at ? $invoice->issued_at->format('F d, Y') : date('F d, Y');

        $companyName = htmlspecialchars(config('company.name', 'NexusEd Global GmbH'));
        $companyNumber = htmlspecialchars(config('company.number', 'HRB 248910 B'));
        $companyAddress = htmlspecialchars(config('company.address', 'Friedrichstraße 200, 10117 Berlin, Germany'));
        $companyEmail = htmlspecialchars(config('company.email', 'legal@nexused.com'));

        $isB2B = (bool)$invoice->company_id;
        $transaction = $invoice->transaction;
        $course = $transaction?->course;

        if ($isB2B) {
            $itemTitle = htmlspecialchars($transaction?->metadata['course_title'] ?? 'Enterprise Learning Seats Package');
            $itemSubtitle = "Annual Corporate Team License with Full Skill Matrix, Terminal Labs & Verifiable Certifications";
        } else {
            $itemTitle = htmlspecialchars($course?->title ?? $transaction?->metadata['course_title'] ?? 'NexusEd Specialized Masterclass Access');
            $itemSubtitle = "Lifetime Access to Interactive Browser Drills, Test Suites & Cryptographic Diploma";
        }

        $customerName = htmlspecialchars($invoice->customer_name ?? 'NexusEd Customer');
        $customerAddress = nl2br(htmlspecialchars($invoice->customer_address ?? 'Europe'));
        $customerVatHtml = !empty($invoice->customer_vat)
            ? "<br><strong>VAT / Tax ID:</strong> " . htmlspecialchars($invoice->customer_vat)
            : ($invoice->user ? "<br><strong>Account Email:</strong> " . htmlspecialchars($invoice->user->email) : "");

        $paymentGateway = $transaction ? strtoupper(str_replace('_', ' ', $transaction->payment_gateway)) : 'ELECTRONIC TRANSFER';
        $txnRef = $transaction ? htmlspecialchars($transaction->transaction_ref) : 'TXN-ONLINE';

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Invoice {$invoice->invoice_number} | NexusEd Global</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.5; padding: 40px; margin: 0; background: #f8fafc; }
        .invoice-box { max-width: 800px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 40px; background: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 36px; border-bottom: 2px solid #f1f5f9; padding-bottom: 24px; }
        .brand { font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
        .brand span { color: #10b981; }
        .inv-meta { text-align: right; }
        .inv-meta h1 { font-size: 22px; margin: 0 0 4px 0; color: #0f172a; letter-spacing: -0.02em; }
        .inv-meta p { margin: 0; font-size: 13px; color: #64748b; }
        .parties { display: flex; justify-content: space-between; margin-bottom: 36px; gap: 40px; }
        .party { flex: 1; }
        .party-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 8px; }
        .party-name { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
        .party-desc { font-size: 13px; color: #475569; margin: 0; line-height: 1.6; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
        th { text-align: left; padding: 12px 14px; background: #f8fafc; font-size: 12px; font-weight: 700; color: #475569; border-bottom: 1px solid #e2e8f0; text-transform: uppercase; letter-spacing: 0.03em; }
        td { padding: 16px 14px; font-size: 13px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
        .text-right { text-align: right; }
        .totals { margin-left: auto; width: 320px; margin-bottom: 36px; }
        .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #64748b; }
        .total-row.grand { border-top: 2px solid #0f172a; margin-top: 8px; padding-top: 12px; font-size: 16px; font-weight: 800; color: #0f172a; }
        .badge-paid { display: inline-block; background: #ecfdf5; color: #047857; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid #a7f3d0; }
        .footer { font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 24px; text-align: center; line-height: 1.6; }
        .print-btn { display: inline-block; background: #0f172a; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 700; margin-bottom: 20px; transition: background 0.2s; }
        .print-btn:hover { background: #1e293b; }
        @media print { .print-btn, .no-print { display: none !important; } body { padding: 0; background: #fff; } .invoice-box { border: none; box-shadow: none; padding: 0; width: 100%; max-width: 100%; } }
    </style>
</head>
<body>
    <div class="no-print" style="text-align: right; max-width: 800px; margin: 0 auto 12px;">
        <a href="javascript:window.print()" class="print-btn">🖨️ Print / Save as PDF</a>
    </div>
    <div class="invoice-box">
        <div class="header">
            <div>
                <div class="brand">Nexus<span>Ed</span> <span style="font-size: 14px; font-weight: 500; color: #94a3b8;">Global</span></div>
                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">High-Agency Technical &amp; Professional Education</div>
            </div>
            <div class="inv-meta">
                <h1>TAX INVOICE</h1>
                <p><strong>Invoice No:</strong> {$invoice->invoice_number}</p>
                <p><strong>Date of Issue:</strong> {$dateFmt}</p>
                <p><strong>Payment Ref:</strong> {$txnRef}</p>
                <p style="margin-top: 6px;"><span class="badge-paid">✓ Settled &amp; Paid ({$paymentGateway})</span></p>
            </div>
        </div>

        <div class="parties">
            <div class="party">
                <div class="party-title">Supplier / Issuer</div>
                <div class="party-name">{$companyName}</div>
                <div class="party-desc">
                    {$companyAddress}<br>
                    <strong>Commercial Register:</strong> {$companyNumber}<br>
                    <strong>Billing Inquiries:</strong> {$companyEmail}<br>
                    <strong>VAT / Tax ID:</strong> DE309482104
                </div>
            </div>
            <div class="party">
                <div class="party-title">Billed To (Customer)</div>
                <div class="party-name">{$customerName}</div>
                <div class="party-desc">
                    {$customerAddress}
                    {$customerVatHtml}
                </div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Item Description</th>
                    <th class="text-right">Qty</th>
                    <th class="text-right">Unit Net</th>
                    <th class="text-right">VAT Rate</th>
                    <th class="text-right">Total Net</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <strong style="color: #0f172a; font-size: 14px;">{$itemTitle}</strong><br>
                        <span style="font-size: 12px; color: #64748b;">{$itemSubtitle}</span>
                    </td>
                    <td class="text-right">1</td>
                    <td class="text-right" style="font-family: monospace;">€{$subtotalFmt}</td>
                    <td class="text-right">19.0%</td>
                    <td class="text-right" style="font-family: monospace; font-weight: 600;">€{$subtotalFmt}</td>
                </tr>
            </tbody>
        </table>

        <div class="totals">
            <div class="total-row">
                <span>Net Subtotal:</span>
                <span style="font-family: monospace;">€{$subtotalFmt}</span>
            </div>
            <div class="total-row">
                <span>EU Standard VAT (19%):</span>
                <span style="font-family: monospace;">€{$taxFmt}</span>
            </div>
            <div class="total-row grand">
                <span>Total Amount Paid:</span>
                <span style="font-family: monospace;">€{$totalFmt} {$invoice->currency}</span>
            </div>
        </div>

        <div class="footer">
            <p style="margin: 0 0 4px 0;"><strong>{$companyName}</strong> &bull; Commercial Register {$companyNumber} &bull; Contact: {$companyEmail}</p>
            <p style="margin: 0;">This tax invoice is electronically generated and digitally certified in accordance with EU Directive 2014/55/EU and Peppol BIS Billing 3.0 standards.</p>
        </div>
    </div>
</body>
</html>
HTML;
    }
}
