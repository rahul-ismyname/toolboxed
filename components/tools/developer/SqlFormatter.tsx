'use client';

import { useState } from 'react';
import { Database, Play, Copy, Check, Trash2, Settings2, AlertCircle } from 'lucide-react';
import { format } from 'sql-formatter';

const DIALECTS = [
    { value: 'sql', label: 'Standard SQL' },
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'mariadb', label: 'MariaDB' },
    { value: 'tsql', label: 'T-SQL (SQL Server)' },
    { value: 'plsql', label: 'PL/SQL (Oracle)' },
    { value: 'sqlite', label: 'SQLite' },
];

export function SqlFormatter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [dialect, setDialect] = useState('sql');
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleFormat = () => {
        if (!input.trim()) return;
        try {
            const formatted = format(input, {
                language: dialect as any,
                keywordCase: 'upper',
                linesBetweenQueries: 2,
            });
            setOutput(formatted);
            setError(null);
        } catch (e: any) {
            setError(e.message || 'Invalid SQL');
        }
    };

    const handleMinify = () => {
        if (!input.trim()) return;
        try {
            // Minifying SQL is essentially formatting with 0 spaces? 
            // sql-formatter doesn't strictly "minify", but we can simply remove newlines and extra spaces regex-style for a basic minify 
            // or use the library if it supports it. For now, let's do a basic regex reduction for "minify" effect 
            // since the library focuses on beautifying.
            const minified = input
                .replace(/\s+/g, ' ')
                .replace(/\s*([,;()=])\s*/g, '$1')
                .trim();
            setOutput(minified);
            setError(null);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
            {/* Input Section */}
            <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
                        <Database className="w-4 h-4 text-emerald-500" />
                        <span>Input SQL</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={dialect}
                            onChange={(e) => setDialect(e.target.value)}
                            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                        >
                            {DIALECTS.map(d => (
                                <option key={d.value} value={d.value}>{d.label}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => setInput('')}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                            title="Clear"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="SELECT * FROM users WHERE active = 1..."
                    className="flex-1 w-full p-6 bg-slate-50 dark:bg-slate-950 font-mono text-sm leading-relaxed outline-none resize-none"
                    spellCheck={false}
                />
            </div>

            {/* Controls (Mobile Only / Middle) */}
            <div className="flex lg:hidden items-center justify-center gap-4">
                <button
                    onClick={handleFormat}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                    <Play className="w-5 h-5 fill-current" />
                    Format
                </button>
            </div>

            {/* Output Section */}
            <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative">
                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>Formatted Output</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Desktop Controls embedded in header */}
                        <button
                            onClick={handleFormat}
                            className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-all mr-2"
                        >
                            <Play className="w-3 h-3 fill-current" />
                            Format
                        </button>
                        <button
                            onClick={handleMinify}
                            className="text-xs font-medium text-slate-500 hover:text-emerald-500 transition-colors mr-4"
                        >
                            Minify
                        </button>

                        <button
                            onClick={copyToClipboard}
                            disabled={!output}
                            className="p-1.5 text-slate-500 hover:text-emerald-500 transition-colors disabled:opacity-30"
                            title="Copy"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="relative flex-1 bg-slate-900">
                    <textarea
                        value={output}
                        readOnly
                        placeholder="-- Formatted SQL will appear here"
                        className={`w-full h-full p-6 bg-slate-50 dark:bg-slate-950 font-mono text-sm leading-relaxed outline-none resize-none ${error ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}
                    />

                    {error && (
                        <div className="absolute bottom-6 left-6 right-6 p-4 bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <div className="text-sm font-bold text-red-900 dark:text-red-200">Formatting Error</div>
                                <div className="text-xs text-red-600 dark:text-red-400 font-mono break-all">{error}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
