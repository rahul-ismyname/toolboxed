'use client';

import { useState } from 'react';
import { FileText, Eye, Edit3, Copy, Check, Trash2 } from 'lucide-react';

export function MarkdownPreviewer() {
    const [markdown, setMarkdown] = useState('# Welcome to Toolboxed\n\nEdit this text to see the **preview** update in real-time.\n\n### Features:\n- Live Preview\n- Clean Interface\n- 100% Client-side');
    const [view, setView] = useState<'both' | 'edit' | 'preview'>('both');
    const [copied, setCopied] = useState(false);

    const copyMarkdown = () => {
        navigator.clipboard.writeText(markdown);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Toolbar */}
            <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button
                            onClick={() => setView('edit')}
                            className={`p-1.5 rounded-md transition-all ${view === 'edit' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-500' : 'text-slate-400'}`}
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setView('both')}
                            className={`p-1.5 rounded-md transition-all hidden md:block ${view === 'both' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-500' : 'text-slate-400'}`}
                        >
                            <div className="flex items-center gap-1.5 px-2 text-xs font-bold uppercase tracking-wider">Split</div>
                        </button>
                        <button
                            onClick={() => setView('preview')}
                            className={`p-1.5 rounded-md transition-all ${view === 'preview' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-500' : 'text-slate-400'}`}
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={copyMarkdown}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span className="hidden sm:inline">Copy</span>
                    </button>
                    <button
                        onClick={() => setMarkdown('')}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className={`grid h-[600px] ${view === 'both' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                {/* Editor */}
                {(view === 'edit' || view === 'both') && (
                    <div className="p-0 bg-slate-50 dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800 transition-all">
                        <textarea
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            className="w-full h-full p-8 bg-transparent outline-none font-mono text-sm leading-relaxed resize-none text-slate-700 dark:text-slate-300"
                            placeholder="Type your markdown here..."
                        />
                    </div>
                )}

                {/* Preview (Simplified rendering for MVP) */}
                {(view === 'preview' || view === 'both') && (
                    <div className="p-8 overflow-y-auto prose dark:prose-invert max-w-none transition-all">
                        {markdown ? (
                            <div className="space-y-4">
                                {markdown.split('\n').map((line, i) => {
                                    if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black mt-8 mb-4">{line.replace('# ', '')}</h1>;
                                    if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-6 mb-3">{line.replace('## ', '')}</h2>;
                                    if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-4 mb-2">{line.replace('### ', '')}</h3>;
                                    if (line.startsWith('- ')) return <li key={i} className="ml-4">{line.replace('- ', '')}</li>;
                                    if (line.startsWith('**') && line.endsWith('**')) return <p key={i}><strong>{line.replace(/\*\*/g, '')}</strong></p>;
                                    return <p key={i} className="text-slate-600 dark:text-slate-400 leading-relaxed min-h-[1em]">{line}</p>;
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 italic">
                                Preview will appear here...
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
