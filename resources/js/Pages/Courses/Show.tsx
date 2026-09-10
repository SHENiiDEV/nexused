import React, { useState } from 'react';
import { Course } from '../../types';
import { AppLayout } from '../../Layouts/AppLayout';
import { CheckoutModal } from '../../Components/CheckoutModal';
import {
    BookOpen,
    Building2,
    CheckCircle2,
    Clock,
    GraduationCap,
    Layers,
    PlayCircle,
    Shield,
    Sparkles,
    UserCheck,
} from 'lucide-react';
import { Head, Link } from '@inertiajs/react';

interface ShowProps {
    course: Course;
    isEnrolled: boolean;
    completedLessonsCount: number;
    availableGateways: Array<{ id: string; name: string; description: string; badge: string }>;
}

export default function Show({ course, isEnrolled, completedLessonsCount, availableGateways }: ShowProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'b2c_course' | 'b2b_license'>('b2c_course');

    const totalLessons = course.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0;

    const openModal = (type: 'b2c_course' | 'b2b_license') => {
        setModalType(type);
        setModalOpen(true);
    };

    return (
        <AppLayout title={course.title}>
            <Head title={`${course.title} | NexusEd`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Course Header Banner */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                    {/* Left 2 Cols: Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs uppercase font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 px-2.5 py-1 rounded-full">
                                {course.topic || 'Masterclass'}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> AI-Curated Curriculum
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                            {course.title}
                        </h1>

                        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                            {course.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 pt-2 border-t border-slate-800">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-500" />
                                <span>{course.estimated_hours} Hours Total</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-slate-500" />
                                <span>{course.modules?.length || 0} Modules • {totalLessons} Lessons</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-emerald-400" />
                                <span>Verified Certificate on Completion</span>
                            </div>
                        </div>

                        {/* Audience & Invariants */}
                        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Target Audience & Competencies
                            </h3>
                            <p className="text-sm text-slate-300">
                                {course.target_audience || 'Software Engineers, Technical Architects, DevOps Leads'}
                            </p>
                        </div>

                        {/* Syllabus Accordion */}
                        <div className="pt-6 space-y-6">
                            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-emerald-400" />
                                <span>Course Syllabus & Interactive Lectures</span>
                            </h2>

                            <div className="space-y-4">
                                {course.modules?.map((mod, modIdx) => (
                                    <div
                                        key={mod.id}
                                        className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm"
                                    >
                                        <div className="p-5 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
                                            <div>
                                                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 tracking-wider">
                                                    Module {modIdx + 1}
                                                </span>
                                                <h3 className="text-base font-bold text-white mt-0.5">{mod.title}</h3>
                                            </div>
                                            <span className="text-xs font-mono text-slate-400">
                                                {mod.lessons?.length || 0} Lessons
                                            </span>
                                        </div>

                                        <div className="divide-y divide-slate-800/60">
                                            {mod.lessons?.map((lesson, lesIdx) => (
                                                <div
                                                    key={lesson.id}
                                                    className="p-4 flex items-center justify-between text-sm hover:bg-slate-850/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <PlayCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                                        <span className="text-slate-300 font-medium">{lesson.title}</span>
                                                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                                                            {lesson.type}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                                                        <span>{lesson.duration_minutes} min</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right 1 Col: Purchase Card */}
                    <div className="lg:sticky lg:top-24 space-y-6">
                        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
                            <div className="border-b border-slate-800 pb-5">
                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                    Full Lifetime Access
                                </div>
                                <div className="text-4xl font-black text-white font-mono flex items-baseline gap-2">
                                    <span>€{Number(course.price).toFixed(2)}</span>
                                    <span className="text-xs text-slate-400 font-sans font-normal">+ EU VAT</span>
                                </div>
                            </div>

                            {isEnrolled ? (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold">You are enrolled in this course!</span>
                                            <p className="mt-0.5 text-emerald-200/80">
                                                {completedLessonsCount} of {totalLessons} lessons completed.
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/learn/${course.slug}`}
                                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-sm text-center transition-all shadow-lg shadow-emerald-950 flex items-center justify-center gap-2"
                                    >
                                        <GraduationCap className="w-4 h-4" /> Open Course Player
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => openModal('b2c_course')}
                                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-sm text-center transition-all shadow-lg shadow-emerald-950 flex items-center justify-center gap-2"
                                    >
                                        <span>Enroll Now (€{Number(course.price).toFixed(2)})</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => openModal('b2b_license')}
                                        className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs text-center transition-all flex items-center justify-center gap-2 border border-slate-700"
                                    >
                                        <Building2 className="w-3.5 h-3.5 text-teal-400" />
                                        <span>Corporate B2B Team License</span>
                                    </button>
                                </div>
                            )}

                            {/* Features list */}
                            <ul className="space-y-2.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Zero-reload SPA player experience</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Interactive code snippets & comprehension quizzes</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Multi-gateway checkout (Corefy, Cardaq, Apple Pay)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Automated PDF & Peppol UBL 2.1 e-invoicing for B2B</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            <CheckoutModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                course={course}
                initialType={modalType}
            />
        </AppLayout>
    );
}
