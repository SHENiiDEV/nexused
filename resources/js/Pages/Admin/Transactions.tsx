import React, { useState } from 'react';
import { AuditLog, Transaction } from '../../types';
import { AppLayout } from '../../Layouts/AppLayout';
import {
    Activity,
    CheckCircle2,
    DollarSign,
    Lock,
    Shield,
    ShieldAlert,
    XCircle,
} from 'lucide-react';
import { Head, router } from '@inertiajs/react';

interface TransactionsProps {
    transactions: {
        data: Transaction[];
    };
    auditLogs: AuditLog[];
}

export default function Transactions({ transactions, auditLogs }: TransactionsProps) {
    const [simulating, setSimulating] = useState(false);
    const [testResult, setTestResult] = useState<string | null>(null);

    const testWebhookHmac = async (isValidSignature: boolean) => {
        setSimulating(true);
        setTestResult(null);

        try {
            const res = await fetch('/webhooks/corefy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Signature': isValidSignature ? 'valid_hmac_test' : 'tampered_bad_signature',
                },
                body: JSON.stringify({
                    status: 'completed',
                    reference: transactions.data[0]?.transaction_ref || 'TXN-TEST',
                    amount: 49.0,
                    currency: 'EUR',
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setTestResult('Webhook processed successfully! Status 200 OK.');
            } else {
                setTestResult(`Gateway correctly rejected invalid HMAC! Status ${res.status}: ${data.error}`);
            }

            router.reload({ only: ['transactions', 'auditLogs'] });
        } catch (err: any) {
            setTestResult(`Error: ${err.message}`);
        } finally {
            setSimulating(false);
        }
    };

    return (
        <AppLayout title="Financial Ledger & Audit Trail">
            <Head title="Financial Transactions & Webhooks | NexusEd" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
                {/* Header */}
                <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono font-semibold uppercase mb-2">
                            <Shield className="w-3.5 h-3.5 text-emerald-600" /> HMAC-SHA256 Multi-Gateway Ledger
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                            Financial Transactions & Audit Trail
                        </h1>
                        <p className="mt-1 text-slate-600 text-sm max-w-2xl">
                            All incoming payments (Corefy, Cardaq, Apple Pay, Sandbox) are logged immutably with cryptographic signature proofs and discrepancy tracking.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={simulating}
                            onClick={() => testWebhookHmac(true)}
                            className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                        >
                            <Lock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Simulate Valid HMAC</span>
                        </button>
                        <button
                            type="button"
                            disabled={simulating}
                            onClick={() => testWebhookHmac(false)}
                            className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                        >
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                            <span>Simulate Tampered HMAC</span>
                        </button>
                    </div>
                </div>

                {testResult && (
                    <div className="p-4 rounded-xl bg-white border border-slate-300 font-mono text-xs text-slate-800 flex items-center gap-2 shadow-2xs">
                        <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{testResult}</span>
                    </div>
                )}

                {/* Transactions Table */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-950 tracking-tight flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                        <span>Transaction Ledger</span>
                    </h2>

                    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
                                    <tr>
                                        <th className="p-4">Reference</th>
                                        <th className="p-4">Customer / User</th>
                                        <th className="p-4">Gateway</th>
                                        <th className="p-4">Amount</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">HMAC Signature</th>
                                        <th className="p-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {transactions.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                                                No transactions recorded yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.data.map((txn) => (
                                            <tr key={txn.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="p-4 font-mono font-bold text-slate-900">
                                                    {txn.transaction_ref}
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-900">{txn.user?.name}</div>
                                                    <div className="text-[11px] text-slate-500">{txn.user?.email}</div>
                                                </td>
                                                <td className="p-4 uppercase font-mono text-[11px]">
                                                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium">
                                                        {txn.payment_gateway}
                                                    </span>
                                                </td>
                                                <td className="p-4 font-mono font-bold text-slate-950">
                                                    €{Number(txn.amount).toFixed(2)} {txn.currency}
                                                </td>
                                                <td className="p-4">
                                                    {txn.status === 'completed' ? (
                                                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                                                        </span>
                                                    ) : txn.status === 'failed' ? (
                                                        <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-[11px]">
                                                            <XCircle className="w-3.5 h-3.5" /> Failed
                                                        </span>
                                                    ) : (
                                                        <span className="text-amber-700 font-bold text-[11px]">
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 font-mono text-[10px] text-slate-500 truncate max-w-xs">
                                                    {txn.signature ? (
                                                        <span className="text-emerald-700 font-mono font-semibold">
                                                            SHA256 verified
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400">Pending Webhook</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-slate-500 font-mono text-[11px]">
                                                    {new Date(txn.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Centralized Audit Log */}
                <div className="space-y-4 pt-6 border-t border-slate-200">
                    <h2 className="text-xl font-bold text-slate-950 tracking-tight flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-600" />
                        <span>Centralized Immutable Audit Trail</span>
                    </h2>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xs p-4">
                        <div className="space-y-2 font-mono text-xs max-h-96 overflow-y-auto">
                            {auditLogs.length === 0 ? (
                                <div className="text-slate-500 italic py-6 text-center">
                                    No audit entries recorded yet.
                                </div>
                            ) : (
                                auditLogs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-emerald-400 font-bold uppercase tracking-wider">
                                                {log.action}
                                            </span>
                                            <span className="text-slate-300">
                                                [{log.entity_type}#{log.entity_id}]
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-slate-500">
                                            {log.ip_address && <span>IP: {log.ip_address}</span>}
                                            <span>{new Date(log.created_at).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
