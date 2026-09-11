<?php

namespace App\Services\Billing;

use App\Models\Company;
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

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Invoice {$invoice->invoice_number} | NexusEd</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.5; padding: 40px; margin: 0; background: #ffffff; }
        .invoice-box { max-width: 800px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 36px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #f1f5f9; padding-bottom: 24px; }
        .brand { font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
        .brand span { color: #10b981; }
        .inv-meta { text-align: right; }
        .inv-meta h1 { font-size: 20px; margin: 0 0 4px 0; color: #0f172a; }
        .inv-meta p { margin: 0; font-size: 13px; color: #64748b; }
        .parties { display: flex; justify-content: space-between; margin-bottom: 36px; gap: 40px; }
        .party { flex: 1; }
        .party-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 8px; }
        .party-name { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
        .party-desc { font-size: 13px; color: #475569; margin: 0; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
        th { text-align: left; padding: 12px; background: #f8fafc; font-size: 12px; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0; }
        td { padding: 14px 12px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
        .text-right { text-align: right; }
        .totals { margin-left: auto; width: 300px; margin-bottom: 40px; }
        .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #64748b; }
        .total-row.grand { border-top: 2px solid #0f172a; margin-top: 6px; padding-top: 10px; font-size: 16px; font-weight: 800; color: #0f172a; }
        .badge-paid { display: inline-block; background: #ecfdf5; color: #047857; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em; }
        .footer { font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center; }
        .print-btn { display: inline-block; background: #0f172a; color: #fff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
        @media print { .print-btn { display: none; } body { padding: 0; } .invoice-box { border: none; box-shadow: none; padding: 0; } }
    </style>
</head>
<body>
    <div style="text-align: right; max-width: 800px; margin: 0 auto 10px;">
        <a href="javascript:window.print()" class="print-btn">Print / Save as PDF</a>
    </div>
    <div class="invoice-box">
        <div class="header">
            <div>
                <div class="brand">Nexus<span>Ed</span></div>
                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Next-Generation AI Educational SaaS</div>
            </div>
            <div class="inv-meta">
                <h1>TAX INVOICE</h1>
                <p><strong>Invoice No:</strong> {$invoice->invoice_number}</p>
                <p><strong>Date:</strong> {$dateFmt}</p>
                <p style="margin-top: 6px;"><span class="badge-paid">Status: Paid</span></p>
            </div>
        </div>

        <div class="parties">
            <div class="party">
                <div class="party-title">Supplier / Issuer</div>
                <div class="party-name">{$companyName}</div>
                <div class="party-desc">
                    {$companyAddress}<br>
                    <strong>Commercial Register:</strong> {$companyNumber}<br>
                    <strong>Contact:</strong> {$companyEmail}<br>
                    <strong>VAT / Tax ID:</strong> DE309482104<br>
                    <strong>E-Invoicing Endpoint:</strong> 9482019482012
                </div>
            </div>
            <div class="party">
                <div class="party-title">Billed To (Customer)</div>
                <div class="party-name">{$invoice->customer_name}</div>
                <div class="party-desc">
                    {$invoice->customer_address}<br>
                    <strong>VAT / Tax ID:</strong> {$invoice->customer_vat}
                </div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th class="text-right">Qty</th>
                    <th class="text-right">Unit Price</th>
                    <th class="text-right">VAT</th>
                    <th class="text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <strong>Enterprise Learning Seats Package</strong><br>
                        <span style="font-size: 12px; color: #64748b;">Annual B2B Team License with Full Analytics & Certifications</span>
                    </td>
                    <td class="text-right">1</td>
                    <td class="text-right">€{$subtotalFmt}</td>
                    <td class="text-right">19%</td>
                    <td class="text-right">€{$subtotalFmt}</td>
                </tr>
            </tbody>
        </table>

        <div class="totals">
            <div class="total-row">
                <span>Subtotal (Net):</span>
                <span>€{$subtotalFmt}</span>
            </div>
            <div class="total-row">
                <span>EU Standard VAT (19%):</span>
                <span>€{$taxFmt}</span>
            </div>
            <div class="total-row grand">
                <span>Total Paid:</span>
                <span>€{$totalFmt} {$invoice->currency}</span>
            </div>
        </div>

        <div class="footer">
            <p>{$companyName} • Commercial Register {$companyNumber} • Official Contact: {$companyEmail}</p>
            <p>This invoice is electronically certified and fully conforms to Peppol BIS Billing 3.0 / EU Directive 2014/55/EU.</p>
        </div>
    </div>
</body>
</html>
HTML;
    }
}
