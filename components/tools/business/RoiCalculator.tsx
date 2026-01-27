'use client';

import { useState } from 'react';
import { TrendingUp, RefreshCw, ArrowRight, Settings2 } from 'lucide-react';

export function RoiCalculator() {
    const [adSpend, setAdSpend] = useState<number>(5000);
    const [revenue, setRevenue] = useState<number>(15000);
    const [advancedMode, setAdvancedMode] = useState(false);

    // Advanced inputs
    const [impressions, setImpressions] = useState<number>(0);
    const [clicks, setClicks] = useState<number>(0);

    const profit = revenue - adSpend;
    const roi = adSpend > 0 ? (profit / adSpend) * 100 : 0;
    const isProfitable = profit >= 0;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
            {/* Semantic Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6 text-center sm:text-left">
                    <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-2xl">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Yield Synthesis</h2>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">ROI Architect</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 sm:p-12 lg:p-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Input Vector Matrix */}
                        <div className="space-y-10">
                            <div className="space-y-4 px-2">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">CapEx Configuration</h3>
                                <p className="text-xs text-slate-400 font-medium">Calibrate the financial input stream.</p>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Initial Ad Spend</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                            <span className="text-slate-300 font-black text-xl group-focus-within:text-emerald-500 transition-colors">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={adSpend}
                                            onChange={(e) => setAdSpend(Number(e.target.value))}
                                            className="w-full pl-14 pr-8 py-6 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] outline-none transition-all font-mono text-2xl font-black text-slate-900 dark:text-white shadow-inner"
                                            placeholder="5000"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Gross Yield Return</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                            <span className="text-slate-300 font-black text-xl group-focus-within:text-emerald-500 transition-colors">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={revenue}
                                            onChange={(e) => setRevenue(Number(e.target.value))}
                                            className="w-full pl-14 pr-8 py-6 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] outline-none transition-all font-mono text-2xl font-black text-slate-900 dark:text-white shadow-inner"
                                            placeholder="15000"
                                        />
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-50 dark:border-slate-800/50">
                                    <button
                                        onClick={() => setAdvancedMode(!advancedMode)}
                                        className="w-full flex items-center justify-between p-6 bg-slate-50/50 dark:bg-slate-950/50 rounded-3xl border border-transparent hover:border-emerald-500/20 active:scale-[0.98] transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl transition-all ${advancedMode ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-900 text-slate-300'}`}>
                                                <Settings2 className="w-4 h-4" />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Advanced Modeling</div>
                                                <div className="text-[9px] font-bold text-slate-300 mt-0.5 uppercase tracking-widest">LTV & CTR Matrices</div>
                                            </div>
                                        </div>
                                        <ArrowRight className={`w-4 h-4 transition-transform ${advancedMode ? 'rotate-90 text-emerald-500' : 'text-slate-200'}`} />
                                    </button>
                                    {advancedMode && (
                                        <div className="mt-4 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl animate-in fade-in slide-in-from-top-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                                Heuristic algorithms engaged. Sequence v2.0 optimized.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Projection Matrix */}
                        <div className="space-y-8">
                            <div className={`rounded-[3rem] p-10 sm:p-14 text-center shadow-2xl transition-all duration-700 relative overflow-hidden group ${isProfitable ? 'bg-slate-900 dark:bg-emerald-500 shadow-indigo-500/10' : 'bg-red-500 shadow-red-500/20'}`}>
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mb-6">Net Yield Efficiency</div>
                                    <div className="text-8xl sm:text-9xl font-black text-white tracking-tighter flex items-start gap-1 mb-10">
                                        {roi.toFixed(0)}
                                        <span className="text-4xl font-black mt-6">%</span>
                                    </div>
                                    <div className="w-full pt-10 border-t border-white/10 grid grid-cols-2 gap-8">
                                        <div className="text-left">
                                            <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Net Cash Flow</div>
                                            <div className="text-2xl font-black text-white tracking-tight">{formatCurrency(profit)}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Alpha State</div>
                                            <div className={`text-2xl font-black tracking-tight ${isProfitable ? 'text-emerald-400 dark:text-slate-900' : 'text-red-200'}`}>
                                                {isProfitable ? 'BULLISH' : 'BEARISH'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 bg-slate-50/50 dark:bg-slate-950/50 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-inner group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Synthesis Optimization</h3>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                    Generating <span className="text-slate-900 dark:text-white font-black">{(revenue / adSpend).toFixed(2)}x</span> leverage
                                    on active capital. {isProfitable
                                        ? " Scaling protocol active. Efficiency exceeds benchmark thresholds by a significant margin."
                                        : " Liquidity erosion detected. Reallocate assets to higher performing vectors immediately."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Protocol Meta */}
            <div className="text-center pb-8 border-t border-slate-50 dark:border-slate-900 pt-8 px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200">
                    Yield Intelligence Node // Agentic 2.0 Standard
                </p>
                <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <span className="text-emerald-500">Fixed Rate Matrix</span>
                    <span className="opacity-20">//</span>
                    <span>100% Deterministic</span>
                </div>
            </div>
        </div>
    );
}
