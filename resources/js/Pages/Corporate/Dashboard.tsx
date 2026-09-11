import React, { useState } from 'react';
import { Company, Course, Invoice } from '../../types';
import { AppLayout } from '../../Layouts/AppLayout';
import {
    BarChart3,
    Building2,
    CheckCircle2,
    Download,
    FileCode,
    FileText,
    GraduationCap,
    Mail,
    Plus,
    Shield,
    TrendingUp,
    Users,
} from 'lucide-react';
import { Head, router } from '@inertiajs/react';

interface EmployeeMetric {
    id: number;
    name: string;
    email: string;
    role: string;
    enrolled_courses: number;
    completed_courses: number;
    completed_lessons: number;
    quiz_accuracy_pct: number;
    created_at: string;
}

interface PlatformUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface DashboardProps {
    company: Company;
    employees: EmployeeMetric[];
    invoices: Invoice[];
    courses: Course[];
    availableUsers?: PlatformUser[];
}

export default function Dashboard({ company, employees, invoices, courses, availableUsers = [] }: DashboardProps) {
    const [inviteMode, setInviteMode] = useState<'platform' | 'email'>('platform');
    const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
    const [inviteName, setInviteName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState<number | ''>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const seatUsagePercent = Math.round((company.used_seats / Math.max(1, company.max_seats)) * 100);

    const handleAddPlatformUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId) return;
        setIsSubmitting(true);

        router.post(
            '/corporate/add-platform-user',
            {
                user_id: selectedUserId,
                course_id: selectedCourseId || null,
            },
            {
                onSuccess: () => {
                    setSelectedUserId('');
                    setSelectedCourseId('');
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post(
            '/corporate/invite',
            {
                name: inviteName,
                email: inviteEmail,
                course_id: selectedCourseId || null,
            },
            {
                onSuccess: () => {
                    setInviteName('');
                    setInviteEmail('');
                    setSelectedCourseId('');
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    return (
        <AppLayout title="Corporate B2B Portal">
            <Head title="Corporate Analytics & Licenses | NexusEd" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
                {/* Header */}
                <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono font-semibold uppercase mb-2">
                            <Building2 className="w-3.5 h-3.5 text-teal-600" /> B2B Corporate Hub
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                            {company.name}
                        </h1>
                        <p className="mt-1 text-slate-600 text-sm">
                            VAT: <span className="font-mono text-slate-800 font-semibold">{company.vat_number || 'DE389201940'}</span> • European Invoicing Standard: Peppol BIS 3.0 / UBL 2.1
                        </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-right shadow-xs">
                        <div className="text-xs text-slate-500 font-medium">Licensed Seats</div>
                        <div className="text-xl font-extrabold font-mono text-emerald-700">
                            {company.used_seats} / {company.max_seats} Active
                        </div>
                    </div>
                </div>

                {/* Top Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                            <span>Seat Allocation</span>
                            <Users className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="text-2xl font-black text-slate-950 font-mono">{seatUsagePercent}%</div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${seatUsagePercent}%` }} />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                            <span>Total Employees</span>
                            <GraduationCap className="w-4 h-4 text-teal-600" />
                        </div>
                        <div className="text-2xl font-black text-slate-950 font-mono">{employees.length}</div>
                        <div className="text-xs text-slate-500">Across all engineering tracks</div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                            <span>Completed Certifications</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="text-2xl font-black text-slate-950 font-mono">
                            {employees.reduce((acc, e) => acc + e.completed_courses, 0)}
                        </div>
                        <div className="text-xs text-slate-500">Mastery exams passed</div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                            <span>Average Quiz Accuracy</span>
                            <TrendingUp className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="text-2xl font-black text-slate-950 font-mono">
                            {employees.length > 0
                                ? Math.round(
                                      employees.reduce((acc, e) => acc + e.quiz_accuracy_pct, 0) / employees.length
                                  )
                                : 0}
                            %
                        </div>
                        <div className="text-xs text-slate-500">Comprehension score</div>
                    </div>
                </div>

                {/* Team Roster & Invite Form */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Employee Analytics Table */}
                    <div className="lg:col-span-8 space-y-4">
                        <h2 className="text-xl font-bold text-slate-950 tracking-tight flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-emerald-600" />
                            <span>Employee Performance & Progress Matrix</span>
                        </h2>

                        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
                                        <tr>
                                            <th className="p-4">Employee</th>
                                            <th className="p-4">Enrolled</th>
                                            <th className="p-4">Completed Lectures</th>
                                            <th className="p-4">Certifications</th>
                                            <th className="p-4">Quiz Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                        {employees.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                                                    No employees enrolled yet. Invite team members to begin.
                                                </td>
                                            </tr>
                                        ) : (
                                            employees.map((emp) => (
                                                <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                                                    <td className="p-4">
                                                        <div className="font-bold text-slate-900">{emp.name}</div>
                                                        <div className="text-[11px] text-slate-500">{emp.email}</div>
                                                    </td>
                                                    <td className="p-4 font-mono font-medium">
                                                        {emp.enrolled_courses} Courses
                                                    </td>
                                                    <td className="p-4 font-mono">
                                                        <span className="text-emerald-700 font-bold">
                                                            {emp.completed_lessons}
                                                        </span>{' '}
                                                        Lectures
                                                    </td>
                                                    <td className="p-4">
                                                        {emp.completed_courses > 0 ? (
                                                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                                {emp.completed_courses} Certified
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-400">In Progress</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 font-mono font-bold text-slate-900">
                                                        {emp.quiz_accuracy_pct}%
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Seat Allocation Form (Platform User or Email Invite) */}
                    <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Plus className="w-5 h-5 text-emerald-600" />
                                <h3 className="text-base font-bold text-slate-950">Add Team Member</h3>
                            </div>
                            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-semibold">
                                {company.max_seats - company.used_seats} seats left
                            </span>
                        </div>

                        {/* Mode Switcher */}
                        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setInviteMode('platform')}
                                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                    inviteMode === 'platform'
                                        ? 'bg-white text-slate-950 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Existing User
                            </button>
                            <button
                                type="button"
                                onClick={() => setInviteMode('email')}
                                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                    inviteMode === 'email'
                                        ? 'bg-white text-slate-950 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Invite via Email
                            </button>
                        </div>

                        {inviteMode === 'platform' ? (
                            <form onSubmit={handleAddPlatformUser} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Select Platform User
                                    </label>
                                    <select
                                        required
                                        value={selectedUserId}
                                        onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : '')}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-slate-800"
                                    >
                                        <option value="">Select registered user...</option>
                                        {availableUsers.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.name} ({u.email})
                                            </option>
                                        ))}
                                    </select>
                                    {availableUsers.length === 0 && (
                                        <p className="text-[11px] text-slate-400 mt-1">
                                            No other unregistered platform users found.
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Assign Initial Course
                                    </label>
                                    <select
                                        value={selectedCourseId}
                                        onChange={(e) => setSelectedCourseId(e.target.value ? Number(e.target.value) : '')}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-slate-800"
                                    >
                                        <option value="">No Course (General License Seat)</option>
                                        {courses.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !selectedUserId || company.used_seats >= company.max_seats}
                                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-xs transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <Users className="w-4 h-4" />
                                    <span>{isSubmitting ? 'Adding...' : 'Add User to Organization'}</span>
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleInvite} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={inviteName}
                                        onChange={(e) => setInviteName(e.target.value)}
                                        placeholder="Jane Doe"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Company Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        placeholder="jane.doe@company.com"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-800"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Assign Initial Course
                                    </label>
                                    <select
                                        value={selectedCourseId}
                                        onChange={(e) => setSelectedCourseId(e.target.value ? Number(e.target.value) : '')}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-slate-800"
                                    >
                                        <option value="">No Course (General Seat)</option>
                                        {courses.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || company.used_seats >= company.max_seats}
                                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-xs transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    <Mail className="w-4 h-4" />
                                    <span>{isSubmitting ? 'Inviting...' : 'Send License Invitation'}</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* B2B Invoices Section: PDF & Peppol BIS 3.0 / UBL 2.1 */}
                <div className="space-y-4 pt-6 border-t border-slate-200">
                    <div>
                        <h2 className="text-xl font-bold text-slate-950 tracking-tight flex items-center gap-2">
                            <FileText className="w-5 h-5 text-emerald-600" />
                            <span>Corporate Invoices & European E-Invoicing (Peppol BIS 3.0)</span>
                        </h2>
                        <p className="text-xs text-slate-600 mt-0.5">
                            Download printable PDF invoices or export structured UBL 2.1 XML files compliant with European e-invoicing standards.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
                                    <tr>
                                        <th className="p-4">Invoice #</th>
                                        <th className="p-4">Issued Date</th>
                                        <th className="p-4">Total Paid</th>
                                        <th className="p-4">VAT (19%)</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {invoices.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-slate-500 italic">
                                                No B2B invoices generated yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        invoices.map((inv) => (
                                            <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="p-4 font-mono font-bold text-slate-900">
                                                    {inv.invoice_number}
                                                </td>
                                                <td className="p-4 font-mono text-slate-500">
                                                    {new Date(inv.issued_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 font-mono font-bold text-emerald-700">
                                                    €{Number(inv.amount).toFixed(2)} {inv.currency}
                                                </td>
                                                <td className="p-4 font-mono text-slate-600">
                                                    €{Number(inv.tax_amount).toFixed(2)}
                                                </td>
                                                <td className="p-4">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                                                        {inv.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                                    <a
                                                        href={`/corporate/invoices/${inv.id}/download`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors"
                                                    >
                                                        <Download className="w-3.5 h-3.5 text-slate-600" />
                                                        <span>View / PDF</span>
                                                    </a>

                                                    <a
                                                        href={`/corporate/invoices/${inv.id}/ubl`}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-2xs"
                                                    >
                                                        <FileCode className="w-3.5 h-3.5 text-teal-400" />
                                                        <span>Export Peppol UBL 2.1</span>
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
