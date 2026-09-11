import React, { useState } from 'react';
import { Course } from '../../types';
import { AppLayout } from '../../Layouts/AppLayout';
import { CheckoutModal } from '../../Components/CheckoutModal';
import { CourseCover } from '../../Components/CourseCover';
import { HeroSection } from '../../Components/HeroSection';
import {
    Award,
    BookOpen,
    Building2,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock,
    Cpu,
    Filter,
    GraduationCap,
    Layers,
    Search,
    Shield,
    SlidersHorizontal,
    Sparkles,
    Star,
    TrendingUp,
    Users,
    X,
} from 'lucide-react';
import { Head, Link, router } from '@inertiajs/react';

interface IndexProps {
    courses: Course[];
    filters: {
        search?: string;
        max_price?: string;
    };
    enrolledCourseIds: number[];
}

const CATEGORY_CARDS = [
    {
        title: 'Business English & Global Fluency',
        desc: 'Executive C1 vocabulary, negotiations, meetings & international communication',
        icon: '🌐',
        badge: 'Top Career Skill',
        searchQuery: 'English',
        tabId: 'languages',
    },
    {
        title: 'Product Design & UX Mastery',
        desc: 'Figma design systems, UX research, wireframing & usability testing',
        icon: '🎨',
        badge: 'High Demand',
        searchQuery: 'Design',
        tabId: 'design',
    },
    {
        title: 'Agile & Scrum Leadership',
        desc: 'Scrum Master, sprint delivery, Kanban & cross-functional leadership',
        icon: '⚡',
        badge: 'Leadership',
        searchQuery: 'Agile',
        tabId: 'management',
    },
    {
        title: 'Corporate Finance & Growth',
        desc: 'DCF valuation, financial models, performance & growth marketing',
        icon: '📈',
        badge: 'Business',
        searchQuery: 'Finance',
        tabId: 'business',
    },
    {
        title: 'Distributed Systems in Go',
        desc: 'Kafka, Raft consensus, microservices & low-latency concurrency',
        icon: '⚙️',
        badge: 'High Salary',
        searchQuery: 'Distributed',
        tabId: 'distributed',
    },
    {
        title: 'Production AI & Agents',
        desc: 'OpenAI API, function calling, RAG & autonomous pipelines',
        icon: '🧠',
        badge: 'Trending Now',
        searchQuery: 'AI',
        tabId: 'ai',
    },
];

const TRUSTED_LOGOS = [
    { name: 'Volkswagen', label: 'VOLKSWAGEN' },
    { name: 'Samsung', label: 'SAMSUNG' },
    { name: 'Cisco', label: 'CISCO' },
    { name: 'Vimeo', label: 'vimeo' },
    { name: 'P&G', label: 'P&G' },
    { name: 'Citi', label: 'citi' },
    { name: 'Ericsson', label: 'ERICSSON' },
];

const TESTIMONIALS = [
    {
        quote: 'NexusEd cut our team onboarding time by 60%. The interactive quizzes and deep architectural code snippets give our developers practical confidence without fluff.',
        author: 'Elena Rostova',
        role: 'VP of Engineering, Acme Tech Group',
    },
    {
        quote: 'The course player is fast, distraction-free, and the Markdown code examples are immediately usable in our production Go microservices.',
        author: 'Markus Weber',
        role: 'Lead Cloud Infrastructure Architect',
    },
    {
        quote: 'Having automated Peppol BIS 3.0 UBL 2.1 electronic invoices directly generated for our EU tax department made corporate approval seamless.',
        author: 'Sophie Laurent',
        role: 'Director of Talent Development',
    },
    {
        quote: 'The AI Course Synthesizer generated an entire 3-module curriculum on Raft consensus in minutes. It completely transformed our internal tech documentation.',
        author: 'David K.',
        role: 'Senior Staff Engineer',
    },
];

