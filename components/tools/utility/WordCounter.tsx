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
        <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <div className="p-6 md:p-8">
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                            Content Analysis
                        </label>
                        <button
                            onClick={() => setText('')}
                            className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                        >
                            <RotateCcw className="w-3 h-3" /> Clear Text
                        </button>
                    </div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste your text here for deep analysis..."
                        className="w-full h-64 p-6 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-lg leading-relaxed outline-none focus:border-emerald-500/50 transition-all resize-none shadow-inner"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Words', value: stats.words, icon: FileText, color: 'text-emerald-500' },
                    { label: 'Characters', value: stats.characters, icon: BarChart3, color: 'text-blue-500' },
                    { label: 'Sentences', value: stats.sentences, icon: BarChart3, color: 'text-purple-500' },
                    { label: 'Paragraphs', value: stats.paragraphs, icon: BarChart3, color: 'text-orange-500' },
                ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-950 ${item.color}`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{item.value.toLocaleString()}</div>
                            <div className="text-sm font-medium text-slate-400">{item.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Detailed Stats */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-emerald-500" />
                        Time Estimates
                    </h3>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl">
                            <span className="text-slate-600 dark:text-slate-400 font-medium">Reading Time</span>
                            <span className="font-bold text-slate-900 dark:text-white">{stats.readingTime} min</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl">
                            <span className="text-slate-600 dark:text-slate-400 font-medium">Speaking Time</span>
                            <span className="font-bold text-slate-900 dark:text-white">{stats.speakingTime} min</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl">
                            <span className="text-slate-600 dark:text-slate-400 font-medium">Chars (No spaces)</span>
                            <span className="font-bold text-slate-900 dark:text-white">{stats.charactersNoSpaces}</span>
                        </div>
                    </div>
                </div>

                {/* Keywords */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-emerald-500" />
                        Top Keywords
                    </h3>
                    <div className="space-y-4">
                        {stats.topKeywords.length > 0 ? (
                            stats.topKeywords.map(([word, count], i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-24 text-sm font-mono text-slate-500 truncate">{word}</div>
                                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 transition-all duration-1000"
                                            style={{ width: `${(count / stats.topKeywords[0][1]) * 100}%` }}
                                        />
                                    </div>
                                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300 w-8 text-right">{count}</div>
                                </div>
                            ))
                        ) : (
                            <div className="text-slate-400 text-sm italic py-12 text-center">
                                Start typing to see keyword analysis...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
