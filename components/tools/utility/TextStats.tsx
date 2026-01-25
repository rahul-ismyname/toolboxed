'use client';

import { useState, useMemo } from 'react';
import { FileText, Clock, Type, BarChart3, PieChart, Info, Download, Copy, Check } from 'lucide-react';

export function TextStats() {
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);

    const stats = useMemo(() => {
        const trimmed = text.trim();
        const words = trimmed ? trimmed.split(/\s+/).length : 0;
        const chars = text.length;
        const charsNoSpaces = text.replace(/\s/g, '').length;
        const sentences = trimmed ? trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
        const paragraphs = trimmed ? trimmed.split(/\n+/).filter(p => p.trim().length > 0).length : 0;

        // Reading Time (Avg 200 wpm)
        const readingTime = Math.ceil(words / 200);

        // Character Frequency (Top 5)
        const charMap: Record<string, number> = {};
        for (const char of text.toLowerCase().replace(/[^a-z]/g, '')) {
            charMap[char] = (charMap[char] || 0) + 1;
        }
        const topChars = Object.entries(charMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime, topChars };
    }, [text]);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Editor Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-emerald-500" />
                                <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Analysis Engine</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCopy}
                                    className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-500 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => setText('')}
                                    className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Paste your text here for deep analysis..."
                            className="flex-1 min-h-[500px] w-full p-8 bg-transparent text-slate-900 dark:text-white outline-none font-medium leading-relaxed resize-none text-lg lg:text-xl placeholder:opacity-20 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800"
                        />
                    </div>
                </div>

                {/* Statistics Column */}
                <div className="space-y-6">
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-500 rounded-[28px] p-6 text-white shadow-lg shadow-emerald-500/20">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Words</p>
                            <h4 className="text-3xl font-black">{stats.words}</h4>
                        </div>
                        <div className="bg-slate-900 dark:bg-white rounded-[28px] p-6 text-white dark:text-slate-950 shadow-lg">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Time</p>
                            <h4 className="text-2xl font-black flex items-center gap-2">
                                <Clock className="w-5 h-5" /> {stats.readingTime}m
                            </h4>
                        </div>
                    </div>

                    {/* Detailed Metrics */}
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="w-5 h-5 text-emerald-500" />
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Metrics</h3>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'Characters', val: stats.chars, icon: Type },
                                { label: 'Sentences', val: stats.sentences, icon: Info },
                                { label: 'Paragraphs', val: stats.paragraphs, icon: PieChart },
                                { label: 'No Spaces', val: stats.charsNoSpaces, icon: Activity }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{item.label}</span>
                                    </div>
                                    <span className="font-mono font-black text-slate-900 dark:text-white">{item.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Letter Distribution */}
                    {stats.topChars.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
                            <div className="flex items-center gap-3">
                                <PieChart className="w-5 h-5 text-emerald-500" />
                                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Letter Usage</h3>
                            </div>
                            <div className="space-y-3">
                                {stats.topChars.map(([char, count], i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                            <span>{char}</span>
                                            <span>{count} times</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 transition-all duration-1000"
                                                style={{ width: `${(count / stats.charsNoSpaces) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Visual Activity dummy for icons
function Activity({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    );
}