export default function Index({ courses, filters, enrolledCourseIds }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeTab, setActiveTab] = useState<string>('all');
    const [levelFilter, setLevelFilter] = useState<'all' | 'starter' | 'intermediate' | 'advanced'>('all');
    const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'price_asc' | 'price_desc' | 'hours'>('featured');
    const [catalogSearch, setCatalogSearch] = useState('');
    const [visibleCount, setVisibleCount] = useState<number>(6);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [checkoutType, setCheckoutType] = useState<'b2c_course' | 'b2b_license'>('b2c_course');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/courses', { search }, { preserveState: true });
    };

    const openCheckout = (course: Course, type: 'b2c_course' | 'b2b_license') => {
        setSelectedCourse(course);
        setCheckoutType(type);
    };

    const selectCategoryTab = (tabId: string) => {
        setActiveTab(tabId);
        setVisibleCount(6);
        const catalogEl = document.getElementById('catalog');
        if (catalogEl) {
            catalogEl.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Level detection helper
    const getCourseLevel = (c: Course): 'starter' | 'intermediate' | 'advanced' => {
        const text = `${c.title || ''} ${c.topic || ''} ${c.description || ''}`.toLowerCase();
        if (
            text.includes('a1') ||
            text.includes('a2') ||
            text.includes('starter') ||
            text.includes('beginner') ||
            text.includes('fundamentals') ||
            text.includes('101') ||
            text.includes('syntax') ||
            text.includes('basics') ||
            text.includes('foundations')
        ) {
            return 'starter';
        }
        if (
            text.includes('c1') ||
            text.includes('c2') ||
            text.includes('advanced') ||
            text.includes('executive') ||
            text.includes('resiliency') ||
            text.includes('zero-trust') ||
            text.includes('lbo') ||
            text.includes('distributed systems') ||
            text.includes('llmops') ||
            text.includes('leadership') ||
            text.includes('mastery')
        ) {
            return 'advanced';
        }
        return 'intermediate';
    };

    // Category matching helper
    const matchCategory = (c: Course, catId: string) => {
        if (catId === 'all') return true;
        const lowerTitle = (c.title || '').toLowerCase();
        const lowerTopic = (c.topic || '').toLowerCase();
        const lowerDesc = (c.description || '').toLowerCase();
        const text = `${lowerTitle} ${lowerTopic} ${lowerDesc}`;

        if (catId === 'languages') {
            return text.includes('english') || text.includes('german') || text.includes('spanish') || text.includes('speaking') || text.includes('language') || text.includes('writing') || text.includes('negotiation');
        }
        if (catId === 'design') {
            return text.includes('design') || text.includes('figma') || text.includes('ux') || text.includes('ui') || text.includes('typography') || text.includes('animation');
        }
        if (catId === 'management') {
            return text.includes('agile') || text.includes('scrum') || text.includes('kanban') || text.includes('management') || text.includes('leadership') || text.includes('okr') || text.includes('prd');
        }
        if (catId === 'business') {
            return text.includes('finance') || text.includes('valuation') || text.includes('marketing') || text.includes('growth') || text.includes('saas') || text.includes('fundraising') || text.includes('sales') || text.includes('peppol') || text.includes('accounting');
        }
        if (catId === 'distributed') {
            return text.includes('distributed') || text.includes('go') || text.includes('golang') || text.includes('rust') || text.includes('kafka') || text.includes('postgres') || text.includes('backend') || text.includes('laravel');
        }
        if (catId === 'ai') {
            return text.includes('ai') || text.includes('agent') || text.includes('llm') || text.includes('openai') || text.includes('neural') || text.includes('deep learning') || text.includes('python') || text.includes('vector');
        }
        if (catId === 'cloud') {
            return text.includes('cloud') || text.includes('kubernetes') || text.includes('k8s') || text.includes('docker') || text.includes('terraform') || text.includes('linux') || text.includes('security') || text.includes('zero-trust') || text.includes('cicd');
        }
        return true;
    };

    // Filter by category, level, and instant search query
    const filteredCourses = courses.filter((c) => {
        if (!matchCategory(c, activeTab)) return false;

        if (levelFilter !== 'all') {
            const lvl = getCourseLevel(c);
            if (lvl !== levelFilter) return false;
        }

        if (catalogSearch.trim() !== '') {
            const q = catalogSearch.toLowerCase().trim();
            const text = `${c.title || ''} ${c.topic || ''} ${c.description || ''}`.toLowerCase();
            if (!text.includes(q)) return false;
        }

        return true;
    }).sort((a, b) => {
        if (sortBy === 'price_asc') {
            return (Number(a.price) || 0) - (Number(b.price) || 0);
        }
        if (sortBy === 'price_desc') {
            return (Number(b.price) || 0) - (Number(a.price) || 0);
        }
        if (sortBy === 'hours') {
            return (a.estimated_hours || 10) - (b.estimated_hours || 10);
        }
        return 0;
    });

    const displayedCourses = filteredCourses.slice(0, visibleCount);

    const hasActiveFilters = activeTab !== 'all' || levelFilter !== 'all' || sortBy !== 'featured' || catalogSearch.trim() !== '';

    const resetFilters = () => {
        setActiveTab('all');
        setLevelFilter('all');
        setSortBy('featured');
        setCatalogSearch('');
        setVisibleCount(6);
    };

    return (
        <AppLayout title="Online Courses & Certifications">
            <Head title="NexusEd — Leading Learning Platform for Business, Design & Engineering" />

            {/* 1. High-Agency Magic UI Hero Section */}
            <HeroSection
                totalCourses={courses.length}
                onSelectCategory={(categoryId) => selectCategoryTab(categoryId)}
            />

            {/* 2. Featured Category Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
                        Learn essential career, business & tech skills
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        High-demand domains curated for international professionals, leaders, designers, and engineers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {CATEGORY_CARDS.map((cat, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => selectCategoryTab(cat.tabId)}
                            className="text-left p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl">{cat.icon}</span>
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                                        {cat.badge}
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                    {cat.title}
                                </h3>
                                <p className="text-xs text-slate-600 leading-relaxed">{cat.desc}</p>
                            </div>
                            <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-700 flex items-center justify-between">
                                <span>Explore Track Courses</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. Main Course Showcase with Tabs ("Trending Courses") */}
            <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-950 tracking-tight">
                        Trending Courses & Masterclasses
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Curriculums with verified code, instant comprehension quizzes, and lifetime access.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                    {[
                        { id: 'all', label: 'All Tracks' },
                        { id: 'languages', label: 'Languages & English' },
                        { id: 'design', label: 'Design & UX' },
                        { id: 'management', label: 'Agile & Leadership' },
                        { id: 'business', label: 'Finance & Growth' },
                        { id: 'distributed', label: 'Distributed & Go' },
                        { id: 'ai', label: 'AI & Machine Learning' },
                        { id: 'cloud', label: 'Cloud & Security' },
                    ].map((tab) => {
                        const count = courses.filter((c) => matchCategory(c, tab.id)).length;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setVisibleCount(6);
                                }}
                                className={`px-4 py-2 text-xs font-bold rounded-full transition-colors flex items-center gap-1.5 cursor-pointer ${
                                    activeTab === tab.id
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span
                                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                                        activeTab === tab.id
                                            ? 'bg-slate-800 text-slate-300'
                                            : 'bg-slate-200 text-slate-600'
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Sub-Filters & Real-time Search Toolbar */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        {/* Instant Search input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                value={catalogSearch}
                                onChange={(e) => {
                                    setCatalogSearch(e.target.value);
                                    setVisibleCount(6);
                                }}
                                placeholder="Filter courses by name, topic, or keyword..."
                                className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-xs"
                            />
                            {catalogSearch && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCatalogSearch('');
                                        setVisibleCount(6);
                                    }}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Level filter pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono mr-1 shrink-0">
                                Level:
                            </span>
                            {[
                                { id: 'all', label: 'All' },
                                { id: 'starter', label: 'Starter / A1' },
                                { id: 'intermediate', label: 'Intermediate' },
                                { id: 'advanced', label: 'Advanced & Lead' },
                            ].map((lvl) => (
                                <button
                                    key={lvl.id}
                                    type="button"
                                    onClick={() => {
                                        setLevelFilter(lvl.id as any);
                                        setVisibleCount(6);
                                    }}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
                                        levelFilter === lvl.id
                                            ? 'bg-emerald-600 text-white shadow-xs'
                                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                    }`}
                                >
                                    {lvl.label}
                                </button>
                            ))}
                        </div>

                        {/* Sort selector */}
                        <div className="flex items-center gap-2 shrink-0">
                            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value as any);
                                    setVisibleCount(6);
                                }}
                                className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs"
                            >
                                <option value="featured">Sort: Curated / Featured</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="hours">Duration: Shortest</option>
                            </select>
                        </div>
                    </div>

                    {/* Counter & Clear Active Filters */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/80 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                            <span>
                                Showing <strong className="text-slate-900 font-mono">{displayedCourses.length}</strong> of{' '}
                                <strong className="text-slate-900 font-mono">{filteredCourses.length}</strong> matching courses
                                {filteredCourses.length !== courses.length && (
                                    <span className="text-slate-500 font-normal"> (filtered from {courses.length} total)</span>
                                )}
                            </span>
                        </div>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline flex items-center gap-1 cursor-pointer"
                            >
                                <span>Reset filters</span>
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Course Cards Grid (Udemy Marketplace Layout) */}
                {filteredCourses.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                        <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                        <h3 className="text-base font-bold text-slate-800">No courses match your filter criteria</h3>
                        <p className="text-xs text-slate-500 mt-1">Try clearing search terms or resetting filters.</p>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                            >
                                Reset All Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayedCourses.map((course, idx) => {
                                const isEnrolled = enrolledCourseIds.includes(course.id);
                                const priceNum = Number(course.price) || 49.0;
                                const originalPrice = Math.round(priceNum * 2.8);
                                const courseLevel = getCourseLevel(course);
                                const levelBadgeText =
                                    courseLevel === 'starter'
                                        ? 'Starter'
                                        : courseLevel === 'advanced'
                                        ? 'Advanced'
                                        : 'Intermediate';
                                const levelBadgeStyle =
                                    courseLevel === 'starter'
                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                        : courseLevel === 'advanced'
                                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                                        : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                                return (
                                    <div
                                        key={course.id}
                                        className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all flex flex-col overflow-hidden group"
                                    >
                                        {/* Card Thumbnail Header */}
                                        <CourseCover
                                            course={course}
                                            badge={idx === 0 ? 'Bestseller' : idx % 3 === 0 ? 'Trending' : 'Masterclass'}
                                        />

                                        {/* Card Body */}
                                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                            <div>
                                                <div className="mb-2 flex items-center gap-1.5 flex-wrap">
                                                    {course.topic && (
                                                        <span className="inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                                                            {course.topic}
                                                        </span>
                                                    )}
                                                    <span className={`inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border font-mono ${levelBadgeStyle}`}>
                                                        {levelBadgeText}
                                                    </span>
                                                </div>

                                                <h3 className="font-bold text-base text-slate-950 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                                                    <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                                                </h3>

                                                <p className="text-xs text-slate-600 mt-1">
                                                    NexusEd Academy Architects
                                                </p>

                                                {/* Ratings and reviews (Udemy pattern) */}
                                                <div className="flex items-center gap-1.5 mt-2">
                                                    <span className="font-bold text-xs text-amber-700 font-mono">4.9</span>
                                                    <div className="flex items-center text-amber-500">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className="w-3 h-3 fill-current" />
                                                        ))}
                                                    </div>
                                                    <span className="text-[11px] text-slate-600 font-mono">
                                                        ({1240 + course.id * 142})
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3 text-xs text-slate-600 mt-2">
                                                    <span>{course.estimated_hours || 6} total hours</span>
                                                    <span>•</span>
                                                    <span>{course.modules_count ?? 3} modules</span>
                                                </div>
                                            </div>

                                            {/* Price and Actions */}
                                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-lg font-bold text-slate-950 font-mono">
                                                        €{priceNum.toFixed(2)}
                                                    </span>
                                                    <span className="text-xs text-slate-600 line-through font-mono">
                                                        €{originalPrice}.00
                                                    </span>
                                                </div>

                                                {isEnrolled ? (
                                                    <Link
                                                        href={`/learn/${course.slug}`}
                                                        className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                                                    >
                                                        Continue
                                                    </Link>
                                                ) : (
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => openCheckout(course, 'b2c_course')}
                                                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                                                        >
                                                            Enroll
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => openCheckout(course, 'b2b_license')}
                                                            className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                                                            title="Corporate team license"
                                                        >
                                                            B2B
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination / Expand Catalog Controls */}
                        <div className="pt-6 pb-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                            {filteredCourses.length > visibleCount && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setVisibleCount((prev) => prev + 6)}
                                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <span>Show More (+6 Courses)</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setVisibleCount(filteredCourses.length)}
                                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <span>View All ({filteredCourses.length} Courses)</span>
                                    </button>
                                </>
                            )}
                            {visibleCount > 6 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setVisibleCount(6);
                                        document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>Collapse to Top 6</span>
                                    <ChevronLeft className="w-3.5 h-3.5 rotate-90" />
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* 4. NexusEd Business Corporate Banner (Matching Screenshot 1) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="rounded-2xl bg-slate-950 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800 shadow-xl">
                    <div className="space-y-4 max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-950 text-teal-400 border border-teal-800/60 font-mono">
                            <Building2 className="w-3.5 h-3.5" /> NexusEd Business for Teams
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                            Upskill your engineering department with corporate licenses
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            Unlimited team access up to €2000, real-time employee progress matrix, quiz scoring analytics, and European Peppol BIS 3.0 / UBL 2.1 compliant e-invoicing.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Link
                                href="/corporate/dashboard"
                                className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                            >
                                Corporate Portal
                            </Link>
                            <Link
                                href="/register"
                                className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-colors cursor-pointer"
                            >
                                Register Enterprise Team
                            </Link>
                        </div>
                    </div>

                    <div className="w-full md:w-80 bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-3 text-xs text-slate-300">
                        <div className="font-bold text-white flex items-center justify-between">
                            <span>Acme Global Tech License</span>
                            <span className="text-emerald-400 font-mono">ACTIVE</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800">
                            <span>Allocated Seats:</span>
                            <span className="font-mono font-bold text-white">20 Seats</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800">
                            <span>EU E-Invoice Standard:</span>
                            <span className="font-mono text-emerald-400">Peppol UBL 2.1</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span>Security Invariant:</span>
                            <span className="font-mono text-slate-400">HMAC-SHA256</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Trusted Companies Logos (Udemy Style Clean Strip) */}
            <div className="border-y border-slate-200 bg-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Trusted by over 16,000 companies and leading engineering teams worldwide
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75">
                        {TRUSTED_LOGOS.map((logo, idx) => (
                            <span key={idx} className="font-black text-sm sm:text-base text-slate-500 tracking-wider">
                                {logo.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* 6. Testimonials Section (Matching Screenshot 1) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
                        How learners like you are achieving their goals
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Verified student reviews and engineering leadership feedback.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TESTIMONIALS.map((t, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-4 shadow-xs">
                            <p className="text-xs text-slate-700 leading-relaxed italic">
                                &ldquo;{t.quote}&rdquo;
                            </p>
                            <div className="pt-3 border-t border-slate-100">
                                <div className="text-xs font-bold text-slate-900">{t.author}</div>
                                <div className="text-[11px] text-slate-500">{t.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
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
