'use client';

import { useState, useMemo } from 'react';
import { Activity, Apple, Zap, Scale, Info } from 'lucide-react';

export function BmrCalculator() {
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [age, setAge] = useState<number>(25);
    const [weight, setWeight] = useState<number>(70);
    const [height, setHeight] = useState<number>(170);

    const bmr = useMemo(() => {
        // Mifflin-St Jeor Equation
        if (gender === 'male') {
            return (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            return (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }
    }, [gender, age, weight, height]);

    const calorieTiers = [
        { label: 'Sedentary', multiplier: 1.2, desc: 'Little or no exercise' },
        { label: 'Lightly Active', multiplier: 1.375, desc: 'Exercise 1-3 times/week' },
        { label: 'Moderately Active', multiplier: 1.55, desc: 'Exercise 4-5 times/week' },
        { label: 'Very Active', multiplier: 1.725, desc: 'Intense exercise daily' },
        { label: 'Extra Active', multiplier: 1.9, desc: 'Physical job or training 2x/day' }
    ];

    return (
        <div className="space-y-12">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Inputs */}
                    <div className="space-y-8">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Sex</label>
                            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl">
                                <button
                                    onClick={() => setGender('male')}
                                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${gender === 'male' ? 'bg-white dark:bg-slate-800 shadow-sm text-emerald-500' : 'text-slate-400'}`}
                                >
                                    Male
                                </button>
                                <button
                                    onClick={() => setGender('female')}
                                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${gender === 'female' ? 'bg-white dark:bg-slate-800 shadow-sm text-emerald-500' : 'text-slate-400'}`}
                                >
                                    Female
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Age</label>
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(Number(e.target.value))}
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Weight (kg)</label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(Number(e.target.value))}
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Height (cm)</label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(Number(e.target.value))}
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Result */}
                    <div className="flex flex-col justify-center">
                        <div className="bg-emerald-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-emerald-500/20">
                            <div className="relative z-10 text-center">
                                <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Your Basal Metabolic Rate</div>
                                <div className="text-6xl font-black mb-2 tracking-tight">
                                    {Math.round(bmr)}
                                </div>
                                <div className="text-lg font-bold opacity-90">Calories / day</div>
                            </div>
                            <Zap className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10" />
                        </div>
                        <div className="mt-6 flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-500 leading-relaxed italic">
                                BMR is the number of calories your body burns at complete rest to maintain vital functions (breathing, circulation, cell production).
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Needs */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 px-2">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    Daily Calorie Needs Based on Activity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {calorieTiers.map((tier) => (
                        <div key={tier.label} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-emerald-500/50 group">
                            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-emerald-500 transition-colors uppercase">{tier.label}</div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white mb-2">{Math.round(bmr * tier.multiplier)}</div>
                            <div className="text-[10px] text-slate-500 leading-tight">{tier.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
