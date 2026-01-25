'use client';

import { useState, useMemo } from 'react';
import { Columns, Copy, Check, Trash2, ArrowLeftRight, Diff } from 'lucide-react';

export function DiffChecker() {
    const [original, setOriginal] = useState('');
    const [changed, setChanged] = useState('');
    const [copied, setCopied] = useState(false);

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

    const clearAll = () => {
        setOriginal('');
        setChanged('');
    };

    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Original Text</label>
                    <textarea
                        value={original}
                        onChange={(e) => setOriginal(e.target.value)}
                        placeholder="Paste original version here..."
                        className="w-full h-64 p-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500/50 transition-all font-mono text-sm resize-none shadow-sm"
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Changed Text</label>
                    <textarea
                        value={changed}
                        onChange={(e) => setChanged(e.target.value)}
                        placeholder="Paste changed version here..."
                        className="w-full h-64 p-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500/50 transition-all font-mono text-sm resize-none shadow-sm"
                    />
                </div>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={clearAll}
                    className="flex items-center gap-2 px-6 py-2 text-slate-400 hover:text-red-500 transition-colors font-bold uppercase tracking-widest text-xs"
                >
                    <Trash2 className="w-4 h-4" /> Clear Both
                </button>
            </div>

            {diff && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                        <Diff className="w-4 h-4 text-emerald-500" />
                        Difference Analysis
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <table className="w-full border-collapse font-mono text-sm">
                            <tbody>
                                {diff.map((line, i) => (
                                    <tr key={i} className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${line.type === 'added' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' :
                                            line.type === 'removed' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
                                                'text-slate-500'
                                        }`}>
                                        <td className="w-12 text-center select-none opacity-30 border-r border-slate-100 dark:border-slate-800 py-1">{i + 1}</td>
                                        <td className="w-8 text-center select-none font-bold opacity-50 py-1">
                                            {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                                        </td>
                                        <td className="px-4 py-1 whitespace-pre leading-relaxed">{line.content}</td>
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
