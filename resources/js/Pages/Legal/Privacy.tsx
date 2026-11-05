import React from 'react';
import { AppLayout } from '../../Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '../../types';
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    Database,
    Eye,
    FileText,
    KeyRound,
    Lock,
    Mail,
    MapPin,
    Printer,
    Scale,
    Shield,
    ShieldCheck,
    UserCheck,
} from 'lucide-react';

export default function Privacy() {
    const { company } = usePage<PageProps>().props;

    const companyName = company?.name || 'TRUE CENTRIC LTD';
    const companyNumber = company?.number || '15642952';
    const companyAddress = company?.address || '20 Wenlock Road, London, England, N1 7GU';
    const companyEmail = company?.email || 'legal@nexused.com';

    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout title="Privacy Policy">
            <Head title="Privacy Policy & GDPR Compliance | NexusEd" />

            <div className="bg-slate-900 text-white border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
                    {/* Navigation Breadcrumb */}
                    <div className="flex items-center justify-between">
                        <Link
                            href="/courses"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Course Catalog</span>
                        </Link>

                        {/* Switcher Pills */}
                        <div className="inline-flex flex-wrap items-center p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs">
                            <Link
                                href="/terms"
                                className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white font-medium transition-colors"
                            >
                                Terms of Service
                            </Link>
                            <span className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                Privacy Policy
                            </span>
                            <Link href="/delivery-and-returns" className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white font-medium transition-colors">
                                Delivery &amp; Returns
                            </Link>
                        </div>
                    </div>

                    {/* Header Title */}
                    <div className="space-y-3 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>UK GDPR &amp; DATA PROTECTION ACT 2018 NOTICE</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                            Privacy Policy
                        </h1>
                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                            How we handle personal data under the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018, as amended. The EU GDPR also applies where its territorial scope covers our processing.
                        </p>
                    </div>

                    {/* Corporate Entity Summary Bar (.env values) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
                        <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Data Controller
                            </span>
                            <div className="text-xs font-bold text-white truncate">{companyName}</div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-sky-400" /> Company Registration
                            </span>
                            <div className="text-xs font-bold text-white font-mono truncate">{companyNumber}</div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-purple-400" /> Controller Seat
                            </span>
                            <div className="text-xs font-bold text-white truncate">{companyAddress}</div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-amber-400" /> Privacy Inquiries
                            </span>
                            <div className="text-xs font-bold text-white truncate">
                                <a href={`mailto:${companyEmail}`} className="hover:text-emerald-400 underline">
                                    {companyEmail}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Left Sticky Table of Contents */}
                    <div className="lg:col-span-4 sticky top-24 space-y-6">
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                    Privacy Outline
                                </span>
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                    8 Articles
                                </span>
                            </div>

                            <nav className="space-y-1 text-xs">
                                {[
                                    { id: 'sec-controller', label: '1. Data Controller Identification' },
                                    { id: 'sec-data-types', label: '2. Categories of Data Collected' },
                                    { id: 'sec-purposes', label: '3. Legal Basis & Processing' },
                                    { id: 'sec-card-security', label: '4. Payment Security & PCI-DSS' },
                                    { id: 'sec-gdpr-rights', label: '5. Your Rights Under GDPR' },
                                    { id: 'sec-retention', label: '6. Data Retention & Erasure' },
                                    { id: 'sec-subprocessors', label: '7. Subprocessors & Hosting' },
                                    { id: 'sec-dpo-contact', label: '8. DPO Contact & Complaints' },
                                ].map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className="block py-2 px-3 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50 transition-colors font-medium"
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </nav>

                            <div className="pt-4 border-t border-slate-100 space-y-2.5">
                                <button
                                    type="button"
                                    onClick={handlePrint}
                                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>Print / Save Policy</span>
                                </button>
                                <a
                                    href={`mailto:${companyEmail}?subject=GDPR Subject Access Request`}
                                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                >
                                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Submit GDPR Request</span>
                                </a>
                            </div>
                        </div>

                        {/* Privacy Trust Card */}
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                <KeyRound className="w-4 h-4 text-emerald-600" />
                                <span>European Data Sovereignty</span>
                            </div>
                            <ul className="text-xs text-slate-600 space-y-2">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    <span>Primary Hosting within European Union</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    <span>No Sale or Renting of Customer Data</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    <span>Encrypted Backups &amp; Audit Logs</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Main Privacy Clauses */}
                    <div className="lg:col-span-8 space-y-8 text-sm leading-relaxed text-slate-700">
                        {/* Section 1 */}
                        <section id="sec-controller" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-950">1. Data Controller Identification</h2>
                                <span className="text-xs font-mono font-bold text-slate-400">Art. 4(7) GDPR</span>
                            </div>
                            <p>
                                The Data Controller responsible for the collection and processing of personal data on this platform under the UK GDPR and, where applicable, the EU GDPR is:
                            </p>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1 text-slate-800">
                                <div><strong className="text-slate-950">{companyName}</strong></div>
                                <div>Company Registration: {companyNumber}</div>
                                <div>{companyAddress}</div>
                                <div>Data Protection Contact: <a href={`mailto:${companyEmail}`} className="text-emerald-700 underline">{companyEmail}</a></div>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section id="sec-data-types" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-950">2. Categories of Personal Data Collected</h2>
                                <span className="text-xs font-mono font-bold text-slate-400">Art. 13 GDPR</span>
                            </div>
                            <p>
                                We collect and process only the minimum necessary data points required to verify your identity, process transactions, deliver certified educational curricula, and comply with applicable tax laws:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                                    <strong className="text-slate-950">Identity &amp; Profile</strong>
                                    <p className="text-slate-600">First name, surname, date of birth (for age verification), and user role.</p>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                                    <strong className="text-slate-950">Contact &amp; Communications</strong>
                                    <p className="text-slate-600">Email address and international phone number for critical security and invoice notifications.</p>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                                    <strong className="text-slate-950">Billing &amp; Tax Compliance</strong>
                                    <p className="text-slate-600">Street, city, country, and postal code for billing, applicable tax requirements and electronic invoices.</p>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                                    <strong className="text-slate-950">Learning Transcripts</strong>
                                    <p className="text-slate-600">Lesson progression, quiz submissions, scores, and issued cryptographic certificate hashes.</p>
                                </div>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section id="sec-purposes" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-950">3. Legal Bases for Processing (GDPR Art. 6)</h2>
                                <span className="text-xs font-mono font-bold text-slate-400">Art. 6 GDPR</span>
                            </div>
                            <p>
                                Every processing activity performed by NexusEd is underpinned by a lawful basis under Article 6(1) of the UK GDPR and, where applicable, the EU GDPR:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
                                <li>
                                    <strong className="text-slate-900">Performance of a Contract (Art. 6(1)(b)):</strong> Delivering course curriculum, managing user accounts, and issuing verified certificates.
                                </li>
                                <li>
                                    <strong className="text-slate-900">Legal Obligation (Art. 6(1)(c)):</strong> Generating tax-compliant invoices, maintaining accounting records under applicable UK company and tax requirements, and complying with international trade sanctions.
                                </li>
                                <li>
                                    <strong className="text-slate-900">Legitimate Interest (Art. 6(1)(f)):</strong> Platform security monitoring, defending against DDoS and credential stuffing, and cryptographic audit log maintenance.
                                </li>
                            </ul>
                        </section>

                        {/* Section 4 */}
                        <section id="sec-card-security" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-950">4. Payment Information Security &amp; Tokenization</h2>
                                <span className="text-xs font-mono font-bold text-slate-400">PCI-DSS 4.0</span>
                            </div>
                            <p>
                                All credit and debit card transactions are processed through certified European acquiring partners under strict PCI-DSS Level 1 compliance.
                            </p>
                            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-emerald-950 space-y-2 text-xs">
                                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                                    <Lock className="w-4 h-4 text-emerald-600" />
                                    Cryptographic Isolation &amp; Zero PAN Storage
                                </div>
                                <p className="leading-relaxed">
                                    NexusEd servers never handle, transmit, or store unencrypted credit card primary account numbers (PAN), expiration dates, or CVV/CVC security codes. Card transactions are secured by 3D-Secure 2.2 authentication and end-to-end tokenization.
                                </p>
                            </div>
                        </section>

                        {/* Section 5 */}
                        <section id="sec-gdpr-rights" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-950">5. Your Data Protection Rights Under GDPR</h2>
                                <span className="text-xs font-mono font-bold text-slate-400">Arts. 15-22 GDPR</span>
                            </div>
                            <p>
                                Under the UK GDPR and, where applicable, the EU GDPR, you have rights regarding your personal data processed by {companyName}, subject to the conditions and exemptions in the applicable law:
                            </p>
                            <div className="space-y-2 text-xs">
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                    <strong className="text-slate-900">Right of Access (Art. 15):</strong> Request a copy of all personal data, course completions, and invoices held about you.
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                    <strong className="text-slate-900">Right to Rectification (Art. 16):</strong> Update or correct inaccurate profile, address, or phone information at any time.
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                    <strong className="text-slate-900">Right to Erasure / &ldquo;To be Forgotten&rdquo; (Art. 17):</strong> Request deletion of your personal account, subject to mandatory statutory tax retention obligations.
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                    <strong className="text-slate-900">Right to Data Portability (Art. 20):</strong> Receive your learning records and certificate proofs in a structured, machine-readable JSON format.
                                </div>
                            </div>
                        </section>

                        {/* Section 6 */}
                        <section id="sec-retention" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-950">6. Data Retention &amp; Erasure Schedules</h2>
                                <span className="text-xs font-mono font-bold text-slate-400">Art. 5(1)(e)</span>
                            </div>
                            <p>
                                Personal profile data is retained for as long as necessary to provide your account and services. You may request erasure using the contact details in this policy. Data that must be retained to comply with a legal obligation or to establish, exercise or defend legal claims is retained only for that purpose and for the applicable period.
                            </p>
                            <p>
                                Company accounting and tax records, including invoices and supporting transaction records, are generally retained for six (6) years from the end of the last company financial year to which they relate, in accordance with applicable UK record-keeping requirements. We retain relevant records for longer where required, for example for transactions spanning accounting periods, long-lived assets, a late Company Tax Return or an HMRC compliance check. Electronic invoice formats do not by themselves determine the retention period.
                            </p>
                        </section>

                        {/* Section 7 */}
                        <section id="sec-subprocessors" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-950">7. Subprocessors &amp; Technical Infrastructure</h2>
                                <span className="text-xs font-mono font-bold text-slate-400">Art. 28 GDPR</span>
                            </div>
                            <p>
                                We utilize vetted subprocessors bound by strict Data Processing Agreements (DPAs) incorporating standard contractual clauses:
                            </p>
                            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                                <li><strong>Cloud Infrastructure &amp; Databases:</strong> Hosted in certified European Union data centers (Frankfurt, Germany).</li>
                                <li><strong>Payment Acquiring Networks:</strong> PCI-DSS Level 1 certified European banking partners.</li>
                                <li><strong>AI Curriculum Synthesis:</strong> OpenAI Enterprise with zero-retention API agreements (prompts are not used for model training).</li>
                            </ul>
                        </section>

                        {/* Section 8 */}
                        <section id="sec-dpo-contact" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-950">8. Privacy Contact &amp; Regulatory Supervision</h2>
                                <span className="text-xs font-mono font-bold text-slate-400">UK GDPR</span>
                            </div>
                            <p>
                                To exercise your GDPR rights or submit a privacy inquiry, please contact our privacy team:
                            </p>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                                <div className="font-bold text-slate-900">Direct Inquiries:</div>
                                <div className="text-slate-700 leading-relaxed font-mono">
                                    {companyName} — Data Protection Team<br />
                                    {companyAddress}<br />
                                    Email: <a href={`mailto:${companyEmail}`} className="text-emerald-700 underline">{companyEmail}</a>
                                </div>
                                <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                                    You have the right to complain to the UK Information Commissioner’s Office (ICO) about our handling of your personal data. You can find details at <a href="https://ico.org.uk/make-a-complaint/" className="text-emerald-700 underline">ico.org.uk/make-a-complaint</a>. Where the EU GDPR applies, you may also complain to a competent EU supervisory authority, including the authority in your habitual place of residence, place of work or place of the alleged infringement.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
