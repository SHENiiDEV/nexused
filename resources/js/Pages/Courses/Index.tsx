import React, { useState } from 'react';
import { Course } from '../../types';
import { AppLayout } from '../../Layouts/AppLayout';
import { CheckoutModal } from '../../Components/CheckoutModal';
import { BookOpen, Clock, Filter, GraduationCap, Layers, Search, Sparkles, UserCheck } from 'lucide-react';
import { Head, Link, router } from '@inertiajs/react';

interface IndexProps {
    courses: Course[];
    filters: {
        search?: string;
        max_price?: string;
    };
    enrolledCourseIds: number[];
}

export default function Index({ courses, filters, enrolledCourseIds }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '300');
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [checkoutType, setCheckoutType] = useState<'b2c_course' | 'b2b_license'>('b2c_course');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/courses', { search, max_price: maxPrice }, { preserveState: true });
    };

    const openCheckout = (course: Course, type: 'b2c_course' | 'b2b_license') => {
        setSelectedCourse(course);
        setCheckoutType(type);
    };

    return (
        <AppLayout title="Course Catalog">
            <Head title="Course Catalog | NexusEd" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Hero Header */}
                <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-slate-800">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
                            <Sparkles className="w-3.5 h-3.5" /> AI-Curated Masterclasses
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                            Explore High-Agency Courses
                        </h1>
                        <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl">
                            Industry-grade technical curriculums automatically generated, validated, and kept fresh by the NexusEd AI Pipeline.
                        </p>
                    </div>

                    <Link
                        href="/admin/generator"
                        className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white hover:border-emerald-500 hover:bg-slate-800 transition-all shadow-md"
                    >
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>Launch AI Generator Studio</span>
                    </Link>
                </div>

                {/* Filters */}
                <form onSubmit={handleFilter} className="mb-8 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-1/2">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by topic, architecture, or technology..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                                Max Price: <span className="font-mono text-emerald-400">€{maxPrice}</span>
                            </span>
                            <input
                                type="range"
                                min="2"
                                max="300"
                                step="5"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="accent-emerald-500 w-32 cursor-pointer"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                            <Filter className="w-3.5 h-3.5" /> Filter
                        </button>
                    </div>
                </form>

                {/* Course Grid */}
                {courses.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800/80 p-8">
                        <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-white">No courses match your filter</h3>
                        <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-md mx-auto">
                            Try broadening your search term, or launch the AI Generator to instantly synthesize a brand-new course on any topic!
                        </p>
                        <Link
                            href="/admin/generator"
                            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                        >
                            Generate Course with AI
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => {
                            const isEnrolled = enrolledCourseIds.includes(course.id);
                            return (
                                <div
                                    key={course.id}
                                    className="flex flex-col bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-emerald-950/20 group"
                                >
                                    {/* Top meta */}
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="font-mono text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 px-2 py-0.5 rounded">
                                            {course.topic || 'Enterprise Tech'}
                                        </span>
                                        <span className="font-mono text-lg font-black text-white">
                                            €{Number(course.price).toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Title & description */}
                                    <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors line-clamp-2">
                                        <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                                    </h3>
                                    <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed flex-1">
                                        {course.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="my-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <Layers className="w-3.5 h-3.5 text-slate-500" />
                                            <span>{course.modules_count ?? 3} Modules</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                                            <span>{course.estimated_hours ?? 5} Hours</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 pt-2">
                                        {isEnrolled ? (
                                            <Link
                                                href={`/learn/${course.slug}`}
                                                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-semibold text-xs text-center transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950"
                                            >
                                                <GraduationCap className="w-4 h-4" /> Continue Learning
                                            </Link>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => openCheckout(course, 'b2c_course')}
                                                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-semibold text-xs text-center transition-all shadow-md shadow-emerald-950"
                                                >
                                                    Enroll (€{Number(course.price).toFixed(2)})
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => openCheckout(course, 'b2b_license')}
                                                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs text-center transition-all"
                                                    title="Purchase corporate team license"
                                                >
                                                    B2B Team
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
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
