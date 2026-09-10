import React, { useState } from 'react';
import { Course } from '../../types';
import { AppLayout } from '../../Layouts/AppLayout';
import { CheckoutModal } from '../../Components/CheckoutModal';
import {
    Award,
    BookOpen,
    Building2,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Cpu,
    Filter,
    GraduationCap,
    Layers,
    Search,
    Shield,
    Sparkles,
    Star,
    TrendingUp,
    Users,
} from 'lucide-react';
import { Head, Link, router } from '@inertiajs/react';

interface IndexProps {
    courses: Course[];
    filters: {
        search?: string;
        max_price?: string;
    };
    enrolledCourseIds: number[];
}

const CATEGORY_CARDS = [
    {
        title: 'Cloud & Kubernetes',
        desc: 'CKA, Microservices, Envoy & Zero-Trust mesh',
        icon: '☁️',
        badge: 'Top Issuer',
        searchQuery: 'Cloud',
    },
    {
        title: 'Distributed Systems in Go',
        desc: 'Kafka, Raft, event streaming & low-latency concurrency',
        icon: '⚡',
        badge: 'High Salary',
        searchQuery: 'Distributed',
    },
    {
        title: 'Production AI & Agents',
        desc: 'OpenAI API, function calling, RAG & autonomous pipelines',
        icon: '🧠',
        badge: 'Trending Now',
        searchQuery: 'AI',
    },
];

const TRUSTED_LOGOS = [
    { name: 'Volkswagen', label: 'VOLKSWAGEN' },
    { name: 'Samsung', label: 'SAMSUNG' },
    { name: 'Cisco', label: 'CISCO' },
    { name: 'Vimeo', label: 'vimeo' },
    { name: 'P&G', label: 'P&G' },
    { name: 'Citi', label: 'citi' },
    { name: 'Ericsson', label: 'ERICSSON' },
];

const TESTIMONIALS = [
    {
        quote: 'NexusEd cut our team onboarding time by 60%. The interactive quizzes and deep architectural code snippets give our developers practical confidence without fluff.',
        author: 'Elena Rostova',
        role: 'VP of Engineering, Acme Tech Group',
    },
    {
        quote: 'The course player is fast, distraction-free, and the Markdown code examples are immediately usable in our production Go microservices.',
        author: 'Markus Weber',
        role: 'Lead Cloud Infrastructure Architect',
    },
    {
        quote: 'Having automated Peppol BIS 3.0 UBL 2.1 electronic invoices directly generated for our EU tax department made corporate approval seamless.',
        author: 'Sophie Laurent',
        role: 'Director of Talent Development',
    },
    {
        quote: 'The AI Course Synthesizer generated an entire 3-module curriculum on Raft consensus in minutes. It completely transformed our internal tech documentation.',
        author: 'David K.',
        role: 'Senior Staff Engineer',
    },
];

