import React, { useEffect, useRef, useState } from 'react';
import { Course } from '../../types';
import { AppLayout } from '../../Layouts/AppLayout';
import { ProgressBar } from '../../Components/ProgressBar';
import { CourseCover } from '../../Components/CourseCover';
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Cpu,
    DollarSign,
    Download,
    FileJson,
    FolderUp,
    Layers,
    Play,
    Radio,
    Sparkles,
    Terminal,
    Upload,
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
    const [activeTab, setActiveTab] = useState<'ai' | 'upload'>('ai');

    // AI Generation state
    const [topic, setTopic] = useState('');
    const [price, setPrice] = useState('49.00');
    const [targetAudience, setTargetAudience] = useState('Senior Engineers, Tech Leads, Cloud Architects');
    const [estimatedHours, setEstimatedHours] = useState('6');

    // Import / Upload state
    const [importFile, setImportFile] = useState<File | null>(null);
    const [jsonText, setJsonText] = useState('');
    const [isImporting, setIsImporting] = useState(false);
    const [importSuccess, setImportSuccess] = useState<{ id: number; slug: string; title: string } | null>(null);
    const [importError, setImportError] = useState<string | null>(null);

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

    const handleImportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsImporting(true);
        setImportError(null);
        setImportSuccess(null);

        try {
            const formData = new FormData();
            if (importFile) {
                formData.append('course_file', importFile);
            } else if (jsonText.trim()) {
                formData.append('json_payload', jsonText.trim());
            } else {
                throw new Error('Please select a JSON file or paste valid JSON course data.');
            }

            const res = await fetch('/admin/courses/import', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || data.message || 'Import failed. Verify JSON structure.');
            }

            setImportSuccess({
                id: data.course_id,
                slug: data.slug,
                title: data.title,
            });
            setJsonText('');
            setImportFile(null);
        } catch (err: any) {
            setImportError(err.message || 'Error importing course.');
        } finally {
            setIsImporting(false);
        }
    };

    const handleDownloadTemplate = () => {
        window.open('/admin/courses/template', '_blank');
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
        <AppLayout title="Course Studio">
            <Head title="Course Studio & Generator | NexusEd" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
                {/* Header */}
                <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono font-semibold uppercase mb-2">
                            <Cpu className="w-3.5 h-3.5 text-emerald-600" /> NexusEd Publishing Studio
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                            Course Creator & Importer
                        </h1>
                        <p className="mt-1 text-slate-600 text-sm max-w-2xl">
                            Synthesize courses autonomously with our chained AI pipeline, or upload complete course curriculum files in standardized JSON format.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDownloadTemplate}
                            className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
                        >
                            <Download className="w-3.5 h-3.5 text-slate-600" />
                            <span>JSON Template</span>
                        </button>

                        <Link
                            href="/admin/transactions"
                            className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
                        >
                            <DollarSign className="w-3.5 h-3.5 text-slate-600" />
                            <span>Ledger</span>
                        </Link>
                    </div>
                </div>

                {/* Tab Selector */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <button
                        onClick={() => setActiveTab('ai')}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                            activeTab === 'ai'
                                ? 'bg-slate-900 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                    >
                        <Sparkles className={`w-4 h-4 ${activeTab === 'ai' ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span>1. AI Autonomous Synthesizer</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                            activeTab === 'upload'
                                ? 'bg-slate-900 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                    >
                        <FolderUp className={`w-4 h-4 ${activeTab === 'upload' ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span>2. Direct JSON Upload / Import</span>
                    </button>
                </div>

                {activeTab === 'ai' ? (
                    /* Generator Form & Console */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Form Section */}
                        <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-emerald-600" />
                                    <span>AI Generation Parameters</span>
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
                ) : (
                    /* Direct Upload / Import Tab */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Form Section */}
                        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-bold text-slate-950 flex items-center gap-2">
                                    <FileJson className="w-4 h-4 text-emerald-600" />
                                    <span>Upload or Paste JSON Curriculum</span>
                                </h2>
                                <button
                                    type="button"
                                    onClick={handleDownloadTemplate}
                                    className="text-xs font-semibold text-slate-600 hover:text-emerald-600 flex items-center gap-1 transition-colors"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Download Example File</span>
                                </button>
                            </div>

                            <form onSubmit={handleImportSubmit} className="space-y-5">
                                {/* File Upload Zone */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                        Option A: Choose .JSON File
                                    </label>
                                    <div className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-6 text-center transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100/70">
                                        <input
                                            type="file"
                                            id="course_file"
                                            accept=".json,application/json"
                                            disabled={isImporting}
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setImportFile(e.target.files[0]);
                                                }
                                            }}
                                            className="hidden"
                                        />
                                        <label htmlFor="course_file" className="cursor-pointer block space-y-2">
                                            <Upload className="w-7 h-7 text-slate-400 mx-auto" />
                                            <div className="text-xs text-slate-600">
                                                {importFile ? (
                                                    <span className="font-bold text-emerald-700">{importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)</span>
                                                ) : (
                                                    <span>Click to select or drag & drop a <strong className="font-semibold text-slate-800">.json</strong> curriculum file</span>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                    {importFile && (
                                        <button
                                            type="button"
                                            onClick={() => setImportFile(null)}
                                            className="text-xs text-rose-600 hover:underline mt-1.5 inline-block"
                                        >
                                            Clear selected file
                                        </button>
                                    )}
                                </div>

                                <div className="relative flex py-1 items-center">
                                    <div className="flex-grow border-t border-slate-200"></div>
                                    <span className="flex-shrink mx-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">OR Option B: Direct JSON Text</span>
                                    <div className="flex-grow border-t border-slate-200"></div>
                                </div>

                                {/* Paste JSON Zone */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Paste JSON Payload
                                    </label>
                                    <textarea
                                        rows={8}
                                        disabled={isImporting || !!importFile}
                                        value={jsonText}
                                        onChange={(e) => setJsonText(e.target.value)}
                                        placeholder={`{\n  "title": "Fullstack Cloud Mastery",\n  "topic": "DevOps",\n  "price": 59,\n  "modules": [\n    {\n      "title": "Module 1",\n      "lessons": [...]\n    }\n  ]\n}`}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 font-mono text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 disabled:opacity-50"
                                    />
                                </div>

                                {importError && (
                                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{importError}</span>
                                    </div>
                                )}

                                {importSuccess && (
                                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-950">Course Imported & Published!</h4>
                                                <p className="text-xs text-slate-600">{importSuccess.title}</p>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/courses/${importSuccess.slug}`}
                                            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors flex items-center gap-1.5 shrink-0"
                                        >
                                            <span>Open Course</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isImporting || (!importFile && !jsonText.trim())}
                                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isImporting ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Parsing & Persisting Course...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 text-white" />
                                            <span>Import & Publish Course to NexusEd</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Guide / Instructions Box */}
                        <div className="lg:col-span-5 space-y-4">
                            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <FileJson className="w-4 h-4 text-emerald-600" />
                                    <span>Curriculum JSON Schema Specification</span>
                                </h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    You can bulk-import complete courses created with your team, exported from other LMS systems, or crafted via custom scripts.
                                </p>
                                <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto space-y-1">
                                    <div><span className="text-purple-400">title</span>: string (Course Title)</div>
                                    <div><span className="text-purple-400">topic</span>: string (Category/Topic)</div>
                                    <div><span className="text-purple-400">price</span>: float (Retail EUR)</div>
                                    <div><span className="text-purple-400">estimated_hours</span>: int</div>
                                    <div><span className="text-purple-400">modules</span>: Array&lt;Module&gt;</div>
                                    <div className="pl-3 text-slate-400">└─ <span className="text-emerald-400">title</span>: string</div>
                                    <div className="pl-3 text-slate-400">└─ <span className="text-emerald-400">lessons</span>: Array&lt;Lesson&gt;</div>
                                    <div className="pl-6 text-slate-500">└─ <span className="text-sky-400">title</span>: string</div>
                                    <div className="pl-6 text-slate-500">└─ <span className="text-sky-400">content</span>: Markdown formatted text</div>
                                    <div className="pl-6 text-slate-500">└─ <span className="text-sky-400">quizzes</span>: Array&lt;Quiz&gt;</div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        onClick={handleDownloadTemplate}
                                        className="w-full py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Download className="w-4 h-4 text-slate-600" />
                                        <span>Download Sample Template (`course-template.json`)</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
                                className="rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col overflow-hidden group shadow-2xs"
                            >
                                <CourseCover course={c} aspectRatio="video" />
                                <div className="p-4 flex items-center justify-between">
                                    <div className="min-w-0 pr-2">
                                        <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                                            {c.title}
                                        </h4>
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
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
