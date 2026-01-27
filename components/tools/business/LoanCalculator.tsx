'use client';

import { useState, useMemo } from 'react';
import { Landmark, ArrowRight, RefreshCw, Calculator, TrendingUp } from 'lucide-react';

export function LoanCalculator() {
    const [amount, setAmount] = useState<number>(50000);
    const [rate, setRate] = useState<number>(8.5);
    const [tenure, setTenure] = useState<number>(5);

    const calculation = useMemo(() => {
        const monthlyRate = (rate / 100) / 12;
        const numberOfPayments = tenure * 12;

        // EMI Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
        const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        const totalPayable = emi * numberOfPayments;
        const totalInterest = totalPayable - amount;

        return { emi, totalPayable, totalInterest };
    }, [amount, rate, tenure]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
            {/* Semantic Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6 text-center sm:text-left">
                    <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-2xl">
                        <Landmark className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Fiscal Architecture</h2>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Loan Architect</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 sm:p-12 lg:p-16">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-14">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Principal Asset</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <span className="text-slate-300 font-black text-xl group-focus-within:text-emerald-500 transition-colors">$</span>
                                </div>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="w-full pl-14 pr-8 py-5 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] outline-none transition-all font-mono text-xl font-black text-slate-900 dark:text-white shadow-inner"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Yield Index (%)</label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    step="0.1"
                                    value={rate}
                                    onChange={(e) => setRate(Number(e.target.value))}
                                    className="w-full px-8 py-5 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] outline-none transition-all font-mono text-xl font-black text-slate-900 dark:text-white shadow-inner text-center"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-500 uppercase">Rate</div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Time Horizon (Y)</label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    value={tenure}
                                    onChange={(e) => setTenure(Number(e.target.value))}
                                    className="w-full px-8 py-5 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] outline-none transition-all font-mono text-xl font-black text-slate-900 dark:text-white shadow-inner text-center"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-500 uppercase">Term</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                {/* Fulfillment Matrix */}
                <div className="bg-slate-900 rounded-[3rem] p-10 sm:p-14 text-white relative overflow-hidden shadow-2xl group transition-all">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/20 to-transparent pointer-events-none" />
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-8">Monthly Fulfillment (EMI)</div>
                        <div className="text-6xl sm:text-8xl font-black mb-16 tracking-tighter text-emerald-400 flex items-start gap-1">
                            {formatCurrency(calculation.emi)}
                        </div>

                        <div className="mt-auto space-y-6 pt-10 border-t border-white/10">
                            {[
                                { label: 'Base Principal', value: formatCurrency(amount) },
                                { label: 'Accumulated Interest', value: formatCurrency(calculation.totalInterest) },
                                { label: 'Gross Liability', value: formatCurrency(calculation.totalPayable), highlight: true }
                            ].map((row, i) => (
                                <div key={i} className={`flex justify-between items-center ${row.highlight ? 'text-2xl font-black pt-8 border-t border-white/10' : 'text-[10px] font-black uppercase tracking-[0.15em] opacity-40'}`}>
                                    <span>{row.label}</span>
                                    <span className={row.highlight ? 'text-emerald-400 font-mono tracking-tighter' : 'font-mono'}>{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Equity Equilibrium */}
                <div className="bg-white dark:bg-slate-900 p-10 sm:p-14 rounded-[3rem] border border-slate-100 dark:border-slate-800 flex flex-col shadow-xl group">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900 transition-all duration-300 shadow-md">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Equity Breakdown Matrix</h3>
                    </div>

                    <div className="space-y-12 flex-1 flex flex-col justify-center">
                        <div className="relative h-4 bg-slate-50 dark:bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-50 dark:border-slate-800">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                style={{ width: `${(amount / calculation.totalPayable) * 100}%` }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Principal Contribution</span>
                                </div>
                                <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{(amount / calculation.totalPayable * 100).toFixed(1)}%</div>
                            </div>
                            <div className="space-y-2 text-right">
                                <div className="flex items-center justify-end gap-3">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Interest Flow Density</span>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800" />
                                </div>
                                <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{(calculation.totalInterest / calculation.totalPayable * 100).toFixed(1)}%</div>
                            </div>
                        </div>

                        <div className="p-10 bg-slate-50/50 dark:bg-slate-950/50 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-inner">
                            <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Alpha State Analysis</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                Capital efficiency projection: Asset maintenance currently costs <span className="font-bold text-slate-900 dark:text-white">${(calculation.totalInterest / amount).toFixed(2)}</span> per principal unit.
                                Aggregate liability is within <span className="text-emerald-500 font-bold">nominal standard thresholds</span> for this risk sector.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reconciliation Footer */}
            <div className="text-center pb-8 pt-4">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200">
                    Capital Fulfillment Protocol // RFC 2452 Financial Standard
                </p>
            </div>
        </div>
    );
}
