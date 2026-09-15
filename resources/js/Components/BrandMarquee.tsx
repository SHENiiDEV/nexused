import React from 'react';

interface Brand {
    name: string;
    svg: React.ReactNode;
}

const BRANDS: Brand[] = [
    {
        name: 'Volkswagen',
        svg: (
            <svg viewBox="0 0 120 120" className="h-9 w-auto fill-current" aria-label="Volkswagen">
                <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="6" />
                <path
                    d="M34 38 L48 76 L55 57 L44 38 Z M65 57 L72 76 L86 38 L76 38 Z M60 70 L53 87 L67 87 Z M41 84 L51 84 L46 72 Z M74 72 L69 84 L79 84 Z"
                    fill="currentColor"
                />
            </svg>
        ),
    },
    {
        name: 'Samsung',
        svg: (
            <svg viewBox="0 0 200 40" className="h-7 w-auto fill-current" aria-label="Samsung">
                <text
                    x="100"
                    y="28"
                    textAnchor="middle"
                    fontFamily="Arial, Helvetica, sans-serif"
                    fontWeight="900"
                    fontSize="26"
                    letterSpacing="3"
                >
                    SAMSUNG
                </text>
            </svg>
        ),
    },
    {
        name: 'Cisco',
        svg: (
            <svg viewBox="0 0 140 50" className="h-8 w-auto fill-current" aria-label="Cisco">
                {/* Cisco Bridge Bars */}
                <rect x="18" y="22" width="4" height="8" rx="2" />
                <rect x="30" y="16" width="4" height="14" rx="2" />
                <rect x="42" y="8" width="4" height="22" rx="2" />
                <rect x="54" y="16" width="4" height="14" rx="2" />
                <rect x="66" y="4" width="4" height="26" rx="2" />
                <rect x="78" y="16" width="4" height="14" rx="2" />
                <rect x="90" y="8" width="4" height="22" rx="2" />
                <rect x="102" y="16" width="4" height="14" rx="2" />
                <rect x="114" y="22" width="4" height="8" rx="2" />
                {/* Cisco Wordmark */}
                <text
                    x="70"
                    y="45"
                    textAnchor="middle"
                    fontFamily="Arial, sans-serif"
                    fontWeight="800"
                    fontSize="13"
                    letterSpacing="3"
                >
                    CISCO
                </text>
            </svg>
        ),
    },
    {
        name: 'Vimeo',
        svg: (
            <svg viewBox="0 0 120 40" className="h-7 w-auto fill-current" aria-label="Vimeo">
                <path d="M12.5 13.8c-.3 2.8 2 4.9 4.3 4.9 4.8 0 8.5-7.1 8.5-12.2 0-3.8-2.3-5.5-5.5-5.5-4.4 0-9.6 4.9-10.8 11.2l-3.2 16.6h7.2l2.3-12c.5-2.6 1.7-3.8 3.1-3.8.9 0 1.5.7 1.5 1.7 0 .5-.1 1-.2 1.6l-2.2 12.5h7.2l3.4-18.7h-7l-1.2 5.9c-.8-1.5-2.3-2.3-4.1-2.3-3.2 0-6.7 3.5-7.3 7.8M40.2 12.4c-2.6 0-4.3 1.5-5.2 3l-.6-2.5h-6.2l-4.5 24.3h7.2l2-11.2c.7-3.7 2.4-5.9 4.7-5.9 2.1 0 3 1.5 3 3.6 0 .8-.1 1.6-.3 2.5l-2 11h7.2l2.3-12.7c.4-2.1.6-3.8.6-5 0-4.4-2.7-7.1-8.2-7.1M65 12.4c-3.1 0-5.4 1.4-6.6 3.5-.8-2.3-2.7-3.5-5.1-3.5-2.4 0-4.2 1.2-5.1 2.8l-.5-2.3h-6.3l-4.5 24.3h7.2l2-11.2c.6-3.6 2-5.9 4-5.9 1.7 0 2.4 1.3 2.4 3.3 0 .8-.1 1.6-.3 2.5l-2 11.3h7.2l2-11.2c.6-3.6 2-5.9 4-5.9 1.7 0 2.4 1.3 2.4 3.3 0 .8-.1 1.6-.3 2.5l-2 11.3h7.2l2.3-12.7c.4-2.1.6-3.8.6-5 0-4.4-2.7-7.1-8.1-7.1M91.8 23.4c0-6.8-4.5-11-10.7-11-6.8 0-11.5 5.2-11.5 12.4 0 7 4.7 11.6 11.5 11.6 5.4 0 9.2-2.8 10.4-7.5h-6.8c-.6 1.8-2 2.8-3.9 2.8-2.8 0-4.3-2.1-4.3-5.5h15.2c.1-.8.1-1.8.1-2.8m-15.3-2.2c.2-2.7 1.7-4.4 4.3-4.4 2.4 0 3.9 1.6 4.1 4.4z" />
            </svg>
        ),
    },
    {
        name: 'P&G',
        svg: (
            <svg viewBox="0 0 120 40" className="h-8 w-auto fill-current" aria-label="Procter & Gamble">
                <text
                    x="60"
                    y="28"
                    textAnchor="middle"
                    fontFamily="Georgia, 'Times New Roman', serif"
                    fontStyle="italic"
                    fontWeight="bold"
                    fontSize="26"
                    letterSpacing="2"
                >
                    P&amp;G
                </text>
            </svg>
        ),
    },
    {
        name: 'Citi',
        svg: (
            <svg viewBox="0 0 100 40" className="h-8 w-auto" aria-label="Citi">
                <path
                    d="M44 14 C52 5, 68 5, 76 14"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                />
                <text
                    x="50"
                    y="30"
                    textAnchor="middle"
                    fontFamily="Arial, sans-serif"
                    fontWeight="800"
                    fontSize="24"
                    fill="currentColor"
                    letterSpacing="1"
                >
                    citi
                </text>
            </svg>
        ),
    },
    {
        name: 'Ericsson',
        svg: (
            <svg viewBox="0 0 150 40" className="h-7 w-auto fill-current" aria-label="Ericsson">
                <g transform="translate(10, 8) skewX(-20)">
                    <rect x="0" y="0" width="4" height="24" rx="2" />
                    <rect x="7" y="0" width="4" height="24" rx="2" />
                    <rect x="14" y="0" width="4" height="24" rx="2" />
                </g>
                <text
                    x="85"
                    y="26"
                    textAnchor="middle"
                    fontFamily="Arial, Helvetica, sans-serif"
                    fontWeight="800"
                    fontSize="16"
                    letterSpacing="2.5"
                >
                    ERICSSON
                </text>
            </svg>
        ),
    },
    {
        name: 'Siemens',
        svg: (
            <svg viewBox="0 0 150 40" className="h-6 w-auto fill-current" aria-label="Siemens">
                <text
                    x="75"
                    y="27"
                    textAnchor="middle"
                    fontFamily="Arial, Helvetica, sans-serif"
                    fontWeight="900"
                    fontSize="20"
                    letterSpacing="3"
                >
                    SIEMENS
                </text>
            </svg>
        ),
    },
    {
        name: 'SAP',
        svg: (
            <svg viewBox="0 0 100 40" className="h-8 w-auto fill-current" aria-label="SAP">
                <path d="M15 6 L85 6 L70 34 L15 34 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <text
                    x="48"
                    y="26"
                    textAnchor="middle"
                    fontFamily="Arial, sans-serif"
                    fontWeight="900"
                    fontSize="18"
                    letterSpacing="2"
                >
                    SAP
                </text>
            </svg>
        ),
    },
    {
        name: 'Intel',
        svg: (
            <svg viewBox="0 0 110 40" className="h-7 w-auto fill-current" aria-label="Intel">
                <text
                    x="55"
                    y="28"
                    textAnchor="middle"
                    fontFamily="Helvetica, Arial, sans-serif"
                    fontWeight="700"
                    fontSize="24"
                    letterSpacing="1"
                >
                    intel.
                </text>
            </svg>
        ),
    },
    {
        name: 'IBM',
        svg: (
            <svg viewBox="0 0 110 40" className="h-7 w-auto fill-current" aria-label="IBM">
                <text
                    x="55"
                    y="29"
                    textAnchor="middle"
                    fontFamily="Courier, monospace"
                    fontWeight="900"
                    fontSize="26"
                    letterSpacing="4"
                >
                    IBM
                </text>
            </svg>
        ),
    },
    {
        name: 'Spotify',
        svg: (
            <svg viewBox="0 0 130 40" className="h-7 w-auto fill-current" aria-label="Spotify">
                <g transform="translate(10, 8)">
                    <circle cx="12" cy="12" r="11" fill="currentColor" />
                    <path
                        d="M6 9 C11 7, 16 8, 19 10 M7 12.5 C11 11, 15 12, 18 13.5 M8 16 C11 15, 14 15.5, 16.5 17"
                        fill="none"
                        stroke="#080C15"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                    />
                </g>
                <text
                    x="75"
                    y="26"
                    textAnchor="middle"
                    fontFamily="Arial, sans-serif"
                    fontWeight="800"
                    fontSize="16"
                    letterSpacing="1"
                >
                    Spotify
                </text>
            </svg>
        ),
    },
];

export function BrandMarquee() {
    const doubledBrands = [...BRANDS, ...BRANDS];

    return (
        <div className="relative w-full overflow-hidden py-12 bg-white border-y border-slate-200/90 shadow-2xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-7 text-center">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Trusted by engineering &amp; enterprise leaders at global organizations
                </p>
            </div>

            {/* Left & Right gradient masks for smooth fade in/out */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-white to-transparent z-10" />

            {/* Infinite Marquee Carousel */}
            <div className="flex overflow-hidden select-none">
                <div className="animate-marquee flex items-center gap-12 sm:gap-20 shrink-0 py-2">
                    {doubledBrands.map((brand, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all duration-300 transform hover:scale-105 px-3 cursor-pointer"
                            title={brand.name}
                        >
                            {brand.svg}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
