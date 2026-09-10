import React from 'react';
import { AppLayout } from '../../Layouts/AppLayout';
import { Building2, GraduationCap, Lock, Mail, User } from 'lucide-react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'student' as 'student' | 'corporate',
        company_name: '',
        vat_number: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <AppLayout title="Create Account">
            <Head title="Sign Up | NexusEd" />

            <div className="max-w-md mx-auto px-4 py-16">
                <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-lg space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold text-slate-950 tracking-tight">Create Your Account</h1>
                        <p className="text-xs text-slate-500">Join the next-generation learning platform</p>
                    </div>

                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setData('role', 'student')}
                            className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                                data.role === 'student'
                                    ? 'bg-white text-slate-950 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>Student (B2C)</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setData('role', 'corporate')}
                            className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                                data.role === 'corporate'
                                    ? 'bg-white text-slate-950 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <Building2 className="w-3.5 h-3.5" />
                            <span>Corporate (B2B)</span>
                        </button>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Alex Morgan"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800"
                                />
                            </div>
                            {errors.name && <div className="text-rose-600 text-xs mt-1">{errors.name}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="alex@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800"
                                />
                            </div>
                            {errors.email && <div className="text-rose-600 text-xs mt-1">{errors.email}</div>}
                        </div>

                        {data.role === 'corporate' && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.company_name}
                                        onChange={(e) => setData('company_name', e.target.value)}
                                        placeholder="Acme Technologies GmbH"
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800"
                                    />
                                    {errors.company_name && (
                                        <div className="text-rose-600 text-xs mt-1">{errors.company_name}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        EU VAT / Tax ID
                                    </label>
                                    <input
                                        type="text"
                                        value={data.vat_number}
                                        onChange={(e) => setData('vat_number', e.target.value)}
                                        placeholder="DE392019482"
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 font-mono"
                                    />
                                </div>
                            </>
                        )}

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

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    required
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-xs transition-all shadow-xs disabled:opacity-50"
                        >
                            {processing ? 'Registering...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="text-center text-xs text-slate-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-emerald-700 hover:underline font-bold">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
