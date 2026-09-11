import React, { useState } from 'react';
import { AppLayout } from '../../Layouts/AppLayout';
import { CourseCover } from '../../Components/CourseCover';
import {
    Award,
    BookOpen,
    CheckCircle2,
    ChevronRight,
    CirclePlay,
    Clock,
    Compass,
    Copy,
    Flame,
    GraduationCap,
    Lock,
    Shield,
    ShieldCheck,
    Sparkles,
    Target,
    Trophy,
    User,
    Zap,
} from 'lucide-react';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '../../types';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    xp_reward: number;
    unlocked: boolean;
    progress: string;
}

interface GamificationStats {
    total_xp: number;
    level: number;
    rank_title: string;
    min_xp: number;
    next_level_xp: number;
    progress_percent: number;
    xp_remaining: number;
    streak_days: number;
    completed_lessons: number;
    correct_quizzes: number;
    quiz_accuracy_percent: number;
    completed_courses: number;
    enrolled_courses: number;
    achievements: Achievement[];
}

interface CourseInProgress {
    enrollment_id: number;
    course_id: number;
    title: string;
    slug: string;
    category: string;
    level: string;
    duration_hours: number;
    thumbnail_url?: string | null;
    total_lessons: number;
    completed_lessons: number;
    progress_percent: number;
    next_lesson_slug?: string | null;
    next_lesson_title: string;
    enrolled_at: string;
    is_completed: boolean;
    completed_at?: string | null;
    certificate_code?: string | null;
}

interface RecommendedCourse {
    id: number;
    title: string;
    slug: string;
    category: string;
    level: string;
    duration_hours: number;
    price: number;
    thumbnail_url?: string | null;
}

interface StudentDashboardProps {
    gamification: GamificationStats;
    coursesInProgress: CourseInProgress[];
    completedCertificates: CourseInProgress[];
    recommendedCourses: RecommendedCourse[];
}

const CAREER_TIERS = [
    { level: 1, title: 'Novice Scholar', min_xp: 0 },
    { level: 2, title: 'Junior Engineer', min_xp: 500 },
    { level: 3, title: 'Systems Architect', min_xp: 1200 },
    { level: 4, title: 'Senior Cloud Vanguard', min_xp: 2500 },
    { level: 5, title: 'Staff AI Specialist', min_xp: 5000 },
    { level: 6, title: 'Distinguished Fellow', min_xp: 9000 },
];

