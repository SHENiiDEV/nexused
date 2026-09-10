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
        badge: 'SEPA & Cards',
        desc: 'Multi-currency EU gateway with HMAC validation',
    },
    {
        id: 'cardaq',
        name: 'Cardaq Acquiring',
        badge: '3D-Secure 2.2',
        desc: 'Direct card processor with encrypted tokens',
    },
    {
        id: 'apple_pay',
        name: 'Apple Pay',
        badge: '1-Touch Pay',
        desc: 'Instant biometric mobile checkout',
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
                await fetch(`/checkout/transactions/${data.init.reference}/complete-mock`, {
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
                router.visit(data.init.redirect_url);
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'Payment initiation failed.');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
            <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-slate-900">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
                        <Shield className="w-3.5 h-3.5 text-emerald-600" /> Secure Checkout (HMAC-Verified)
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
                        Enroll in {course.title}
                    </h2>
                </div>

                {/* Purchase Type Selector */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-6">
                    <button
                        type="button"
                        onClick={() => setPurchaseType('b2c_course')}
                        className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                            !isB2B
                                ? 'bg-white text-slate-950 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        Individual (€{basePrice.toFixed(2)})
                    </button>
                    <button
                        type="button"
                        onClick={() => setPurchaseType('b2b_license')}
                        className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                            isB2B
                                ? 'bg-white text-slate-950 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        Corporate B2B License
                    </button>
                </div>

                {/* B2B Seats Range */}
                {isB2B && (
                    <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-slate-700">Department Seats</label>
                            <span className="text-xs font-mono font-bold text-emerald-700">{seats} Seats (25% off)</span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="50"
                            step="5"
                            value={seats}
                            onChange={(e) => setSeats(Number(e.target.value))}
                            className="w-full accent-emerald-600 cursor-pointer"
                        />
                        <p className="mt-2 text-[11px] text-slate-500">
                            Includes employee analytics dashboard, seat invitation management, and Peppol UBL 2.1 e-invoices.
                        </p>
                    </div>
                )}

                {/* Gateway Selector */}
                <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                        Payment Gateway Driver
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
                                            ? 'border-slate-900 bg-slate-50 text-slate-950 font-semibold shadow-xs ring-1 ring-slate-900'
                                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between w-full mb-1">
                                        <span className="text-xs font-bold text-slate-950 flex items-center gap-1.5">
                                            {gw.id === 'mock' ? <Zap className="w-3.5 h-3.5 text-amber-500" /> : <CreditCard className="w-3.5 h-3.5 text-slate-700" />}
                                            {gw.name}
                                        </span>
                                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                                    </div>
                                    <span className="text-[10px] text-slate-500 line-clamp-1">{gw.desc}</span>
                                    <span className="mt-1 text-[9px] font-mono text-emerald-700 font-semibold">{gw.badge}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Price Breakdown */}
                <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 divide-y divide-slate-200/80 text-xs">
                    <div className="flex justify-between pb-2 text-slate-600">
                        <span>Subtotal (Net):</span>
                        <span className="font-mono font-semibold text-slate-900">€{calculatedPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-slate-600">
                        <span>EU VAT (19%):</span>
                        <span className="font-mono font-semibold text-slate-900">€{vatAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 text-sm font-bold text-slate-950">
                        <span>Total Due:</span>
                        <span className="font-mono text-emerald-700">€{totalPrice.toFixed(2)} EUR</span>
                    </div>
                </div>

                {errorMessage && (
                    <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                        {errorMessage}
                    </div>
                )}

                {/* Submit button */}
                <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleCheckout}
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-sm transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
