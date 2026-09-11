import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Briefcase,
    CheckCircle2,
    Clock,
    Cpu,
    Globe,
    Layers,
    Palette,
    Play,
    ShieldCheck,
    Sparkles,
    Star,
    Terminal,
    TrendingUp,
    Zap,
} from 'lucide-react';

interface HeroSectionProps {
    totalCourses: number;
    onSelectCategory: (categoryId: string) => void;
}

interface TrackStep {
    label: string;
    courseSlug: string;
    duration: string;
    done?: boolean;
    active?: boolean;
}

interface TrackData {
    id: string;
    name: string;
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    accentBg: string;
    accentBorder: string;
    steps: TrackStep[];
    previewTag: string;
    previewCode: string;
    previewOutcome: string;
    targetFilter: string;
}

const HERO_TRACKS: TrackData[] = [
    {
        id: 'languages',
        name: 'English Fluency',
        badge: '10 Courses • A1 to C1',
        icon: Globe,
        accentColor: 'text-sky-400',
        accentBg: 'bg-sky-500/10',
        accentBorder: 'border-sky-500/30',
        targetFilter: 'languages',
        previewTag: 'EXECUTIVE COMMUNICATION FRAMEWORK',
        previewCode: '“From a strategic standpoint, we propose a phased milestone rollout to mitigate risk while accelerating time-to-market.”',
        previewOutcome: 'C1 Fluency in international boardroom meetings & high-stakes negotiations',
        steps: [
            { label: 'English A1: Absolute Starter', courseSlug: 'english-a1-everyday-starter', duration: '6h', done: true },
            { label: 'English A2: Travel Survival', courseSlug: 'english-a2-conversations-travel', duration: '7h', done: true },
            { label: 'English B1: Everyday Fluency', courseSlug: 'english-b1-intermediate-fluency', duration: '8h', done: true },
            { label: 'English B2: Workplace Sync', courseSlug: 'english-b2-workplace-collaboration', duration: '9h', active: true },
            { label: 'Business English C1: Executive', courseSlug: 'business-english-executive-c1', duration: '12h' },
            { label: 'Public Speaking & Pitching', courseSlug: 'executive-public-speaking-storytelling', duration: '5h' },
        ],
    },
    {
        id: 'design',
        name: 'UI/UX & Figma',
        badge: '7 Courses • Junior to Lead',
        icon: Palette,
        accentColor: 'text-pink-400',
        accentBg: 'bg-pink-500/10',
        accentBorder: 'border-pink-500/30',
        targetFilter: 'design',
        previewTag: 'DESIGN TOKEN TO CODE PIPELINE',
        previewCode: ':root { --color-surface: #0B0F17; --radius-card: 16px; --wcag-contrast: 7.4:1 (AAA); }',
        previewOutcome: 'Scalable multi-brand design systems & interactive Figma prototypes',
        steps: [
            { label: 'Visual Design Fundamentals', courseSlug: 'design-fundamentals-typography-color', duration: '5h', done: true },
            { label: 'Figma Auto-Layout & Variants', courseSlug: 'figma-essentials-autolayout-prototyping', duration: '6h', done: true },
            { label: 'Product Design & UX Research', courseSlug: 'product-design-figma-ux-mastery', duration: '10h', active: true },
            { label: 'Enterprise Design Tokens', courseSlug: 'enterprise-design-systems-tokens', duration: '8h' },
            { label: 'Micro-Interactions & Motion', courseSlug: 'micro-interactions-web-animation', duration: '6h' },
        ],
    },
    {
        id: 'agile',
        name: 'Agile & Leadership',
        badge: '7 Courses • Scrum to Director',
        icon: Briefcase,
        accentColor: 'text-indigo-400',
        accentBg: 'bg-indigo-500/10',
        accentBorder: 'border-indigo-500/30',
        targetFilter: 'management',
        previewTag: 'LITTLE\'S LAW DELIVERY METRICS',
        previewCode: 'LeadTime = WIP / Throughput. Capping concurrent sprint WIP reduced release cycle from 14d to 3.8d.',
        previewOutcome: 'Lead high-performing teams with proven Scrum, Kanban, and OKR frameworks',
        steps: [
            { label: 'Project Scope & Work Breakdown', courseSlug: 'project-management-fundamentals-scope', duration: '6h', done: true },
            { label: 'Scrum Master Delivery Lead', courseSlug: 'agile-project-management-scrum', duration: '8h', done: true },
            { label: 'Kanban Flow & WIP Limits', courseSlug: 'kanban-method-flow-metrics', duration: '5h', active: true },
            { label: 'Engineering Leadership & 1-on-1s', courseSlug: 'engineering-leadership-management', duration: '7h' },
            { label: 'Strategic Roadmaps & OKRs', courseSlug: 'strategic-roadmapping-okrs', duration: '6h' },
        ],
    },
    {
        id: 'systems',
        name: 'Distributed Go',
        badge: '8 Courses • Systems Engineering',
        icon: Zap,
        accentColor: 'text-amber-400',
        accentBg: 'bg-amber-500/10',
        accentBorder: 'border-amber-500/30',
        targetFilter: 'distributed',
        previewTag: 'RAFT CONSENSUS QUORUM AUDIT',
        previewCode: 'cluster.QuorumCheck(ctx) -> Leader: node-02, Term: 48, Status: HEALTHY (p99 latency: 1.4ms)',
        previewOutcome: 'Architect fault-tolerant distributed pipelines handling 100k+ events/sec',
        steps: [
            { label: 'Programming in Go Syntax', courseSlug: 'golang-syntax-concurrency-basics', duration: '7h', done: true },
            { label: 'High-Performance Go APIs', courseSlug: 'go-high-performance-apis', duration: '8h', done: true },
            { label: 'Distributed Systems & Raft', courseSlug: 'distributed-systems-go', duration: '14h', active: true },
            { label: 'Kafka & Event Sourcing', courseSlug: 'event-driven-systems-kafka', duration: '10h' },
            { label: 'Microservices Resiliency & gRPC', courseSlug: 'microservices-resiliency-grpc-tracing', duration: '8h' },
        ],
    },
    {
        id: 'ai',
        name: 'AI & Agents',
        badge: '8 Courses • OpenAI to LLMOps',
        icon: Cpu,
        accentColor: 'text-emerald-400',
        accentBg: 'bg-emerald-500/10',
        accentBorder: 'border-emerald-500/30',
        targetFilter: 'ai',
        previewTag: 'STRUCTURED AUTONOMOUS AGENT LOOP',
        previewCode: 'const plan = await agent.synthesize({ schema: PydanticModel, tools: [VectorSearch, CodeExec] });',
        previewOutcome: 'Deploy autonomous agent loops, vector RAG, and production LLMOps guardrails',
        steps: [
            { label: 'Prompt Engineering & CoT', courseSlug: 'ai-literacy-prompt-engineering', duration: '5h', done: true },
            { label: 'OpenAI API & Tool Calling', courseSlug: 'openai-api-function-calling', duration: '6h', done: true },
            { label: 'Production AI Agents & RAG', courseSlug: 'production-ai-agents', duration: '18h', active: true },
            { label: 'Vector Databases & Hybrid Search', courseSlug: 'vector-databases-semantic-search', duration: '7h' },
            { label: 'Fine-Tuning LoRA & LLMOps', courseSlug: 'fine-tuning-llms-lora-unsloth', duration: '9h' },
        ],
    },
];

