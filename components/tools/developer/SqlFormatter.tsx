'use client';

import { useState } from 'react';
import { Database, Play, Copy, Check, Trash2, AlertCircle } from 'lucide-react';
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
    const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');

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
            if (typeof window !== 'undefined' && window.innerWidth < 1024) setActiveTab('output');
        } catch (e: any) {
            setError(e.message || 'Invalid SQL');
            if (typeof window !== 'undefined' && window.innerWidth < 1024) setActiveTab('output');
        }
    };

    const handleMinify = () => {
        if (!input.trim()) return;
        try {
            const minified = input
                .replace(/\s+/g, ' ')
                .replace(/\s*([,;()=])\s*/g, '$1')
                .trim();
            setOutput(minified);
            setError(null);
            if (typeof window !== 'undefined' && window.innerWidth < 1024) setActiveTab('output');
        } catch (e: any) {
            setError(e.message);
            if (typeof window !== 'undefined' && window.innerWidth < 1024) setActiveTab('output');
        }
    };

    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
            {/* Header Nexus */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-xl">
                        <Database className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Database Optimizer</h2>
                        <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">SQL Formatter</p>
                    </div>
                </div>
                {/* Mobile Tab Pulse */}
                <div className="lg:hidden flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
                    <button
                        onClick={() => setActiveTab('input')}
                        className={`flex-1 sm:px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'input' ? 'bg-white dark:bg-slate-900 text-emerald-500 shadow-lg' : 'text-slate-400'}`}
                    >
                        Source
                    </button>
                    <button
                        onClick={() => setActiveTab('output')}
                        className={`flex-1 sm:px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'output' ? 'bg-white dark:bg-slate-900 text-emerald-500 shadow-lg' : 'text-slate-400'}`}
                    >
                        Result
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[500px] lg:h-[calc(100vh-20rem)]">
                {/* Source Column */}
                <div className={`flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden ${activeTab === 'input' ? 'flex' : 'hidden lg:flex'}`}>
                    <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-950/30 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Input Protocol</span>
                        </div>
                        <select
                            value={dialect}
                            onChange={(e) => setDialect(e.target.value)}
                            className="bg-transparent border-none text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 focus:outline-none cursor-pointer"
                        >
                            {DIALECTS.map(d => (
                                <option key={d.value} value={d.value}>{d.label}</option>
                            ))}
                        </select>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="SELECT * FROM manifest WHERE status = 'ACTIVE'..."
                        className="flex-1 p-8 bg-slate-50/30 dark:bg-slate-950/50 font-mono text-xs leading-relaxed outline-none resize-none custom-scrollbar text-slate-700 dark:text-slate-300"
                        spellCheck={false}
                    />
                    <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800 lg:hidden">
                        <button
                            onClick={handleFormat}
                            disabled={!input.trim()}
                            className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-[1.5rem] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-4"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            Format SQL Module
                        </button>
                    </div>
                </div>

                {/* Result Column */}
                <div className={`flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden relative ${activeTab === 'output' ? 'flex' : 'hidden lg:flex'}`}>
                    <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-950/30 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Output Manifest</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleMinify}
                                className="text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-emerald-500 transition-colors"
                            >
                                Minify
                            </button>
                            <button
                                onClick={copyToClipboard}
                                disabled={!output}
                                className="p-2 text-slate-300 hover:text-emerald-500 transition-all active:scale-90 disabled:opacity-30"
                            >
                                {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative overflow-hidden">
                        <textarea
                            value={output}
                            readOnly
                            placeholder="-- Formatted SQL projection"
                            className={`w-full h-full p-8 bg-slate-50/50 dark:bg-slate-950/50 font-mono text-xs leading-relaxed outline-none resize-none custom-scrollbar ${error ? 'text-red-400 opacity-50' : 'text-slate-700 dark:text-slate-300'}`}
                        />

                        {error && (
                            <div className="absolute inset-x-6 bottom-6 p-6 bg-red-500/90 backdrop-blur-xl border border-red-400/30 rounded-2xl flex items-start gap-5 animate-in slide-in-from-bottom-4">
                                <AlertCircle className="w-6 h-6 text-white shrink-0 mt-1" />
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Parser Integrity Error</div>
                                    <div className="text-xs text-white/90 font-mono break-all leading-relaxed">{error}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Desktop Command Center */}
                    <div className="hidden lg:flex p-6 border-t border-slate-50 dark:border-slate-800">
                        <button
                            onClick={handleFormat}
                            disabled={!input.trim()}
                            className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-[1.5rem] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-4"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            Format SQL Module
                        </button>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                    Query Processor // SQL ISO/IEC 9075
                </p>
            </div>
        </div>
    );
}
