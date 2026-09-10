import React, { useState } from 'react';
import { Transaction } from '../../types';
import { AppLayout } from '../../Layouts/AppLayout';
import { CheckCircle2, CreditCard, Lock, Shield, XCircle } from 'lucide-react';
import { Head, router } from '@inertiajs/react';

interface ProcessProps {
    transaction: Transaction;
    gateway: string;
}

export default function Process({ transaction, gateway }: ProcessProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<'success' | 'failed' | null>(null);

    const handleAuthorize = async (shouldSucceed: boolean) => {
        setIsProcessing(true);

        try {
            // Send webhook to verify HMAC and settle transaction
            const res = await fetch(`/checkout/transactions/${transaction.id}/complete-mock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });

            if (res.ok && shouldSucceed) {
                setResult('success');
                setTimeout(() => {
                    if (transaction.metadata?.type === 'b2b_license') {
                        router.visit('/corporate/dashboard');
                    } else if (transaction.course_id) {
                        router.visit(`/courses`);
                    } else {
                        router.visit('/courses');
                    }
                }, 1500);
            } else {
                setResult('failed');
            }
        } catch {
            setResult('failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <AppLayout title="Payment Gateway Processing">
            <Head title={`Checkout Processing | ${gateway.toUpperCase()}`} />

            <div className="max-w-md mx-auto px-4 py-16">
                <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl text-center space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                        <CreditCard className="w-7 h-7" />
                    </div>

                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full mb-2">
                            <Shield className="w-3 h-3" /> {gateway.toUpperCase()} Gateway
                        </div>
                        <h1 className="text-xl font-bold text-white">Payment Authorization</h1>
                        <p className="text-xs text-slate-400 mt-1">
                            Reference: <span className="font-mono text-slate-300">{transaction.transaction_ref}</span>
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
                        <div className="flex justify-between text-slate-400">
                            <span>Amount to Authorize:</span>
                            <span className="font-mono font-bold text-white">
                                €{Number(transaction.amount).toFixed(2)} {transaction.currency}
                            </span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                            <span>Security:</span>
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <Lock className="w-3 h-3" /> HMAC-SHA256 Signed
                            </span>
                        </div>
                    </div>

                    {result === 'success' && (
                        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Payment Approved! Redirecting to your learning dashboard...</span>
                        </div>
                    )}

                    {result === 'failed' && (
                        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            <span>Authorization declined or rejected by gateway provider.</span>
                        </div>
                    )}

                    {!result && (
                        <div className="space-y-2">
                            <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() => handleAuthorize(true)}
                                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs transition-all shadow-md shadow-emerald-950 disabled:opacity-50"
                            >
                                {isProcessing ? 'Communicating with Gateway...' : 'Authorize & Complete Payment'}
                            </button>
                            <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() => handleAuthorize(false)}
                                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 text-xs transition-colors"
                            >
                                Simulate Gateway Decline
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
