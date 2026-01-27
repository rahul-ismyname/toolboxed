'use client';

import { useState, useEffect } from 'react';
import { LoremIpsum } from 'lorem-ipsum';
import { Copy, Check, RefreshCw, Settings2 } from 'lucide-react';

type Unit = 'paragraphs' | 'sentences' | 'words';

export function LoremGenerator() {
    const [count, setCount] = useState(3);
    const [unit, setUnit] = useState<Unit>('paragraphs');
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);

    const lorem = new LoremIpsum({
        sentencesPerParagraph: {
            max: 8,
            min: 4
        },
        wordsPerSentence: {
            max: 16,
            min: 4
        }
    });

    const generateText = () => {
        let generated = '';
        switch (unit) {
            case 'paragraphs':
                generated = lorem.generateParagraphs(count);
                break;
            case 'sentences':
                generated = lorem.generateSentences(count);
                break;
            case 'words':
                generated = lorem.generateWords(count);
                break;
        }
        setText(generated);
    };

    // Generate initial text
    useEffect(() => {
        generateText();
    }, [count, unit]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
            {/* Semantic Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6 text-center sm:text-left">
                    <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-2xl">
                        <Settings2 className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Synthetic Synthesis</h2>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Lorem Architect</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 sm:p-12 lg:p-16">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                        {/* Control Matrix */}
                        <div className="lg:w-1/3 space-y-10">
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-1">Synthesis Matrix</h3>
                                    <p className="text-xs text-slate-400 px-1 font-medium">Fine-tune the output density.</p>
                                </div>

                                <div className="space-y-8 p-8 bg-slate-50 dark:bg-slate-950/50 rounded-[2.5rem] border border-slate-50 dark:border-slate-800/50 shadow-inner">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Magnification</label>
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={count}
                                                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-full px-8 py-5 bg-white dark:bg-slate-900 border-2 border-transparent focus:border-emerald-500/30 rounded-2xl font-mono font-black text-2xl text-slate-900 dark:text-white outline-none transition-all shadow-sm"
                                            />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">Tokens</div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Vector Type</label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {(['paragraphs', 'sentences', 'words'] as Unit[]).map((u) => (
                                                <button
                                                    key={u}
                                                    onClick={() => setUnit(u)}
                                                    className={`px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 text-left flex items-center justify-between ${unit === u ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 border-transparent hover:border-slate-100 dark:hover:border-slate-800'}`}
                                                >
                                                    {u}
                                                    {unit === u && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={generateText}
                                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-3 lg:hover:skew-x-2"
                                >
                                    <RefreshCw className="w-4 h-4" /> Mutate Stream
                                </button>
                                <button
                                    onClick={copyToClipboard}
                                    className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 lg:hover:-skew-x-2"
                                >
                                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Buffer Synced' : 'Copy Sequence'}
                                </button>
                            </div>
                        </div>

                        {/* Stream Projection */}
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center justify-between px-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Active Projection Stream</h3>
                                </div>
                                <span className="text-[9px] font-black text-slate-200 dark:text-slate-800 tracking-widest">UTF-8 // EN-US</span>
                            </div>
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-[3rem] blur opacity-0 group-hover:opacity-5 transition duration-1000"></div>
                                <textarea
                                    value={text}
                                    readOnly
                                    className="relative w-full h-[450px] lg:h-[600px] p-10 sm:p-14 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500/20 rounded-[3rem] text-slate-600 dark:text-slate-400 font-serif text-lg leading-relaxed outline-none shadow-inner resize-none scrollbar-hide select-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Protocol Specification */}
            <div className="text-center pb-8 pt-4">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200">
                    Synthetic Text Generator Node // Agentic 2.0 Standard
                </p>
            </div>
        </div>
    );
}
