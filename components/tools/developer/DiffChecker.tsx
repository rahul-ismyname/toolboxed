'use client';

import { useState, useMemo, useCallback } from 'react';
import { Trash2, Diff } from 'lucide-react';

export function DiffChecker() {
    const [original, setOriginal] = useState('');
    const [changed, setChanged] = useState('');

    const diff = useMemo(() => {
        if (!original && !changed) return null;

        const originalLines = original.split('\n');
        const changedLines = changed.split('\n');

        const lines: { content: string; type: 'unchanged' | 'added' | 'removed' }[] = [];

        // Very basic line-by-line diff for MVP
        const maxLines = Math.max(originalLines.length, changedLines.length);

        for (let i = 0; i < maxLines; i++) {
            const o = originalLines[i];
            const c = changedLines[i];

            if (o === c) {
                if (o !== undefined) lines.push({ content: o, type: 'unchanged' });
            } else {
                if (o !== undefined) lines.push({ content: o, type: 'removed' });
                if (c !== undefined) lines.push({ content: c, type: 'added' });
            }
        }

        return lines;
    }, [original, changed]);

    const clearAll = useCallback(() => {
        setOriginal('');
        setChanged('');
    }, []);

    const [resultView, setResultView] = useState<'diff' | 'original' | 'changed'>('diff');

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2 md:space-y-3">
                    <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Original Text</label>
                    <textarea
                        value={original}
                        onChange={(e) => setOriginal(e.target.value)}
                        placeholder="Paste original version here..."
                        className="w-full h-48 md:h-64 p-4 md:p-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500/50 transition-all font-mono text-xs md:text-sm resize-none shadow-sm"
                    />
                </div>
                <div className="space-y-2 md:space-y-3">
                    <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Changed Text</label>
                    <textarea
                        value={changed}
                        onChange={(e) => setChanged(e.target.value)}
                        placeholder="Paste changed version here..."
                        className="w-full h-48 md:h-64 p-4 md:p-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500/50 transition-all font-mono text-xs md:text-sm resize-none shadow-sm"
                    />
                </div>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={clearAll}
                    className="flex items-center gap-2 px-4 md:px-6 py-2 text-slate-400 hover:text-red-500 transition-colors font-bold uppercase tracking-widest text-[10px] md:text-xs"
                >
                    <Trash2 className="w-4 h-4" /> Clear Both
                </button>
            </div>

            {diff && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="border-b border-slate-100 dark:border-slate-800 px-4 md:px-6 py-3 md:py-4 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                            <Diff className="w-4 h-4 text-emerald-500" />
                            Difference Analysis
                        </div>

                        {/* Result View Tabs (Mobile Focus) */}
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start md:self-auto">
                            {[
                                { id: 'diff', label: 'Diff' },
                                { id: 'original', label: 'Orig' },
                                { id: 'changed', label: 'New' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setResultView(tab.id as 'diff' | 'original' | 'changed')}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${resultView === tab.id ? 'bg-white dark:bg-slate-700 text-emerald-500 shadow-sm' : 'text-slate-400'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-0 overflow-x-auto no-scrollbar">
                        <table className="w-full border-collapse font-mono text-[11px] md:text-sm min-w-[500px] md:min-w-0">
                            <tbody>
                                {diff.filter(line => {
                                    if (resultView === 'diff') return true;
                                    if (resultView === 'original') return line.type !== 'added';
                                    if (resultView === 'changed') return line.type !== 'removed';
                                    return true;
                                }).map((line, i) => (
                                    <tr key={i} className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${line.type === 'added' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' :
                                        line.type === 'removed' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
                                            'text-slate-500'
                                        }`}>
                                        <td className="w-8 md:w-12 text-center select-none opacity-30 border-r border-slate-100 dark:border-slate-800 py-1">{i + 1}</td>
                                        <td className="w-6 md:w-8 text-center select-none font-bold opacity-50 py-1">
                                            {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                                        </td>
                                        <td className="px-3 md:px-4 py-1 whitespace-pre leading-relaxed">{line.content || ' '}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
