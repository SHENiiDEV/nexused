import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy, Terminal } from 'lucide-react';

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ children }) => (
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mt-6 mb-4 pb-2 border-b border-slate-200">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-6 mb-3">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-lg font-bold text-slate-900 mt-4 mb-2">
                            {children}
                        </h3>
                    ),
                    p: ({ children }) => (
                        <p className="my-3 text-slate-700 leading-7 font-normal">
                            {children}
                        </p>
                    ),
                    ul: ({ children }) => (
                        <ul className="my-4 ml-6 list-disc space-y-2 text-slate-700">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="my-4 ml-6 list-decimal space-y-2 text-slate-700">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => <li className="pl-1">{children}</li>,
                    blockquote: ({ children }) => (
                        <blockquote className="my-5 border-l-4 border-emerald-600 bg-emerald-50/60 px-4 py-3 rounded-r-lg text-emerald-950 text-sm">
                            {children}
                        </blockquote>
                    ),
                    hr: () => <hr className="my-8 border-slate-200" />,
                    table: ({ children }) => (
                        <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                            <table className="w-full text-left text-sm text-slate-800">{children}</table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                            {children}
                        </thead>
                    ),
                    tbody: ({ children }) => (
                        <tbody className="divide-y divide-slate-100">{children}</tbody>
                    ),
                    tr: ({ children }) => <tr className="hover:bg-slate-50/60 transition-colors">{children}</tr>,
                    th: ({ children }) => <th className="px-4 py-3 font-semibold">{children}</th>,
                    td: ({ children }) => <td className="px-4 py-3">{children}</td>,
                    code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeString = String(children).replace(/\n$/, '');
                        const isBlock = match || codeString.includes('\n');

                        if (isBlock) {
                            return <CodeBlock language={match ? match[1] : 'code'} code={codeString} />;
                        }

                        return (
                            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-slate-800 border border-slate-200">
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
        }
    };

    return (
        <div className="my-6 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-mono uppercase tracking-wider text-[11px] font-semibold text-slate-300">
                        {language}
                    </span>
                </div>
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 rounded-md px-2 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    aria-label="Copy code"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px] font-medium">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Copy</span>
                        </>
                    )}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto font-mono text-xs sm:text-sm text-slate-200 leading-6 bg-slate-950 m-0">
                <code>{code}</code>
            </pre>
        </div>
    );
}
