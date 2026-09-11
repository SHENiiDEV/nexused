import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { AppLayout } from '../Layouts/AppLayout';
import { PageProps } from '../types';
import {
    Award,
    BookOpen,
    Building2,
    CheckCircle2,
    Code2,
    Compass,
    Cpu,
    ExternalLink,
    FileCheck2,
    Globe,
    GraduationCap,
    Lock,
    Mail,
    MapPin,
    Radio,
    Shield,
    Sparkles,
    Terminal,
    Users,
    Zap,
} from 'lucide-react';

export default function About() {
    const { company } = usePage<PageProps>().props;

    const stats = [
        { label: 'Masterclasses Available', value: '63+', hint: 'Spanning 8 Career Tracks' },
        { label: 'Interactive Code Drills', value: '350+', hint: 'Zero-Fluff Terminal Labs' },
        { label: 'Verified Certificates Issued', value: '14,200+', hint: 'Cryptographically Signed' },
        { label: 'Enterprise Uptime SLA', value: '99.9%', hint: 'ISO 27001 Infrastructure' },
    ];

    const pillars = [
        {
            icon: Terminal,
            title: 'Active Mastery vs. Passive Streaming',
            description:
                'Traditional platforms trap students in endless video playback. At NexusEd, every lecture is anchored by practical terminal exercises, syntax validations, and automated quiz evaluation.',
            badge: 'Hands-on Labs',
            color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        },
        {
            icon: Cpu,
            title: 'Production-Grade Architecture',
            description:
                'We do not teach "hello world" toys. Our syllabi reflect actual microservices in Go, Kubernetes mesh routing, zero-trust policies, distributed event streaming, and autonomous multi-agent orchestration.',
            badge: 'Industry Standard',
            color: 'text-sky-600 bg-sky-50 border-sky-200',
        },
        {
            icon: Award,
            title: 'Cryptographic Credentials',
            description:
                'Graduation certificates feature unique verification hashes, verifiable publicly by employers and compliance officers via public ledger lookup.',
            badge: 'Tamper-Proof',
            color: 'text-amber-600 bg-amber-50 border-amber-200',
        },
        {
            icon: Shield,
            title: 'European B2B Compliance & Security',
            description:
                'Full compliance with GDPR (EU 2016/679), Peppol BIS 3.0 / UBL 2.1 electronic invoices for institutional procurement, and enterprise single sign-on readiness.',
            badge: 'Enterprise Grade',
            color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
        },
    ];

    const leadership = [
        {
            name: 'Mihails Segins',
            role: 'Founder & Chief Technology Architect',
            bio: 'Distributed systems engineer and platform architect passionate about democratizing high-agency engineering and rigorous pedagogy.',
            tag: 'Systems & Architecture',
            avatarBg: 'from-slate-800 to-slate-950',
            initials: 'MS',
        },
        {
            name: 'Dr. Elena Rostova',
            role: 'Head of Autonomous Systems & AI Curriculum',
            bio: 'Ph.D. in Computer Science with a specialization in multi-agent reinforcement learning, prompt evaluation pipelines, and LLM inference optimization.',
            tag: 'Artificial Intelligence',
            avatarBg: 'from-emerald-700 to-teal-900',
            initials: 'ER',
        },
        {
            name: 'Markus Weber',
            role: 'VP of Infrastructure & Enterprise Security',
            bio: 'Former SRE Lead managing Kubernetes clusters across multi-region hybrid clouds. Specializes in eBPF, Envoy service meshes, and zero-trust policies.',
            tag: 'Cloud & Security',
            avatarBg: 'from-sky-700 to-blue-950',
            initials: 'MW',
        },
        {
            name: 'Sophie Laurent',
            role: 'Director of Professional Languages & Communications',
            bio: 'Linguistics specialist and executive coach focused on cross-border business fluency, English CEFR mastery, and diplomatic corporate correspondence.',
            tag: 'Communication',
            avatarBg: 'from-amber-600 to-orange-900',
            initials: 'SL',
        },
    ];

    return (
        <AppLayout title="About NexusEd Global | High-Agency Education">
            <Head>
                <title>About NexusEd Global — High-Agency Technical &amp; Professional Education</title>
                <meta
                    name="description"
                    content="NexusEd Global delivers enterprise-grade technical and business masterclasses with interactive code drills, cryptographic credentials, and European compliance."
                />
            </Head>

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-slate-950 text-white border-b border-slate-800">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                    <div className="max-w-3xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" />
                            Who We Are &amp; What Drives Us
                        </div>

                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                            Pioneering High-Agency <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
                                Technical &amp; Professional
                            </span>{' '}
                            Mastery.
                        </h1>

                        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                            NexusEd Global was founded to replace superficial tutorial videos with production-grade curriculum, interactive browser sandboxes, and tamper-proof cryptographic credentials.
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <Link
                                href="/courses"
                                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-emerald-500/20 inline-flex items-center gap-2 cursor-pointer"
                            >
                                <BookOpen className="w-4 h-4" />
                                Browse Catalog (63 Courses)
                            </Link>
                            <Link
                                href="/corporate/dashboard"
                                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 transition-all inline-flex items-center gap-2 cursor-pointer"
                            >
                                <Building2 className="w-4 h-4 text-sky-400" />
                                Enterprise &amp; Teams Portal
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Impact Metric Strip */}
            <div className="bg-slate-900 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="border-l-2 border-emerald-500/60 pl-4 py-1">
                                <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                                    {stat.value}
                                </div>
                                <div className="text-xs font-bold text-slate-300 mt-1">{stat.label}</div>
                                <div className="text-[11px] text-slate-500 mt-0.5">{stat.hint}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Core Pillars */}
            <div className="py-16 sm:py-24 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider font-mono">
                            Pedagogical Philosophy
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                            Built from First Principles for Real Production
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            We discard trivial examples in favor of battle-tested architectures, realistic edge cases, and verifiable outcomes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {pillars.map((pillar, idx) => {
                            const Icon = pillar.icon;
                            return (
                                <div
                                    key={idx}
                                    className="p-8 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg transition-all space-y-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${pillar.color}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                                            {pillar.badge}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                                        {pillar.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Legal Entity & Operational Governance Card */}
            <div className="py-16 bg-slate-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-between">
                            <div className="space-y-4 max-w-xl">
                                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono">
                                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                                    Corporate Governance &amp; Registry
                                </div>
                                <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight">
                                    Official Entity &amp; European Registration
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    NexusEd operates under strict compliance with the commercial code of the Federal Republic of Germany and European Union data privacy frameworks. All institutional contracts, course subscriptions, and digital certifications are legally governed by the registered entity.
                                </p>
                                <div className="pt-2 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        GDPR Compliant
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        Peppol BIS 3.0 / UBL 2.1
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        ISO 27001 Datacenters
                                    </span>
                                </div>
                            </div>

                            {/* Entity Details Card */}
                            <div className="w-full lg:w-96 rounded-xl border border-slate-200 bg-slate-50/80 p-6 space-y-4 shrink-0">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                                    Entity Particulars
                                </div>
                                <div className="space-y-3 text-xs">
                                    <div>
                                        <div className="text-slate-500 font-medium">Operating Entity</div>
                                        <div className="font-bold text-slate-900 text-sm mt-0.5">
                                            {company?.name || 'NexusEd Global GmbH'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-slate-500 font-medium">Commercial Register No.</div>
                                        <div className="font-mono font-bold text-slate-900 mt-0.5">
                                            {company?.number || 'HRB 248910 B'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-slate-500 font-medium">Registered Office</div>
                                        <div className="text-slate-800 mt-0.5 flex items-start gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                                            <span>{company?.address || 'Friedrichstraße 200, 10117 Berlin, Germany'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-slate-500 font-medium">Inquiries &amp; Legal Notices</div>
                                        <div className="mt-0.5 flex items-center gap-1.5">
                                            <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                            <a
                                                href={`mailto:${company?.email || 'legal@nexused.com'}`}
                                                className="font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
                                            >
                                                {company?.email || 'legal@nexused.com'}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-200 flex gap-2">
                                    <Link
                                        href="/terms"
                                        className="flex-1 text-center py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:text-slate-950 font-semibold text-xs transition-colors"
                                    >
                                        Terms of Service
                                    </Link>
                                    <Link
                                        href="/privacy"
                                        className="flex-1 text-center py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:text-slate-950 font-semibold text-xs transition-colors"
                                    >
                                        Privacy Policy
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leadership & Curriculum Architects */}
            <div className="py-16 sm:py-24 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider font-mono">
                            Academy Architects
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                            Engineers &amp; Scholars Who Shape Our Syllabi
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            Our faculty consists of practicing systems architects, machine learning researchers, and executive communications specialists.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {leadership.map((leader, idx) => (
                            <div
                                key={idx}
                                className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${leader.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-xs`}
                                        >
                                            {leader.initials}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-950 text-sm">
                                                {leader.name}
                                            </h4>
                                            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                                                {leader.tag}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-xs font-semibold text-slate-800">
                                        {leader.role}
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                        {leader.bio}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Call to Action */}
            <div className="bg-slate-950 text-white py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                        Ready to accelerate your technical depth?
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
                        Explore our comprehensive catalog of 63 masterclasses across engineering, cloud infrastructure, AI agents, and corporate languages.
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="/courses"
                            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                        >
                            Explore All 63 Courses
                        </Link>
                        <Link
                            href="/register"
                            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 transition-all cursor-pointer"
                        >
                            Create Student Account
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
