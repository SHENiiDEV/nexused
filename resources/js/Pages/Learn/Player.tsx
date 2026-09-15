import React, { useState } from 'react';
import { Course, Enrollment, Lesson, Quiz } from '../../types';
import { AppLayout } from '../../Layouts/AppLayout';
import { MarkdownRenderer } from '../../Components/MarkdownRenderer';
import confetti from 'canvas-confetti';
import {
    Award,
    BookOpen,
    CheckCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    HelpCircle,
    Menu,
    PlayCircle,
    Sparkles,
    X,
    XCircle,
} from 'lucide-react';
import { Head, Link } from '@inertiajs/react';

interface PlayerProps {
    course: Course;
    currentLesson: Lesson;
    completedLessonIds: number[];
    quizAttempts: Record<number, { is_correct: boolean; quiz_option_id: number }>;
    enrollment: Enrollment;
}

export default function Player({
    course,
    currentLesson: initialLesson,
    completedLessonIds: initialCompletedIds,
    quizAttempts: initialQuizAttempts,
    enrollment,
}: PlayerProps) {
    const [activeLesson, setActiveLesson] = useState<Lesson>(initialLesson);
    const [completedIds, setCompletedIds] = useState<number[]>(initialCompletedIds);
    const [attempts, setAttempts] = useState<Record<number, { is_correct: boolean; quiz_option_id: number }>>(
        initialQuizAttempts || {}
    );
    const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
    const [quizFeedbacks, setQuizFeedbacks] = useState<Record<number, { is_correct: boolean; explanation: string; correct_option_id: number }>>({});
    const [isCompleting, setIsCompleting] = useState<boolean>(false);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
    const [certificateCode, setCertificateCode] = useState<string | null>(enrollment?.certificate_code || null);

    const allLessons = course.modules?.flatMap((m) => m.lessons || []) || [];
    const currentLessonIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
    const isCurrentCompleted = completedIds.includes(activeLesson.id);

    const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
    const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

    const completedCount = completedIds.length;
    const totalCount = allLessons.length;
    const progressPercent = Math.round((completedCount / Math.max(1, totalCount)) * 100);

    const handleSwitchLesson = (lesson: Lesson) => {
        setActiveLesson(lesson);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSidebarOpen(false);
    };

    const handleCompleteLesson = async () => {
        setIsCompleting(true);
        try {
            const res = await fetch(`/learn/lessons/${activeLesson.id}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });
            const data = await res.json();

            if (data.success) {
                if (!completedIds.includes(activeLesson.id)) {
                    setCompletedIds([...completedIds, activeLesson.id]);
                }

                if (data.is_course_completed) {
                    setCertificateCode(data.certificate_code);
                    setShowCompletionModal(true);
                    confetti({
                        particleCount: 120,
                        spread: 80,
                        origin: { y: 0.6 },
                    });
                } else if (nextLesson) {
                    handleSwitchLesson(nextLesson);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsCompleting(false);
        }
    };

    const handleQuizSubmit = async (quiz: Quiz) => {
        const optionId = selectedOptions[quiz.id];
        if (!optionId) return;

        try {
            const res = await fetch(`/learn/quizzes/${quiz.id}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({ quiz_option_id: optionId }),
            });
            const data = await res.json();

            setQuizFeedbacks((prev) => ({
                ...prev,
                [quiz.id]: {
                    is_correct: data.is_correct,
                    explanation: data.explanation,
                    correct_option_id: data.correct_option_id,
                },
            }));

            setAttempts((prev) => ({
                ...prev,
                [quiz.id]: {
                    is_correct: data.is_correct,
                    quiz_option_id: optionId,
                },
            }));

            if (data.is_correct) {
                confetti({
                    particleCount: 40,
                    spread: 50,
                    origin: { y: 0.7 },
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AppLayout title={`Learning: ${activeLesson.title}`}>
            <Head title={`${activeLesson.title} | ${course.title}`} />

            <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-4.5rem)] bg-white text-slate-900">
                {/* Mobile curriculum top trigger bar */}
                <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200 sticky top-16 z-20">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs"
                    >
                        <Menu className="w-4 h-4 text-emerald-600" />
                        <span>Curriculum ({completedCount}/{totalCount})</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500 font-medium">Progress:</span>
                        <span className="font-mono text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {progressPercent}%
                        </span>
                    </div>
                </div>

                {/* Mobile Drawer Overlay & Left Sidebar for Desktop */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <aside
                    className={`fixed inset-y-0 left-0 z-50 w-4/5 max-w-sm bg-white border-r border-slate-200 flex flex-col shadow-2xl transition-transform duration-300 md:static md:w-80 lg:w-96 md:bg-slate-50 md:sticky md:top-18 md:h-[calc(100vh-4.5rem)] md:z-30 md:shadow-none md:translate-x-0 ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
                >
                    {/* Course Header in Sidebar */}
                    <div className="p-4 sm:p-5 border-b border-slate-200 bg-white">
                        <div className="flex items-center justify-between mb-2">
                            <Link
                                href={`/courses/${course.slug}`}
                                className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 font-medium"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" /> Course Overview
                            </Link>
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(false)}
                                className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <h2 className="text-sm font-bold text-slate-950 tracking-tight line-clamp-2">
                            {course.title}
                        </h2>

                        {/* Progress Bar */}
                        <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1 font-medium">
                                <span className="text-slate-500">Progress</span>
                                <span className="text-emerald-700 font-mono font-bold">{progressPercent}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Modules and Lessons list */}
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-200/60 p-2 space-y-3">
                        {course.modules?.map((module, modIdx) => (
                            <div key={module.id} className="pt-2">
                                <div className="px-3 mb-1.5 text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider">
                                    Module {modIdx + 1}: {module.title}
                                </div>
                                <div className="space-y-1">
                                    {module.lessons?.map((lesson) => {
                                        const isActive = lesson.id === activeLesson.id;
                                        const isDone = completedIds.includes(lesson.id);

                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => handleSwitchLesson(lesson)}
                                                className={`w-full text-left flex items-start gap-2.5 p-2.5 rounded-xl text-xs transition-all ${
                                                    isActive
                                                        ? 'bg-emerald-50 md:bg-white border border-emerald-200 md:border-slate-300 text-slate-950 font-semibold shadow-xs'
                                                        : 'text-slate-700 hover:bg-slate-100'
                                                }`}
                                            >
                                                {isDone ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                                ) : (
                                                    <PlayCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="truncate">{lesson.title}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                                                        <span>{lesson.duration_minutes}m</span>
                                                        {lesson.quizzes && lesson.quizzes.length > 0 && (
                                                            <span>• {lesson.quizzes.length} quizzes</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main Content Area: Instant Lecture & Quizzes */}
                <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-4xl mx-auto w-full space-y-8 pb-28 md:pb-10">
                    {/* Header */}
                    <div className="pb-6 border-b border-slate-200">
                        <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold mb-2">
                            <span>Lecture Notes</span>
                            <span>•</span>
                            <span className="capitalize">{activeLesson.type}</span>
                            <span>•</span>
                            <span>{activeLesson.duration_minutes} min</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                            {activeLesson.title}
                        </h1>
                    </div>

                    {/* Markdown Content */}
                    <article className="min-h-[280px]">
                        <MarkdownRenderer content={activeLesson.content} />
                    </article>

                    {/* Interactive Quizzes Section */}
                    {activeLesson.quizzes && activeLesson.quizzes.length > 0 && (
                        <section className="pt-8 border-t border-slate-200 space-y-6">
                            <div className="flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-emerald-600" />
                                <h2 className="text-xl font-bold text-slate-950 tracking-tight">
                                    Knowledge Check & Comprehension Quizzes
                                </h2>
                            </div>

                            <div className="space-y-6">
                                {activeLesson.quizzes.map((quiz, qIdx) => {
                                    const feedback = quizFeedbacks[quiz.id];
                                    const previousAttempt = attempts[quiz.id];
                                    const isAnswered = feedback !== undefined || previousAttempt !== undefined;
                                    const isCorrect = feedback?.is_correct ?? previousAttempt?.is_correct;

                                    return (
                                        <div
                                            key={quiz.id}
                                            className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                                                    Q{qIdx + 1}
                                                </span>
                                                <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                                                    {quiz.question_text}
                                                </h3>
                                            </div>

                                            {/* Quiz Options */}
                                            <div className="space-y-2">
                                                {quiz.options?.map((opt) => {
                                                    const isSelected = selectedOptions[quiz.id] === opt.id || previousAttempt?.quiz_option_id === opt.id;
                                                    const isCorrectOption = feedback?.correct_option_id === opt.id || (isAnswered && opt.is_correct);

                                                    let optionStyle = 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50';

                                                    if (isAnswered) {
                                                        if (isCorrectOption) {
                                                            optionStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                                                        } else if (isSelected && !isCorrect) {
                                                            optionStyle = 'border-rose-500 bg-rose-50/70 text-rose-950 ring-1 ring-rose-500';
                                                        }
                                                    } else if (isSelected) {
                                                        optionStyle = 'border-slate-800 bg-slate-50 text-slate-950 font-semibold ring-1 ring-slate-800';
                                                    }

                                                    return (
                                                        <button
                                                            key={opt.id}
                                                            type="button"
                                                            disabled={isAnswered}
                                                            onClick={() =>
                                                                setSelectedOptions({
                                                                    ...selectedOptions,
                                                                    [quiz.id]: opt.id,
                                                                })
                                                            }
                                                            className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${optionStyle}`}
                                                        >
                                                            <span>{opt.option_text}</span>
                                                            {isAnswered && isCorrectOption && (
                                                                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                                            )}
                                                            {isAnswered && isSelected && !isCorrect && (
                                                                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Submit */}
                                            {!isAnswered && (
                                                <button
                                                    type="button"
                                                    disabled={!selectedOptions[quiz.id]}
                                                    onClick={() => handleQuizSubmit(quiz)}
                                                    className="py-2 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs disabled:opacity-50 transition-colors shadow-xs"
                                                >
                                                    Submit Answer
                                                </button>
                                            )}

                                            {/* Feedback */}
                                            {isAnswered && (
                                                <div
                                                    className={`p-4 rounded-xl text-xs leading-relaxed ${
                                                        isCorrect
                                                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                                                            : 'bg-slate-50 border border-slate-200 text-slate-800'
                                                    }`}
                                                >
                                                    <div className="font-bold flex items-center gap-1.5 mb-1 text-slate-950">
                                                        {isCorrect ? (
                                                            <span className="text-emerald-700">Correct!</span>
                                                        ) : (
                                                            <span className="text-rose-700">Incorrect</span>
                                                        )}
                                                        <span>• Architectural Rationale:</span>
                                                    </div>
                                                    <p>{feedback?.explanation || quiz.explanation}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Navigation Footer Controls */}
                    <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            {prevLesson && (
                                <button
                                    onClick={() => handleSwitchLesson(prevLesson)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-2 shadow-2xs"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Previous: {prevLesson.title}
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                disabled={isCompleting}
                                onClick={handleCompleteLesson}
                                className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 ${
                                    isCurrentCompleted
                                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                }`}
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{isCurrentCompleted ? 'Completed (Next)' : 'Mark Completed & Proceed'}</span>
                            </button>

                            {nextLesson && (
                                <button
                                    onClick={() => handleSwitchLesson(nextLesson)}
                                    className="p-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
                                    title="Next lecture"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Completion Celebration Modal */}
            {showCompletionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
                    <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-2xl space-y-5">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
                            <Award className="w-8 h-8 animate-bounce" />
                        </div>

                        <h2 className="text-2xl font-black text-slate-950 tracking-tight">
                            Congratulations!
                        </h2>

                        <p className="text-sm text-slate-600">
                            You have completed all lectures and quizzes for <span className="font-bold text-slate-900">{course.title}</span>.
                        </p>

                        {certificateCode && (
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800">
                                Certificate Code: <strong>{certificateCode}</strong>
                            </div>
                        )}

                        <div className="flex flex-col gap-2 pt-2">
                            {certificateCode && (
                                <Link
                                    href={`/certificates/${certificateCode}`}
                                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 font-bold text-xs text-white transition-colors flex items-center justify-center gap-2 shadow-xs"
                                >
                                    <Award className="w-4 h-4" /> View & Print Certificate
                                </Link>
                            )}
                            <button
                                onClick={() => setShowCompletionModal(false)}
                                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 transition-colors"
                            >
                                Continue Reviewing Lessons
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
