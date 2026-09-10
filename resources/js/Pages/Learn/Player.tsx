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
    // SPA state: instant lecture switching without reload
    const [activeLesson, setActiveLesson] = useState<Lesson>(initialLesson);
    const [completedIds, setCompletedIds] = useState<number[]>(initialCompletedIds);
    const [attempts, setAttempts] = useState<Record<number, { is_correct: boolean; quiz_option_id: number }>>(
        initialQuizAttempts || {}
    );
    const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
    const [quizFeedbacks, setQuizFeedbacks] = useState<Record<number, { is_correct: boolean; explanation: string; correct_option_id: number }>>({});
    const [isCompleting, setIsCompleting] = useState<boolean>(false);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    // Completion modal
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

    // Instant switch to another lesson inside SPA
    const handleSwitchLesson = (lesson: Lesson) => {
        setActiveLesson(lesson);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSidebarOpen(false);
    };

    // Mark current lesson as complete
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
                    // Confetti explosion!
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

    // Submit quiz option
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

            <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
                {/* Mobile sidebar toggle bar */}
                <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-300"
                    >
                        <Menu className="w-4 h-4 text-emerald-400" />
                        <span>Curriculum ({completedCount}/{totalCount})</span>
                    </button>
                    <span className="font-mono text-xs text-emerald-400 font-bold">{progressPercent}%</span>
                </div>

                {/* Left Sidebar: Sticky Modules & Lessons Navigation */}
                <aside
                    className={`w-full md:w-80 lg:w-96 bg-slate-900 border-r border-slate-800 shrink-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] flex flex-col z-30 transition-all ${
                        sidebarOpen ? 'block' : 'hidden md:flex'
                    }`}
                >
                    {/* Course Overview in Sidebar */}
                    <div className="p-5 border-b border-slate-800">
                        <Link
                            href={`/courses/${course.slug}`}
                            className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 mb-2 font-medium"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" /> Back to Course Overview
                        </Link>
                        <h2 className="text-base font-bold text-white tracking-tight line-clamp-2">{course.title}</h2>

                        {/* Progress Bar */}
                        <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1 font-medium">
                                <span className="text-slate-400">Course Progress</span>
                                <span className="text-emerald-400 font-mono font-bold">{progressPercent}%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Modules and Lessons list */}
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 p-3 space-y-4">
                        {course.modules?.map((module, modIdx) => (
                            <div key={module.id} className="pt-2">
                                <div className="px-2 mb-2 text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
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
                                                        ? 'bg-emerald-950/60 border border-emerald-800 text-white font-semibold'
                                                        : 'text-slate-300 hover:bg-slate-800/60'
                                                }`}
                                            >
                                                {isDone ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                                ) : (
                                                    <PlayCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="truncate">{lesson.title}</div>
                                                    <div className="text-[10px] text-slate-500 font-mono mt-0.5 flex items-center gap-2">
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

                {/* Main Content Area: Instant Markdown Lecture & Quizzes */}
                <main className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto w-full space-y-10">
                    {/* Lecture Header */}
                    <div className="pb-6 border-b border-slate-800">
                        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold mb-2">
                            <span>{activeLesson.module_id ? 'Current Lesson' : ''}</span>
                            <span>•</span>
                            <span className="capitalize">{activeLesson.type} Lecture</span>
                            <span>•</span>
                            <span>{activeLesson.duration_minutes} Minutes</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                            {activeLesson.title}
                        </h1>
                    </div>

                    {/* Markdown Renderer with Syntax Highlighting */}
                    <article className="min-h-[300px]">
                        <MarkdownRenderer content={activeLesson.content} />
                    </article>

                    {/* Interactive Quizzes Section */}
                    {activeLesson.quizzes && activeLesson.quizzes.length > 0 && (
                        <section className="pt-8 border-t border-slate-800 space-y-6">
                            <div className="flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-emerald-400" />
                                <h2 className="text-xl font-bold text-white tracking-tight">
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
                                            className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                                                    Q{qIdx + 1}
                                                </span>
                                                <h3 className="text-sm sm:text-base font-semibold text-slate-100">
                                                    {quiz.question_text}
                                                </h3>
                                            </div>

                                            {/* Quiz Options */}
                                            <div className="space-y-2">
                                                {quiz.options?.map((opt) => {
                                                    const isSelected = selectedOptions[quiz.id] === opt.id || previousAttempt?.quiz_option_id === opt.id;
                                                    const isCorrectOption = feedback?.correct_option_id === opt.id || (isAnswered && opt.is_correct);

                                                    let optionStyle = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700';

                                                    if (isAnswered) {
                                                        if (isCorrectOption) {
                                                            optionStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-semibold ring-1 ring-emerald-500';
                                                        } else if (isSelected && !isCorrect) {
                                                            optionStyle = 'border-rose-500 bg-rose-950/40 text-rose-200 ring-1 ring-rose-500';
                                                        }
                                                    } else if (isSelected) {
                                                        optionStyle = 'border-emerald-500 bg-emerald-950/30 text-white ring-1 ring-emerald-500';
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
                                                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                                            )}
                                                            {isAnswered && isSelected && !isCorrect && (
                                                                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Submit Quiz Answer */}
                                            {!isAnswered && (
                                                <button
                                                    type="button"
                                                    disabled={!selectedOptions[quiz.id]}
                                                    onClick={() => handleQuizSubmit(quiz)}
                                                    className="py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs disabled:opacity-50 transition-colors"
                                                >
                                                    Submit Answer
                                                </button>
                                            )}

                                            {/* Explanation feedback */}
                                            {isAnswered && (
                                                <div
                                                    className={`p-4 rounded-xl text-xs leading-relaxed ${
                                                        isCorrect
                                                            ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-200'
                                                            : 'bg-slate-950 border border-slate-800 text-slate-300'
                                                    }`}
                                                >
                                                    <div className="font-bold flex items-center gap-1.5 mb-1 text-white">
                                                        {isCorrect ? (
                                                            <span className="text-emerald-400">Correct!</span>
                                                        ) : (
                                                            <span className="text-rose-400">Incorrect</span>
                                                        )}
                                                        <span>• Architectural Explanation:</span>
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
                    <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            {prevLesson && (
                                <button
                                    onClick={() => handleSwitchLesson(prevLesson)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-2"
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
                                className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 ${
                                    isCurrentCompleted
                                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
                                }`}
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{isCurrentCompleted ? 'Completed (Next)' : 'Mark Completed & Proceed'}</span>
                            </button>

                            {nextLesson && (
                                <button
                                    onClick={() => handleSwitchLesson(nextLesson)}
                                    className="p-3 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
                                    title="Next lecture"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Course Completion Celebration Modal */}
            {showCompletionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
                    <div className="relative w-full max-w-md bg-slate-900 border border-emerald-500/50 rounded-2xl p-8 text-center shadow-2xl space-y-5">
                        <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-950">
                            <Award className="w-8 h-8 animate-bounce" />
                        </div>

                        <h2 className="text-2xl font-black text-white tracking-tight">
                            Congratulations!
                        </h2>

                        <p className="text-sm text-slate-300">
                            You have successfully completed all lectures and quizzes for <span className="font-bold text-white">{course.title}</span>.
                        </p>

                        {certificateCode && (
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400">
                                Certificate Code: <strong>{certificateCode}</strong>
                            </div>
                        )}

                        <div className="flex flex-col gap-2 pt-2">
                            {certificateCode && (
                                <Link
                                    href={`/certificates/${certificateCode}`}
                                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white transition-colors flex items-center justify-center gap-2"
                                >
                                    <Award className="w-4 h-4" /> View & Print Certificate
                                </Link>
                            )}
                            <button
                                onClick={() => setShowCompletionModal(false)}
                                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
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
