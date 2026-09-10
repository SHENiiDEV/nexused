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

    const [isGenerating, setIsGenerating] = useState(false);
    const [activeCourseId, setActiveCourseId] = useState<number | null>(null);
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState<string>('Ready');
    const [logs, setLogs] = useState<GenerationLog[]>([]);
    const [completedCourse, setCompletedCourse] = useState<{ id: number; slug: string; title: string } | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const pollingIntervalRef = useRef<any>(null);

    useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);

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
                // retry
            }
        }, 1200);
    };

    return (
        <AppLayout title="AI Course Generation Studio">
            <Head title="AI Course Generator | NexusEd" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
                {/* Header */}
                <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono font-semibold uppercase mb-2">
                            <Cpu className="w-3.5 h-3.5 text-emerald-600" /> OpenAI Job Chaining Pipeline
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                            Autonomous Course Synthesizer
                        </h1>
                        <p className="mt-1 text-slate-600 text-sm max-w-2xl">
                            Enter any technological subject and price. Chained background jobs generate the syllabus (JSON) → lesson longforms (Markdown) → comprehension quizzes with explanations.
                        </p>
                    </div>

                    <Link
                        href="/admin/transactions"
                        className="self-start sm:self-auto px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                        <DollarSign className="w-3.5 h-3.5 text-slate-600" />
                        <span>Financial Transactions Ledger</span>
                    </Link>
                </div>

                {/* Generator Form & Console */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Form Section */}
                    <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-emerald-600" />
                                <span>Course Generation Parameters</span>
                            </h2>
                        </div>

                        <form onSubmit={handleStartGeneration} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Topic & Core Technology
                                </label>
                                <input
                                    type="text"
                                    required
                                    disabled={isGenerating}
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g. Distributed Systems Architecture with Go & Kafka"
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 disabled:opacity-50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
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
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-slate-800 disabled:opacity-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Estimated Hours
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="50"
                                        disabled={isGenerating}
                                        value={estimatedHours}
                                        onChange={(e) => setEstimatedHours(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-mono text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-slate-800 disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Target Audience
                                </label>
                                <input
                                    type="text"
                                    disabled={isGenerating}
                                    value={targetAudience}
                                    onChange={(e) => setTargetAudience(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-slate-800 disabled:opacity-50"
                                />
                            </div>

                            {errorMessage && (
                                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isGenerating || !topic.trim()}
                                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-xs transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>AI Pipeline Running...</span>
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 fill-current text-emerald-400" />
                                        <span>Dispatch AI Generation Chain</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Real-time Progress & Console */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Progress Bar Display */}
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Radio className={`w-4 h-4 ${isGenerating ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
                                    <h3 className="text-sm font-bold text-slate-900">Pipeline Execution Status</h3>
                                </div>
                                <span className="font-mono text-xs font-semibold text-slate-500">
                                    {isGenerating ? 'LIVE' : completedCourse ? 'COMPLETED' : 'IDLE'}
                                </span>
                            </div>

                            <ProgressBar
                                progress={progress}
                                step={currentStep}
                                size="lg"
                            />

                            {completedCourse && (
                                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4 animate-in fade-in">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-950">Course Published Successfully!</h4>
                                            <p className="text-xs text-slate-600">{completedCourse.title}</p>
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

                        {/* Logs */}
                        <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xs">
                            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
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
                                    <div className="text-slate-500 italic py-6 text-center">
                                        No active pipeline execution. Submit the form to watch real-time events.
                                    </div>
                                ) : (
                                    logs.map((log, idx) => (
                                        <div key={idx} className="flex items-start gap-2.5 leading-relaxed">
                                            <span className="text-slate-500 text-[11px] shrink-0">{log.time}</span>
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
                <div className="pt-6 border-t border-slate-200 space-y-4">
                    <h3 className="text-lg font-bold text-slate-950 tracking-tight flex items-center gap-2">
                        <Layers className="w-4 h-4 text-slate-600" />
                        <span>Recently Synthesized Courses</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentCourses.map((c) => (
                            <div
                                key={c.id}
                                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors flex items-center justify-between shadow-2xs"
                            >
                                <div className="min-w-0 pr-2">
                                    <h4 className="text-sm font-semibold text-slate-900 truncate">{c.title}</h4>
                                    <div className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-2">
                                        <span>€{Number(c.price).toFixed(2)}</span>
                                        <span>•</span>
                                        <span className="text-emerald-700 capitalize font-medium">{c.status}</span>
                                    </div>
                                </div>
                                <Link
                                    href={`/courses/${c.slug}`}
                                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
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
