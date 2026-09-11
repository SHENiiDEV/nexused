import React, { useState } from 'react';
import { Course } from '../../types';
import { AppLayout } from '../../Layouts/AppLayout';
import { CheckoutModal } from '../../Components/CheckoutModal';
import { CourseCover } from '../../Components/CourseCover';
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
    Star,
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

            {/* Dark Top Hero Strip (Udemy Style Course Banner) */}
            <div className="bg-slate-950 text-white py-12 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs uppercase font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800/60">
                                {course.topic || 'Masterclass'}
                            </span>
                            <span className="text-xs text-slate-400">
                                Last updated {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                            {course.title}
                        </h1>

                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                            {course.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-amber-400 font-mono">4.9</span>
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3 h-3 fill-current" />
                                    ))}
                                </div>
                                <span className="text-slate-400 font-mono">(1,840 ratings)</span>
                            </div>
                            <span>•</span>
                            <span>Created by NexusEd Principal Architects</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-medium">English [Auto]</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section & Sticky Purchase Card */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                    {/* Left 2 Cols: Syllabus & Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* What you'll learn */}
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
                            <h2 className="text-lg font-bold text-slate-950">What you will learn</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>Master stateful distributed invariants and consensus algorithms</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>Deploy scalable event streams with backpressure control</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>Hands-on quizzes with instant feedback and architectural explanations</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>Verified completion certificate conferred upon passing all modules</span>
                                </div>
                            </div>
                        </div>

                        {/* Course Content Syllabus */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-950">Course Content</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {course.modules?.length || 0} modules • {totalLessons} lectures • {course.estimated_hours}h total length
                                    </p>
                                </div>
                            </div>

                            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200 bg-white shadow-xs">
                                {course.modules?.map((mod, modIdx) => (
                                    <div key={mod.id} className="p-4 sm:p-5">
                                        <div className="flex items-center justify-between font-semibold text-slate-900 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono text-emerald-700 font-bold">
                                                    Module {modIdx + 1}:
                                                </span>
                                                <span>{mod.title}</span>
                                            </div>
                                            <span className="text-xs text-slate-500 font-mono">
                                                {mod.lessons?.length || 0} lectures
                                            </span>
                                        </div>

                                        <div className="mt-3 space-y-1 pl-4 border-l-2 border-slate-100">
                                            {mod.lessons?.map((lesson) => (
                                                <div
                                                    key={lesson.id}
                                                    className="py-1.5 flex items-center justify-between text-xs text-slate-600 hover:text-slate-900"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <PlayCircle className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{lesson.title}</span>
                                                    </div>
                                                    <span className="font-mono text-[11px] text-slate-400">
                                                        {lesson.duration_minutes}m
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right 1 Col: Sticky Purchase Card */}
                    <div className="lg:sticky lg:top-24 space-y-6">
                        <div className="rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden space-y-6">
                            <CourseCover course={course} aspectRatio="video" />
                            <div className="p-6 sm:p-8 pt-0 space-y-6">
                            <div className="border-b border-slate-100 pb-5">
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                    Lifetime Access
                                </div>
                                <div className="text-4xl font-extrabold text-slate-950 font-mono flex items-baseline gap-2">
                                    <span>€{Number(course.price).toFixed(2)}</span>
                                    <span className="text-xs text-slate-500 font-sans font-normal">+ EU VAT</span>
                                </div>
                            </div>

                            {isEnrolled ? (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold">You are already enrolled!</span>
                                            <p className="mt-0.5 text-emerald-700">
                                                {completedLessonsCount} of {totalLessons} lectures completed.
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/learn/${course.slug}`}
                                        className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm text-center transition-colors flex items-center justify-center gap-2 shadow-xs"
                                    >
                                        <GraduationCap className="w-4 h-4" /> Open Course Player
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => openModal('b2c_course')}
                                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs sm:text-sm text-center transition-all shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2"
                                    >
                                        <span>Enroll Now (€{Number(course.price).toFixed(2)})</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => openModal('b2b_license')}
                                        className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs text-center transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Building2 className="w-3.5 h-3.5 text-teal-700" />
                                        <span>Corporate B2B Team License</span>
                                    </button>
                                </div>
                            )}

                            {/* Features list */}
                            <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>Zero-reload instant SPA course player</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>Interactive code snippets & architecture quizzes</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>Multi-gateway payment with HMAC verification</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>Automated Peppol UBL 2.1 e-invoicing for B2B</span>
                                </li>
                            </ul>
                            </div>
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
