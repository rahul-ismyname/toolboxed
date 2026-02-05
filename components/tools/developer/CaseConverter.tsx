'use client';

import { useState } from 'react';
import { Type, Copy, Check, RotateCcw } from 'lucide-react';

type CaseType = 'camel' | 'snake' | 'pascal' | 'constant' | 'kebab' | 'title' | 'lower' | 'upper';

export function CaseConverter() {
    const [input, setInput] = useState('');
    const [copied, setCopied] = useState<CaseType | null>(null);

    const toCamel = (str: string) => str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');
    const toSnake = (str: string) => str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('_') || '';
    const toPascal = (str: string) => str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '');
    const toConstant = (str: string) => toSnake(str).toUpperCase();
    const toKebab = (str: string) => toSnake(str).replace(/_/g, '-');
    const toTitle = (str: string) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

    const conversions: { id: CaseType; label: string; fn: (s: string) => string }[] = [
        { id: 'camel', label: 'camelCase', fn: toCamel },
        { id: 'pascal', label: 'PascalCase', fn: toPascal },
        { id: 'snake', label: 'snake_case', fn: toSnake },
        { id: 'constant', label: 'CONSTANT_CASE', fn: toConstant },
        { id: 'kebab', label: 'kebab-case', fn: toKebab },
        { id: 'title', label: 'Title Case', fn: toTitle },
        { id: 'lower', label: 'lowercase', fn: (s) => s.toLowerCase() },
        { id: 'upper', label: 'UPPERCASE', fn: (s) => s.toUpperCase() },
    ];

    const copyToClipboard = (text: string, id: CaseType) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-6 sm:p-12">
                    <div className="space-y-8">
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-lg">
                                        <Type className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lexical Origin</h2>
                                        <p className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-wider">Text Buffer</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setInput('')}
                                    className="px-6 py-3 bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95"
                                >
                                    <RotateCcw className="w-4 h-4" /> Purge
                                </button>
                            </div>
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-[2rem] blur opacity-0 group-focus-within:opacity-5 transition duration-1000"></div>
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Enter raw text for mutation..."
                                    className="relative w-full h-40 p-8 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500/30 rounded-[2rem] text-lg font-bold text-slate-900 dark:text-white outline-none transition-all resize-none shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {conversions.map((conv) => {
                                const result = input ? conv.fn(input) : '';
                                return (
                                    <div
                                        key={conv.id}
                                        className="bg-slate-50/50 dark:bg-slate-950/50 p-6 rounded-3xl border border-slate-50 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl hover:shadow-indigo-500/5 group"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">{conv.label}</span>
                                            <button
                                                onClick={() => copyToClipboard(result, conv.id)}
                                                disabled={!result}
                                                className="p-3 bg-white dark:bg-slate-800 text-slate-300 hover:text-emerald-500 rounded-xl shadow-lg border border-slate-50 dark:border-slate-800 transition-all active:scale-90 disabled:opacity-0"
                                            >
                                                {copied === conv.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <div
                                            onClick={() => copyToClipboard(result, conv.id)}
                                            className="w-full font-mono text-sm font-bold text-slate-700 dark:text-slate-300 break-all cursor-pointer group-hover:text-emerald-500 transition-colors"
                                        >
                                            {result || <span className="opacity-20 italic">Awaiting origin...</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 sm:px-0">
                <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] text-center border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Words</div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{input ? input.trim().split(/\s+/).length : 0}</div>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] text-center border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Characters</div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{input.length}</div>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] text-center border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lines</div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{input ? input.split(/\r\n|\r|\n/).length : 0}</div>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] text-center border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bytes</div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{new Blob([input]).size}</div>
                </div>
            </div>

            <div className="flex items-center gap-3 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Lexical Engine Status: Active
            </div>
        </div >
    );
}
