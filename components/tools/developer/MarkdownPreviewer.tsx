'use client';

import { useState, useEffect } from 'react';
import { Eye, Edit3, Copy, Check, Trash2, ArrowLeftRight } from 'lucide-react';

export function MarkdownPreviewer() {
    const [markdown, setMarkdown] = useState('# Welcome to Toolboxed\n\nEdit this text to see the **preview** update in real-time.\n\n### Features:\n- Live Preview\n- Clean Interface\n- 100% Client-side');
    const [view, setView] = useState<'both' | 'edit' | 'preview'>('both');
    const [copied, setCopied] = useState(false);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const copyMarkdown = () => {
        navigator.clipboard.writeText(markdown);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
            {/* Semantic Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6 text-center sm:text-left">
                    <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-2xl">
                        <Edit3 className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Lexical Synthesis</h2>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Markdown Architect</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
                    <button
                        onClick={() => setView('edit')}
                        className={`p-2.5 px-5 rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${view === 'edit' ? 'bg-white dark:bg-slate-800 shadow-xl text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Edit3 className="w-4 h-4" />
                        <span className={view === 'edit' ? 'inline' : 'hidden sm:inline'}>Editor</span>
                    </button>
                    <button
                        onClick={() => setView('preview')}
                        className={`p-2.5 px-5 rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${view === 'preview' ? 'bg-white dark:bg-slate-800 shadow-xl text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Eye className="w-4 h-4" />
                        <span className={view === 'preview' ? 'inline' : 'hidden sm:inline'}>Preview</span>
                    </button>
                    <button
                        onClick={() => setView('both')}
                        className={`hidden lg:flex p-2.5 px-5 rounded-xl transition-all items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${view === 'both' ? 'bg-white dark:bg-slate-800 shadow-xl text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <ArrowLeftRight className="w-4 h-4" />
                        <span>Projection</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                {/* Secondary Actions */}
                <div className="px-8 py-5 border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/20 dark:bg-slate-950/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Direct Serialization Buffer</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={copyMarkdown}
                            className={`p-3 rounded-xl transition-all active:scale-90 ${copied ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-emerald-500 shadow-sm border border-slate-100 dark:border-slate-700'}`}
                            title="Copy All"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={() => setMarkdown('')}
                            className="p-3 bg-white dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 active:scale-90 transition-all"
                            title="Purge Buffer"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className={`grid h-[600px] lg:h-[700px] ${view === 'both' && !isMobile ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
                    {/* Source Vector */}
                    {(view === 'edit' || (view === 'both' && !isMobile)) && (
                        <div className={`flex flex-col bg-slate-50/50 dark:bg-slate-950/30 border-r border-slate-100 dark:border-slate-800/50 transition-all ${(view === 'both' && isMobile) ? 'hidden' : ''}`}>
                            <div className="px-10 py-4 text-[9px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-100 dark:border-slate-900/50">Source Matrix</div>
                            <textarea
                                value={markdown}
                                onChange={(e) => setMarkdown(e.target.value)}
                                className="flex-1 w-full p-10 bg-transparent outline-none font-mono text-sm leading-relaxed resize-none text-slate-600 dark:text-slate-400 scrollbar-hide shadow-inner"
                                placeholder="Commence markdown synthesis..."
                            />
                        </div>
                    )}

                    {/* Result Projection */}
                    {(view === 'preview' || (view === 'both' && !isMobile)) && (
                        <div className={`flex flex-col transition-all overflow-hidden ${(view === 'both' && isMobile) ? 'hidden' : ''}`}>
                            <div className="px-10 py-4 text-[9px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-100 dark:border-slate-900/50">Projection Area</div>
                            <div className="flex-1 p-10 overflow-y-auto custom-scrollbar prose dark:prose-invert max-w-none">
                                {markdown ? (
                                    <div className="space-y-6">
                                        {markdown.split('\n').map((line, i) => {
                                            if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black mt-8 mb-6 text-slate-900 dark:text-white uppercase tracking-tight">{line.replace('# ', '')}</h1>;
                                            if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-black mt-6 mb-4 text-slate-800 dark:text-slate-100">{line.replace('## ', '')}</h2>;
                                            if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-4 mb-3 text-slate-700 dark:text-slate-200">{line.replace('### ', '')}</h3>;
                                            if (line.startsWith('- ')) return <li key={i} className="ml-6 text-slate-600 dark:text-slate-400 list-disc marker:text-emerald-500">{line.replace('- ', '')}</li>;
                                            if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="text-slate-600 dark:text-slate-400 font-bold">{line.replace(/\*\*/g, '')}</p>;
                                            if (!line.trim()) return <div key={i} className="h-4" />;
                                            return <p key={i} className="text-slate-600 dark:text-slate-400 leading-relaxed">{line}</p>;
                                        })}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center space-y-6 text-slate-200 dark:text-slate-800">
                                        <Eye className="w-16 h-16 opacity-10" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Projection Awaiting Stream</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Verification Specification */}
            <div className="text-center pb-8 border-t border-slate-50 dark:border-slate-900 pt-8 px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200">
                    Serialization Engine // RFC 7763 Standard
                </p>
                <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <span className="text-emerald-500">Real-time Buffer</span>
                    <span className="opacity-20">//</span>
                    <span>100% Deterministic</span>
                </div>
            </div>
        </div>
    );
}
