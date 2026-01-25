'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Briefcase, Calculator, HelpCircle } from 'lucide-react';

export function FreelanceRateCalc() {
    const [income, setIncome] = useState<number>(100000);
    const [expenses, setExpenses] = useState<number>(500);
    const [hours, setHours] = useState<number>(30);
    const [weeksOff, setWeeksOff] = useState<number>(4);
    const [tax, setTax] = useState<number>(30);

    const [hourlyRate, setHourlyRate] = useState<number>(0);
    const [dailyRate, setDailyRate] = useState<number>(0);
    const [weeklyRate, setWeeklyRate] = useState<number>(0);

    useEffect(() => {
        const annualBizAds = expenses * 12;
        const taxRate = tax / 100;
        const taxableNeeded = income / (1 - taxRate);
        const totalRevenueNeeded = taxableNeeded + annualBizAds;
        const billableWeeks = 52 - weeksOff;
        const totalBillableHours = billableWeeks * hours;

        const rate = totalBillableHours > 0 ? totalRevenueNeeded / totalBillableHours : 0;

        setHourlyRate(Math.ceil(rate));
        setDailyRate(Math.ceil(rate * (hours / 5)));
        setWeeklyRate(Math.ceil(rate * hours));
    }, [income, expenses, hours, weeksOff, tax]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
                    <div className="p-2 bg-slate-900 text-white rounded-lg">
                        <DollarSign className="w-5 h-5" />
                    </div>
                    Freelance Rate Calculator
                </h2>
                <p className="text-slate-500 mt-2 text-sm ml-12">
                    Calculate your required billable rate based on your net income goals.
                </p>
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Desired Annual Net Income
                        </label>
                        <div className="relative group">
                            <span className="absolute left-3 top-2.5 text-slate-400 font-medium group-focus-within:text-slate-900 transition-colors">$</span>
                            <input
                                type="number"
                                value={income}
                                onChange={(e) => setIncome(Number(e.target.value))}
                                className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all font-medium text-slate-900"
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            This is your "Take Home" pay
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Monthly Expenses
                        </label>
                        <div className="relative group">
                            <span className="absolute left-3 top-2.5 text-slate-400 font-medium group-focus-within:text-slate-900 transition-colors">$</span>
                            <input
                                type="number"
                                value={expenses}
                                onChange={(e) => setExpenses(Number(e.target.value))}
                                className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all font-medium text-slate-900"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Billable Hours/Week
                            </label>
                            <input
                                type="number"
                                value={hours}
                                onChange={(e) => setHours(Number(e.target.value))}
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all font-medium text-slate-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Vacation Weeks
                            </label>
                            <input
                                type="number"
                                value={weeksOff}
                                onChange={(e) => setWeeksOff(Number(e.target.value))}
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all font-medium text-slate-900"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-sm font-semibold text-slate-700">Tax Rate</label>
                            <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{tax}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={tax}
                            onChange={(e) => setTax(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-6">
                    <div className="bg-slate-900 text-white rounded-2xl p-8 text-center shadow-xl shadow-slate-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <DollarSign className="w-24 h-24 rotate-12" />
                        </div>

                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2 relative z-10">You must charge</h3>
                        <div className="text-6xl font-black tracking-tight relative z-10">
                            ${hourlyRate}
                            <span className="text-2xl text-slate-500 font-medium ml-1">/hr</span>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 gap-4 relative z-10">
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Daily</div>
                                <div className="text-xl font-bold">${dailyRate}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Weekly</div>
                                <div className="text-xl font-bold">${weeklyRate}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 text-sm text-slate-500 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <HelpCircle className="w-5 h-5 shrink-0 text-slate-400" />
                        <p className="leading-relaxed">
                            <strong>Tip:</strong> This is your <em>break-even</em> rate. Most senor freelancers add a 20-30% "profit margin" on top of this number for growth and savings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
