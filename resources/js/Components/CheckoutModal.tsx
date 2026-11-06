import React, { useState } from 'react';
import { Course } from '../types';
import { CreditCard, ExternalLink, Lock, Shield, ShieldCheck, X } from 'lucide-react';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    course: Course;
    initialType?: 'b2c_course' | 'b2b_license';
}

export function CheckoutModal({
    isOpen,
    onClose,
    course,
    initialType = 'b2c_course',
}: CheckoutModalProps) {
    const [purchaseType, setPurchaseType] = useState<'b2c_course' | 'b2b_license'>(initialType);
    const [seats, setSeats] = useState<number>(10);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    if (!isOpen) return null;

    const basePrice = Number(course.price) || 49.0;
    const isB2B = purchaseType === 'b2b_license';

    // B2B 25% discount, capped at €2000
    const calculatedPrice = isB2B
        ? Math.min(2000, Math.round(basePrice * seats * 0.75 * 100) / 100)
        : basePrice;

    const vatAmount = Math.round(calculatedPrice * 0.19 * 100) / 100;
    const totalPrice = Math.round((calculatedPrice + vatAmount) * 100) / 100;

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
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
                    gateway: 'corefy',
                    seats: isB2B ? seats : undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || data.error || 'Checkout initialization failed');
            }

            // Redirect flow: instantly redirect customer to Hosted Payment Page (Sterling-Pay / CardGate)
            const redirectUrl = data.init?.hppUrl || data.init?.redirect_url || data.hppUrl || data.redirect_url;
            if (redirectUrl) {
                window.location.href = redirectUrl;
                return;
            }

            throw new Error('Payment gateway did not provide a valid redirect URL.');
        } catch (err: any) {
            setErrorMessage(err.message || 'Payment initiation failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in overflow-y-auto">
            <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-slate-900 my-8">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit SSL Encrypted Checkout
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
                        Enroll in {course.title}
                    </h2>
                </div>

                {/* Purchase Type Selector */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-5">
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
                    <div className="mb-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
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

                {/* Payment Gateway: Redirect Flow to Sterling-Pay / CardGate HPP */}
                <form onSubmit={handleCheckout} className="space-y-4 mb-5">
                    <div className="p-4 rounded-2xl border-2 border-slate-900 bg-slate-50/50 space-y-3.5">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-slate-900 text-white">
                                    <CreditCard className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-sm text-slate-950">Credit / Debit Card</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                                <span className="text-blue-600">VISA</span>
                                <span>•</span>
                                <span className="text-amber-600">MC</span>
                                <span>•</span>
                                <span className="text-sky-600">AMEX</span>
                            </div>
                        </div>

                        {/* Redirect Flow Notice */}
                        <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                            <div className="flex items-start gap-2.5">
                                <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div className="text-xs text-slate-600 leading-relaxed">
                                    <p className="font-semibold text-slate-900 mb-1">
                                        Secure Payment via Sterling-Pay CardGate
                                    </p>
                                    <p>
                                        You will be redirected to the secure Hosted Payment Page to enter your card details and complete 3D-Secure 2.2 authentication.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium">
                                <span className="flex items-center gap-1">
                                    <Lock className="w-3 h-3 text-emerald-600" /> PCI-DSS Level 1
                                </span>
                                <span className="flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> 3D-Secure 2.2
                                </span>
                                <span>Instant Enrollment</span>
                            </div>
                        </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 divide-y divide-slate-200/80 text-xs">
                        <div className="flex justify-between pb-1.5 text-slate-600">
                            <span>Subtotal (Net):</span>
                            <span className="font-mono font-semibold text-slate-900">€{calculatedPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-1.5 text-slate-600">
                            <span>EU VAT (19%):</span>
                            <span className="font-mono font-semibold text-slate-900">€{vatAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-1.5 text-sm font-bold text-slate-950">
                            <span>Total Due:</span>
                            <span className="font-mono text-emerald-700">€{totalPrice.toFixed(2)} EUR</span>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                            {errorMessage}
                        </div>
                    )}

                    <p className="text-xs leading-relaxed text-slate-600">
                        Digital access is activated after payment confirmation. {isB2B && 'Team licenses are one-time purchases with no automatic renewal. '}
                        Read the <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">Terms of Service</a> and <a href="/delivery-and-returns" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">Delivery, Withdrawal &amp; Refund Policy</a> before paying. Consumers have a 14-day right of withdrawal; starting a course does not by itself waive that right. These links open in a new tab.
                    </p>

                    {/* Pay Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-sm transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Redirecting to Payment Gateway...</span>
                            </>
                        ) : (
                            <>
                                <Lock className="w-4 h-4 text-emerald-400" />
                                <span>Pay €{totalPrice.toFixed(2)} with Credit Card</span>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
