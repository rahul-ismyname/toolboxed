'use client';

import { useState } from 'react';
import { FileJson, Copy, Check, Trash2, Maximize2, Minimize2, AlertCircle } from 'lucide-react';

export function JsonFormatter() {
    const [input, setInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const formatJson = (minify = false) => {
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            const formatted = minify
                ? JSON.stringify(parsed)
                : JSON.stringify(parsed, null, 2);
            setInput(formatted);
            setError(null);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const copyToClipboard = () => {
        if (!input) return;
        navigator.clipboard.writeText(input);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clearAll = () => {
        setInput('');
        setError(null);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            {/* Toolbar */}
            <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <FileJson className="w-5 h-5 text-emerald-500" />
                    JSON Formatter & Validator
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => formatJson(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                    >
                        <Maximize2 className="w-4 h-4" />
                        Prettify
                    </button>
                    <button
                        onClick={() => formatJson(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors"
                    >
                        <Minimize2 className="w-4 h-4" />
                        Minify
                    </button>
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>
                    <button
                        onClick={copyToClipboard}
                        disabled={!input}
                        className="p-2 text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-all disabled:opacity-30"
                    >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={clearAll}
                        className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="p-6 md:p-8">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder='Paste your JSON here... Example: {"id":1,"name":"Toolboxed"}'
                        className={`w-full h-[500px] p-6 bg-slate-50 dark:bg-slate-950 border-2 rounded-2xl font-mono text-sm leading-relaxed outline-none transition-all resize-none shadow-inner ${error
                                ? 'border-red-300 dark:border-red-900/50 focus:border-red-500'
                                : 'border-slate-100 dark:border-slate-800 focus:border-emerald-500/50'
                            }`}
                    />

                    {error && (
                        <div className="absolute bottom-6 left-6 right-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <div className="text-sm font-bold text-red-900 dark:text-red-200">Invalid JSON Format</div>
                                <div className="text-xs text-red-600 dark:text-red-400 font-mono break-all">{error}</div>
                            </div>
                        </div>
                    )}

                    {!input && !error && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 dark:opacity-10 grayscale">
                            <FileJson className="w-32 h-32" />
                        </div>
                    )}
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/50 text-center">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</div>
                        <div className={`text-sm font-bold ${error ? 'text-red-500' : input ? 'text-emerald-500' : 'text-slate-400'}`}>
                            {error ? 'Invalid' : input ? 'Valid' : 'Waiting...'}
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/50 text-center">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Characters</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                            {input.length}
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/50 text-center">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Lines</div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                            {input ? input.split('\n').length : 0}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
