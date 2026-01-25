'use client';

import { useState } from 'react';
import { TrendingUp, RefreshCw, ArrowRight } from 'lucide-react';

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
        <div className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/50">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                    <div className="p-2 bg-slate-900 dark:bg-slate-800 text-white rounded-lg">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    ROI Calculator
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm ml-12">
                    Calculate the profitability of your marketing campaigns.
                </p>
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-12">
                {/* Inputs */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Total Cost / Ad Spend</label>
                        <div className="relative group">
                            <span className="absolute left-3 top-2.5 text-slate-400 font-medium group-focus-within:text-slate-900 dark:group-focus-within:text-slate-100 transition-colors">$</span>
                            <input
                                type="number"
                                value={adSpend}
                                onChange={(e) => setAdSpend(Number(e.target.value))}
                                className="w-full pl-8 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent outline-none transition-all font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-900"
                                placeholder="5000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Total Revenue Generated</label>
                        <div className="relative group">
                            <span className="absolute left-3 top-2.5 text-slate-400 font-medium group-focus-within:text-slate-900 dark:group-focus-within:text-slate-100 transition-colors">$</span>
                            <input
                                type="number"
                                value={revenue}
                                onChange={(e) => setRevenue(Number(e.target.value))}
                                className="w-full pl-8 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 focus:border-transparent outline-none transition-all font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-900"
                                placeholder="15000"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={advancedMode}
                                onChange={(e) => setAdvancedMode(e.target.checked)}
                                className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900"
                            />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Show Advanced Metrics (Coming Soon)</span>
                        </label>
                        {advancedMode && (
                            <p className="text-xs text-slate-400 mt-2 italic">Additional inputs like Impressions and CTR will be available in v1.1</p>
                        )}
                    </div>
                </div>

                {/* Results */}
                <div className="flex flex-col gap-6">
                    <div className={`rounded-2xl p-8 text-center shadow-xl transition-all duration-300 ${isProfitable ? 'bg-slate-900 dark:bg-slate-800 shadow-emerald-900/10' : 'bg-red-500 shadow-red-500/20'}`}>
                        <div className="text-sm font-semibold text-white/70 uppercase tracking-widest mb-2">Return on Investment</div>
                        <div className="text-6xl font-black text-white tracking-tight flex justify-center items-end gap-1">
                            {roi.toFixed(0)}
                            <span className="text-2xl font-bold mb-1.5">%</span>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs text-white/60 uppercase tracking-wide mb-1">Profit/Loss</div>
                                <div className="text-xl font-bold text-white">{formatCurrency(profit)}</div>
                            </div>
                            <div>
                                <div className="text-xs text-white/60 uppercase tracking-wide mb-1">Status</div>
                                <div className="text-xl font-bold text-white">{isProfitable ? 'Positive' : 'Negative'}</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        <p>
                            <strong>Analysis:</strong> For every $1.00 you spent, you made back <strong>${(revenue / adSpend).toFixed(2)}</strong> in revenue.
                            {isProfitable
                                ? " Great job! Your campaign is generating value."
                                : " You are currently losing money on this investment."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
