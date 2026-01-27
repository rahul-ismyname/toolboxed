'use client';

import { useState } from 'react';
import { Calculator, ArrowRight, RefreshCcw } from 'lucide-react';

type Gender = 'male' | 'female';
type Activity = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
type Goal = 'lose' | 'maintain' | 'gain';

interface Results {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
}

export function KetoCalculator() {
    const [age, setAge] = useState<number | ''>('');
    const [gender, setGender] = useState<Gender>('female');
    const [weight, setWeight] = useState<number | ''>('');
    const [height, setHeight] = useState<number | ''>('');
    const [activity, setActivity] = useState<Activity>('sedentary');
    const [goal, setGoal] = useState<Goal>('lose');
    const [results, setResults] = useState<Results | null>(null);

    const calculate = () => {
        if (!age || !weight || !height) return;

        // Mifflin-St Jeor Equation
        let bmr = 10 * weight + 6.25 * height - 5 * age;
        bmr += gender === 'male' ? 5 : -161;

        const multipliers: Record<Activity, number> = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            very_active: 1.9,
        };

        const tdee = bmr * multipliers[activity];

        let targetCalories = tdee;
        if (goal === 'lose') targetCalories -= 500;
        if (goal === 'gain') targetCalories += 500;

        // KETO RATIOS: 5% Carbs, 25% Protein, 70% Fat
        const carbs = 25; // Net grams fixed
        const protein = (targetCalories * 0.25) / 4;
        const fat = (targetCalories * 0.70) / 9;

        setResults({
            calories: Math.round(targetCalories),
            carbs: carbs,
            protein: Math.round(protein),
            fat: Math.round(fat)
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 lg:space-y-20 animate-in fade-in duration-500 font-sans">
            {/* Semantic Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6 text-center sm:text-left">
                    <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-2xl">
                        <Calculator className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Nutritional Architect</h2>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Keto Oracle</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 sm:p-12 lg:p-14">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                        {/* Control Matrix */}
                        <div className="lg:col-span-6 space-y-10">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 italic">Biological Sex</label>
                                    <div className="flex bg-slate-50 dark:bg-slate-950 p-1.5 rounded-[1.8rem] border border-slate-100 dark:border-slate-800 shadow-inner">
                                        <button
                                            onClick={() => setGender('male')}
                                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-[1.2rem] transition-all ${gender === 'male' ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-xl' : 'text-slate-300'}`}
                                        >M</button>
                                        <button
                                            onClick={() => setGender('female')}
                                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-[1.2rem] transition-all ${gender === 'female' ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-xl' : 'text-slate-300'}`}
                                        >F</button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 italic">Age Factor</label>
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(Number(e.target.value))}
                                        placeholder="Years"
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500/20 rounded-[1.8rem] outline-none transition-all font-mono font-black text-slate-900 dark:text-white shadow-inner text-center placeholder:text-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 italic">Mass (kg)</label>
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(Number(e.target.value))}
                                        placeholder="kg"
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500/20 rounded-[1.8rem] outline-none transition-all font-mono font-black text-slate-900 dark:text-white shadow-inner text-center placeholder:text-slate-200"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 italic">Elevation (cm)</label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(Number(e.target.value))}
                                        placeholder="cm"
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500/20 rounded-[1.8rem] outline-none transition-all font-mono font-black text-slate-900 dark:text-white shadow-inner text-center placeholder:text-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 italic">Activity Protocol</label>
                                <div className="relative group">
                                    <select
                                        value={activity}
                                        onChange={(e) => setActivity(e.target.value as Activity)}
                                        className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500/20 rounded-[1.8rem] outline-none appearance-none font-bold text-xs text-slate-700 dark:text-slate-200 cursor-pointer shadow-inner"
                                    >
                                        <option value="sedentary">Sedentary (Minimum Load)</option>
                                        <option value="light">Light Activity (1-2 Cycles)</option>
                                        <option value="moderate">Moderate Activity (3-5 Cycles)</option>
                                        <option value="active">High Activity (6-7 Cycles)</option>
                                        <option value="very_active">Intense Activity (Physical Profession)</option>
                                    </select>
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-emerald-500 transition-colors">
                                        <ArrowRight className="w-4 h-4 rotate-90" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 italic">Biometric Objective</label>
                                <div className="relative group">
                                    <select
                                        value={goal}
                                        onChange={(e) => setGoal(e.target.value as Goal)}
                                        className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500/20 rounded-[1.8rem] outline-none appearance-none font-bold text-xs text-slate-700 dark:text-slate-200 cursor-pointer shadow-inner"
                                    >
                                        <option value="lose">Aggressive Weight Loss</option>
                                        <option value="maintain">Statutory Maintenance</option>
                                        <option value="gain">Hypertrophic Gain</option>
                                    </select>
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-emerald-500 transition-colors">
                                        <ArrowRight className="w-4 h-4 rotate-90" />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={calculate}
                                className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-[0.2em] text-xs rounded-[2rem] transition-all shadow-2xl shadow-indigo-500/10 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 group"
                            >
                                Generate Macro Manifest <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Projection Matrix */}
                        <div className="lg:col-span-6">
                            {!results ? (
                                <div className="h-full min-h-[400px] border-4 border-dashed border-slate-50 dark:border-slate-900 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 bg-slate-50/30 dark:bg-slate-950/30 group">
                                    <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] mb-6 shadow-xl border border-slate-100 dark:border-slate-800 transition-all group-hover:rotate-12">
                                        <RefreshCcw className="w-12 h-12 text-slate-200 dark:text-slate-700 animate-spin-slow" />
                                    </div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Awaiting Biometric Signal...</h3>
                                </div>
                            ) : (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    <div className="bg-slate-900 dark:bg-slate-950 rounded-[3rem] p-12 text-white text-center shadow-3xl relative overflow-hidden group">
                                        <div className="absolute -inset-2 bg-gradient-to-br from-emerald-500/10 via-indigo-500/10 to-emerald-500/10 opacity-30 blur-3xl" />
                                        <div className="relative z-10 space-y-2">
                                            <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.4em] italic mb-4">Energy Quotient</p>
                                            <div className="flex items-baseline justify-center gap-2">
                                                <p className="text-8xl font-black tracking-tighter text-glow-emerald">{results.calories}</p>
                                                <span className="text-xl text-white/20 font-black uppercase tracking-widest italic">kcal</span>
                                            </div>

                                            <div className="w-full h-3 bg-white/5 rounded-full mt-12 overflow-hidden flex border border-white/5 shadow-inner">
                                                <div style={{ width: '5%' }} className="h-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                                                <div style={{ width: '25%' }} className="h-full bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]" />
                                                <div style={{ width: '70%' }} className="h-full bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                                            </div>
                                            <div className="flex justify-between text-[8px] font-black text-white/20 mt-4 font-mono uppercase tracking-[0.2em] italic">
                                                <span className="text-rose-500/80">5% Glycogen</span>
                                                <span className="text-sky-500/80">25% Amino</span>
                                                <span className="text-amber-500/80">70% Lipid</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm text-center group hover:border-rose-500/30 transition-all hover:scale-[1.05]">
                                            <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-2 italic">Carbs</p>
                                            <p className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tighter">{results.carbs}g</p>
                                        </div>
                                        <div className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm text-center group hover:border-sky-500/30 transition-all hover:scale-[1.05]">
                                            <p className="text-[9px] font-black text-sky-500 uppercase tracking-widest mb-2 italic">Protein</p>
                                            <p className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tighter">{results.protein}g</p>
                                        </div>
                                        <div className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm text-center group hover:border-amber-500/30 transition-all hover:scale-[1.05]">
                                            <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-2 italic">Lipids</p>
                                            <p className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tighter">{results.fat}g</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reconciliation Protocol */}
            <div className="text-center py-8 opacity-20 border-t border-slate-50 dark:border-slate-800 mt-12">
                <p className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-400">
                    Dimensional Macro Translation // KETO_MANIFEST_X4
                </p>
            </div>
        </div>
    );
}
