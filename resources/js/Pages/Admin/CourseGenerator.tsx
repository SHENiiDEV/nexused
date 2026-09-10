import React, { useEffect, useRef, useState } from 'react';
import { Course } from '../../types';
import { AppLayout } from '../../Layouts/AppLayout';
import { ProgressBar } from '../../Components/ProgressBar';
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Cpu,
    DollarSign,
    Layers,
    Play,
    Radio,
    Sparkles,
    Terminal,
} from 'lucide-react';
import { Head, Link } from '@inertiajs/react';

interface GeneratorProps {
    recentCourses: Course[];
}

interface GenerationLog {
    time: string;
    message: string;
    step: string;
    progress: number;
}

export default function CourseGenerator({ recentCourses }: GeneratorProps) {
    const [topic, setTopic] = useState('');
    const [price, setPrice] = useState('49.00');
    const [targetAudience, setTargetAudience] = useState('Senior Engineers, Tech Leads, Cloud Architects');
    const [estimatedHours, setEstimatedHours] = useState('6');

    // Pipeline state
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeCourseId, setActiveCourseId] = useState<number | null>(null);
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState<string>('Ready');
    const [logs, setLogs] = useState<GenerationLog[]>([]);
    const [completedCourse, setCompletedCourse] = useState<{ id: number; slug: string; title: string } | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const pollingIntervalRef = useRef<any>(null);

    // Clean up polling interval
    useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);

    // Trigger AI generation
    const handleStartGeneration = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setIsGenerating(true);
        setProgress(5);
        setCurrentStep('Submitting to AI Pipeline...');
        setCompletedCourse(null);
        setErrorMessage(null);

        const initialLog: GenerationLog = {
            time: new Date().toLocaleTimeString(),
            message: `Initiating pipeline for topic: "${topic}" at €${price}`,
            step: 'Queueing',
            progress: 5,
        };
        setLogs([initialLog]);

        try {
            const res = await fetch('/admin/courses/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    topic,
                    price: parseFloat(price),
                    target_audience: targetAudience,
                    estimated_hours: parseInt(estimatedHours, 10),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || data.error || 'Pipeline initiation failed');
            }

            setActiveCourseId(data.course_id);

            // Start real-time sync via polling + WebSocket listener
            startRealTimePolling(data.course_id);
        } catch (err: any) {
            setErrorMessage(err.message || 'Error triggering course generation.');
            setIsGenerating(false);
        }
    };

    const startRealTimePolling = (courseId: number) => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }

        pollingIntervalRef.current = setInterval(async () => {
            try {
                const res = await fetch(`/admin/courses/${courseId}/status`);
                const statusData = await res.json();

                setProgress(statusData.generation_progress);
                setCurrentStep(statusData.generation_step || 'Processing...');

                setLogs((prev) => {
                    const lastLog = prev[prev.length - 1];
                    if (lastLog && lastLog.message === statusData.generation_step) {
                        return prev;
                    }
                    return [
                        ...prev,
                        {
                            time: new Date().toLocaleTimeString(),
                            message: statusData.generation_step || `Step progress at ${statusData.generation_progress}%`,
                            step: statusData.status,
                            progress: statusData.generation_progress,
                        },
                    ];
                });

                if (statusData.status === 'published' || statusData.generation_progress >= 100) {
                    clearInterval(pollingIntervalRef.current);
                    setIsGenerating(false);
                    setCompletedCourse({
                        id: statusData.id,
                        slug: statusData.slug,
                        title: statusData.title,
                    });
                }
            } catch {
                // Keep polling retry
            }
        }, 1200);
    };

    return (
        <AppLayout title="AI Course Generation Studio">
            <Head title="AI Course Generator | NexusEd" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
                {/* Header */}
                <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-mono font-semibold uppercase mb-2">
                            <Cpu className="w-3.5 h-3.5" /> OpenAI Job Chaining Pipeline
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                            Autonomous Course Synthesizer
                        </h1>
                        <p className="mt-1 text-slate-400 text-sm max-w-2xl">
                            Enter any technological subject and retail price. The backend orchestrates chained jobs: Syllabus Generation (JSON) → Content Writing (Markdown) → Quiz Synthesis → Reverb Event Broadcast.
                        </p>
                    </div>

                    <Link
                        href="/admin/transactions"
                        className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:border-amber-400 transition-colors flex items-center gap-1.5"
                    >
                        <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                        <span>View Financial Ledger</span>
                    </Link>
                </div>

                {/* Generator Form & Real-time Console */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Form Section */}
                    <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                                <span>Course Generation Parameters</span>
                            </h2>
                        </div>

                        <form onSubmit={handleStartGeneration} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Topic & Core Technology
                                </label>
                                <input
                                    type="text"
                                    required
                                    disabled={isGenerating}
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g. Distributed Systems Architecture with Go & Kafka"
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                        Retail Price (€ EUR)
                                    </label>
                                    <input
                                        type="number"
                                        min="2"
                                        max="300"
                                        step="1"
                                        required
                                        disabled={isGenerating}
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                        Estimated Hours
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="50"
                                        disabled={isGenerating}
                                        value={estimatedHours}
                                        onChange={(e) => setEstimatedHours(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Target Audience
                                </label>
                                <input
                                    type="text"
                                    disabled={isGenerating}
                                    value={targetAudience}
                                    onChange={(e) => setTargetAudience(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                                />
                            </div>

                            {errorMessage && (
                                <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isGenerating || !topic.trim()}
                                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-sm transition-all shadow-lg shadow-emerald-950 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>AI Pipeline Running...</span>
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 fill-current" />
                                        <span>Dispatch AI Generation Chain</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Real-time Progress & Pipeline Log Stream */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Progress Bar Display */}
                        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Radio className={`w-4 h-4 ${isGenerating ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                                    <h3 className="text-sm font-bold text-white">Pipeline Execution Status</h3>
                                </div>
                                <span className="font-mono text-xs text-slate-400">
                                    {isGenerating ? 'LIVE BROADCAST' : completedCourse ? 'COMPLETED' : 'IDLE'}
                                </span>
                            </div>

                            <ProgressBar
                                progress={progress}
                                step={currentStep}
                                size="lg"
                            />

                            {/* Completed Course banner */}
                            {completedCourse && (
                                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 flex items-center justify-between gap-4 animate-in fade-in">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-bold text-white">Course Published Successfully!</h4>
                                            <p className="text-xs text-emerald-300/80">{completedCourse.title}</p>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/courses/${completedCourse.slug}`}
                                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors flex items-center gap-1.5 shrink-0"
                                    >
                                        <span>View Course</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Pipeline Terminal Logs */}
                        <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
                            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-400">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-emerald-400" />
                                    <span className="font-mono font-semibold text-slate-200 text-[11px]">
                                        Job Chaining Event Stream
                                    </span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-500">
                                    Laravel Reverb / WebSockets
                                </span>
                            </div>

                            <div className="p-4 font-mono text-xs space-y-2 max-h-72 overflow-y-auto">
                                {logs.length === 0 ? (
                                    <div className="text-slate-600 italic py-6 text-center">
                                        No active pipeline execution. Submit the form to watch real-time events.
                                    </div>
                                ) : (
                                    logs.map((log, idx) => (
                                        <div key={idx} className="flex items-start gap-2.5 leading-relaxed">
                                            <span className="text-slate-600 text-[11px] shrink-0">{log.time}</span>
                                            <span className="text-emerald-400 text-[11px] uppercase font-bold shrink-0">
                                                [{log.progress}%]
                                            </span>
                                            <span className="text-slate-300">{log.message}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recently Created Courses */}
                <div className="pt-6 border-t border-slate-800 space-y-4">
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        <Layers className="w-4 h-4 text-emerald-400" />
                        <span>Recently Synthesized Courses</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentCourses.map((c) => (
                            <div
                                key={c.id}
                                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between"
                            >
                                <div className="min-w-0 pr-2">
                                    <h4 className="text-sm font-semibold text-white truncate">{c.title}</h4>
                                    <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                                        <span>€{Number(c.price).toFixed(2)}</span>
                                        <span>•</span>
                                        <span className="text-emerald-400 capitalize">{c.status}</span>
                                    </div>
                                </div>
                                <Link
                                    href={`/courses/${c.slug}`}
                                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
