'use client';

import { useState, useMemo } from 'react';
import { AlignLeft, Copy, Check, RefreshCw, Layers } from 'lucide-react';

export function LoremIpsumGenerator() {
    const [count, setCount] = useState(5);
    const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
    const [copied, setCopied] = useState(false);

    const LOREM = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.",
        "Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.",
        "Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula.",
        "Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam.",
        "Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi.",
        "Duis sapien nunc, commodo et, interdum suscipit, sollicitudin et, dolor.",
        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
        "Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat.",
        "Cras mollis scelerisque nunc. Donec rhoncus. Fusce tation."
    ];

    const generatedText = useMemo(() => {
        let result = [];
        if (type === 'paragraphs') {
            for (let i = 0; i < count; i++) {
                result.push(LOREM.slice(0, Math.floor(Math.random() * 5) + 3).join(' '));
            }
            return result.join('\n\n');
        } else if (type === 'sentences') {
            const allSentences = LOREM.join(' ').split('.');
            return allSentences.slice(0, count).join('.') + '.';
        } else {
            const allWords = LOREM.join(' ').split(' ');
            return allWords.slice(0, count).join(' ');
        }
    }, [count, type]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-8 md:p-12 lg:flex gap-12">
                {/* Configuration */}
                <div className="lg:w-1/3 mb-8 lg:mb-0 space-y-8">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Layers className="w-5 h-5 text-emerald-500" />
                        Generator Settings
                    </h3>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Amount</label>
                            <input
                                type="number"
                                value={count}
                                min="1"
                                max="100"
                                onChange={(e) => setCount(Number(e.target.value))}
                                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Unit Type</label>
                            <div className="grid grid-cols-1 gap-2">
                                {['paragraphs', 'sentences', 'words'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setType(t as any)}
                                        className={`py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all text-left flex items-center justify-between ${type === t
                                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                                                : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                                            }`}
                                    >
                                        <span className="capitalize">{t}</span>
                                        {type === t && <Check className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={copyToClipboard}
                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                        >
                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            {copied ? 'Copied Text' : 'Copy Result'}
                        </button>
                    </div>
                </div>

                {/* Output Area */}
                <div className="flex-1 space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <AlignLeft className="w-5 h-5 text-emerald-500" />
                        Generated Text
                    </h3>
                    <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-3xl border-2 border-slate-100 dark:border-slate-800 h-[500px] overflow-y-auto">
                        <div className="prose dark:prose-invert prose-slate max-w-none text-slate-600 dark:text-slate-400 leading-relaxed font-serif whitespace-pre-wrap">
                            {generatedText}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
