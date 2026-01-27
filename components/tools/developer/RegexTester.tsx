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

    const [activeTab, setActiveTab] = useState<'editor' | 'cheat-sheet'>('editor');

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            {/* Mobile Tab Switcher */}
            <div className="flex lg:hidden p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full">
                <button
                    onClick={() => setActiveTab('editor')}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'editor' ? 'bg-white dark:bg-slate-700 text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                    Regex Lab
                </button>
                <button
                    onClick={() => setActiveTab('cheat-sheet')}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'cheat-sheet' ? 'bg-white dark:bg-slate-700 text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                    Cheat Sheet
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Main Tester Area */}
                <div className={`lg:col-span-2 space-y-6 ${activeTab === 'editor' ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'}`}>

                    {/* Pattern Input */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
                        <div className="flex items-center gap-2 mb-6 font-black text-[10px] uppercase tracking-widest text-slate-400">
                            <ScanSearch className="w-5 h-5 text-emerald-500" />
                            <span>Regular Expression Engine</span>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-mono text-xl group-focus-within:text-emerald-500 transition-colors">/</span>
                                <input
                                    type="text"
                                    value={pattern}
                                    onChange={(e) => setPattern(e.target.value)}
                                    className="w-full pl-10 pr-10 py-4 sm:py-5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-50 dark:border-slate-800 rounded-2xl font-mono text-base sm:text-lg text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all shadow-inner"
                                    placeholder="your-regex-here"
                                />
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-mono text-xl group-focus-within:text-emerald-500 transition-colors">/</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-1.5 shadow-sm">
                                {['g', 'i', 'm'].map(flag => (
                                    <button
                                        key={flag}
                                        onClick={() => toggleFlag(flag)}
                                        className={`w-12 h-12 rounded-xl font-black font-mono text-sm transition-all active:scale-90 ${flags.includes(flag)
                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl'
                                            : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
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
                        <div className="bg-red-50 dark:bg-red-950/90 backdrop-blur-md border border-red-100 dark:border-red-900/30 rounded-2xl p-5 flex items-start gap-4 text-red-600 dark:text-red-400 animate-in fade-in zoom-in-95">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <div className="text-[10px] font-black uppercase tracking-widest">Syntax Error Detected</div>
                                <div className="font-mono text-xs break-all leading-relaxed">{error}</div>
                            </div>
                        </div>
                    )}

                    {/* Test String & Output */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden min-h-[450px] flex flex-col group">
                        <div className="px-8 py-5 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
                            <div className="font-black text-[10px] uppercase tracking-widest text-slate-400">Target Expression</div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setTestString('')} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                <div className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/20">
                                    {matches.length} MATCH{matches.length !== 1 ? 'ES' : ''}
                                </div>
                            </div>
                        </div>

                        <div className="relative flex-1 bg-slate-50/30 dark:bg-slate-950/30">
                            {/* Editor Layer */}
                            <textarea
                                value={testString}
                                onChange={(e) => setTestString(e.target.value)}
                                className="absolute inset-0 w-full h-full p-8 bg-transparent font-mono text-base sm:text-lg leading-relaxed text-transparent caret-slate-900 dark:caret-white outline-none resize-none z-10 selection:bg-emerald-500/20 custom-scrollbar"
                                spellCheck={false}
                                placeholder="Paste your test text here..."
                            />
                            {/* Highlighting Layer */}
                            <div className="absolute inset-0 w-full h-full p-8 font-mono text-base sm:text-lg leading-relaxed whitespace-pre-wrap break-words text-slate-300 dark:text-slate-600 pointer-events-none z-0 overflow-y-auto custom-scrollbar">
                                {highlightedText}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Cheat Sheet */}
                <div className={`space-y-6 ${activeTab === 'cheat-sheet' ? 'block' : 'hidden lg:block'}`}>
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-50 dark:border-slate-800 p-8 sticky top-24">
                        <div className="flex items-center gap-2 mb-8 font-black text-[10px] uppercase tracking-widest text-slate-400">
                            <Info className="w-5 h-5 text-emerald-500" />
                            <span>Survival Manual</span>
                        </div>
                        <div className="space-y-8">
                            <CheatItem title="Classes" items={[
                                { code: '.', desc: 'Wildcard' },
                                { code: '\\d', desc: 'Digit' },
                                { code: '\\w', desc: 'Word' },
                                { code: '\\s', desc: 'Space' },
                            ]} />
                            <CheatItem title="Quantifiers" items={[
                                { code: '*', desc: '0+' },
                                { code: '+', desc: '1+' },
                                { code: '?', desc: '0 or 1' },
                                { code: '{n}', desc: 'Exactly n' },
                            ]} />
                            <CheatItem title="Anchors" items={[
                                { code: '^', desc: 'Start' },
                                { code: '$', desc: 'End' },
                                { code: '\\b', desc: 'Bound' },
                            ]} />
                        </div>
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