export default function StudentDashboard({
    gamification,
    coursesInProgress,
    completedCertificates,
    recommendedCourses,
}: StudentDashboardProps) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const handleCopyCert = (code: string) => {
        navigator.clipboard.writeText(`${window.location.origin}/certificates/${code}`);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2500);
    };

    const renderAchievementIcon = (iconName: string) => {
        switch (iconName) {
            case 'Sparkles':
                return <Sparkles className="w-5 h-5" />;
            case 'BookOpen':
                return <BookOpen className="w-5 h-5" />;
            case 'Target':
                return <Target className="w-5 h-5" />;
            case 'Award':
                return <Award className="w-5 h-5" />;
            case 'Flame':
                return <Flame className="w-5 h-5" />;
            case 'ShieldCheck':
                return <ShieldCheck className="w-5 h-5" />;
            default:
                return <Trophy className="w-5 h-5" />;
        }
    };

    return (
        <AppLayout title="Student Learning Hub">
            <Head title="My Learning Dashboard & Career Progression | NexusEd" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
                
                {/* 1. Hero Level & XP Progression Card */}
                <div className="rounded-3xl bg-slate-950 text-white p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-slate-800">
                    {/* Subtle grid backdrop pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        {/* User Identity & Current Rank */}
                        <div className="space-y-4 max-w-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xl flex items-center justify-center shadow-lg border border-emerald-400/30">
                                    {user?.name
                                        ? user.name
                                              .split(' ')
                                              .map((n) => n[0])
                                              .join('')
                                              .toUpperCase()
                                              .slice(0, 2)
                                        : 'NX'}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                                            {user?.name || 'Fellow Engineer'}
                                        </h1>
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                                            Level {gamification.level}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5 flex items-center gap-1.5">
                                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                                        <span>Rank: </span>
                                        <span className="text-slate-200 font-bold">{gamification.rank_title}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Level XP Progress Bar */}
                            <div className="space-y-2 pt-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 font-medium flex items-center gap-1">
                                        <Zap className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>Level Progress</span>
                                    </span>
                                    <span className="font-mono text-emerald-400 font-bold">
                                        {gamification.total_xp.toLocaleString()} / {gamification.next_level_xp.toLocaleString()} XP ({gamification.progress_percent}%)
                                    </span>
                                </div>
                                <div className="w-full h-3.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700 shadow-sm"
                                        style={{ width: `${Math.max(4, gamification.progress_percent)}%` }}
                                    />
                                </div>
                                <p className="text-[11px] text-slate-400">
                                    {gamification.xp_remaining > 0 ? (
                                        <>
                                            <span className="font-mono text-slate-300 font-semibold">{gamification.xp_remaining.toLocaleString()} XP</span> remaining to unlock next rank.
                                        </>
                                    ) : (
                                        <span className="text-emerald-400 font-semibold">Maximum platform rank achieved! Outstanding mastery.</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Fast Metrics Matrix */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
                            {/* Streak */}
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-center space-y-1">
                                <div className="inline-flex p-2 rounded-xl bg-amber-500/10 text-amber-400">
                                    <Flame className="w-5 h-5" />
                                </div>
                                <div className="text-xl font-extrabold font-mono text-white">
                                    {gamification.streak_days}d
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium">Daily Streak</div>
                            </div>

                            {/* Completed Lessons */}
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-center space-y-1">
                                <div className="inline-flex p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div className="text-xl font-extrabold font-mono text-white">
                                    {gamification.completed_lessons}
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium">Lectures Cleared</div>
                            </div>

                            {/* Quiz Accuracy */}
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-center space-y-1">
                                <div className="inline-flex p-2 rounded-xl bg-sky-500/10 text-sky-400">
                                    <Target className="w-5 h-5" />
                                </div>
                                <div className="text-xl font-extrabold font-mono text-white">
                                    {gamification.quiz_accuracy_percent}%
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium">Quiz Accuracy</div>
                            </div>

                            {/* Diplomas */}
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-center space-y-1">
                                <div className="inline-flex p-2 rounded-xl bg-purple-500/10 text-purple-400">
                                    <Award className="w-5 h-5" />
                                </div>
                                <div className="text-xl font-extrabold font-mono text-white">
                                    {gamification.completed_courses}
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium">Certificates</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Career Progression Ladder (Tiers 1 to 6) */}
                <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-emerald-600" />
                            <h2 className="text-lg font-bold text-slate-950 tracking-tight">
                                Engineering Career &amp; Mastery Ladder
                            </h2>
                        </div>
                        <span className="text-xs text-slate-500">
                            Milestones calculate continuously based on completed modules and quiz accuracy
                        </span>
                    </div>

                    {/* Step Ladder */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {CAREER_TIERS.map((tier) => {
                            const isCurrent = gamification.level === tier.level;
                            const isCompleted = gamification.level > tier.level;

                            return (
                                <div
                                    key={tier.level}
                                    className={`p-4 rounded-2xl border transition-all text-center relative ${
                                        isCurrent
                                            ? 'bg-emerald-50/50 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                                            : isCompleted
                                            ? 'bg-slate-50/80 border-slate-200 text-slate-800'
                                            : 'bg-white border-slate-200/60 opacity-60'
                                    }`}
                                >
                                    {isCurrent && (
                                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider">
                                            Current
                                        </span>
                                    )}

                                    <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                                        Tier 0{tier.level}
                                    </div>
                                    <div className="text-xs font-black text-slate-900 mt-1 mb-1">
                                        {tier.title}
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-500">
                                        {tier.min_xp.toLocaleString()} XP
                                    </div>

                                    <div className="mt-3 flex justify-center">
                                        {isCompleted ? (
                                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            </div>
                                        ) : isCurrent ? (
                                            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center animate-pulse">
                                                <Zap className="w-3 h-3" />
                                            </div>
                                        ) : (
                                            <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                                                <Lock className="w-3 h-3" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 3. In-Progress Courses & Quick Resume */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-emerald-600" />
                            <h2 className="text-xl font-black text-slate-950 tracking-tight">
                                Active Curriculum &amp; Courses
                            </h2>
                        </div>
                        <Link
                            href="/courses"
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                        >
                            <span>Browse Catalog</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {coursesInProgress.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center bg-slate-50/50 space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto shadow-xs">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-slate-900">No active course enrollments</h3>
                                <p className="text-xs text-slate-500 max-w-md mx-auto">
                                    You have not enrolled in any curriculum yet. Select from our industry-accredited courses to begin leveling up your engineering rank.
                                </p>
                            </div>
                            <Link
                                href="/courses"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
                            >
                                <Compass className="w-4 h-4" />
                                <span>Explore Marketplace</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {coursesInProgress.map((course) => (
                                <div
                                    key={course.enrollment_id}
                                    className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                                >
                                    {/* Thumbnail Cover */}
                                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900">
                                        <CourseCover
                                            course={course as any}
                                            title={course.title}
                                            category={course.category}
                                            slug={course.slug}
                                            thumbnailUrl={course.thumbnail_url}
                                            level={course.level}
                                            className="w-full h-full object-cover"
                                        />
                                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-mono font-bold uppercase">
                                            {course.category}
                                        </span>
                                    </div>

                                    {/* Title & Metadata */}
                                    <div className="space-y-2">
                                        <h3 className="text-base font-bold text-slate-950 line-clamp-1">
                                            {course.title}
                                        </h3>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{course.duration_hours}h total</span>
                                            </span>
                                            <span>•</span>
                                            <span className="capitalize">{course.level}</span>
                                        </div>
                                    </div>

                                    {/* Progress Metric */}
                                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-600 font-semibold">
                                                {course.completed_lessons} of {course.total_lessons} Lectures
                                            </span>
                                            <span className="font-mono text-emerald-700 font-bold">
                                                {course.progress_percent}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-600 rounded-full transition-all"
                                                style={{ width: `${course.progress_percent}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Action Button: Resume Learning */}
                                    <Link
                                        href={
                                            course.next_lesson_slug
                                                ? `/learn/${course.slug}/${course.next_lesson_slug}`
                                                : `/learn/${course.slug}`
                                        }
                                        className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer group"
                                    >
                                        <CirclePlay className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                                        <span>Resume: {course.next_lesson_title.slice(0, 26)}...</span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 4. Achievements & Unlockable Badges Showcase */}
                <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            <h2 className="text-lg font-bold text-slate-950 tracking-tight">
                                Unlockable Badges &amp; Milestone Trophies
                            </h2>
                        </div>
                        <span className="text-xs font-mono text-slate-500">
                            {gamification.achievements.filter((a) => a.unlocked).length} of {gamification.achievements.length} Unlocked
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {gamification.achievements.map((badge) => (
                            <div
                                key={badge.id}
                                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                                    badge.unlocked
                                        ? 'bg-slate-50/70 border-slate-200/90 shadow-xs'
                                        : 'bg-white border-slate-200/50 opacity-50'
                                }`}
                            >
                                <div
                                    className={`p-2.5 rounded-xl shrink-0 ${
                                        badge.unlocked
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-slate-100 text-slate-400'
                                    }`}
                                >
                                    {renderAchievementIcon(badge.icon)}
                                </div>

                                <div className="space-y-1 min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-1">
                                        <h4 className="text-xs font-bold text-slate-900 truncate">
                                            {badge.title}
                                        </h4>
                                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                                            +{badge.xp_reward} XP
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-normal">
                                        {badge.description}
                                    </p>
                                    <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400">
                                        <span>Status:</span>
                                        <span className={badge.unlocked ? 'text-emerald-700 font-bold' : ''}>
                                            {badge.progress}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Verified Cryptographic Certificates Locker */}
                {completedCertificates.length > 0 && (
                    <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-2">
                                <Award className="w-5 h-5 text-emerald-600" />
                                <h2 className="text-lg font-bold text-slate-950 tracking-tight">
                                    Verified Cryptographic Diplomas
                                </h2>
                            </div>
                            <span className="text-xs text-slate-500">Tamper-Proof Ledger</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {completedCertificates.map((cert) => (
                                <div
                                    key={cert.enrollment_id}
                                    className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 space-y-4 shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                                                Accredited Certificate
                                            </span>
                                            <h3 className="text-base font-bold text-white mt-0.5">
                                                {cert.title}
                                            </h3>
                                        </div>
                                        <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                                    </div>

                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                                        <div>
                                            <div className="text-[10px] text-slate-400">Verification Ledger Code</div>
                                            <div className="font-mono font-bold text-emerald-400">
                                                {cert.certificate_code}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleCopyCert(cert.certificate_code!)}
                                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                                            title="Copy verification link"
                                        >
                                            {copiedCode === cert.certificate_code ? (
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-[11px] text-slate-400">
                                            Completed: {cert.completed_at}
                                        </span>
                                        <a
                                            href={`/certificates/${cert.certificate_code}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                                        >
                                            View Certificate
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 6. Recommended Next Courses */}
                {recommendedCourses.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-950">
                                Recommended Next Tracks for Your Rank
                            </h3>
                            <Link href="/courses" className="text-xs font-semibold text-emerald-700 hover:underline">
                                View all {recommendedCourses.length + 3} courses
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {recommendedCourses.map((rc) => (
                                <Link
                                    key={rc.id}
                                    href={`/courses/${rc.slug}`}
                                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all group flex flex-col justify-between space-y-3"
                                >
                                    <div className="space-y-1.5">
                                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                            {rc.category}
                                        </span>
                                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                                            {rc.title}
                                        </h4>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                                        <span className="text-slate-500 capitalize">{rc.level}</span>
                                        <span className="font-extrabold text-slate-950">€{rc.price}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </AppLayout>
    );
}