export default function Index({ courses, filters, enrolledCourseIds }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeTab, setActiveTab] = useState<string>('all');
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [checkoutType, setCheckoutType] = useState<'b2c_course' | 'b2b_license'>('b2c_course');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/courses', { search }, { preserveState: true });
    };

    const openCheckout = (course: Course, type: 'b2c_course' | 'b2b_license') => {
        setSelectedCourse(course);
        setCheckoutType(type);
    };

    // Filter by active category tab
    const filteredCourses = courses.filter((c) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'distributed') return c.title.toLowerCase().includes('distributed') || c.topic?.toLowerCase().includes('distributed');
        if (activeTab === 'ai') return c.title.toLowerCase().includes('ai') || c.topic?.toLowerCase().includes('ai');
        if (activeTab === 'cloud') return c.title.toLowerCase().includes('cloud') || c.title.toLowerCase().includes('kubernetes');
        return true;
    });

    return (
        <AppLayout title="Online Courses & Certifications">
            <Head title="NexusEd — Leading Learning Platform for Engineering & AI" />

            {/* 1. Hero Promotional Banner (Udemy Style Clean Card) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
                <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden p-8 sm:p-14 shadow-lg border border-slate-800">
                    <div className="max-w-xl space-y-4 relative z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> New Generation Curriculum
                        </span>
                        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                            Be the leader AI & Cloud needs from €9.99
                        </h1>
                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                            Master distributed architecture, high-concurrency Go pipelines, and autonomous AI agents with hands-on code and verified certifications.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <Link
                                href="#catalog"
                                className="px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors shadow-sm"
                            >
                                Explore Catalog
                            </Link>
                            <Link
                                href="/admin/generator"
                                className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-colors"
                            >
                                AI Generator Studio →
                            </Link>
                        </div>
                    </div>

                    {/* Subtle aesthetic backdrop geometry */}
                    <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 opacity-90">
                        <div className="w-80 h-48 rounded-xl bg-slate-800/80 border border-slate-700 p-5 shadow-2xl space-y-3">
                            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                                <span>PIPELINE ORCHESTRATOR</span>
                                <span className="text-emerald-400">ACTIVE</span>
                            </div>
                            <div className="h-2 rounded bg-slate-700 w-3/4" />
                            <div className="h-2 rounded bg-slate-700 w-1/2" />
                            <div className="pt-2 flex items-center gap-2">
                                <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono">
                                    Kafka Streams
                                </span>
                                <span className="px-2 py-1 rounded bg-teal-950 text-teal-400 text-[10px] font-mono">
                                    Kubernetes
                                </span>
                                <span className="px-2 py-1 rounded bg-amber-950 text-amber-400 text-[10px] font-mono">
                                    OpenAI JSON
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Three Featured Category Cards ("Learn essential career and life skills") */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
                        Learn essential career & architecture skills
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        High-demand engineering domains curated for engineers, architects, and technical leads.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {CATEGORY_CARDS.map((cat, idx) => (
                        <Link
                            key={idx}
                            href={`/courses?search=${encodeURIComponent(cat.searchQuery)}`}
                            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl">{cat.icon}</span>
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                                        {cat.badge}
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                    {cat.title}
                                </h3>
                                <p className="text-xs text-slate-600 leading-relaxed">{cat.desc}</p>
                            </div>
                            <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-700 flex items-center justify-between">
                                <span>Browse Courses</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* 3. Main Course Showcase with Tabs ("Trending Courses") */}
            <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
                        Trending Courses & Masterclasses
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Curriculums with verified code, instant comprehension quizzes, and lifetime access.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-4 py-2 text-xs font-bold rounded-full transition-colors ${
                            activeTab === 'all'
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                        All Tracks ({courses.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('distributed')}
                        className={`px-4 py-2 text-xs font-bold rounded-full transition-colors ${
                            activeTab === 'distributed'
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                        Distributed Systems in Go
                    </button>
                    <button
                        onClick={() => setActiveTab('ai')}
                        className={`px-4 py-2 text-xs font-bold rounded-full transition-colors ${
                            activeTab === 'ai'
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                        AI & Agents
                    </button>
                    <button
                        onClick={() => setActiveTab('cloud')}
                        className={`px-4 py-2 text-xs font-bold rounded-full transition-colors ${
                            activeTab === 'cloud'
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                        Cloud & Kubernetes
                    </button>
                </div>

                {/* Course Cards Grid (Udemy Marketplace Layout) */}
                {filteredCourses.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                        <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                        <h3 className="text-base font-bold text-slate-800">No courses match this category</h3>
                        <p className="text-xs text-slate-500 mt-1">Try switching tabs or search terms.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course, idx) => {
                            const isEnrolled = enrolledCourseIds.includes(course.id);
                            const priceNum = Number(course.price) || 49.0;
                            const originalPrice = Math.round(priceNum * 2.8);

                            return (
                                <div
                                    key={course.id}
                                    className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all flex flex-col overflow-hidden group"
                                >
                                    {/* Card Thumbnail Header */}
                                    <div className="relative aspect-video bg-slate-900 flex items-center justify-center p-6 text-white overflow-hidden">
                                        <div className="text-center space-y-1">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 mx-auto flex items-center justify-center text-emerald-400 font-black text-lg">
                                                {course.title.charAt(0)}
                                            </div>
                                            <span className="font-mono text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
                                                {course.topic || 'Enterprise Track'}
                                            </span>
                                        </div>
                                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 font-sans shadow-xs">
                                            {idx === 0 ? 'Bestseller' : 'Hot & New'}
                                        </span>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                        <div>
                                            <h3 className="font-bold text-base text-slate-950 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                                                <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                                            </h3>

                                            <p className="text-xs text-slate-600 mt-1">
                                                NexusEd Academy Architects
                                            </p>

                                            {/* Ratings and reviews (Udemy pattern) */}
                                            <div className="flex items-center gap-1.5 mt-2">
                                                <span className="font-bold text-xs text-amber-700 font-mono">4.9</span>
                                                <div className="flex items-center text-amber-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className="w-3 h-3 fill-current" />
                                                    ))}
                                                </div>
                                                <span className="text-[11px] text-slate-600 font-mono">
                                                    ({1240 + course.id * 142})
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 text-xs text-slate-600 mt-2">
                                                <span>{course.estimated_hours || 6} total hours</span>
                                                <span>•</span>
                                                <span>{course.modules_count ?? 3} modules</span>
                                            </div>
                                        </div>

                                        {/* Price and Actions */}
                                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-slate-950 font-mono">
                                                    €{priceNum.toFixed(2)}
                                                </span>
                                                <span className="text-xs text-slate-600 line-through font-mono">
                                                    €{originalPrice}.00
                                                </span>
                                            </div>

                                            {isEnrolled ? (
                                                <Link
                                                    href={`/learn/${course.slug}`}
                                                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                                                >
                                                    Continue
                                                </Link>
                                            ) : (
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => openCheckout(course, 'b2c_course')}
                                                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs"
                                                    >
                                                        Enroll
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openCheckout(course, 'b2b_license')}
                                                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                                                        title="Corporate team license"
                                                    >
                                                        B2B
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 4. NexusEd Business Corporate Banner (Matching Screenshot 1) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="rounded-2xl bg-slate-950 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800 shadow-xl">
                    <div className="space-y-4 max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-950 text-teal-400 border border-teal-800/60 font-mono">
                            <Building2 className="w-3.5 h-3.5" /> NexusEd Business for Teams
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                            Upskill your engineering department with corporate licenses
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            Unlimited team access up to €2000, real-time employee progress matrix, quiz scoring analytics, and European Peppol BIS 3.0 / UBL 2.1 compliant e-invoicing.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Link
                                href="/corporate/dashboard"
                                className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors"
                            >
                                Open B2B Dashboard
                            </Link>
                            <Link
                                href="/demo-login/corporate"
                                className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-colors"
                            >
                                Demo as Corporate Manager
                            </Link>
                        </div>
                    </div>

                    <div className="w-full md:w-80 bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-3 text-xs text-slate-300">
                        <div className="font-bold text-white flex items-center justify-between">
                            <span>Acme Global Tech License</span>
                            <span className="text-emerald-400 font-mono">ACTIVE</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800">
                            <span>Allocated Seats:</span>
                            <span className="font-mono font-bold text-white">20 Seats</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800">
                            <span>EU E-Invoice Standard:</span>
                            <span className="font-mono text-emerald-400">Peppol UBL 2.1</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span>Security Invariant:</span>
                            <span className="font-mono text-slate-400">HMAC-SHA256</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Trusted Companies Logos (Udemy Style Clean Strip) */}
            <div className="border-y border-slate-200 bg-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Trusted by over 16,000 companies and leading engineering teams worldwide
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75">
                        {TRUSTED_LOGOS.map((logo, idx) => (
                            <span key={idx} className="font-black text-sm sm:text-base text-slate-500 tracking-wider">
                                {logo.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* 6. Testimonials Section (Matching Screenshot 1) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
                        How learners like you are achieving their goals
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Verified student reviews and engineering leadership feedback.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TESTIMONIALS.map((t, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-4 shadow-xs">
                            <p className="text-xs text-slate-700 leading-relaxed italic">
                                &ldquo;{t.quote}&rdquo;
                            </p>
                            <div className="pt-3 border-t border-slate-100">
                                <div className="text-xs font-bold text-slate-900">{t.author}</div>
                                <div className="text-[11px] text-slate-500">{t.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Checkout Modal */}
            {selectedCourse && (
                <CheckoutModal
                    isOpen={!!selectedCourse}
                    onClose={() => setSelectedCourse(null)}
                    course={selectedCourse}
                    initialType={checkoutType}
                />
            )}
        </AppLayout>
    );
}
