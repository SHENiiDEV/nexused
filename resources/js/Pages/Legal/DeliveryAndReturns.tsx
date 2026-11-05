import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';
import { AppLayout } from '../../Layouts/AppLayout';
import { PageProps } from '../../types';

export default function DeliveryAndReturns() {
    const { company } = usePage<PageProps>().props;
    const companyName = company?.name || 'TRUE CENTRIC LTD';
    const companyAddress = company?.address || '20 Wenlock Road, London, England, N1 7GU';
    const companyEmail = company?.email || 'legal@nexused.com';

    return (
        <AppLayout title="Delivery & Returns">
            <Head title="Digital Delivery, Withdrawal & Refund Policy | NexusEd" />

            <div className="bg-slate-900 text-white border-b border-slate-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-5">
                    <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
                        <ArrowLeft className="w-4 h-4" /> Back to Course Catalog
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Digital Delivery, Withdrawal &amp; Refund Policy</h1>
                    <p className="text-slate-300 leading-relaxed">How to access your purchase, withdraw from a consumer contract or request help with a refund.</p>
                    <p className="text-xs text-slate-400">Updated 5 November 2026</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6 text-sm leading-relaxed text-slate-700">
                <nav aria-label="Legal documents" className="flex flex-wrap items-center gap-4">
                    <Link href="/terms" className="text-emerald-700 underline">Terms of Service</Link>
                    <Link href="/privacy" className="text-emerald-700 underline">Privacy Policy</Link>
                    <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 text-slate-700 underline">
                        <Printer className="w-4 h-4" /> Print / Save PDF
                    </button>
                </nav>

                <section className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-4">
                    <h2 className="text-lg font-bold text-slate-950">1. Digital delivery and access</h2>
                    <p>NexusEd supplies online courses and corporate team licenses digitally. No physical goods are shipped and there are no shipping charges.</p>
                    <p>After successful payment confirmation, an individual course is made available in your account dashboard. For a corporate purchase, the purchased seats are added to the organization account; the administrator allocates seats and course access to employees through the corporate portal. Access depends on payment confirmation, rather than submission of the payment form alone.</p>
                    <p>A browser, internet connection and a NexusEd account are required. Check the selected course description for any additional software or technical requirements. The access scope is described in the selected offer and order confirmation. Corporate licenses are one-time purchases with no automatic renewal or recurring subscription charge.</p>
                    <p>If payment is confirmed but your purchase is missing, contact <a href={`mailto:${companyEmail}`} className="text-emerald-700 underline">{companyEmail}</a> with your order reference and account email. Do not send full card details or security codes.</p>
                </section>

                <section id="withdrawal" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-4">
                    <h2 className="text-lg font-bold text-slate-950">2. Consumer right of withdrawal</h2>
                    <p>For consumer distance contracts, the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 provide a right to cancel. If you purchase as a consumer, you have the right to withdraw from your contract within fourteen (14) days without giving any reason. The withdrawal period expires fourteen days after the day the contract is concluded. Where mandatory law provides a later start or a longer period, that law applies.</p>
                    <p>To exercise this right, inform {companyName}, {companyAddress}, email: <a href={`mailto:${companyEmail}`} className="text-emerald-700 underline">{companyEmail}</a>, of your decision by an unequivocal statement, for example by email or a letter sent by post. You may use the model form below, but it is not obligatory. Sending your withdrawal statement before the period expires is sufficient.</p>
                    <p>Starting or opening a course does not by itself waive your right of withdrawal. We do not treat acceptance of the general Terms or payment alone as a waiver of that right.</p>
                    <p>This right applies to consumers acting for purposes wholly or mainly outside their trade, business, craft or profession. Statutory consumer withdrawal rights do not generally apply to purchases made for business purposes; see section 5.</p>
                </section>

                <section className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-4">
                    <h2 className="text-lg font-bold text-slate-950">3. Effects of withdrawal and reimbursement</h2>
                    <p>If you withdraw, we will reimburse all payments received from you under the withdrawn contract without undue delay and no later than fourteen (14) days after the day we are informed of your decision. We will use the same payment method used for the original transaction unless you expressly agree otherwise. You will not incur fees for the reimbursement.</p>
                    <p>No physical return is required. Access to the course or licenses covered by the withdrawn contract will end when that contract is unwound. Withdrawal from one purchase does not affect your other purchases.</p>
                </section>

                <section id="withdrawal-form" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-4">
                    <h2 className="text-lg font-bold text-slate-950">4. Model withdrawal form</h2>
                    <p>Complete and return this form only if you wish to withdraw from the contract. You can copy it into an email or print it and send it by post.</p>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 break-words">
                        <p>To: {companyName}, {companyAddress}; email: {companyEmail}</p>
                        <p>I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract for the supply of the following digital content / provision of the following service (*):</p>
                        <p>Course or team license: ____________________</p>
                        <p>Ordered on (*) / received on (*): ____________________</p>
                        <p>Name of consumer(s): ____________________</p>
                        <p>Address of consumer(s): ____________________</p>
                        <p>Signature of consumer(s) (only if this form is notified on paper): ____________________</p>
                        <p>Date: ____________________</p>
                        <p>(*) Delete as appropriate. You may also include your order reference and account email to help us locate the purchase.</p>
                    </div>
                </section>

                <section className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-4">
                    <h2 className="text-lg font-bold text-slate-950">5. Business purchases and other refund requests</h2>
                    <p>For purchases made for business purposes, cancellation and any discretionary refund depend on the agreed offer or a separate written agreement. Contact us with your order reference to discuss your request. This policy does not create an additional unconditional refund entitlement after the applicable withdrawal period.</p>
                    <p>Whether you purchase as a consumer or a business, your applicable statutory rights relating to non-delivery or defective digital products remain unaffected. Contact us if access fails or the purchase does not conform to the contract so that we can address the issue. Any rights to a price reduction, termination or reimbursement available under applicable law remain in place.</p>
                </section>
            </div>
        </AppLayout>
    );
}
