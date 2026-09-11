import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, ChevronDown } from 'lucide-react';

interface DatePickerProps {
    value: string; // ISO string 'YYYY-MM-DD' or ''
    onChange: (date: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    maxDate?: string;
    minDate?: string;
    disabled?: boolean;
    required?: boolean;
}

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const SHORT_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onChange,
    placeholder = 'Select date of birth',
    label,
    error,
    maxDate = new Date().toISOString().split('T')[0],
    minDate = '1920-01-01',
    disabled = false,
    required = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial display date: parse value or default to ~25 years ago for convenient DOB selection
    const initialDate = value ? new Date(value) : new Date(new Date().getFullYear() - 25, 0, 1);
    const [currentMonth, setCurrentMonth] = useState<number>(
        isNaN(initialDate.getTime()) ? 0 : initialDate.getMonth()
    );
    const [currentYear, setCurrentYear] = useState<number>(
        isNaN(initialDate.getTime()) ? new Date().getFullYear() - 25 : initialDate.getFullYear()
    );
    const [viewMode, setViewMode] = useState<'days' | 'years'>('days');

    // Close on click outside or Escape
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setViewMode('days');
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
                setViewMode('days');
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    // When value updates from outside, sync month & year
    useEffect(() => {
        if (value) {
            const d = new Date(value);
            if (!isNaN(d.getTime())) {
                setCurrentMonth(d.getMonth());
                setCurrentYear(d.getFullYear());
            }
        }
    }, [value]);

    // Format human-friendly display date
    const formattedDisplay = (() => {
        if (!value) return '';
        const parts = value.split('-');
        if (parts.length !== 3) return value;
        const [y, m, d] = parts;
        const monthIdx = parseInt(m, 10) - 1;
        const monthStr = MONTH_NAMES[monthIdx] || m;
        return `${parseInt(d, 10)} ${monthStr} ${y}`;
    })();

