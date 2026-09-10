import React, { useState } from 'react';
import { Course } from '../types';
import { Check, CreditCard, Shield, X, Zap } from 'lucide-react';
import { router } from '@inertiajs/react';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    course: Course;
    initialType?: 'b2c_course' | 'b2b_license';
}

const GATEWAYS = [
    {
        id: 'corefy',
        name: 'Corefy Hub',
        badge: 'SEPA & Visa/MC',
        desc: 'Multi-currency European gateway with HMAC validation',
    },
    {
        id: 'cardaq',
        name: 'Cardaq Acquiring',
        badge: '3D-Secure 2.2',
        desc: 'Direct card processor with encrypted tokenization',
    },
    {
        id: 'apple_pay',
        name: 'Apple Pay',
        badge: '1-Touch',
        desc: 'Instant biometric token checkout',
    },
    {
        id: 'mock',
        name: 'Sandbox Instant Test',
        badge: 'Demo Mode',
        desc: 'Simulate instant completion and webhook verification',
    },
];

export function CheckoutModal({
    isOpen,
    onClose,
    course,
    initialType = 'b2c_course',
}: CheckoutModalProps) {
    const [purchaseType, setPurchaseType] = useState<'b2c_course' | 'b2b_license'>(initialType);
    const [selectedGateway, setSelectedGateway] = useState<string>('mock');
    const [seats, setSeats] = useState<number>(10);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    if (!isOpen) return null;

    const basePrice = Number(course.price) || 29.0;
    const isB2B = purchaseType === 'b2b_license';

    // B2B 25% discount, capped at €2000
    const calculatedPrice = isB2B
        ? Math.min(2000, Math.round(basePrice * seats * 0.75 * 100) / 100)
        : basePrice;

    const vatAmount = Math.round(calculatedPrice * 0.19 * 100) / 100;
    const totalPrice = Math.round((calculatedPrice + vatAmount) * 100) / 100;

    const handleCheckout = async () => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const res = await fetch('/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    course_id: course.id,
                    type: purchaseType,
                    gateway: selectedGateway,
                    seats: isB2B ? seats : undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || data.error || 'Checkout initialization failed');
            }

            if (selectedGateway === 'mock') {
                // Instantly complete mock transaction for seamless demo
                const compRes = await fetch(`/checkout/transactions/${data.init.reference}/complete-mock`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    },
                });

                if (isB2B) {
                    router.visit('/corporate/dashboard');
                } else {
                    router.visit(`/learn/${course.slug}`);
                }
            } else {
                // Redirect to gateway simulation page
                router.visit(data.init.redirect_url);
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'Payment initiation failed.');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 mb-2">
                        <Shield className="w-3 h-3" /> Secure Checkout (HMAC-Verified)
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Enroll in {course.title}
                    </h2>
                </div>

                {/* Purchase Type Selector */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-6">
                    <button
                        type="button"
                        onClick={() => setPurchaseType('b2c_course')}
                        className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                            !isB2B
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        Individual (€{basePrice})
                    </button>
                    <button
                        type="button"
                        onClick={() => setPurchaseType('b2b_license')}
                        className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                            isB2B
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        Corporate B2B (Team License)
                    </button>
                </div>

                {/* B2B Seat count selector */}
                {isB2B && (
                    <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-semibold text-slate-300">Department Seats</label>
                            <span className="text-xs font-mono font-bold text-emerald-400">{seats} Seats (25% off)</span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="50"
                            step="5"
                            value={seats}
                            onChange={(e) => setSeats(Number(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer"
                        />
                        <p className="mt-2 text-[11px] text-slate-400">
                            Includes employee performance dashboard, progress analytics, and automated Peppol UBL 2.1 e-invoicing.
                        </p>
                    </div>
                )}

                {/* Gateway Selector */}
                <div className="mb-6">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                        Select Payment Gateway Driver
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {GATEWAYS.map((gw) => {
                            const isSelected = selectedGateway === gw.id;
                            return (
                                <button
                                    key={gw.id}
                                    type="button"
                                    onClick={() => setSelectedGateway(gw.id)}
                                    className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                                        isSelected
                                            ? 'border-emerald-500 bg-emerald-950/20 text-white shadow-sm ring-1 ring-emerald-500'
                                            : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                                    }`}
                                >
                                    <div className="flex items-center justify-between w-full mb-1">
                                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                            {gw.id === 'mock' ? <Zap className="w-3.5 h-3.5 text-amber-400" /> : <CreditCard className="w-3.5 h-3.5 text-emerald-400" />}
                                            {gw.name}
                                        </span>
                                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                                    </div>
                                    <span className="text-[10px] text-slate-400 line-clamp-1">{gw.desc}</span>
                                    <span className="mt-1 text-[9px] font-mono text-emerald-400/90 font-medium">{gw.badge}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Price Breakdown */}
                <div className="mb-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 divide-y divide-slate-800/80 text-xs">
                    <div className="flex justify-between pb-2 text-slate-400">
                        <span>Subtotal (Net):</span>
                        <span className="font-mono text-slate-200">€{calculatedPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-slate-400">
                        <span>EU VAT (19%):</span>
                        <span className="font-mono text-slate-200">€{vatAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 text-sm font-bold text-white">
                        <span>Total Due:</span>
                        <span className="font-mono text-emerald-400">€{totalPrice.toFixed(2)} EUR</span>
                    </div>
                </div>

                {errorMessage && (
                    <div className="mb-4 p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-200 text-xs">
                        {errorMessage}
                    </div>
                )}

                {/* Submit button */}
                <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleCheckout}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-950 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Processing Transaction...</span>
                        </>
                    ) : (
                        <>
                            <span>Pay €{totalPrice.toFixed(2)} via {selectedGateway.toUpperCase()}</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
