'use client';

import { useState } from 'react';
import { FileJson, Copy, Minimize, AlignLeft, Trash2, Check, AlertCircle, Code2 } from 'lucide-react';

export function JsonFormatter() {
    const [input, setInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const format = () => {
        try {
            if (!input.trim()) return;
            const parsed = JSON.parse(input);
            setInput(JSON.stringify(parsed, null, 2));
            setError(null);
        } catch (e: any) {
            setError(e.message || 'Invalid JSON');
        }
    };

    const minify = () => {
        try {
            if (!input.trim()) return;
            const parsed = JSON.parse(input);
            setInput(JSON.stringify(parsed));
            setError(null);
        } catch (e: any) {
            setError(e.message || 'Invalid JSON');
        }
    };

    const clear = () => {
        setInput('');
        setError(null);
        setCopied(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(input);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden h-[80vh] flex flex-col">
            {/* Header & Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-slate-100 dark:border-slate-900 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">
                        <Code2 className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm">JSON Editor</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Validation & Formatting</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={format}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-sm font-medium shadow-sm"
                    >
                        <AlignLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-500" /> Prettify
                    </button>
                    <button
                        onClick={minify}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-sm font-medium shadow-sm"
                    >
                        <Minimize className="w-4 h-4 text-blue-600" /> Minify
                    </button>
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 hidden md:block"></div>
                    <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-all text-sm font-medium shadow-sm active:translate-y-0.5"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button
                        onClick={clear}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-slate-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium ml-1"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative bg-slate-50/30 dark:bg-slate-900/30">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste your JSON here..."
                    className={`w-full h-full p-6 font-mono text-sm resize-none focus:outline-none bg-transparent text-slate-800 dark:text-slate-200 placeholder:text-slate-400 leading-relaxed ${error ? 'bg-red-50/30 dark:bg-red-900/10' : ''}`}
                    spellCheck={false}
                />

                {/* Statistics Bar */}
                <div className="absolute bottom-0 inset-x-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 py-2 text-xs text-slate-400 font-mono flex justify-between items-center z-10">
                    <div className="flex gap-4">
                        <span>Chars: {input.length}</span>
                        <span>Lines: {input.split('\n').length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : (input ? 'bg-emerald-500' : 'bg-slate-300')}`} />
                        <span>{error ? 'Invalid' : (input ? 'Valid JSON' : 'Ready')}</span>
                    </div>
                </div>

                {/* Error Toast */}
                {error && (
                    <div className="absolute bottom-12 right-6 bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl shadow-xl shadow-red-500/10 flex items-start gap-3 text-sm font-medium border border-red-100 dark:border-red-900 animate-in slide-in-from-bottom-4 max-w-sm">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold mb-0.5">Syntax Error</p>
                            <p className="text-slate-600 font-normal text-xs">{error}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
