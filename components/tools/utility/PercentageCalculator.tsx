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
        <div className="space-y-8">
            {/* Scenario 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                    What is X% of Y?
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-lg font-medium">
                    <span>What is</span>
                    <input
                        type="number"
                        value={s1P}
                        onChange={(e) => setS1P(Number(e.target.value))}
                        className="w-24 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 transition-all text-center"
                    />
                    <span>% of</span>
                    <input
                        type="number"
                        value={s1V}
                        onChange={(e) => setS1V(Number(e.target.value))}
                        className="w-32 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 transition-all text-center"
                    />
                    <div className="flex items-center gap-4 ml-auto">
                        <ArrowRight className="w-5 h-5 text-slate-300" />
                        <div className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 min-w-[120px] text-center">
                            {r1.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Scenario 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                    X is what percent of Y?
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-lg font-medium">
                    <input
                        type="number"
                        value={s2V1}
                        onChange={(e) => setS2V1(Number(e.target.value))}
                        className="w-32 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-blue-500 transition-all text-center"
                    />
                    <span>is what % of</span>
                    <input
                        type="number"
                        value={s2V2}
                        onChange={(e) => setS2V2(Number(e.target.value))}
                        className="w-32 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-blue-500 transition-all text-center"
                    />
                    <div className="flex items-center gap-4 ml-auto">
                        <ArrowRight className="w-5 h-5 text-slate-300" />
                        <div className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 min-w-[120px] text-center">
                            {r2.toFixed(2)}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Scenario 3 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                    Percentage Increase/Decrease
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-lg font-medium">
                    <span>From</span>
                    <input
                        type="number"
                        value={s3V1}
                        onChange={(e) => setS3V1(Number(e.target.value))}
                        className="w-32 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-purple-500 transition-all text-center"
                    />
                    <span>to</span>
                    <input
                        type="number"
                        value={s3V2}
                        onChange={(e) => setS3V2(Number(e.target.value))}
                        className="w-32 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-purple-500 transition-all text-center"
                    />
                    <div className="flex items-center gap-4 ml-auto">
                        <ArrowRight className="w-5 h-5 text-slate-300" />
                        <div className={`px-6 py-3 font-bold rounded-xl shadow-lg min-w-[120px] text-center text-white ${r3 >= 0 ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-red-500 shadow-red-500/20'}`}>
                            {r3 >= 0 ? '+' : ''}{r3.toFixed(2)}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
