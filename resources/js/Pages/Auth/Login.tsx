import React, { useState } from 'react';
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

            <div className="max-w-md mx-auto px-4 py-12">
                <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black text-xl mx-auto shadow-md">
                            N
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
                        <p className="text-xs text-slate-400">Access your courses, analytics, and AI studio</p>
                    </div>

                    {/* 1-Click Demo Logins */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                        <div className="text-[11px] font-mono uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" /> Fast Demo Roles
                        </div>
                        <div className="grid grid-cols-1 gap-1.5">
                            <Link
                                href="/demo-login/student"
                                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-800 text-xs text-slate-200 transition-colors"
                            >
                                <span className="flex items-center gap-2 font-medium">
                                    <GraduationCap className="w-4 h-4 text-emerald-400" /> Student (B2C)
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">student@nexused.test</span>
                            </Link>

                            <Link
                                href="/demo-login/corporate"
                                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-teal-800 text-xs text-slate-200 transition-colors"
                            >
                                <span className="flex items-center gap-2 font-medium">
                                    <Building2 className="w-4 h-4 text-teal-400" /> Corporate (B2B)
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">corporate@nexused.test</span>
                            </Link>

                            <Link
                                href="/demo-login/admin"
                                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-800 text-xs text-slate-200 transition-colors"
                            >
                                <span className="flex items-center gap-2 font-medium">
                                    <Shield className="w-4 h-4 text-amber-400" /> Admin / Creator
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">admin@nexused.test</span>
                            </Link>
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center">
                        <div className="border-t border-slate-800 w-full" />
                        <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase font-semibold">Or email login</span>
                        <div className="border-t border-slate-800 w-full" />
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            {errors.email && <div className="text-rose-400 text-xs mt-1">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            {errors.password && <div className="text-rose-400 text-xs mt-1">{errors.password}</div>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs transition-all shadow-md shadow-emerald-950 disabled:opacity-50"
                        >
                            {processing ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="text-center text-xs text-slate-400">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-emerald-400 hover:underline font-semibold">
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
