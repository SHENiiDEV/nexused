<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to NexusEd Global</title>
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
                                            Verified Account
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 40px 40px 32px 40px;">
                            <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1.3;">
                                Welcome to NexusEd, {{ $user->name }}!
                            </h1>
                            
                            <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                                Your account has been successfully created. You now have full access to our catalog of 63+ production-grade masterclasses across distributed systems, cloud architecture, AI engineering, product design, and executive communication.
                            </p>

                            <!-- Welcome Bonus Card -->
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 24px 0; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px 20px;">
                                <tr>
                                    <td>
                                        <div style="font-size: 12px; font-weight: 700; color: #15803d; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                                            ⚡ Welcome Starter Bonus Awarded
                                        </div>
                                        <div style="font-size: 14px; color: #166534; font-weight: 600;">
                                            +100 Experience Points (XP) &bull; Day 1 Learning Streak Initialized
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Account Details -->
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 24px 0; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
                                <tr>
                                    <td style="padding-bottom: 10px; font-size: 13px; color: #64748b; font-weight: 500;">Account Email:</td>
                                    <td style="padding-bottom: 10px; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right; font-family: monospace;">{{ $user->email }}</td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 10px; font-size: 13px; color: #64748b; font-weight: 500;">Account Type:</td>
                                    <td style="padding-bottom: 10px; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right; text-transform: capitalize;">{{ $user->role }}</td>
                                </tr>
                                <tr>
                                    <td style="font-size: 13px; color: #64748b; font-weight: 500;">Registration Date:</td>
                                    <td style="font-size: 13px; color: #0f172a; font-weight: 600; text-align: right;">{{ now()->format('F j, Y, H:i') }} UTC</td>
                                </tr>
                            </table>

                            <!-- Primary CTA -->
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0 16px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ config('app.url') }}/dashboard" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #0f172a; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.2);">
                                            Open Learning Dashboard &rarr;
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 24px 0 0 0; font-size: 13px; line-height: 1.6; color: #64748b; text-align: center;">
                                Looking for a specific topic? <a href="{{ config('app.url') }}/courses" style="color: #059669; font-weight: 600; text-decoration: underline;">Explore the full course catalog</a>.
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
                                            Inquiries: <a href="mailto:{{ $company['email'] ?? 'info@nexused.co.uk' }}" style="color: #34d399; text-decoration: none;">{{ $company['email'] ?? 'info@nexused.co.uk' }}</a>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-top: 16px; font-size: 10px; color: #64748b; border-top: 1px solid #1e293b; margin-top: 16px;">
                                        &copy; {{ date('Y') }} NexusEd Global. All rights reserved. You received this email because you signed up on nexused.co.uk.
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
