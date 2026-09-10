import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps, User } from '../types';
import {
    BookOpen,
    Building2,
    CheckCircle2,
    ChevronDown,
    Cpu,
    DollarSign,
    GraduationCap,
    LogOut,
    Menu,
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
    const { auth, flash, appName } = usePage<PageProps>().props;
    const user: User | null = auth.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [demoMenuOpen, setDemoMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300 font-sans antialiased">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-8">
                        <Link href="/courses" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black text-base shadow-md group-hover:scale-105 transition-transform">
                                N
                            </div>
                            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                                Nexus<span className="text-emerald-400">Ed</span>
                                <span className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 uppercase">
                                    LMS + AI
                                </span>
                            </span>
                        </Link>

                        {/* Desktop Links */}
                        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
                            <Link
                                href="/courses"
                                className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1.5"
                            >
                                <BookOpen className="w-4 h-4 text-emerald-400" />
                                <span>Courses</span>
                            </Link>

                            {user?.role === 'corporate' && (
                                <Link
                                    href="/corporate/dashboard"
                                    className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1.5"
                                >
                                    <Building2 className="w-4 h-4 text-teal-400" />
                                    <span>B2B Portal</span>
                                </Link>
                            )}

                            {user?.role === 'admin' && (
                                <>
                                    <Link
                                        href="/admin/generator"
                                        className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1.5"
                                    >
                                        <Cpu className="w-4 h-4 text-emerald-400" />
                                        <span>AI Course Studio</span>
                                    </Link>
                                    <Link
                                        href="/admin/transactions"
                                        className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1.5"
                                    >
                                        <DollarSign className="w-4 h-4 text-amber-400" />
                                        <span>Financial Ledger</span>
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>

                    {/* Right Hand Controls: Demo Switcher & Auth */}
                    <div className="flex items-center gap-3">
                        {/* Instant Demo Switcher Pill */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/70 bg-slate-900/90 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Switch Role</span>
                                <span className="font-mono text-[10px] uppercase bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                                    {user?.role || 'Guest'}
                                </span>
                                <ChevronDown className="w-3 h-3 text-slate-400" />
                            </button>

                            {demoMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-xl p-2 z-50 animate-in fade-in">
                                    <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                        1-Click Demo Logins
                                    </div>
                                    <Link
                                        href="/demo-login/student"
                                        onClick={() => setDemoMenuOpen(false)}
                                        className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                                    >
                                        <GraduationCap className="w-4 h-4 text-emerald-400" />
                                        <div>
                                            <div className="font-semibold">Student (B2C)</div>
                                            <div className="text-[10px] text-slate-400">Course player, quizzes, certificates</div>
                                        </div>
                                    </Link>
                                    <Link
                                        href="/demo-login/corporate"
                                        onClick={() => setDemoMenuOpen(false)}
                                        className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                                    >
                                        <Building2 className="w-4 h-4 text-teal-400" />
                                        <div>
                                            <div className="font-semibold">Corporate (B2B)</div>
                                            <div className="text-[10px] text-slate-400">Acme Corp, seats, Peppol invoices</div>
                                        </div>
                                    </Link>
                                    <Link
                                        href="/demo-login/admin"
                                        onClick={() => setDemoMenuOpen(false)}
                                        className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                                    >
                                        <Shield className="w-4 h-4 text-amber-400" />
                                        <div>
                                            <div className="font-semibold">Admin / Creator</div>
                                            <div className="text-[10px] text-slate-400">AI course studio, ledger, webhooks</div>
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:block text-right">
                                    <div className="text-xs font-semibold text-white">{user.name}</div>
                                    <div className="text-[10px] font-mono text-slate-400 capitalize">{user.role}</div>
                                </div>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Drawer */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-2">
                        <Link
                            href="/courses"
                            className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-900"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Course Catalog
                        </Link>
                        {user?.role === 'corporate' && (
                            <Link
                                href="/corporate/dashboard"
                                className="block px-3 py-2 rounded-lg text-sm text-teal-300 hover:bg-slate-900"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                B2B Corporate Portal
                            </Link>
                        )}
                        {user?.role === 'admin' && (
                            <>
                                <Link
                                    href="/admin/generator"
                                    className="block px-3 py-2 rounded-lg text-sm text-emerald-300 hover:bg-slate-900"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    AI Course Generator
                                </Link>
                                <Link
                                    href="/admin/transactions"
                                    className="block px-3 py-2 rounded-lg text-sm text-amber-300 hover:bg-slate-900"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Financial Transactions
                                </Link>
                            </>
                        )}
                        <div className="pt-2 border-t border-slate-800">
                            <div className="text-[11px] font-semibold text-slate-400 uppercase mb-2">Switch Demo User</div>
                            <div className="flex flex-col gap-1">
                                <Link href="/demo-login/student" className="text-xs text-slate-300 py-1 hover:text-emerald-400">
                                    Student (B2C)
                                </Link>
                                <Link href="/demo-login/corporate" className="text-xs text-slate-300 py-1 hover:text-teal-400">
                                    Corporate (B2B Acme Corp)
                                </Link>
                                <Link href="/demo-login/admin" className="text-xs text-slate-300 py-1 hover:text-amber-400">
                                    Admin / Creator
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Flash Notifications */}
            {flash.success && (
                <div className="bg-emerald-950/80 border-b border-emerald-800 text-emerald-200 px-4 py-3 text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{flash.success}</span>
                </div>
            )}
            {flash.error && (
                <div className="bg-rose-950/80 border-b border-rose-800 text-rose-200 px-4 py-3 text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
                    <span>{flash.error}</span>
                </div>
            )}

            {/* Main Page Content */}
            <main className="flex-1 w-full">{children}</main>

            {/* Footer */}
            <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60 py-8 text-xs text-slate-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">NexusEd SaaS</span>
                        <span>•</span>
                        <span>Next-Generation LMS with OpenAI Job Chaining Pipeline</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-slate-400">
                        <span className="inline-flex items-center gap-1 text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Laravel Reverb & WebSockets Ready
                        </span>
                        <span>•</span>
                        <span className="text-slate-300 font-mono">Peppol BIS 3.0 / UBL 2.1 Compliant</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
