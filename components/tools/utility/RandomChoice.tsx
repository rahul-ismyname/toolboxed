'use client';

import { useState, useRef, useEffect } from 'react';
import { Shuffle, Trash2, Plus, Sparkles, Trophy, ListTodo, HelpCircle } from 'lucide-react';

export function RandomChoice() {
    const [input, setInput] = useState('');
    const [choices, setChoices] = useState<string[]>([]);
    const [winner, setWinner] = useState<string | null>(null);
    const [isShuffling, setIsShuffling] = useState(false);
    const [pickIndex, setPickIndex] = useState(0);

    const addChoices = () => {
        const newChoices = input.split(/[\n,]/).map(c => c.trim()).filter(c => c.length > 0);
        setChoices(prev => Array.from(new Set([...prev, ...newChoices])));
        setInput('');
    };

    const removeChoice = (index: number) => {
        setChoices(prev => prev.filter((_, i) => i !== index));
    };

    const clearAll = () => {
        setChoices([]);
        setWinner(null);
    };

    const pickRandom = async () => {
        if (choices.length < 2 || isShuffling) return;
        setIsShuffling(true);
        setWinner(null);

        // Simulation of shuffling
        let iterations = 20;
        for (let i = 0; i < iterations; i++) {
            setPickIndex(Math.floor(Math.random() * choices.length));
            await new Promise(resolve => setTimeout(resolve, 50 + (i * 10)));
        }

        const finalWinner = choices[Math.floor(Math.random() * choices.length)];
        setWinner(finalWinner);
        setIsShuffling(false);
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Input Section */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
                        <div className="flex items-center gap-3">
                            <ListTodo className="w-6 h-6 text-emerald-500" />
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Setup</h3>
                        </div>

                        <div className="space-y-4">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), addChoices())}
                                placeholder="Enter options (comma or newline separated)..."
                                className="w-full h-40 bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-slate-900 dark:text-white outline-none focus:border-emerald-500/50 transition-all font-medium resize-none text-sm"
                            />
                            <button
                                onClick={addChoices}
                                disabled={!input.trim()}
                                className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 group disabled:opacity-30"
                            >
                                <Plus className="w-4 h-4 transition-transform group-active:scale-125" /> Add Options
                            </button>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={clearAll}
                                className="w-full py-3 text-slate-400 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-3 h-3" /> Clear Everything
                            </button>
                        </div>
                    </div>
                </div>

                {/* Animation & Result Section */}
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 md:p-12 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden min-h-[500px] flex flex-col justify-center items-center">
                        {/* Background Decoration */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />

                        {choices.length < 2 ? (
                            <div className="text-center space-y-6 animate-in fade-in duration-500">
                                <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center mx-auto border border-slate-100 dark:border-slate-800">
                                    <HelpCircle className="w-10 h-10 text-slate-300" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-bold text-slate-400">Not enough options yet</h4>
                                    <p className="text-sm text-slate-400/60 max-w-[280px] mx-auto">Add at least two choices on the left to start the magic!</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full space-y-12 text-center relative z-10">
                                <div className="bg-slate-50 dark:bg-slate-950/50 p-12 rounded-[40px] border-4 border-slate-100 dark:border-slate-800/50 shadow-inner relative group transition-all">
                                    {isShuffling ? (
                                        <div className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white animate-bounce tracking-tight truncate px-4">
                                            {choices[pickIndex]}
                                        </div>
                                    ) : winner ? (
                                        <div className="space-y-6 animate-in zoom-in duration-500">
                                            <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 shadow-lg shadow-emerald-500/30">
                                                <Trophy className="w-3 h-3" /> The Winner
                                            </div>
                                            <div className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter break-words px-4 drop-shadow-sm">
                                                {winner}
                                            </div>
                                            <div className="flex justify-center gap-2">
                                                <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                                                <Sparkles className="w-6 h-6 text-emerald-500 animate-pulse delay-75" />
                                                <Sparkles className="w-6 h-6 text-blue-500 animate-pulse delay-150" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="text-6xl md:text-8xl font-black text-slate-100 dark:text-slate-900 tracking-tighter">
                                                READY?
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Tap shuffle below</p>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={pickRandom}
                                    disabled={isShuffling}
                                    className={`px-16 py-6 rounded-full font-black uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-2xl relative group ${isShuffling ? 'bg-slate-200 text-slate-400 dark:bg-slate-800' : 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:scale-105'}`}
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        <Shuffle className={`w-5 h-5 ${isShuffling ? 'animate-spin' : ''}`} />
                                        {isShuffling ? 'Deciding...' : 'SHUFFLE & PICK'}
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Chips Display */}
                    <div className="flex flex-wrap gap-3 justify-center">
                        {choices.map((choice, i) => (
                            <div
                                key={i}
                                className="group flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm transition-all hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/20"
                            >
                                <span className="max-w-[120px] truncate">{choice}</span>
                                <button
                                    onClick={() => removeChoice(i)}
                                    className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
