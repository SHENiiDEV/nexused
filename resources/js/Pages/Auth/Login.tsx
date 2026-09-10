import React from 'react';
import { AppLayout } from '../../Layouts/AppLayout';
import { Building2, GraduationCap, Lock, Mail, Shield, Sparkles } from 'lucide-react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <AppLayout title="Sign In">
            <Head title="Sign In | NexusEd" />

            <div className="max-w-md mx-auto px-4 py-16">
                <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-lg space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xl mx-auto shadow-xs">
                            N
                        </div>
                        <h1 className="text-2xl font-bold text-slate-950 tracking-tight">Welcome Back</h1>
                        <p className="text-xs text-slate-500">Sign in to your learning dashboard</p>
                    </div>

                    {/* 1-Click Demo Logins */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                        <div className="text-[11px] font-mono uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> 1-Click Demo Accounts
                        </div>
                        <div className="grid grid-cols-1 gap-1.5">
                            <Link
                                href="/demo-login/student"
                                className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs text-slate-800 transition-colors shadow-2xs"
                            >
                                <span className="flex items-center gap-2 font-semibold">
                                    <GraduationCap className="w-4 h-4 text-emerald-600" /> Student (B2C)
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">student@nexused.test</span>
                            </Link>

                            <Link
                                href="/demo-login/corporate"
                                className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs text-slate-800 transition-colors shadow-2xs"
                            >
                                <span className="flex items-center gap-2 font-semibold">
                                    <Building2 className="w-4 h-4 text-teal-600" /> Corporate (B2B)
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">corporate@nexused.test</span>
                            </Link>

                            <Link
                                href="/demo-login/admin"
                                className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs text-slate-800 transition-colors shadow-2xs"
                            >
                                <span className="flex items-center gap-2 font-semibold">
                                    <Shield className="w-4 h-4 text-amber-600" /> Admin / Creator
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">admin@nexused.test</span>
                            </Link>
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center">
                        <div className="border-t border-slate-200 w-full" />
                        <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-semibold">Or email login</span>
                        <div className="border-t border-slate-200 w-full" />
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800"
                                />
                            </div>
                            {errors.email && <div className="text-rose-600 text-xs mt-1">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800"
                                />
                            </div>
                            {errors.password && <div className="text-rose-600 text-xs mt-1">{errors.password}</div>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-xs transition-all shadow-xs disabled:opacity-50"
                        >
                            {processing ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="text-center text-xs text-slate-500">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-emerald-700 hover:underline font-bold">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
