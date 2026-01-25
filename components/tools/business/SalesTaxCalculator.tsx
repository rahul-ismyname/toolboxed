'use client';

import { useState, useMemo } from 'react';
import { DollarSign, Receipt, TrendingUp, Info } from 'lucide-react';

export function SalesTaxCalculator() {
    const [amount, setAmount] = useState<number>(100);
    const [taxRate, setTaxRate] = useState<number>(7.5);
    const [type, setType] = useState<'add' | 'remove'>('add');

    const result = useMemo(() => {
        let taxAmount: number;
        let total: number;
        let net: number;

        if (type === 'add') {
            net = amount;
            taxAmount = (amount * taxRate) / 100;
            total = amount + taxAmount;
        } else {
            total = amount;
            net = amount / (1 + taxRate / 100);
            taxAmount = amount - net;
        }

        return { net, taxAmount, total };
    }, [amount, taxRate, type]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    return (
        <div className="space-y-12">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                            Amount ($)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                            Tax Rate (%)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={taxRate}
                            onChange={(e) => setTaxRate(Number(e.target.value))}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                            Calculation Type
                        </label>
                        <div className="flex bg-slate-50 dark:bg-slate-950 p-1 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => setType('add')}
                                className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${type === 'add' ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm' : 'text-slate-400'}`}
                            >
                                Add Tax
                            </button>
                            <button
                                onClick={() => setType('remove')}
                                className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${type === 'remove' ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm' : 'text-slate-400'}`}
                            >
                                Remove Tax
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Result Card */}
                <div className="bg-slate-900 dark:bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <div className="text-sm font-bold uppercase tracking-widest opacity-60 mb-2">Total Amount</div>
                        <div className="text-6xl font-black mb-10 tracking-tight text-emerald-400">
                            {formatCurrency(result.total)}
                        </div>

                        <div className="space-y-4 pt-8 border-t border-white/10">
                            <div className="flex justify-between items-center text-sm">
                                <span className="opacity-60">Net Amount (Before Tax)</span>
                                <span className="font-bold">{formatCurrency(result.net)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-t border-white/5 pt-4">
                                <span className="opacity-60 text-emerald-400">Tax Amount</span>
                                <span className="font-bold text-emerald-400">+{formatCurrency(result.taxAmount)}</span>
                            </div>
                        </div>
                    </div>
                    <Receipt className="absolute -right-8 -bottom-8 w-64 h-64 opacity-5" />
                </div>

                {/* Info Card */}
                <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <Info className="w-5 h-5 text-emerald-500" />
                        Understanding Sales Tax
                    </h3>
                    <div className="space-y-4 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        <p>
                            <strong>Add Tax:</strong> Calculates the final price when a tax percentage is added to your base cost.
                        </p>
                        <p>
                            <strong>Remove Tax (Reverse Tax):</strong> Calculates the original base price if the amount you entered already includes tax (GST/VAT).
                        </p>
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 italic">
                            Formula used: {type === 'add' ? 'Total = Net * (1 + Rate)' : 'Net = Total / (1 + Rate)'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
