'use client';

import { useState } from 'react';
import { Link2, Copy, Check, Trash2 } from 'lucide-react';

export function UrlEncoderDecoder() {
    const [input, setInput] = useState('');
    const [copied, setCopied] = useState(false);

    const encode = () => {
        try {
            setInput(encodeURIComponent(input));
        } catch (e) {
            console.error('Encoding error:', e);
        }
    };

    const decode = () => {
        try {
            setInput(decodeURIComponent(input));
        } catch (e) {
            console.error('Decoding error:', e);
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
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            {/* Toolbar */}
            <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <Link2 className="w-5 h-5 text-emerald-500" />
                    URL Encoder & Decoder
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={encode}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                    >
                        Encode
                    </button>
                    <button
                        onClick={decode}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors"
                    >
                        Decode
                    </button>
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>
                    <button
                        onClick={copyToClipboard}
                        className="p-2 text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-all disabled:opacity-30"
                        disabled={!input}
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
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='Paste your URL or encoded string here...'
                    className="w-full h-[400px] p-6 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-mono text-sm leading-relaxed outline-none focus:border-emerald-500/50 transition-all resize-none shadow-inner"
                />

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Character Count</div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                            {input.length}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
