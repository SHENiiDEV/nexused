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
    const { auth, flash } = usePage<PageProps>().props;
    const user: User | null = auth.user;

    const [megaMenuOpen, setMegaMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [demoMenuOpen, setDemoMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleGlobalSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/courses?search=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased">
            {/* Top Navigation Bar (Udemy Style Clean White) */}
            <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
                    {/* Left: Brand + Explore Mega Menu Trigger */}
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                        <Link href="/courses" className="flex items-center gap-2 group">
                            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-black text-lg shadow-xs group-hover:bg-emerald-600 transition-colors">
                                N
                            </div>
                            <span className="text-xl font-extrabold tracking-tight text-slate-950">
                                Nexus<span className="text-emerald-600">Ed</span>
                            </span>
                        </Link>

                        {/* Explore Mega Menu Button */}
                        <button
                            type="button"
                            onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-slate-100/80 rounded-lg transition-colors"
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

                    {/* Right: Quick Links, Role Switcher, Auth */}
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        {/* NexusEd Business / Corporate link */}
                        <Link
                            href="/corporate/dashboard"
                            className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-emerald-700 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                            <span>NexusEd Business</span>
                        </Link>

                        {/* AI Studio Link for Creators/Admins */}
                        <Link
                            href="/admin/generator"
                            className="hidden xl:flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-emerald-700 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <Cpu className="w-3.5 h-3.5 text-slate-500" />
                            <span>AI Studio</span>
                        </Link>

                        {/* Fast 1-Click Demo Role Switcher Pill */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition-colors shadow-2xs"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="hidden sm:inline">Role:</span>
                                <span className="font-semibold text-slate-900 capitalize">
                                    {user?.role || 'Guest'}
                                </span>
                                <ChevronDown className="w-3 h-3 text-slate-500" />
                            </button>

                            {demoMenuOpen && (
                                <div className="absolute right-0 mt-2 w-60 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in">
                                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        1-Click Demo Logins
                                    </div>
                                    <Link
                                        href="/demo-login/student"
                                        onClick={() => setDemoMenuOpen(false)}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-800 hover:bg-slate-50 transition-colors"
                                    >
                                        <GraduationCap className="w-4 h-4 text-emerald-600" />
                                        <div>
                                            <div className="font-semibold">Student (B2C)</div>
                                            <div className="text-[10px] text-slate-500">Course player & quizzes</div>
                                        </div>
                                    </Link>
                                    <Link
                                        href="/demo-login/corporate"
                                        onClick={() => setDemoMenuOpen(false)}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-800 hover:bg-slate-50 transition-colors"
                                    >
                                        <Building2 className="w-4 h-4 text-teal-600" />
                                        <div>
                                            <div className="font-semibold">Corporate (B2B)</div>
                                            <div className="text-[10px] text-slate-500">Acme Corp & Peppol Invoices</div>
                                        </div>
                                    </Link>
                                    <Link
                                        href="/demo-login/admin"
                                        onClick={() => setDemoMenuOpen(false)}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-800 hover:bg-slate-50 transition-colors"
                                    >
                                        <Shield className="w-4 h-4 text-amber-600" />
                                        <div>
                                            <div className="font-semibold">Admin / Creator</div>
                                            <div className="text-[10px] text-slate-500">AI studio & HMAC ledger</div>
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* User Account / Auth buttons */}
                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:block text-right">
                                    <div className="text-xs font-bold text-slate-900">{user.name}</div>
                                    <div className="text-[10px] font-mono text-slate-500 capitalize">{user.role}</div>
                                </div>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-3.5 py-2 text-xs font-bold rounded-lg border border-slate-900 text-slate-900 hover:bg-slate-100 transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-3.5 py-2 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-100"
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
                        <button
                            onClick={() => {
                                setMobileMenuOpen(false);
                                setMegaMenuOpen(true);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50 flex items-center justify-between"
                        >
                            <span>Explore Categories</span>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                        </button>
                        <Link
                            href="/courses"
                            className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            All Courses
                        </Link>
                        <Link
                            href="/corporate/dashboard"
                            className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            NexusEd Business (Corporate)
                        </Link>
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
                            Financial Transactions & Webhooks
                        </Link>
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

            {/* Deep Clean Footer (Udemy Style) */}
            <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-300 py-12 text-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Top row: Brand & Business prompt */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b border-slate-800 gap-4">
                        <div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                Nexus<span className="text-emerald-400">Ed</span> Business
                            </span>
                            <p className="text-xs text-slate-400 mt-1">
                                Upskill teams with AI-curated curriculum, performance metrics, and Peppol UBL 2.1 invoicing.
                            </p>
                        </div>
                        <Link
                            href="/corporate/dashboard"
                            className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
                        >
                            Get NexusEd Business
                        </Link>
                    </div>

                    {/* Columns */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs">
                        <div className="space-y-2.5">
                            <div className="font-bold text-white uppercase tracking-wider text-[11px]">NexusEd Overview</div>
                            <div><Link href="/courses" className="hover:text-white">Explore Courses</Link></div>
                            <div><Link href="/admin/generator" className="hover:text-white">AI Course Studio</Link></div>
                            <div><Link href="/courses?search=Distributed" className="hover:text-white">Distributed Systems</Link></div>
                            <div><Link href="/courses?search=AI" className="hover:text-white">Generative AI Tracks</Link></div>
                        </div>

                        <div className="space-y-2.5">
                            <div className="font-bold text-white uppercase tracking-wider text-[11px]">B2B & Enterprise</div>
                            <div><Link href="/corporate/dashboard" className="hover:text-white">Corporate Portal</Link></div>
                            <div><span className="text-slate-400">Team Licensing (up to €2000)</span></div>
                            <div><span className="text-slate-400">Peppol BIS 3.0 / UBL 2.1</span></div>
                            <div><span className="text-slate-400">Employee Analytics Matrix</span></div>
                        </div>

                        <div className="space-y-2.5">
                            <div className="font-bold text-white uppercase tracking-wider text-[11px]">Billing & Security</div>
                            <div><Link href="/admin/transactions" className="hover:text-white">HMAC Webhook Ledger</Link></div>
                            <div><span className="text-slate-400">Corefy Multi-Currency</span></div>
                            <div><span className="text-slate-400">Cardaq Acquiring</span></div>
                            <div><span className="text-slate-400">Apple Pay Integration</span></div>
                        </div>

                        <div className="space-y-2.5">
                            <div className="font-bold text-white uppercase tracking-wider text-[11px]">Legal & Standards</div>
                            <div><span className="text-slate-400">EU Invoicing Directive 2014/55/EU</span></div>
                            <div><span className="text-slate-400">Terms of Service</span></div>
                            <div><span className="text-slate-400">Privacy Policy (GDPR)</span></div>
                            <div className="pt-2">
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-700 text-slate-300 hover:text-white text-xs">
                                    <Globe className="w-3.5 h-3.5" />
                                    <span>English (EU)</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-slate-800 text-white flex items-center justify-center font-bold text-xs">N</div>
                            <span>© {new Date().getFullYear()} NexusEd Global GmbH. All rights reserved.</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1 text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Reverb WebSockets Ready
                            </span>
                            <span>•</span>
                            <span>Standard European E-Invoicing</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
