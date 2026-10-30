import React from 'react';
import { AppLayout } from '../../Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '../../types';
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    ChevronRight,
    Download,
    FileText,
    Globe,
    HelpCircle,
    Mail,
    MapPin,
    Printer,
    Scale,
    Shield,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';

export default function Terms() {
    const { company } = usePage<PageProps>().props;

    const companyName = company?.name || 'NexusEd Global GmbH';
    const companyNumber = company?.number || 'HRB 248910 B';
    const companyAddress = company?.address || 'Friedrichstraße 200, 10117 Berlin, Germany';
    const companyEmail = company?.email || 'legal@nexused.com';

    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout title="Terms of Service">
            <Head title="Terms of Service & User Agreement | NexusEd" />

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
                            <span className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                Terms of Service
                            </span>
                            <Link
                                href="/privacy"
                                className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white font-medium transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link href="/delivery-and-returns" className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white font-medium transition-colors">
                                Delivery &amp; Returns
                            </Link>
                        </div>
                    </div>

                    {/* Header Title */}
                    <div className="space-y-3 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                            <Scale className="w-3.5 h-3.5" />
                            <span>USER AGREEMENT • UPDATED 30 OCTOBER 2026</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                            Terms of Service
                        </h1>
                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                            These Terms of Service govern your access to and purchase of individual masterclasses, enterprise licenses, and verified certifications on the NexusEd platform.
                        </p>
                    </div>

                    {/* Corporate Entity Summary Bar (.env values) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
                        <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Operating Entity
                            </span>
                            <div className="text-xs font-bold text-white truncate">{companyName}</div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-sky-400" /> Commercial Register
                            </span>
                            <div className="text-xs font-bold text-white font-mono truncate">{companyNumber}</div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-purple-400" /> Registered Seat
                            </span>
                            <div className="text-xs font-bold text-white truncate">{companyAddress}</div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-amber-400" /> Official Counsel
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
                                    Document Outline
                                </span>
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                    8 Clauses
                                </span>
                            </div>

                            <nav className="space-y-1 text-xs">
                                {[
                                    { id: 'sec-acceptance', label: '1. Acceptance & Operating Entity' },
                                    { id: 'sec-eligibility', label: '2. Registration & Compliance' },
                                    { id: 'sec-licensing', label: '3. Lifetime Course License' },
                                    { id: 'sec-payments', label: '4. Payments & 3DS Security' },
                                    { id: 'sec-enterprise', label: '5. Corporate Licenses & Peppol' },
                                    { id: 'sec-ai-studio', label: '6. AI Course Generation & Conduct' },
                                    { id: 'sec-disclaimer', label: '7. Limitation of Liability' },
                                    { id: 'sec-contact', label: '8. Governing Law & Contact' },
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
                                    <span>Print / Save PDF Copy</span>
                                </button>
                                <a
                                    href={`mailto:${companyEmail}?subject=Legal Inquiry regarding NexusEd Terms`}
                                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                >
                                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Contact Legal Department</span>
                                </a>
                            </div>
                        </div>

                        {/* Security & Audit Certifications Box */}
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                <span>Statutory Accreditations</span>
                            </div>
                            <ul className="text-xs text-slate-600 space-y-2">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    <span>EU Directive 2014/55/EU E-Invoicing</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    <span>PCI-DSS Level 1 Certified Transactions</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    <span>3D-Secure 2.2 Payment Verification</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Main Legal Clauses */}
                    <div className="lg:col-span-8 space-y-8 text-sm leading-relaxed text-slate-700">
                        {/* Section 1 */}
                        <section id="sec-acceptance" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-950">1. Acceptance of Terms &amp; Operating Entity</h2>
                                <span className="text-xs font-mono font-bold text-slate-400">§ 1.0</span>
                            </div>
                            <p>
                                These Terms of Service (&ldquo;Agreement&rdquo;) constitute a legally binding agreement between you (&ldquo;User&rdquo;, &ldquo;Student&rdquo;, or &ldquo;Corporate Customer&rdquo;) and <strong className="text-slate-950">{companyName}</strong>, registered in the commercial register under registration number <strong className="text-slate-950 font-mono">{companyNumber}</strong>, having its registered seat at <strong className="text-slate-950">{companyAddress}</strong> (&ldquo;NexusEd&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;).
                            </p>
                            <p>
                                By creating an account, enrolling in coursework, generating synthetic courses, or purchasing enterprise licensing, you expressly agree to be bound by these terms. If you are entering into this Agreement on behalf of a legal entity, you represent that you possess the legal authority to bind that entity.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section id="sec-eligibility" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-950">2. Registration, KYC &amp; Sanctioned Jurisdictions</h2>
                                <span className="text-xs font-mono font-bold text-slate-400">§ 2.0</span>
                            </div>
                            <p>
                                To maintain European payment integrity and comply with international anti-money laundering (AML) and anti-fraud protocols, every registered user must provide truthful, complete, and accurate profile data during account creation:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                    <div className="font-bold text-xs text-slate-900">Mandatory KYC Attributes</div>
                                    <div className="text-xs text-slate-600">Full legal name, date of birth, verified telephone number, and residential street address.</div>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                    <div className="font-bold text-xs text-slate-900">Trade Compliance Sanctions</div>
                                    <div className="text-xs text-slate-600">NexusEd strictly denies registration and transactions from sanctioned jurisdictions pursuant to EU/FATF directives.</div>
                                </div>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section id="sec-licensing" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-950">3. Educational Course Licensing &amp; Intellectual Property</h2>
                                <span className="text-xs font-mono font-bold text-slate-400">§ 3.0</span>
                            </div>
                            <p>
                                Upon successful payment of the applicable course tuition, NexusEd grants you a personal, non-exclusive, non-transferable, lifetime license to access the curriculum, review lesson content, participate in comprehension assessments, and download issued completion diplomas.
                            </p>
                            <p>
                                Delivery is digital; no physical goods are shipped. Access is activated after successful payment confirmation. Our <Link href="/delivery-and-returns" className="text-emerald-700 underline">Digital Delivery, Withdrawal &amp; Refund Policy</Link> explains access, support, consumer withdrawal rights and refunds and forms part of these Terms. Starting a course does not by itself waive your withdrawal rights.
                            </p>
                            <p>
                                All course curriculum text, interactive terminal drills, audio/video assets, and certification signatures are proprietary intellectual property of {companyName} or its licensed contributors. Unauthorized scraping, wholesale reproduction, or reselling of course materials is strictly prohibited and subject to civil and criminal liability.
                            </p>
                        </section>

                        {/* Section 4 */}
                        <section id="sec-payments" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-950">4. Payment Processing, Card Security &amp; 3DS 2.2</h2>
                                <span className="text-xs font-mono font-bold text-slate-400">§ 4.0</span>
                            </div>
                            <p>
                                All individual course enrollments are processed via bank-grade credit and debit card acquiring in EUR (&euro;). All card transactions undergo mandatory <strong>3D-Secure 2.2 (Strong Customer Authentication)</strong> challenge validation.
                            </p>
                            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-emerald-950 space-y-2 text-xs">
                                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    Zero Plaintext Card Storage
                                </div>
                                <p className="leading-relaxed">
                                    NexusEd never stores your primary card number (PAN), expiration date, or security CVV/CVC code on our servers. All card payment data is handled exclusively by PCI-DSS Level 1 certified payment processors.
                                </p>
                            </div>
                        </section>

                        {/* Section 5 */}
                        <section id="sec-enterprise" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-950">5. Corporate Licensing, Team Pools &amp; Peppol E-Invoicing</h2>
                                <span className="text-xs font-mono font-bold text-slate-400">§ 5.0</span>
                            </div>
                            <p>
                                Corporate team licenses are available as one-time purchases of employee seats. They do not automatically renew or create recurring subscription charges. Corporate administrators may allocate seats up to the purchased limit and monitor employee educational progress through the corporate portal. The scope of access is described in the selected offer and order confirmation.
                            </p>
                            <p>
                                In accordance with the <strong>European Directive 2014/55/EU</strong>, corporate purchases generate fully compliant <strong>Peppol BIS 3.0 (UBL 2.1 XML)</strong> electronic invoices containing valid European VAT identifiers and cryptographic transaction audit records.
                            </p>
                        </section>

                        {/* Section 6 */}
                        <section id="sec-ai-studio" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-950">6. AI Course Generation Pipeline &amp; Acceptable Use</h2>
                                <span className="text-xs font-mono font-bold text-slate-400">§ 6.0</span>
                            </div>
                            <p>
                                Our autonomous AI Course Synthesizer produces structured technical curriculum, interactive quizzes, and verification code snippets. Users and creators agree not to utilize prompt injection or synthesize material promoting harmful activities, malicious software, or defamatory content.
                            </p>
                        </section>

                        {/* Section 7 */}
                        <section id="sec-disclaimer" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-950">7. Limitation of Liability &amp; Warranty Disclaimer</h2>
                                <span className="text-xs font-mono font-bold text-slate-400">§ 7.0</span>
                            </div>
                            <p>
                                We are liable without limitation for intent and gross negligence, for culpable injury to life, body or health, and wherever liability is mandatory by law, including under the German Product Liability Act. Liability under an expressly assumed guarantee remains subject to that guarantee.
                            </p>
                            <p>
                                For ordinary negligence, we are liable for breach of an essential contractual obligation whose performance is necessary for the proper execution of the contract and on which you may normally rely. In that case, liability is limited to damage that was foreseeable and typical for the contract when it was concluded. Otherwise, liability for ordinary negligence is excluded, subject to the exceptions above.
                            </p>
                            <p>
                                Your statutory rights concerning the supply and conformity of digital products, including remedies for defects, remain unaffected. These Terms do not exclude mandatory consumer rights or provide a blanket exclusion of warranties.
                            </p>
                        </section>

                        {/* Section 8 */}
                        <section id="sec-contact" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-950">8. Governing Law, Judicial Venue &amp; Formal Notices</h2>
                                <span className="text-xs font-mono font-bold text-slate-400">§ 8.0</span>
                            </div>
                            <p>
                                This Agreement is governed by the laws of the Federal Republic of Germany. If you are a consumer, this choice does not deprive you of the protection of mandatory provisions of the law that would apply without this choice, including the law of your habitual residence where Article 6 of Regulation (EC) No 593/2008 (Rome I) applies.
                            </p>
                            <p>
                                For consumers, jurisdiction is determined by applicable law, including Articles 17–19 of Regulation (EU) No 1215/2012 where applicable. No exclusive Berlin jurisdiction is imposed on consumers. For business customers who are merchants, legal entities under public law or special funds under public law, the courts of Berlin have exclusive jurisdiction to the extent a jurisdiction agreement is legally permitted. Mandatory jurisdiction rules remain unaffected.
                            </p>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                                <div className="font-bold text-slate-900">Official Legal Notice Address:</div>
                                <div className="text-slate-700 leading-relaxed font-mono">
                                    {companyName}<br />
                                    Commercial Register: {companyNumber}<br />
                                    {companyAddress}<br />
                                    Email: <a href={`mailto:${companyEmail}`} className="text-emerald-700 underline">{companyEmail}</a>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
