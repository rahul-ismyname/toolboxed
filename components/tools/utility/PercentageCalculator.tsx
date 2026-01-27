'use client';

import { useState, useMemo } from 'react';
import { Percent, ArrowRight, RotateCcw } from 'lucide-react';

export function PercentageCalculator() {
    // Scenario 1: What is X% of Y?
    const [s1P, setS1P] = useState<number>(10);
    const [s1V, setS1V] = useState<number>(100);

    // Scenario 2: X is what percent of Y?
    const [s2V1, setS2V1] = useState<number>(20);
    const [s2V2, setS2V2] = useState<number>(200);

    // Scenario 3: Percentage increase/decrease from X to Y
    const [s3V1, setS3V1] = useState<number>(100);
    const [s3V2, setS3V2] = useState<number>(150);

    const r1 = useMemo(() => (s1P / 100) * s1V, [s1P, s1V]);
    const r2 = useMemo(() => (s2V2 !== 0 ? (s2V1 / s2V2) * 100 : 0), [s2V1, s2V2]);
    const r3 = useMemo(() => (s3V1 !== 0 ? ((s3V2 - s3V1) / s3V1) * 100 : 0), [s3V1, s3V2]);

    return (
        <div className="max-w-5xl mx-auto space-y-12 lg:space-y-16 animate-in fade-in duration-500 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6 text-center sm:text-left">
                    <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-2xl">
                        <Percent className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Ratio Architect</h2>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Proportional Logic</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-8">
                {/* Scenario 1: What is X% of Y? */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-950/50 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[4rem] -mr-8 -mt-8 pointer-events-none transition-all group-hover:w-40 group-hover:h-40" />

                    <div className="flex items-center gap-4 mb-10 relative z-10">
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                            <Percent className="w-5 h-5" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Magnitude Extraction</h3>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10 relative z-10">
                        <div className="flex-1 w-full space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Factor Percentage</label>
                            <div className="relative group/input">
                                <input
                                    type="number"
                                    value={s1P}
                                    onChange={(e) => setS1P(Number(e.target.value))}
                                    className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] outline-none transition-all text-center font-mono font-black text-2xl shadow-inner text-slate-900 dark:text-white"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black pointer-events-none">%</div>
                            </div>
                        </div>
                        <div className="text-slate-300 font-black uppercase text-[10px] tracking-widest pt-6">OF</div>
                        <div className="flex-1 w-full space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Origin Value</label>
                            <input
                                type="number"
                                value={s1V}
                                onChange={(e) => setS1V(Number(e.target.value))}
                                className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] outline-none transition-all text-center font-mono font-black text-2xl shadow-inner text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="flex items-center gap-6 pt-6">
                            <ArrowRight className="w-6 h-6 text-slate-200 hidden lg:block" />
                            <div className="px-10 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-[2rem] shadow-2xl min-w-[160px] text-center text-2xl tracking-tighter hover:scale-105 transition-transform cursor-default">
                                {r1.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scenario 2: X is what percent of Y? */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-950/50 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[4rem] -mr-8 -mt-8 pointer-events-none transition-all group-hover:w-40 group-hover:h-40" />

                    <div className="flex items-center gap-4 mb-10 relative z-10">
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
                            <Percent className="w-5 h-5" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Ratio Synthesis</h3>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10 relative z-10">
                        <div className="flex-1 w-full space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Subset Value</label>
                            <input
                                type="number"
                                value={s2V1}
                                onChange={(e) => setS2V1(Number(e.target.value))}
                                className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-950/50 border-2 border-transparent focus:border-blue-500/20 rounded-[2rem] outline-none transition-all text-center font-mono font-black text-2xl shadow-inner text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="text-slate-300 font-black uppercase text-[10px] tracking-widest pt-6 whitespace-nowrap">IS OF</div>
                        <div className="flex-1 w-full space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Total Origin</label>
                            <input
                                type="number"
                                value={s2V2}
                                onChange={(e) => setS2V2(Number(e.target.value))}
                                className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-950/50 border-2 border-transparent focus:border-blue-500/20 rounded-[2rem] outline-none transition-all text-center font-mono font-black text-2xl shadow-inner text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="flex items-center gap-6 pt-6">
                            <ArrowRight className="w-6 h-6 text-slate-200 hidden lg:block" />
                            <div className="px-10 py-6 bg-blue-500 text-white font-black rounded-[2rem] shadow-2xl shadow-blue-500/20 min-w-[160px] text-center text-2xl tracking-tighter hover:scale-105 transition-transform cursor-default">
                                {r2.toFixed(2)}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scenario 3: Percentage Increase/Decrease */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-950/50 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-[4rem] -mr-8 -mt-8 pointer-events-none transition-all group-hover:w-40 group-hover:h-40" />

                    <div className="flex items-center gap-4 mb-10 relative z-10">
                        <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl">
                            <Percent className="w-5 h-5" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Delta Evolution</h3>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10 relative z-10">
                        <div className="flex-1 w-full space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Phase 1 (Origin)</label>
                            <input
                                type="number"
                                value={s3V1}
                                onChange={(e) => setS3V1(Number(e.target.value))}
                                className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-950/50 border-2 border-transparent focus:border-purple-500/20 rounded-[2rem] outline-none transition-all text-center font-mono font-black text-2xl shadow-inner text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="text-slate-300 font-black uppercase text-[10px] tracking-widest pt-6">TO</div>
                        <div className="flex-1 w-full space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Phase 2 (Target)</label>
                            <input
                                type="number"
                                value={s3V2}
                                onChange={(e) => setS3V2(Number(e.target.value))}
                                className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-950/50 border-2 border-transparent focus:border-purple-500/20 rounded-[2rem] outline-none transition-all text-center font-mono font-black text-2xl shadow-inner text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="flex items-center gap-6 pt-6">
                            <ArrowRight className="w-6 h-6 text-slate-200 hidden lg:block" />
                            <div className={`px-10 py-6 font-black rounded-[2rem] shadow-2xl min-w-[160px] text-center text-2xl tracking-tighter text-white transition-all duration-500 hover:scale-105 cursor-default ${r3 >= 0 ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 shadow-rose-500/20'}`}>
                                {r3 >= 0 ? '+' : ''}{r3.toFixed(2)}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center pb-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-6 opacity-30 px-6">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                    Proportional Logic Engine // Active
                </p>
                <div className="p-2 border border-slate-200 dark:border-slate-800 rounded-full">
                    <RotateCcw className="w-3 h-3 text-slate-400" />
                </div>
            </div>
        </div>
    );
}
