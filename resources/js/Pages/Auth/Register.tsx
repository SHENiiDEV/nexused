import React, { useState } from 'react';
import { AppLayout } from '../../Layouts/AppLayout';
import { ALLOWED_COUNTRIES } from '../../constants/countries';
import { DatePicker } from '../../Components/DatePicker';
import {
    Building2,
    CheckCircle2,
    Eye,
    EyeOff,
    Globe,
    GraduationCap,
    Lock,
    Mail,
    MapPin,
    Phone,
    Shield,
    ShieldCheck,
    Sparkles,
    User,
} from 'lucide-react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        surname: '',
        email: '',
        phone: '',
        date_of_birth: '',
        address_street: '',
        address_city: '',
        address_country: 'Germany',
        address_postcode: '',
        password: '',
        password_confirmation: '',
        terms: false,
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
            <Head title="Create Your Account | NexusEd" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    
                    {/* Left Column: Brand, Trust & Social Proof (Executive Style) */}
                    <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold tracking-wide">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                <span>Verified Onboarding &amp; Security</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
                                Start your executive learning journey with{' '}
                                <span className="underline decoration-emerald-500/30 underline-offset-8">
                                    NexusEd
                                </span>
                                .
                            </h1>

                            <p className="text-slate-600 text-sm leading-relaxed">
                                Join over 45,000 engineers, managers, and enterprise teams mastering high-demand technologies through verifiable, AI-accelerated curriculum.
                            </p>
                        </div>

                        {/* Feature Points */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                                <div className="p-2 rounded-xl bg-slate-100 text-slate-800 shrink-0 mt-0.5">
                                    <Sparkles className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Adaptive AI-Tutor &amp; Content
                                    </h3>
                                    <p className="text-xs text-slate-500 leading-normal">
                                        Tailored interactive labs, code analysis, and real-time comprehension assessments.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                                <div className="p-2 rounded-xl bg-slate-100 text-slate-800 shrink-0 mt-0.5">
                                    <Shield className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Bank-Grade Data Compliance
                                    </h3>
                                    <p className="text-xs text-slate-500 leading-normal">
                                        Compliant with EU GDPR, PCI-DSS Level 1 specifications, and encrypted user vault.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                                <div className="p-2 rounded-xl bg-slate-100 text-slate-800 shrink-0 mt-0.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        Accredited Certification
                                    </h3>
                                    <p className="text-xs text-slate-500 leading-normal">
                                        Shareable certificates verifiable by employers and corporate sponsors globally.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial Quote */}
                        <div className="p-5 rounded-2xl bg-slate-950 text-white shadow-lg space-y-3">
                            <p className="text-xs text-slate-300 italic leading-relaxed">
                                &ldquo;The speed and depth of NexusEd&apos;s adaptive curriculum allowed our department to standardize AI engineering competencies within weeks instead of quarters.&rdquo;
                            </p>
                            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                                <div className="w-8 h-8 rounded-full bg-emerald-600 font-bold flex items-center justify-center text-xs text-white">
                                    ER
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-white">Elena Rostova</div>
                                    <div className="text-[11px] text-slate-400">Head of Talent Development &amp; Engineering</div>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges Bar */}
                        <div className="flex items-center justify-between text-[11px] text-slate-400 px-2">
                            <span>🔒 256-Bit SSL Secured</span>
                            <span>⚡ GDPR Compliant</span>
                            <span>💳 PCI-DSS Level 1</span>
                        </div>
                    </div>

                    {/* Right Column: Premium Multi-Section Registration Form */}
                    <div className="lg:col-span-7">
                        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-xl shadow-slate-900/5 space-y-8">
                            
                            {/* Header & Role Switcher */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                                        Create Your Account
                                    </h2>
                                    <span className="text-xs font-medium text-slate-500">
                                        Step 1 of 1
                                    </span>
                                </div>

                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Please enter your legal identity and address details. Required for verified certification issuance and secure payment processing.
                                </p>

                                {/* Role Selector */}
                                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60">
                                    <button
                                        type="button"
                                        onClick={() => setData('role', 'student')}
                                        className={`py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                            data.role === 'student'
                                                ? 'bg-white text-slate-950 shadow-sm border border-slate-200/60'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <GraduationCap className={`w-4 h-4 ${data.role === 'student' ? 'text-emerald-600' : 'text-slate-400'}`} />
                                        <span>Individual Student</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('role', 'corporate')}
                                        className={`py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                            data.role === 'corporate'
                                                ? 'bg-white text-slate-950 shadow-sm border border-slate-200/60'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        <Building2 className={`w-4 h-4 ${data.role === 'corporate' ? 'text-sky-600' : 'text-slate-400'}`} />
                                        <span>Corporate / Team</span>
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={submit} className="space-y-8">
                                
                                {/* Section 1: Personal Identification */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-mono font-bold flex items-center justify-center">
                                            1
                                        </span>
                                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                            Personal Details
                                        </h3>
                                    </div>

                                    {/* Name & Surname */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                                First Name <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder="e.g. Alexander"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 transition-all"
                                                />
                                            </div>
                                            {errors.name && <div className="text-rose-600 text-xs mt-1 font-medium">{errors.name}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                                Surname / Last Name <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={data.surname}
                                                    onChange={(e) => setData('surname', e.target.value)}
                                                    placeholder="e.g. Vance"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 transition-all"
                                                />
                                            </div>
                                            {errors.surname && <div className="text-rose-600 text-xs mt-1 font-medium">{errors.surname}</div>}
                                        </div>
                                    </div>

                                    {/* Email & Phone */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                                Email Address <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="email"
                                                    required
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="alexander@company.com"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 transition-all"
                                                />
                                            </div>
                                            {errors.email && <div className="text-rose-600 text-xs mt-1 font-medium">{errors.email}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                                Phone Number <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="tel"
                                                    required
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    placeholder="+49 151 23456789"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 transition-all font-mono"
                                                />
                                            </div>
                                            {errors.phone && <div className="text-rose-600 text-xs mt-1 font-medium">{errors.phone}</div>}
                                        </div>
                                    </div>

                                    {/* Date of Birth with Custom Premium DatePicker */}
                                    <div>
                                        <DatePicker
                                            label="Date of Birth"
                                            required
                                            value={data.date_of_birth}
                                            onChange={(date) => setData('date_of_birth', date)}
                                            placeholder="Choose birth date (DD Month YYYY)"
                                            error={errors.date_of_birth}
                                        />
                                    </div>
                                </div>

                                {/* Section 2: Residential & Billing Address (4 sections) */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-mono font-bold flex items-center justify-center">
                                                2
                                            </span>
                                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                                Residential &amp; Billing Address
                                            </h3>
                                        </div>
                                        <span className="text-[11px] text-slate-400 font-medium">Compliance verification</span>
                                    </div>

                                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-4">
                                        {/* 1. Street, house number, apartment */}
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                                <span>1. Street, House number, Apartment... <span className="text-rose-500">*</span></span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.address_street}
                                                onChange={(e) => setData('address_street', e.target.value)}
                                                placeholder="e.g. Friedrichstraße 43, Apt. 2B"
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 transition-all"
                                            />
                                            {errors.address_street && (
                                                <div className="text-rose-600 text-xs mt-1 font-medium">{errors.address_street}</div>
                                            )}
                                        </div>

                                        {/* 2. City & 4. Post code */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                                    2. City <span className="text-rose-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={data.address_city}
                                                    onChange={(e) => setData('address_city', e.target.value)}
                                                    placeholder="e.g. Berlin"
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 transition-all"
                                                />
                                                {errors.address_city && (
                                                    <div className="text-rose-600 text-xs mt-1 font-medium">{errors.address_city}</div>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                                    4. Post Code <span className="text-rose-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={data.address_postcode}
                                                    onChange={(e) => setData('address_postcode', e.target.value)}
                                                    placeholder="e.g. 10117"
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 transition-all font-mono"
                                                />
                                                {errors.address_postcode && (
                                                    <div className="text-rose-600 text-xs mt-1 font-medium">{errors.address_postcode}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* 3. Country */}
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                                                <span>3. Country <span className="text-rose-500">*</span></span>
                                                <span className="text-[10px] text-slate-400 font-normal">Compliant Jurisdictions Only</span>
                                            </label>
                                            <div className="relative">
                                                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                <select
                                                    required
                                                    value={data.address_country}
                                                    onChange={(e) => setData('address_country', e.target.value)}
                                                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-slate-800 appearance-none cursor-pointer transition-all"
                                                >
                                                    {ALLOWED_COUNTRIES.map((country) => (
                                                        <option key={country} value={country}>
                                                            {country}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                                                    ▼
                                                </div>
                                            </div>
                                            {errors.address_country && (
                                                <div className="text-rose-600 text-xs mt-1 font-medium">{errors.address_country}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Optional Corporate Fields */}
                                {data.role === 'corporate' && (
                                    <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/70 border border-sky-200/90 space-y-3.5">
                                        <div className="text-sky-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-sky-700" />
                                            <span>Corporate Organization Details</span>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                                Company Legal Name <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={data.company_name}
                                                onChange={(e) => setData('company_name', e.target.value)}
                                                placeholder="e.g. Acme Technologies GmbH"
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800"
                                            />
                                            {errors.company_name && (
                                                <div className="text-rose-600 text-xs mt-1 font-medium">{errors.company_name}</div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                                                <span>EU VAT / Tax Identification Number</span>
                                                <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.vat_number}
                                                onChange={(e) => setData('vat_number', e.target.value)}
                                                placeholder="e.g. DE392019482"
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 font-mono"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Section 3: Credentials & Policy Acceptance */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-mono font-bold flex items-center justify-center">
                                            3
                                        </span>
                                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                            Security &amp; Agreements
                                        </h3>
                                    </div>

                                    {/* Passwords */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                                Account Password <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    required
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder="Minimum 8 characters"
                                                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            {errors.password && (
                                                <div className="text-rose-600 text-xs mt-1 font-medium">{errors.password}</div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                                Confirm Password <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    required
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    placeholder="Re-enter password"
                                                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800 transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mandatory Checkbox: Terms & Conditions and Privacy Policy */}
                                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
                                        <label className="flex items-start gap-3 cursor-pointer select-none group">
                                            <input
                                                type="checkbox"
                                                required
                                                checked={data.terms}
                                                onChange={(e) => setData('terms', e.target.checked)}
                                                className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                            />
                                            <span className="text-xs text-slate-700 leading-relaxed">
                                                I agree to the{' '}
                                                <a
                                                    href="/terms"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-bold text-slate-900 hover:text-emerald-700 underline underline-offset-2"
                                                >
                                                    Terms &amp; Conditions
                                                </a>{' '}
                                                and{' '}
                                                <a
                                                    href="/privacy"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-bold text-slate-900 hover:text-emerald-700 underline underline-offset-2"
                                                >
                                                    Privacy Policy
                                                </a>
                                                . I confirm all provided identity information is accurate.
                                            </span>
                                        </label>
                                        {errors.terms && (
                                            <div className="text-rose-600 text-xs mt-2 pl-7 font-medium">{errors.terms}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="space-y-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing || !data.terms}
                                        className="w-full py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 cursor-pointer"
                                    >
                                        {processing ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Registering Account &amp; Verifying Identity...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                                <span>Complete Registration</span>
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center text-[11px] text-slate-400">
                                        By registering, your account is configured for direct course access and certification ledger.
                                    </p>
                                </div>
                            </form>

                            {/* Existing account footer */}
                            <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
                                Already possess an account?{' '}
                                <Link
                                    href="/login"
                                    className="text-emerald-700 hover:text-emerald-800 font-bold underline underline-offset-2"
                                >
                                    Sign In here
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
