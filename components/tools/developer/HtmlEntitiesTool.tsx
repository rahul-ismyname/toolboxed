'use client';

import { useState } from 'react';
import { Code, Copy, Check, Trash2, ArrowLeftRight } from 'lucide-react';

export function HtmlEntitiesTool() {
    const [input, setInput] = useState('');
    const [copied, setCopied] = useState(false);

    const encode = () => {
        const div = document.createElement('div');
        div.textContent = input;
        setInput(div.innerHTML);
    };

    const decode = () => {
        const div = document.createElement('div');
        div.innerHTML = input;
        setInput(div.textContent || '');
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
        <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                {/* Header Evolution */}
                <div className="p-8 sm:p-12 border-b border-slate-50 dark:border-slate-800/50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl shadow-xl">
                                <Code className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Entity Transformation</h2>
                                <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">HTML Processor</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                onClick={copyToClipboard}
                                disabled={!input}
                                className="flex-1 sm:flex-none p-4 bg-white dark:bg-slate-800 text-slate-400 hover:text-emerald-500 rounded-2xl shadow-lg border border-slate-50 dark:border-slate-800 transition-all active:scale-90 disabled:opacity-30"
                            >
                                {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={clearAll}
                                className="flex-1 sm:flex-none p-4 bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-2xl transition-all active:scale-90"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-8 sm:p-12 space-y-8">
                    {/* Action Nexus */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={encode}
                            className="py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-4"
                        >
                            <ArrowLeftRight className="w-5 h-5" />
                            Synthesize Encoding
                        </button>
                        <button
                            onClick={decode}
                            className="py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4"
                        >
                            <ArrowLeftRight className="w-5 h-5 rotate-180" />
                            Resolve Entities
                        </button>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-[2rem] blur opacity-0 group-focus-within:opacity-5 transition duration-1000"></div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter raw string or entities for processing..."
                            className="relative w-full h-[350px] p-8 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500/30 rounded-[2rem] text-slate-900 dark:text-white font-mono text-sm leading-relaxed outline-none transition-all resize-none shadow-inner"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-50 dark:border-slate-800/50 text-center">
                            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Magnitude</div>
                            <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                                {input.length}
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-50 dark:border-slate-800/50 text-center">
                            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Engine Status</div>
                            <div className={`text-xl font-black uppercase tracking-tighter ${input ? 'text-emerald-500' : 'text-slate-400'}`}>
                                {input ? 'Active' : 'Standby'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                    Transcoding node // HTML 5.2 Compliant
                </p>
            </div>
        </div>
    );
}