export function HeroSection({ totalCourses, onSelectCategory }: HeroSectionProps) {
    const [selectedTrackId, setSelectedTrackId] = useState<string>('languages');

    const currentTrack = HERO_TRACKS.find((t) => t.id === selectedTrackId) || HERO_TRACKS[0];
    const TrackIcon = currentTrack.icon;

    const handleExploreTrack = () => {
        onSelectCategory(currentTrack.targetFilter);
        const catalogEl = document.getElementById('catalog');
        if (catalogEl) {
            catalogEl.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative w-full bg-[#080C15] border-b border-slate-800/80 overflow-hidden mb-12 shadow-sm">
            {/* Background Subtle Grid Texture spanning entire viewport */}
            <div
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{
                    backgroundImage: `radial-gradient(#334155 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                }}
            />

            {/* Soft Ambient Glow Beams */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

            {/* Centered Content Container matching page width */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* LEFT COLUMN (Content & Actions) */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Interactive Magic UI Pulsing Badge */}
                        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            <span className="text-xs font-semibold text-slate-200 tracking-wide">
                                63 Verified Curriculums • 8 Progressive Tracks
                            </span>
                            <span className="text-xs text-emerald-400 font-mono font-bold">2026 Ready</span>
                        </div>

                        {/* High-Impact Headline */}
                        <div className="space-y-2">
                            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black text-white tracking-tight leading-[1.08]">
                                Master high-impact skills with{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
                                    verified roadmaps.
                                </span>
                            </h1>
                            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl pt-1">
                                Comprehensive learning tracks spanning executive English fluency, Figma product design, Agile delivery leadership, corporate finance, and distributed systems architecture.
                            </p>
                        </div>

                        {/* CTA Buttons & Search Trigger */}
                        <div className="flex flex-wrap items-center gap-3.5 pt-2">
                            <a
                                href="#catalog"
                                className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/20 active:scale-[0.98] flex items-center gap-2"
                            >
                                <span>Explore {totalCourses} Courses</span>
                                <ArrowRight className="w-4 h-4" />
                            </a>

                            <button
                                type="button"
                                onClick={handleExploreTrack}
                                className="px-5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-all flex items-center gap-2"
                            >
                                <TrackIcon className={`w-4 h-4 ${currentTrack.accentColor}`} />
                                <span>View {currentTrack.name} Track</span>
                            </button>
                        </div>

                        {/* Social Proof & Trust Badges */}
                        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                            {/* Avatar Stack */}
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2 overflow-hidden">
                                    <div className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 bg-emerald-700 text-white font-bold flex items-center justify-center text-[10px]">
                                        AK
                                    </div>
                                    <div className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 bg-sky-700 text-white font-bold flex items-center justify-center text-[10px]">
                                        MR
                                    </div>
                                    <div className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 bg-indigo-700 text-white font-bold flex items-center justify-center text-[10px]">
                                        SL
                                    </div>
                                    <div className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 bg-amber-700 text-white font-bold flex items-center justify-center text-[10px]">
                                        +4k
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-3 h-3 fill-current" />
                                        ))}
                                        <span className="font-bold text-slate-200 ml-1 text-xs font-mono">4.9/5</span>
                                    </div>
                                    <span className="text-[11px] text-slate-400">2,840+ verified completions</span>
                                </div>
                            </div>

                            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

                            <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Accredited Peppol & EU Compliant Invoicing</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Interactive Magic UI Career Track Console */}
                    <div className="lg:col-span-5">
                        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl p-5 space-y-4 backdrop-blur-md">
                            {/* Track Selector Tab Bar */}
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                                        Interactive Track Simulator
                                    </span>
                                </div>
                                <span className="text-[11px] font-mono text-slate-500">Step 1 of 5</span>
                            </div>

                            {/* Quick Select Track Pills */}
                            <div className="grid grid-cols-5 gap-1.5 p-1 rounded-xl bg-slate-950/60 border border-slate-800/80">
                                {HERO_TRACKS.map((track) => {
                                    const isSelected = track.id === selectedTrackId;
                                    const Icon = track.icon;
                                    return (
                                        <button
                                            key={track.id}
                                            type="button"
                                            onClick={() => setSelectedTrackId(track.id)}
                                            className={`p-2 rounded-lg text-center transition-all flex flex-col items-center gap-1 ${
                                                isSelected
                                                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                                            }`}
                                        >
                                            <Icon className={`w-3.5 h-3.5 ${isSelected ? track.accentColor : ''}`} />
                                            <span className="text-[10px] font-semibold truncate w-full">
                                                {track.name.split(' ')[0]}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Active Track Header */}
                            <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center gap-2.5">
                                    <div className={`p-2 rounded-xl ${currentTrack.accentBg} ${currentTrack.accentBorder} border`}>
                                        <TrackIcon className={`w-4 h-4 ${currentTrack.accentColor}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white leading-none">
                                            {currentTrack.name} Track
                                        </h3>
                                        <span className="text-[11px] text-slate-400 font-mono mt-0.5 inline-block">
                                            {currentTrack.badge}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Sequential Roadmap Path (Magic UI Node Steps) */}
                            <div className="space-y-1.5 py-1">
                                {currentTrack.steps.slice(0, 4).map((step, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/courses/${step.courseSlug}`}
                                        className={`group p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                                            step.active
                                                ? 'bg-slate-800/90 border-slate-700 text-white shadow-sm'
                                                : step.done
                                                ? 'bg-slate-950/40 border-slate-800/60 text-slate-300 hover:border-slate-700'
                                                : 'bg-slate-950/20 border-slate-900 text-slate-500'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5 truncate">
                                            {step.done ? (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                            ) : step.active ? (
                                                <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-400 flex items-center justify-center shrink-0">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                </span>
                                            ) : (
                                                <span className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
                                            )}
                                            <span className="font-medium truncate group-hover:text-white transition-colors">
                                                {step.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono text-slate-400">
                                            <span>{step.duration}</span>
                                            <ArrowRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 group-hover:text-slate-300 transition-all" />
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Live Drill / Terminal Preview Card */}
                            <div className="rounded-xl bg-slate-950 border border-slate-800/90 p-3 space-y-1.5">
                                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                                    <span className="text-emerald-400">{currentTrack.previewTag}</span>
                                    <span>PRACTICE LAB</span>
                                </div>
                                <p className="text-xs font-mono text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60 leading-relaxed italic">
                                    {currentTrack.previewCode}
                                </p>
                                <div className="text-[11px] text-slate-400 pt-0.5 flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                                    <span className="truncate">{currentTrack.previewOutcome}</span>
                                </div>
                            </div>

                            {/* Action CTA Button for Track */}
                            <button
                                type="button"
                                onClick={handleExploreTrack}
                                className="w-full py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-sm"
                            >
                                <span>Explore All Courses in {currentTrack.name} Track</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
