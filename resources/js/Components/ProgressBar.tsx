import React from 'react';

interface ProgressBarProps {
    progress: number;
    label?: string;
    step?: string;
    showPercentage?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
    progress,
    label,
    step,
    showPercentage = true,
    size = 'md',
}: ProgressBarProps) {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    const heightClass = {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4',
    }[size];

    return (
        <div className="w-full">
            {(label || showPercentage) && (
                <div className="flex justify-between items-center mb-2 text-xs font-medium">
                    <span className="text-slate-300 font-semibold">{label}</span>
                    {showPercentage && (
                        <span className="text-emerald-400 font-mono font-bold">
                            {clampedProgress}%
                        </span>
                    )}
                </div>
            )}
            <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50 ${heightClass}`}>
                <div
                    className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                    style={{ width: `${clampedProgress}%` }}
                />
            </div>
            {step && (
                <p className="mt-1.5 text-xs text-slate-400 truncate flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{step}</span>
                </p>
            )}
        </div>
    );
}
