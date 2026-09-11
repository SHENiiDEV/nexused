import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps, User } from '../types';
import { MegaMenu } from '../Components/MegaMenu';
import {
    BookOpen,
    Building2,
    CheckCircle2,
    ChevronDown,
    Compass,
    Cpu,
    DollarSign,
    Globe,
    GraduationCap,
    LogOut,
    Menu,
    Search,
    Shield,
    Sparkles,
    UserCheck,
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
        <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased">
            {/* Top Navigation Bar (Udemy Style Clean White) */}
            <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
                    {/* Left: Brand + Explore Mega Menu Trigger */}
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                        <Link href="/courses" className="flex items-center gap-2 group">
                            <img
                                src="/favicon.svg"
                                alt="NexusEd"
                                className="w-9 h-9 rounded-lg shadow-xs group-hover:scale-105 transition-transform"
                            />
                            <span className="text-xl font-extrabold tracking-tight text-slate-950">
                                Nexus<span className="text-emerald-600">Ed</span>
                            </span>
                        </Link>

                        {/* Explore Mega Menu Button */}
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

                                {/* Corporate Portal Link (Only if user has company or corporate role) */}
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
                                <div className="flex items-center gap-2.5 pl-2 sm:pl-3 sm:border-l border-slate-200">
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-2 group cursor-pointer"
                                        title="Go to Dashboard"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
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
                                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                        title="Sign Out"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2.5">
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
                                    className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-900 hover:border-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs cursor-pointer"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-100 cursor-pointer"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Drawer */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-3 shadow-lg">
                        <form onSubmit={handleGlobalSearch} className="relative mb-2">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search courses..."
                                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900"
                            />
                        </form>
                        <Link
                            href="/courses"
                            className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            All Courses
                        </Link>
                        <Link
                            href="/about"
                            className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            About Us
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="block px-3 py-2 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-slate-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    My Learning &amp; Dashboard
                                </Link>
                                {user.company_id && (
                                    <Link
                                        href="/corporate/dashboard"
                                        className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Corporate Portal
                                    </Link>
                                )}
                                {user.role === 'admin' && (
                                    <>
                                        <Link
                                            href="/admin/generator"
                                            className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            AI Course Studio
                                        </Link>
                                        <Link
                                            href="/admin/transactions"
                                            className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Transaction Ledger
                                        </Link>
                                    </>
                                )}
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign Out
                                </Link>
                            </>
                        ) : (
                            <div className="pt-2 border-t border-slate-100 flex gap-2">
                                <Link
                                    href="/login"
                                    className="flex-1 text-center py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex-1 text-center py-2 rounded-lg bg-slate-900 text-xs font-bold text-white"
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

            {/* Main Content Body */}
            <main className="flex-1 w-full bg-slate-50/40">{children}</main>

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
