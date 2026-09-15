import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps, User } from '../types';
import { MegaMenu } from '../Components/MegaMenu';
import {
    Award,
    BookOpen,
    Building2,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Compass,
    Cpu,
    DollarSign,
    Globe,
    GraduationCap,
    Home,
    Info,
    LogOut,
    Menu,
    Search,
    Shield,
    Sparkles,
    UserCheck,
    UserCircle,
    X,
} from 'lucide-react';

interface AppLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
    const { auth, flash, company } = usePage<PageProps>().props;
    const user: User | null = auth.user;

    const [megaMenuOpen, setMegaMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';

    const handleGlobalSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/courses?search=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    const userInitials = user?.name
        ? user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : 'U';

    return (
        <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
            {/* Top Navigation Bar (Udemy Style Clean White) */}
            <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-2xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3 sm:gap-4">
                    {/* Left: Brand + Explore Mega Menu Trigger */}
                    <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                        <Link href="/courses" className="flex items-center gap-2 group">
                            <img
                                src="/favicon.svg"
                                alt="NexusEd"
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shadow-xs group-hover:scale-105 transition-transform"
                            />
                            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-950">
                                Nexus<span className="text-emerald-600">Ed</span>
                            </span>
                        </Link>

                        {/* Explore Mega Menu Button (Desktop) */}
                        <button
                            type="button"
                            onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-slate-100/80 rounded-lg transition-colors cursor-pointer"
                        >
                            <Compass className="w-4 h-4 text-slate-500" />
                            <span>Explore</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* Middle: Full-width Rounded Search Pill */}
                    <form
                        onSubmit={handleGlobalSearch}
                        className="hidden sm:flex flex-1 max-w-2xl relative"
                    >
                        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for anything (e.g. Distributed Systems, Kubernetes, Go, OpenAI)..."
                            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 transition-all shadow-2xs"
                        />
                    </form>

                    {/* Right: Quick Links, Dynamic User Bar, Auth */}
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        {user ? (
                            <>
                                {/* Student Dashboard Link */}
                                <Link
                                    href="/dashboard"
                                    className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                                    <span>My Learning</span>
                                </Link>

                                {/* Corporate Portal Link */}
                                {user.company_id && (
                                    <Link
                                        href="/corporate/dashboard"
                                        className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        <Building2 className="w-4 h-4 text-sky-600" />
                                        <span>Corporate</span>
                                    </Link>
                                )}

                                {/* Admin / AI Studio & Ledger */}
                                {user.role === 'admin' && (
                                    <div className="hidden xl:flex items-center gap-1">
                                        <Link
                                            href="/admin/generator"
                                            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 px-2.5 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                                            title="AI Course Studio"
                                        >
                                            <Cpu className="w-4 h-4 text-amber-600" />
                                            <span>AI Studio</span>
                                        </Link>
                                        <Link
                                            href="/admin/transactions"
                                            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 px-2.5 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                                            title="Transaction Ledger"
                                        >
                                            <Shield className="w-4 h-4 text-slate-600" />
                                            <span>Ledger</span>
                                        </Link>
                                    </div>
                                )}

                                {/* User Profile Badge */}
                                <div className="flex items-center gap-2 sm:gap-2.5 pl-1 sm:pl-3 sm:border-l border-slate-200">
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-2 group cursor-pointer"
                                        title="Go to Dashboard"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center group-hover:bg-emerald-600 transition-colors shadow-2xs">
                                            {userInitials}
                                        </div>
                                        <div className="hidden md:block text-left leading-tight">
                                            <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                                {user.name}
                                            </div>
                                            <div className="text-[10px] text-slate-500 font-mono capitalize">
                                                {user.role}
                                            </div>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                        title="Sign Out"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 sm:gap-2.5">
                                <Link
                                    href="/about"
                                    className="hidden lg:flex text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1.5"
                                >
                                    About Us
                                </Link>
                                <Link
                                    href="/courses"
                                    className="hidden lg:flex text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1.5"
                                >
                                    Browse Courses
                                </Link>
                                <Link
                                    href="/login"
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-900 hover:border-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs cursor-pointer"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Trigger Button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
                            aria-label="Toggle mobile menu"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Drawer Slide-Over Sheet */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
                        {/* Mobile Search Bar */}
                        <form onSubmit={handleGlobalSearch} className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search courses, tracks, tech..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-800 transition-all"
                            />
                        </form>

                        {/* User Status Profile Card if Logged In */}
                        {user ? (
                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                                        {userInitials}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-950">{user.name}</div>
                                        <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase">
                                    {user.role}
                                </span>
                            </div>
                        ) : null}

                        {/* Navigation Links Grid */}
                        <div className="space-y-1">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">
                                Navigation
                            </div>
                            <Link
                                href="/courses"
                                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="flex items-center gap-2.5">
                                    <BookOpen className="w-4 h-4 text-emerald-600" />
                                    <span>All Masterclasses &amp; Catalog</span>
                                </span>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </Link>

                            <Link
                                href="/dashboard"
                                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="flex items-center gap-2.5">
                                    <GraduationCap className="w-4 h-4 text-sky-600" />
                                    <span>My Learning Dashboard</span>
                                </span>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </Link>

                            <Link
                                href="/about"
                                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="flex items-center gap-2.5">
                                    <Info className="w-4 h-4 text-slate-500" />
                                    <span>About NexusEd Global</span>
                                </span>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </Link>

                            {user?.company_id && (
                                <Link
                                    href="/corporate/dashboard"
                                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="flex items-center gap-2.5">
                                        <Building2 className="w-4 h-4 text-teal-600" />
                                        <span>Corporate Portal</span>
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                </Link>
                            )}

                            {user?.role === 'admin' && (
                                <>
                                    <Link
                                        href="/admin/generator"
                                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <Cpu className="w-4 h-4 text-amber-600" />
                                            <span>AI Course Studio</span>
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-slate-400" />
                                    </Link>
                                    <Link
                                        href="/admin/transactions"
                                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <Shield className="w-4 h-4 text-purple-600" />
                                            <span>Transaction Ledger</span>
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-slate-400" />
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Auth actions in mobile menu */}
                        {user ? (
                            <div className="pt-2 border-t border-slate-100">
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out of Account</span>
                                </Link>
                            </div>
                        ) : (
                            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                                <Link
                                    href="/login"
                                    className="text-center py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 hover:bg-slate-50 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/register"
                                    className="text-center py-2.5 rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-xs"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </header>

            {/* 3-Level Mega Menu Popover */}
            <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />

            {/* Flash Alerts */}
            {flash.success && (
                <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 px-4 py-3 text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{flash.success}</span>
                </div>
            )}
            {flash.error && (
                <div className="bg-rose-50 border-b border-rose-200 text-rose-800 px-4 py-3 text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
                    <span>{flash.error}</span>
                </div>
            )}

            {/* Main Content Body (With bottom padding for mobile sticky navigation bar) */}
            <main className="flex-1 w-full bg-slate-50/40 pb-20 md:pb-0">{children}</main>

            {/* Mobile Bottom Navigation Bar (Thumb Friendly) */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 md:hidden flex items-center justify-around px-2 py-1.5 shadow-lg">
                {/* Courses / Explore */}
                <Link
                    href="/courses"
                    className="flex flex-col items-center justify-center p-1.5 text-slate-600 hover:text-emerald-700 transition-colors"
                >
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                    <span className="text-[10px] font-bold mt-0.5">Explore</span>
                </Link>

                {/* My Learning */}
                <Link
                    href={user ? '/dashboard' : '/login'}
                    className="flex flex-col items-center justify-center p-1.5 text-slate-600 hover:text-emerald-700 transition-colors"
                >
                    <GraduationCap className="w-5 h-5 text-sky-600" />
                    <span className="text-[10px] font-bold mt-0.5">My Learning</span>
                </Link>

                {/* Corporate / Business */}
                <Link
                    href="/corporate/dashboard"
                    className="flex flex-col items-center justify-center p-1.5 text-slate-600 hover:text-emerald-700 transition-colors"
                >
                    <Building2 className="w-5 h-5 text-teal-600" />
                    <span className="text-[10px] font-bold mt-0.5">Corporate</span>
                </Link>

                {/* About / Info */}
                <Link
                    href="/about"
                    className="flex flex-col items-center justify-center p-1.5 text-slate-600 hover:text-emerald-700 transition-colors"
                >
                    <Info className="w-5 h-5 text-slate-500" />
                    <span className="text-[10px] font-bold mt-0.5">About</span>
                </Link>

                {/* Profile / Sign In */}
                <Link
                    href={user ? '/dashboard' : '/login'}
                    className="flex flex-col items-center justify-center p-1.5 text-slate-600 hover:text-emerald-700 transition-colors"
                >
                    {user ? (
                        <div className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[9px] flex items-center justify-center">
                            {userInitials}
                        </div>
                    ) : (
                        <UserCircle className="w-5 h-5 text-slate-500" />
                    )}
                    <span className="text-[10px] font-bold mt-0.5">{user ? 'Account' : 'Sign In'}</span>
                </Link>
            </nav>

            {/* Clean Enterprise Footer */}
            <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-300 py-12 text-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Top row: Brand & Business prompt */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b border-slate-800 gap-4">
                        <div className="flex items-start gap-3">
                            <img src="/favicon.svg" alt="NexusEd" className="w-10 h-10 rounded-lg shrink-0 mt-0.5" />
                            <div>
                                <span className="text-xl font-bold text-white tracking-tight">
                                    Nexus<span className="text-emerald-400">Ed</span> Global
                                </span>
                                <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                                    Operated by <strong className="text-slate-200">{company?.name || 'NexusEd Global GmbH'}</strong> (Reg. No: {company?.number || 'HRB 248910 B'}). Professional education platform with verified certificates and enterprise compliance.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/corporate/dashboard"
                            className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                        >
                            Enterprise &amp; Teams
                        </Link>
                    </div>

                    {/* Columns */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs">
                        <div className="space-y-2.5">
                            <div className="font-bold text-white uppercase tracking-wider text-[11px]">Learning Tracks</div>
                            <div><Link href="/courses" className="hover:text-white transition-colors">All Masterclasses</Link></div>
                            <div><Link href="/courses?search=English" className="hover:text-white transition-colors">Languages &amp; Communication</Link></div>
                            <div><Link href="/courses?search=Design" className="hover:text-white transition-colors">Product Design &amp; UX</Link></div>
                            <div><Link href="/courses?search=Distributed" className="hover:text-white transition-colors">Distributed Systems &amp; Go</Link></div>
                            <div><Link href="/courses?search=AI" className="hover:text-white transition-colors">Autonomous AI &amp; Agents</Link></div>
                        </div>

                        <div className="space-y-2.5">
                            <div className="font-bold text-white uppercase tracking-wider text-[11px]">Company &amp; Enterprise</div>
                            <div><Link href="/about" className="hover:text-white transition-colors text-emerald-400 font-semibold">About NexusEd Global</Link></div>
                            <div><Link href="/corporate/dashboard" className="hover:text-white transition-colors">Corporate Portal</Link></div>
                            <div><span className="text-slate-400">Team Licensing &amp; Seats</span></div>
                            <div><span className="text-slate-400">Peppol BIS 3.0 / UBL 2.1</span></div>
                            <div><span className="text-slate-400">Skill Matrix &amp; Analytics</span></div>
                        </div>

                        <div className="space-y-2.5">
                            <div className="font-bold text-white uppercase tracking-wider text-[11px]">Trust &amp; Security</div>
                            <div><span className="text-slate-400">256-Bit Bank-Grade Encryption</span></div>
                            <div><span className="text-slate-400">PCI-DSS Level 1 Compliant</span></div>
                            <div><span className="text-slate-400">Verified Diplomas &amp; Badges</span></div>
                            <div><span className="text-slate-400">99.9% Platform SLA</span></div>
                        </div>

                        <div className="space-y-2.5">
                            <div className="font-bold text-white uppercase tracking-wider text-[11px]">Legal &amp; Compliance</div>
                            <div><Link href="/about" className="hover:text-white transition-colors">Entity &amp; Governance</Link></div>
                            <div><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></div>
                            <div><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy (GDPR)</Link></div>
                            <div>
                                <a
                                    href={`mailto:${company?.email || 'legal@nexused.com'}`}
                                    className="hover:text-white transition-colors text-slate-300 underline"
                                >
                                    {company?.email || 'legal@nexused.com'}
                                </a>
                            </div>
                            <div className="text-[11px] text-slate-400 pt-1 font-mono">
                                Reg. {company?.number || 'HRB 248910 B'}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[11px] text-slate-400">
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2 text-slate-300">
                                <img src="/favicon.svg" alt="NexusEd" className="w-5 h-5 rounded" />
                                <span className="font-semibold text-white">{company?.name || 'NexusEd Global GmbH'}</span>
                                <span>•</span>
                                <span>Reg. No: <span className="font-mono text-slate-200">{company?.number || 'HRB 248910 B'}</span></span>
                            </div>
                            <div className="text-slate-500">
                                Registered Office: {company?.address || 'Friedrichstraße 200, 10117 Berlin, Germany'}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <span className="inline-flex items-center gap-1 text-emerald-400">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                ISO/IEC 27001 Infrastructure
                            </span>
                            <span>•</span>
                            <span>© {new Date().getFullYear()} All rights reserved.</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
