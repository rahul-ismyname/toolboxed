'use client';

import { useState, useMemo } from 'react';
import { Calendar, Baby, Clock, Hourglass, Gift } from 'lucide-react';

export function AgeCalculator() {
    const [birthDate, setBirthDate] = useState('');
    const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);

    const result = useMemo(() => {
        if (!birthDate) return null;

        const birth = new Date(birthDate);
        const target = new Date(targetDate);

        if (birth > target) return { error: 'Birth date cannot be in the future!' };

        let years = target.getFullYear() - birth.getFullYear();
        let months = target.getMonth() - birth.getMonth();
        let days = target.getDate() - birth.getDate();

        if (days < 0) {
            months -= 1;
            const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0);
            days += lastMonth.getDate();
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        // Total stats
        const diffTime = Math.abs(target.getTime() - birth.getTime());
        const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = (years * 12) + months;
        const totalHours = totalDays * 24;

        // Next birthday
        const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
        if (nextBirthday < target) {
            nextBirthday.setFullYear(target.getFullYear() + 1);
        }
        const diffNext = nextBirthday.getTime() - target.getTime();
        const daysToNext = Math.ceil(diffNext / (1000 * 60 * 60 * 24));

        return { years, months, days, totalDays, totalWeeks, totalMonths, totalHours, daysToNext };
    }, [birthDate, targetDate]);

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                            Age At Date
                        </label>
                        <input
                            type="date"
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium"
                        />
                    </div>
                </div>

                {result && 'error' in result && (
                    <div className="mt-8 p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl text-center font-medium border border-red-100 dark:border-red-900/30">
                        {result.error}
                    </div>
                )}
            </div>

            {result && !('error' in result) && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-emerald-500 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
                        <div className="relative z-10 text-center">
                            <div className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">You are</div>
                            <div className="text-5xl md:text-6xl font-black mb-4 flex items-baseline justify-center gap-2">
                                {result.years} <span className="text-2xl font-medium opacity-80">Years</span>
                                {result.months} <span className="text-2xl font-medium opacity-80">Months</span>
                            </div>
                            <div className="text-xl font-bold opacity-90">
                                and {result.days} days old
                            </div>
                        </div>
                        <Baby className="absolute -right-8 -bottom-8 w-64 h-64 opacity-10" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-500">
                                    <Gift className="w-5 h-5" />
                                </div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Next Birthday</div>
                            </div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{result.daysToNext} days</div>
                            <div className="text-xs text-slate-400">Until your next celebration</div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-500">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Total Duration</div>
                            </div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{result.totalMonths.toLocaleString()}</div>
                            <div className="text-xs text-slate-400">Total months since birth</div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-500">
                                    <Hourglass className="w-5 h-5" />
                                </div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Life in Days</div>
                            </div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{result.totalDays.toLocaleString()}</div>
                            <div className="text-xs text-slate-400">Total days on earth</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
