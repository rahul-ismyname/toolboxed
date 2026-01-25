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
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-6 md:p-8">
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Your Text
                            </label>
                            <button
                                onClick={() => setInput('')}
                                className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                            >
                                <RotateCcw className="w-3 h-3" /> Clear
                            </button>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type or paste your text here..."
                            className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-lg text-slate-900 dark:text-white-outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none shadow-inner"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {conversions.map((conv) => {
                            const result = input ? conv.fn(input) : '';
                            return (
                                <div key={conv.id} className="group relative">
                                    <div className="flex justify-between items-center mb-1.5 px-1">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{conv.label}</span>
                                        <button
                                            onClick={() => copyToClipboard(result, conv.id)}
                                            disabled={!result}
                                            className="text-slate-400 hover:text-emerald-500 transition-colors disabled:opacity-0"
                                        >
                                            {copied === conv.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <div
                                        onClick={() => copyToClipboard(result, conv.id)}
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl font-mono text-sm text-slate-700 dark:text-slate-300 truncate cursor-pointer hover:border-emerald-500/30 transition-all"
                                    >
                                        {result || <span className="opacity-30 italic">Result will appear here...</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