    // Navigate months
    const prevMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((y) => y - 1);
        } else {
            setCurrentMonth((m) => m - 1);
        }
    };

    const nextMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((y) => y + 1);
        } else {
            setCurrentMonth((m) => m + 1);
        }
    };

    // Days grid calculation
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOffset = (year: number, month: number) => {
        // 0 = Sunday, 1 = Monday ... We want Monday as 0
        const day = new Date(year, month, 1).getDay();
        return (day + 6) % 7;
    };

    const totalDays = getDaysInMonth(currentYear, currentMonth);
    const firstDayOffset = getFirstDayOffset(currentYear, currentMonth);
    const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1 < 0 ? 11 : currentMonth - 1);

    const handleSelectDay = (day: number) => {
        const mm = String(currentMonth + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        const isoString = `${currentYear}-${mm}-${dd}`;
        onChange(isoString);
        setIsOpen(false);
    };

    const clearDate = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
    };

    // Years for selector (from 1920 to currentYear max limit)
    const maxYear = parseInt(maxDate.split('-')[0], 10) || new Date().getFullYear();
    const minYear = parseInt(minDate.split('-')[0], 10) || 1920;
    const yearOptions: number[] = [];
    for (let y = maxYear; y >= minYear; y--) {
        yearOptions.push(y);
    }

    return (
        <div className="relative w-full" ref={containerRef}>
            {label && (
                <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        {label} {required && <span className="text-rose-500">*</span>}
                    </label>
                    {value && (
                        <span className="text-[11px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Age: {new Date().getFullYear() - parseInt(value.split('-')[0], 10)} yrs
                        </span>
                    )}
                </div>
            )}

            {/* Input Trigger Button */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between pl-3.5 pr-3 py-2.5 rounded-xl border text-left transition-all ${
                    error
                        ? 'border-rose-400 bg-rose-50/40 text-slate-900 focus:ring-2 focus:ring-rose-500/20'
                        : isOpen
                        ? 'border-slate-900 bg-white ring-2 ring-slate-900/10 shadow-xs'
                        : 'border-slate-300 bg-slate-50 hover:bg-white text-slate-900'
                } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <div className="flex items-center gap-2.5 truncate">
                    <div className={`p-1 rounded-lg ${value ? 'bg-emerald-100/70 text-emerald-800' : 'text-slate-400'}`}>
                        <CalendarIcon className="w-4 h-4" />
                    </div>
                    {value ? (
                        <span className="text-sm font-semibold text-slate-900 tracking-tight">
                            {formattedDisplay}
                        </span>
                    ) : (
                        <span className="text-sm text-slate-400">{placeholder}</span>
                    )}
                </div>

                <div className="flex items-center gap-1.5 text-slate-400">
                    {value && !disabled && (
                        <span
                            onClick={clearDate}
                            role="button"
                            tabIndex={0}
                            className="p-1 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
                            title="Clear date"
                        >
                            <X className="w-3.5 h-3.5" />
                        </span>
                    )}
                    <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-slate-900' : ''
                        }`}
                    />
                </div>
            </button>

            {error && <div className="text-rose-600 text-xs mt-1 font-medium">{error}</div>}

            {/* Popover Calendar Modal */}
            {isOpen && (
                <div className="absolute left-0 z-50 mt-2 w-full sm:w-[330px] rounded-2xl bg-white border border-slate-200 p-4 shadow-2xl shadow-slate-950/15">
                    {/* Header Controls */}
                    <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                        {viewMode === 'days' ? (
                            <>
                                <button
                                    type="button"
                                    onClick={prevMonth}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('years')}
                                        className="px-2.5 py-1 text-xs font-bold text-slate-900 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                        <span>{MONTH_NAMES[currentMonth]}</span>
                                        <span className="text-emerald-700 font-mono">{currentYear}</span>
                                        <ChevronDown className="w-3 h-3 text-slate-400" />
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={nextMonth}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center justify-between w-full">
                                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Select Year &amp; Month
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('days')}
                                    className="text-xs font-semibold text-emerald-700 hover:underline px-2 py-1 cursor-pointer"
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>

                    {/* View: Fast Year & Month Picker */}
                    {viewMode === 'years' && (
                        <div className="space-y-3">
                            <div>
                                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Month
                                </span>
                                <div className="grid grid-cols-3 gap-1.5 max-h-32 overflow-y-auto pr-1">
                                    {MONTH_NAMES.map((name, idx) => (
                                        <button
                                            key={name}
                                            type="button"
                                            onClick={() => {
                                                setCurrentMonth(idx);
                                                setViewMode('days');
                                            }}
                                            className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                                currentMonth === idx
                                                    ? 'bg-slate-900 text-white font-bold'
                                                    : 'text-slate-700 hover:bg-slate-100'
                                            }`}
                                        >
                                            {name.slice(0, 3)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Year (Fast Select)
                                </span>
                                <div className="grid grid-cols-4 gap-1.5 max-h-40 overflow-y-auto pr-1 font-mono text-xs">
                                    {yearOptions.map((yr) => (
                                        <button
                                            key={yr}
                                            type="button"
                                            onClick={() => {
                                                setCurrentYear(yr);
                                                setViewMode('days');
                                            }}
                                            className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                                                currentYear === yr
                                                    ? 'bg-emerald-600 text-white font-bold'
                                                    : 'text-slate-700 hover:bg-slate-100'
                                            }`}
                                        >
                                            {yr}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View: Days Calendar Grid */}
                    {viewMode === 'days' && (
                        <div>
                            {/* Day Header */}
                            <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
                                {SHORT_DAYS.map((d) => (
                                    <div
                                        key={d}
                                        className="text-[10px] font-bold uppercase tracking-wider text-slate-400 py-1"
                                    >
                                        {d}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Days */}
                            <div className="grid grid-cols-7 gap-1 text-center">
                                {/* Previous Month Fillers */}
                                {Array.from({ length: firstDayOffset }).map((_, i) => {
                                    const dayNum = prevMonthDays - firstDayOffset + i + 1;
                                    return (
                                        <div
                                            key={`prev-${i}`}
                                            className="py-2 text-xs text-slate-300 pointer-events-none select-none"
                                        >
                                            {dayNum}
                                        </div>
                                    );
                                })}

                                {/* Current Month Days */}
                                {Array.from({ length: totalDays }).map((_, i) => {
                                    const day = i + 1;
                                    const mm = String(currentMonth + 1).padStart(2, '0');
                                    const dd = String(day).padStart(2, '0');
                                    const dayIso = `${currentYear}-${mm}-${dd}`;
                                    const isSelected = value === dayIso;
                                    const isToday =
                                        new Date().toISOString().split('T')[0] === dayIso;
                                    const isFuture = dayIso > maxDate;

                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            disabled={isFuture}
                                            onClick={() => handleSelectDay(day)}
                                            className={`py-2 rounded-lg text-xs font-semibold transition-all relative cursor-pointer ${
                                                isSelected
                                                    ? 'bg-slate-900 text-white shadow-xs scale-105'
                                                    : isFuture
                                                    ? 'text-slate-300 cursor-not-allowed opacity-40'
                                                    : 'text-slate-700 hover:bg-slate-100 active:scale-95'
                                            }`}
                                        >
                                            {day}
                                            {isToday && !isSelected && (
                                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Quick Presets Footer */}
                            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                                <span>Quick presets:</span>
                                <div className="flex gap-1.5">
                                    {[18, 25, 30, 40].map((age) => (
                                        <button
                                            key={age}
                                            type="button"
                                            onClick={() => {
                                                const targetYear = new Date().getFullYear() - age;
                                                setCurrentYear(targetYear);
                                                setCurrentMonth(0);
                                                handleSelectDay(1);
                                            }}
                                            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[10px] font-semibold transition-colors cursor-pointer"
                                        >
                                            {age}y
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
