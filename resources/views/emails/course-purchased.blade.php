<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation & Tax Invoice</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table role="presentation" width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #0f172a; padding: 32px 40px; text-align: left;">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td>
                                        <div style="font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                                            Nexus<span style="color: #10b981;">Ed</span> <span style="font-size: 14px; font-weight: 500; color: #94a3b8; letter-spacing: 0;">Global</span>
                                        </div>
                                    </td>
                                    <td align="right">
                                        <span style="display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 700; color: #34d399; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                                            Payment Settled
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 40px 40px 32px 40px;">
                            <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1.3;">
                                Order Confirmation &amp; Access Unlocked
                            </h1>
                            
                            <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                                Hello <strong>{{ $user->name }}</strong>, thank you for your order! Your payment has been confirmed, and full immediate access has been activated on your account.
                            </p>

                            <!-- Item Purchased Highlight Box -->
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px 0; background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px;">
                                <tr>
                                    <td>
                                        <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                                            {{ $isCorporate ? 'Corporate Training Package' : 'Masterclass Enrolled' }}
                                        </div>
                                        <div style="font-size: 17px; font-weight: 800; color: #0f172a; line-height: 1.4; margin-bottom: 6px;">
                                            {{ $course?->title ?? $transaction->metadata['course_title'] ?? 'Enterprise Team Package' }}
                                        </div>
                                        @if($course)
                                            <div style="font-size: 13px; color: #475569;">
                                                Category: <span style="font-weight: 600; color: #0f172a;">{{ $course->category }}</span> &bull; Difficulty: <span style="font-weight: 600; color: #0f172a; text-transform: capitalize;">{{ $course->difficulty }}</span>
                                            </div>
                                        @elseif($isCorporate)
                                            <div style="font-size: 13px; color: #475569;">
                                                Allocated Seats: <span style="font-weight: 700; color: #059669;">+{{ $transaction->metadata['seats'] ?? 10 }} Team Licenses</span>
                                            </div>
                                        @endif
                                    </td>
                                </tr>
                            </table>

                            <!-- Official Invoice Attachment Notice Box -->
                            @if(isset($invoice))
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px 0; background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 18px 20px;">
                                <tr>
                                    <td>
                                        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td width="36" valign="top" style="padding-right: 12px;">
                                                    <div style="font-size: 24px; line-height: 1;">📄</div>
                                                </td>
                                                <td>
                                                    <div style="font-size: 13px; font-weight: 800; color: #166534; margin-bottom: 2px;">
                                                        Official Tax Invoice Attached
                                                    </div>
                                                    <div style="font-size: 12px; color: #15803d; line-height: 1.5;">
                                                        Invoice No: <strong style="font-family: monospace; color: #0f172a;">{{ $invoice->invoice_number }}</strong> &bull; Total: <strong style="color: #0f172a;">&euro;{{ number_format((float)$invoice->amount, 2) }} {{ $invoice->currency }}</strong><br>
                                                        Attached file: <code style="background-color: #dcfce7; padding: 2px 6px; border-radius: 4px; font-size: 11px; color: #14532d;">Invoice-{{ $invoice->invoice_number }}.pdf</code> (Official PDF Tax Invoice).
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            @endif

                            <!-- Order / Payment Receipt Details -->
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px 0; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
                                <tr>
                                    <td style="padding-bottom: 10px; font-size: 13px; color: #64748b; font-weight: 500;">Transaction Reference:</td>
                                    <td style="padding-bottom: 10px; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right; font-family: monospace;">{{ $transaction->transaction_ref }}</td>
                                </tr>
                                @if(isset($invoice))
                                <tr>
                                    <td style="padding-bottom: 10px; font-size: 13px; color: #64748b; font-weight: 500;">Invoice Number:</td>
                                    <td style="padding-bottom: 10px; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right; font-family: monospace;">{{ $invoice->invoice_number }}</td>
                                </tr>
                                @endif
                                <tr>
                                    <td style="padding-bottom: 10px; font-size: 13px; color: #64748b; font-weight: 500;">Amount Paid:</td>
                                    <td style="padding-bottom: 10px; font-size: 15px; color: #0f172a; font-weight: 800; text-align: right; font-family: monospace;">&euro;{{ number_format((float)$transaction->amount, 2) }} {{ $transaction->currency }}</td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 10px; font-size: 13px; color: #64748b; font-weight: 500;">Payment Gateway:</td>
                                    <td style="padding-bottom: 10px; font-size: 13px; color: #0f172a; font-weight: 600; text-align: right; text-transform: uppercase;">{{ str_replace('_', ' ', $transaction->payment_gateway) }}</td>
                                </tr>
                                <tr>
                                    <td style="font-size: 13px; color: #64748b; font-weight: 500;">Date &amp; Time:</td>
                                    <td style="font-size: 13px; color: #0f172a; font-weight: 600; text-align: right;">{{ $transaction->updated_at?->format('F j, Y, H:i') ?? now()->format('F j, Y, H:i') }} UTC</td>
                                </tr>
                            </table>

                            <!-- Primary CTA Button -->
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0 16px 0;">
                                <tr>
                                    <td align="center">
                                        @if($course)
                                            <a href="{{ config('app.url') }}/learn/{{ $course->slug }}" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #10b981; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);">
                                                Start Learning Now &rarr;
                                            </a>
                                        @elseif($isCorporate)
                                            <a href="{{ config('app.url') }}/corporate/dashboard" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #0f172a; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.2);">
                                                Manage Team Seats &amp; Invoices &rarr;
                                            </a>
                                        @else
                                            <a href="{{ config('app.url') }}/dashboard" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #0f172a; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 10px;">
                                                Go to Dashboard &rarr;
                                            </a>
                                        @endif
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 24px 0 0 0; font-size: 13px; line-height: 1.6; color: #64748b; text-align: center;">
                                Need assistance or a duplicate VAT invoice? Visit your <a href="{{ config('app.url') }}/dashboard" style="color: #059669; font-weight: 600; text-decoration: underline;">User Dashboard</a> or contact <a href="mailto:{{ $company['email'] ?? 'info@nexused.co.uk' }}" style="color: #059669; font-weight: 600;">{{ $company['email'] ?? 'info@nexused.co.uk' }}</a>.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #0f172a; padding: 28px 40px; border-top: 1px solid #1e293b; text-align: left;">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td>
                                        <div style="font-size: 12px; font-weight: 700; color: #ffffff; margin-bottom: 4px;">
                                            {{ $company['name'] ?? 'NexusEd Global GmbH' }}
                                        </div>
                                        <div style="font-size: 11px; color: #94a3b8; line-height: 1.5;">
                                            Commercial Register: <span style="font-family: monospace; color: #cbd5e1;">{{ $company['number'] ?? 'HRB 248910 B' }}</span><br>
                                            Registered Office: {{ $company['address'] ?? 'Friedrichstraße 200, 10117 Berlin, Germany' }}<br>
                                            Billing Inquiries: <a href="mailto:{{ $company['email'] ?? 'info@nexused.co.uk' }}" style="color: #34d399; text-decoration: none;">{{ $company['email'] ?? 'info@nexused.co.uk' }}</a>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-top: 16px; font-size: 10px; color: #64748b; border-top: 1px solid #1e293b; margin-top: 16px;">
                                        &copy; {{ date('Y') }} NexusEd Global. Official electronic order confirmation with attached tax invoice.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
