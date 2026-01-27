'use client';

import { useState, useMemo } from 'react';
import { FileText, Clock, BarChart3, RotateCcw } from 'lucide-react';

export function WordCounter() {
    const [text, setText] = useState('');

    const stats = useMemo(() => {
        const trimmedText = text.trim();
        const words = trimmedText ? trimmedText.split(/\s+/).length : 0;
        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        const sentences = trimmedText ? trimmedText.split(/[.!?]+/).filter(Boolean).length : 0;
        const paragraphs = trimmedText ? trimmedText.split(/\n+/).filter(Boolean).length : 0;

        // Avg reading speed: 200 wpm, Speaking speed: 130 wpm
        const readingTime = Math.ceil(words / 200);
        const speakingTime = Math.ceil(words / 130);

        // Keyword Density
        const wordFreq: Record<string, number> = {};
        const commonWords = ['the', 'and', 'a', 'to', 'in', 'is', 'it', 'of', 'for', 'with', 'on', 'at', 'by'];
        trimmedText.toLowerCase().split(/\W+/).filter(w => w.length > 2 && !commonWords.includes(w)).forEach(w => {
            wordFreq[w] = (wordFreq[w] || 0) + 1;
        });
        const topKeywords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 5);

        return { words, characters, charactersNoSpaces, sentences, paragraphs, readingTime, speakingTime, topKeywords };
    }, [text]);

    return (
        <div className="max-w-6xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
            {/* Semantic Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6 text-center sm:text-left">
                    <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-2xl">
                        <FileText className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Linguistic Synthesis</h2>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Semantic Architect</p>
                    </div>
                </div>
                <button
                    onClick={() => setText('')}
                    className="w-full sm:w-auto px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <RotateCcw className="w-4 h-4" />
                    Purge Buffer
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-indigo-500/5 overflow-hidden border border-slate-100 dark:border-slate-800">
                <div className="p-8 sm:p-12">
                    <div className="flex justify-between items-center mb-6 px-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                                Semantic Stream Analyzer
                            </label>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-5 transition duration-1000"></div>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Initiate data sequence for deep linguistic analysis..."
                            className="relative w-full h-64 lg:h-96 p-8 sm:p-12 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-[2.5rem] text-base lg:text-lg leading-relaxed outline-none transition-all resize-none shadow-inner placeholder:text-slate-200 dark:placeholder:text-slate-800 text-slate-600 dark:text-slate-400"
                        />
                    </div>
                </div>
            </div>

            {/* Metric Matrix Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-2">
                {[
                    { label: 'Lexicon', value: stats.words, icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Glyphs', value: stats.characters, icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Sentences', value: stats.sentences, icon: BarChart3, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                    { label: 'Paragraphs', value: stats.paragraphs, icon: BarChart3, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-50 dark:border-slate-800 flex flex-col items-center gap-4 transition-all hover:scale-105 active:scale-95 group">
                        <div className={`p-4 rounded-2xl ${item.bg} ${item.color} group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900 transition-all duration-300 shadow-lg`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{item.value.toLocaleString()}</div>
                            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1">{item.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Temporal Vector Projection */}
                <div className="bg-white dark:bg-slate-900 p-10 sm:p-12 rounded-[3rem] shadow-2xl border border-slate-50 dark:border-slate-800 group">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                            <Clock className="w-5 h-5" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Temporal Vector Projection</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: 'Silent Reading', value: `${stats.readingTime} min`, desc: '~200 WPM' },
                            { label: 'Vocal Projection', value: `${stats.speakingTime} min`, desc: '~130 WPM' },
                            { label: 'Net Metadata', value: stats.charactersNoSpaces, desc: 'Excl. Whitespace' }
                        ].map((stat, i) => (
                            <div key={i} className="flex justify-between items-center p-6 bg-slate-50/50 dark:bg-slate-950/50 rounded-2xl border border-transparent group-hover:border-emerald-500/10 transition-all">
                                <div>
                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{stat.label}</div>
                                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-400/60 mt-1">{stat.desc}</div>
                                </div>
                                <span className="font-mono text-xl font-black text-emerald-500 tracking-tighter">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lexical Frequency Hub */}
                <div className="bg-white dark:bg-slate-900 p-10 sm:p-12 rounded-[3rem] shadow-2xl border border-slate-50 dark:border-slate-800 group">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Lexical Frequency Hub</h3>
                    </div>
                    <div className="space-y-6">
                        {stats.topKeywords.length > 0 ? (
                            stats.topKeywords.map(([word, count], i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end px-2">
                                        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{word}</span>
                                        <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg">{count} INSTANCES</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-50 dark:bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-100 dark:border-slate-800/50">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                            style={{ width: `${(count / stats.topKeywords[0][1]) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-200 dark:text-slate-800 gap-6">
                                <RotateCcw className="w-12 h-12 opacity-10 animate-spin-slow" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Data Stream</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Semantic Footer */}
            <div className="text-center pb-8 pt-4">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200">
                    Linguistic Synthesis Engine // ISO 639-1 Compliant
                </p>
            </div>
        </div>
    );
}
