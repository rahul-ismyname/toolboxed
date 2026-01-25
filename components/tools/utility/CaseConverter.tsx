'use client';

import { useState } from 'react';
import { Type, Copy, Check, Trash2, ArrowUpDown } from 'lucide-react';

export function CaseConverter() {
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);

    const transform = (type: string) => {
        let result = text;
        switch (type) {
            case 'upper': result = text.toUpperCase(); break;
            case 'lower': result = text.toLowerCase(); break;
            case 'sentence':
                result = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
                break;
            case 'title':
                result = text.toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
                break;
            case 'camel':
                result = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
                break;
            case 'snake':
                result = text.toLowerCase().replace(/\s+/g, '_');
                break;
        }
        setText(result);
    };

    const copyToClipboard = () => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                    {[
                        { id: 'upper', label: 'UPPERCASE' },
                        { id: 'lower', label: 'lowercase' },
                        { id: 'sentence', label: 'Sentence case' },
                        { id: 'title', label: 'Title Case' },
                    ].map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => transform(btn.id)}
                            className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-emerald-500 transition-colors whitespace-nowrap"
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 ml-auto">
                    <button
                        onClick={copyToClipboard}
                        className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"
                        disabled={!text}
                    >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={() => setText('')}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="p-8">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your text here to change its case..."
                    className="w-full h-80 p-6 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500/50 transition-all font-medium text-lg leading-relaxed resize-none shadow-inner"
                />

                <div className="mt-8 flex flex-wrap gap-4">
                    <button
                        onClick={() => transform('camel')}
                        className="flex-1 py-3 px-6 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-500 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                        <ArrowUpDown className="w-4 h-4" /> camelCase
                    </button>
                    <button
                        onClick={() => transform('snake')}
                        className="flex-1 py-3 px-6 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-500 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                        <ArrowUpDown className="w-4 h-4" /> snake_case
                    </button>
                </div>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl text-center border border-slate-100 dark:border-slate-800">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Words</div>
                        <div className="text-xl font-bold text-slate-900 dark:text-white">{text ? text.trim().split(/\s+/).length : 0}</div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl text-center border border-slate-100 dark:border-slate-800">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Characters</div>
                        <div className="text-xl font-bold text-slate-900 dark:text-white">{text.length}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
