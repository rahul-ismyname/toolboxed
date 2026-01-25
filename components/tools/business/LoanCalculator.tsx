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
        <div className="space-y-12">
            <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                            Loan Amount
                        </label>
                        <div className="relative group">
                            <span className="absolute left-4 top-4 text-slate-400 font-bold">$</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full p-4 pl-8 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                            Interest Rate (%)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                            Tenure (Years)
                        </label>
                        <input
                            type="number"
                            value={tenure}
                            onChange={(e) => setTenure(Number(e.target.value))}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Result Card */}
                <div className="bg-slate-900 dark:bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <div className="text-sm font-bold uppercase tracking-widest opacity-60 mb-2">Monthly EMI</div>
                        <div className="text-6xl font-black mb-10 tracking-tight text-emerald-400">
                            {formatCurrency(calculation.emi)}
                        </div>

                        <div className="space-y-4 pt-8 border-t border-white/10">
                            <div className="flex justify-between items-center text-sm">
                                <span className="opacity-60">Principal Amount</span>
                                <span className="font-bold">{formatCurrency(amount)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="opacity-60">Total Interest</span>
                                <span className="font-bold">{formatCurrency(calculation.totalInterest)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-white/5 text-lg font-black">
                                <span>Total Payable</span>
                                <span>{formatCurrency(calculation.totalPayable)}</span>
                            </div>
                        </div>
                    </div>
                    <Calculator className="absolute -right-8 -bottom-8 w-64 h-64 opacity-5" />
                </div>

                {/* Analysis Card */}
                <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                        Loan Analysis
                    </h3>
                    <div className="space-y-6">
                        <div className="relative h-4 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                            <div
                                className="absolute left-0 top-0 h-full bg-emerald-500"
                                style={{ width: `${(amount / calculation.totalPayable) * 100}%` }}
                            />
                        </div>
                        <div className="flex gap-8">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="text-sm font-medium text-slate-500">Principal ({(amount / calculation.totalPayable * 100).toFixed(0)}%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200" />
                                <span className="text-sm font-medium text-slate-500">Interest ({(calculation.totalInterest / calculation.totalPayable * 100).toFixed(0)}%)</span>
                            </div>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed pt-4 border-t border-slate-100 dark:border-slate-800/50">
                            For every dollar you borrow, you will pay back an additional <span className="font-bold text-slate-900 dark:text-white">${(calculation.totalInterest / amount).toFixed(2)}</span> in interest over {tenure} years.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
