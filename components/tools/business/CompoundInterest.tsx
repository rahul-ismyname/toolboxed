'use client';

import { useState, useMemo } from 'react';
import { Landmark, ArrowRight, RefreshCw, Calculator } from 'lucide-react';

export function CompoundInterest() {
    const [initialAmount, setInitialAmount] = useState<number>(10000);
    const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
    const [rate, setRate] = useState<number>(7);
    const [years, setYears] = useState<number>(10);
    const [frequency, setFrequency] = useState<number>(12); // Compounded monthly by default

    const calculation = useMemo(() => {
        let total = initialAmount;
        const monthlyRate = (rate / 100) / 12;
        const totalMonths = years * 12;
        const schedule = [];

        for (let month = 1; month <= totalMonths; month++) {
            total = (total + monthlyContribution) * (1 + monthlyRate);
            if (month % 12 === 0) {
                schedule.push({
                    year: month / 12,
                    balance: total,
                    totalContributions: initialAmount + (monthlyContribution * month)
                });
            }
        }

        const totalContributions = initialAmount + (monthlyContribution * totalMonths);
        const totalInterest = total - totalContributions;

        return { total, totalContributions, totalInterest, schedule };
    }, [initialAmount, monthlyContribution, rate, years]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="space-y-12">
            <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-8 grid lg:grid-cols-2 gap-12">
                    {/* Inputs */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-emerald-500" />
                            Investment Parameters
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Initial Deposit</label>
                                <div className="relative group">
                                    <span className="absolute left-3 top-2.5 text-slate-400 font-medium group-focus-within:text-slate-900 dark:group-focus-within:text-slate-100 transition-colors">$</span>
                                    <input
                                        type="number"
                                        value={initialAmount}
                                        onChange={(e) => setInitialAmount(Number(e.target.value))}
                                        className="w-full pl-8 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Monthly Contribution</label>
                                <div className="relative group">
                                    <span className="absolute left-3 top-2.5 text-slate-400 font-medium group-focus-within:text-slate-900 dark:group-focus-within:text-slate-100 transition-colors">$</span>
                                    <input
                                        type="number"
                                        value={monthlyContribution}
                                        onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                                        className="w-full pl-8 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Annual Interest Rate (%)</label>
                                <input
                                    type="number"
                                    value={rate}
                                    onChange={(e) => setRate(Number(e.target.value))}
                                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Investment Period (Years)</label>
                                <input
                                    type="number"
                                    value={years}
                                    onChange={(e) => setYears(Math.min(50, Number(e.target.value)))}
                                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Results Card */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-emerald-500 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg shadow-emerald-500/20">
                            <div className="relative z-10 text-center">
                                <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Estimated Future Value</div>
                                <div className="text-5xl font-black mb-6 tracking-tight">
                                    {formatCurrency(calculation.total)}
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-6">
                                    <div>
                                        <div className="text-[10px] uppercase font-bold opacity-70 mb-1">Total Contributions</div>
                                        <div className="text-xl font-bold">{formatCurrency(calculation.totalContributions)}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-bold opacity-70 mb-1">Total Interest</div>
                                        <div className="text-xl font-bold">{formatCurrency(calculation.totalInterest)}</div>
                                    </div>
                                </div>
                            </div>
                            <Landmark className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10" />
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                            *This is an estimate based on annual compounding. Actual results may vary based on currency fluctuations and precise compounding schedules.
                        </div>
                    </div>
                </div>
            </div>

            {/* Growth Schedule */}
            <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-8 overflow-hidden">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Yearly Growth Projection</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Year</th>
                                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Future Value</th>
                                <th className="py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Growth</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                            {calculation.schedule.map((row) => (
                                <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                    <td className="py-4 font-bold text-slate-900 dark:text-white">Year {row.year}</td>
                                    <td className="py-4 text-emerald-600 dark:text-emerald-400 font-mono font-bold">{formatCurrency(row.balance)}</td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full flex-1 max-w-[100px] overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-500"
                                                    style={{ width: `${(row.balance / calculation.total) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-400 font-bold">{((row.balance / calculation.total) * 100).toFixed(0)}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
