'use client';

import { useState, useMemo } from 'react';
import { ScanSearch, Play, Copy, Check, Trash2, AlertCircle, Info } from 'lucide-react';

export function RegexTester() {
    const [pattern, setPattern] = useState(String.raw`\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b`);
    const [flags, setFlags] = useState('gm');
    const [testString, setTestString] = useState('Contact us at support@toolboxed.online or sales@toolboxed.online for assistance.');
    const [copied, setCopied] = useState(false);

    const { matches, error, highlightedText } = useMemo(() => {
        if (!pattern) return { matches: [], error: null, highlightedText: testString };

        try {
            const regex = new RegExp(pattern, flags);
            const matches = Array.from(testString.matchAll(regex));

            // Create highlighted HTML
            let lastIndex = 0;
            const parts = [];

            // If global flag is not set, matchAll returns iterator but behave slightly differently for highlighting all
            // We force 'g' for highlighting purposes internally if we want to show all, but let's respect user flags if possible.
            // Actually, for a tester, usually we want to show what the regex matches.

            matches.forEach((match, i) => {
                const start = match.index!;
                const end = start + match[0].length;

                // Non-matched part
                if (start > lastIndex) {
                    parts.push(<span key={`text-${i}`}>{testString.slice(lastIndex, start)}</span>);
                }

                // Matched part
                parts.push(
                    <mark key={`match-${i}`} className="bg-emerald-200 dark:bg-emerald-500/30 text-emerald-900 dark:text-emerald-100 rounded-sm px-0.5 border-b-2 border-emerald-500">
                        {match[0]}
                    </mark>
                );

                lastIndex = end;
            });

            // Remaining part
            if (lastIndex < testString.length) {
                parts.push(<span key="text-end">{testString.slice(lastIndex)}</span>);
            }

            return { matches, error: null, highlightedText: parts.length > 0 ? parts : testString };

        } catch (e: any) {
            return { matches: [], error: e.message, highlightedText: testString };
        }
    }, [pattern, flags, testString]);

    const toggleFlag = (flag: string) => {
        setFlags(prev => prev.includes(flag) ? prev.replace(flag, '') : prev + flag);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Tester Area */}
            <div className="lg:col-span-2 space-y-6">

                {/* Pattern Input */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center gap-2 mb-4 font-semibold text-slate-700 dark:text-slate-200">
                        <ScanSearch className="w-5 h-5 text-emerald-500" />
                        <span>Regular Expression</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <span className="absolute left-4 top-3 text-slate-400 font-mono text-lg">/</span>
                            <input
                                type="text"
                                value={pattern}
                                onChange={(e) => setPattern(e.target.value)}
                                className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-lg text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                placeholder="Enter regex pattern..."
                            />
                            <span className="absolute right-4 top-3 text-slate-400 font-mono text-lg">/</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5">
                            {['g', 'i', 'm'].map(flag => (
                                <button
                                    key={flag}
                                    onClick={() => toggleFlag(flag)}
                                    className={`w-10 h-10 rounded-lg font-bold font-mono transition-colors ${flags.includes(flag)
                                            ? 'bg-emerald-500 text-white shadow-sm'
                                            : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                                        }`}
                                    title={`Toggle '${flag}' flag`}
                                >
                                    {flag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-xl p-4 flex items-center gap-3 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="font-mono text-sm">{error}</span>
                    </div>
                )}

                {/* Test String & Output */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[400px] flex flex-col">
                    <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div className="font-semibold text-slate-700 dark:text-slate-200">Test String</div>
                        <div className="text-xs font-medium px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-md">
                            {matches.length} Match{matches.length !== 1 ? 'es' : ''}
                        </div>
                    </div>

                    <div className="relative flex-1">
                        {/* Editor Layer */}
                        <textarea
                            value={testString}
                            onChange={(e) => setTestString(e.target.value)}
                            className="absolute inset-0 w-full h-full p-6 bg-transparent font-mono text-lg leading-relaxed text-transparent caret-slate-900 dark:caret-white outline-none resize-none z-10 selection:bg-emerald-500/20"
                            spellCheck={false}
                        />
                        {/* Highlighting Layer */}
                        <div className="absolute inset-0 w-full h-full p-6 font-mono text-lg leading-relaxed whitespace-pre-wrap break-words text-slate-400 dark:text-slate-500 pointer-events-none z-0">
                            {highlightedText}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Cheat Sheet */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center gap-2 mb-4 font-bold text-slate-900 dark:text-white">
                        <Info className="w-5 h-5 text-emerald-500" />
                        <span>Cheat Sheet</span>
                    </div>
                    <div className="space-y-4">
                        <CheatItem title="Character Classes" items={[
                            { code: '.', desc: 'Any character' },
                            { code: '\\d', desc: 'Digit (0-9)' },
                            { code: '\\w', desc: 'Word char (a-z, 0-9, _)' },
                            { code: '\\s', desc: 'Whitespace' },
                        ]} />
                        <CheatItem title="Quantifiers" items={[
                            { code: '*', desc: '0 or more' },
                            { code: '+', desc: '1 or more' },
                            { code: '?', desc: '0 or 1' },
                            { code: '{3}', desc: 'Exactly 3' },
                        ]} />
                        <CheatItem title="Anchors" items={[
                            { code: '^', desc: 'Start of string' },
                            { code: '$', desc: 'End of string' },
                            { code: '\\b', desc: 'Word boundary' },
                        ]} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function CheatItem({ title, items }: { title: string, items: { code: string, desc: string }[] }) {
    return (
        <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</h4>
            <div className="space-y-1.5">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                        <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-mono font-bold">{item.code}</code>
                        <span className="text-slate-500 dark:text-slate-400">{item.desc}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
