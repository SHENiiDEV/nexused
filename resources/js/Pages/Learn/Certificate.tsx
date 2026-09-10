import React from 'react';
import { Enrollment } from '../../types';
import { AppLayout } from '../../Layouts/AppLayout';
import { Award, CheckCircle2, Download, Printer, Shield } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';

interface CertificateProps {
    enrollment: Enrollment;
}

export default function Certificate({ enrollment }: CertificateProps) {
    const handlePrint = () => {
        window.print();
    };

    const completionDate = enrollment.completed_at
        ? new Date(enrollment.completed_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : new Date().toLocaleDateString('en-US');

    return (
        <AppLayout title="Verified Certificate">
            <Head title={`Certificate | ${enrollment.certificate_code}`} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Print and Share Controls */}
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        href={`/courses/${enrollment.course?.slug}`}
                        className="text-xs text-slate-400 hover:text-emerald-400"
                    >
                        ← Back to Course
                    </Link>
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:border-emerald-500 text-xs font-semibold flex items-center gap-2 transition-all shadow"
                    >
                        <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
                    </button>
                </div>

                {/* Printable Certificate Frame */}
                <div className="relative rounded-3xl bg-slate-900 border-2 border-emerald-500/40 p-8 sm:p-14 text-center shadow-2xl overflow-hidden print:border-slate-400 print:text-black print:bg-white print:shadow-none">
                    {/* Background guilloche corner accents */}
                    <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-emerald-500/10 blur-2xl" />
                    <div className="absolute -bottom-12 -right-12 w-36 h-36 rounded-full bg-teal-500/10 blur-2xl" />

                    <div className="space-y-6 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-mono font-semibold uppercase">
                            <Shield className="w-3.5 h-3.5" /> Verified Completion Credential
                        </div>

                        <div className="text-sm font-semibold tracking-widest text-slate-400 uppercase">
                            NexusEd Global Academy
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
                            Certificate of Mastery
                        </h1>

                        <p className="text-xs sm:text-sm text-slate-400">
                            This certifies that the recipient has rigorously completed all coursework, comprehensive lectures, and practical architecture quizzes in:
                        </p>

                        <div className="py-4 border-y border-slate-800">
                            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-sans tracking-tight">
                                {enrollment.course?.title}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-xs text-slate-400">Conferred Upon:</div>
                            <div className="text-xl sm:text-2xl font-bold text-white">
                                {enrollment.user?.name}
                            </div>
                        </div>

                        <div className="pt-6 grid grid-cols-2 gap-4 text-xs border-t border-slate-800 text-slate-400">
                            <div className="text-left">
                                <span className="block text-[10px] uppercase font-mono text-slate-500">Issued On</span>
                                <span className="font-semibold text-slate-300">{completionDate}</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-[10px] uppercase font-mono text-slate-500">Verification ID</span>
                                <span className="font-mono font-bold text-emerald-400">{enrollment.certificate_code}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
