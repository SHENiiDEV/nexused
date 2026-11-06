import React, { useEffect, useState } from 'react';
import { AppLayout } from '../../Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Clock, AlertCircle, Download, ArrowRight, ShieldCheck } from 'lucide-react';

interface ReturnProps {
    reference: string;
}

interface PaymentStatus {
    transactionRef: string;
    status: 'pending' | 'processed' | 'process_failed';
    type: string;
    planTitle: string;
    amountCents: number;
    currency: string;
    customerEmail: string;
    completedAt: string | null;
    orderReference: string | null;
}

export default function Return({ reference }: ReturnProps) {
    const [statusData, setStatusData] = useState<PaymentStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStatus = async () => {
        if (!reference) return;
        try {
            const res = await fetch(`/api/payments/orders/${encodeURIComponent(reference)}/status`);
            if (res.ok) {
                const data: PaymentStatus = await res.json();
                setStatusData(data);
                setError(null);
            } else {
                setError('Payment reference not found or still initializing.');
            }
        } catch (e: any) {
            setError(e.message || 'Error checking payment status');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(() => {
            if (!statusData || statusData.status === 'pending') {
                fetchStatus();
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [reference, statusData?.status]);

    const isProcessed = statusData?.status === 'processed';
    const isFailed = statusData?.status === 'process_failed';
    const isPending = !isProcessed && !isFailed;

    const formattedAmount = statusData ? (statusData.amountCents / 100).toFixed(2) : '0.00';

    return (
        <AppLayout title="Payment Confirmation">
            <Head title="Payment Confirmation | NexusEd" />

            <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="rounded-3xl bg-white border border-slate-200/80 p-8 sm:p-10 shadow-xl space-y-8">
                    {/* Status Header */}
                    <div className="text-center space-y-4">
                        {isProcessed ? (
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center shadow-sm">
                                <CheckCircle2 className="w-9 h-9" />
                            </div>
                        ) : isFailed ? (
                            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 mx-auto flex items-center justify-center shadow-sm">
                                <AlertCircle className="w-9 h-9" />
                            </div>
                        ) : (
                            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center shadow-sm animate-pulse">
                                <Clock className="w-9 h-9 animate-spin" />
                            </div>
                        )}

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                                {isProcessed
                                    ? 'Payment Successful!'
                                    : isFailed
                                    ? 'Payment Declined or Failed'
                                    : 'Confirming Your Payment...'}
                            </h1>
                            <p className="text-sm text-slate-600 mt-1.5">
                                {isProcessed
                                    ? 'Your transaction has been securely processed and confirmed by the payment gateway.'
                                    : isFailed
                                    ? 'The issuer declined the transaction or payment processing could not be finalized.'
                                    : 'Please wait while we receive cryptographic confirmation from Sterling-Pay / CardGate.'}
                            </p>
                        </div>
                    </div>

                    {/* Receipt Details Card */}
                    {statusData && (
                        <div className="rounded-2xl bg-slate-50 border border-slate-200/60 p-6 space-y-4 text-sm">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                                <span className="text-slate-500 font-medium">Transaction Reference</span>
                                <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                                    {statusData.transactionRef}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                                <span className="text-slate-500 font-medium">Description</span>
                                <span className="font-semibold text-slate-900">
                                    {statusData.planTitle}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                                <span className="text-slate-500 font-medium">Amount</span>
                                <span className="font-mono font-bold text-emerald-700 text-base">
                                    {formattedAmount} {statusData.currency}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                                <span className="text-slate-500 font-medium">Customer Email</span>
                                <span className="text-slate-800">{statusData.customerEmail}</span>
                            </div>

                            {statusData.completedAt && (
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 font-medium">Settled At</span>
                                    <span className="text-slate-700 font-mono text-xs">
                                        {new Date(statusData.completedAt).toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs font-mono text-amber-800">
                            {error}
                        </div>
                    )}

                    {/* Security Badge */}
                    <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 pt-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Protected by Sterling-Pay PCI-DSS Gateway & SHA1/HMAC Security</span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
                        {isProcessed && (
                            <a
                                href={`/api/payments/orders/${encodeURIComponent(reference)}/invoice`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition shadow-sm"
                            >
                                <Download className="w-4 h-4" />
                                <span>Download PDF Invoice</span>
                            </a>
                        )}

                        <Link
                            href="/dashboard"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition"
                        >
                            <span>Go to Dashboard</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
