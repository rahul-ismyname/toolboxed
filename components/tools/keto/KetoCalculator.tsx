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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header - Clean Light Theme */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
                    <div className="p-2 bg-slate-900 text-white rounded-lg">
                        <Calculator className="w-5 h-5" />
                    </div>
                    Keto Calculator
                </h2>
                <p className="text-slate-500 mt-2 text-sm ml-12">
                    Calculate exact macros for ketosis using the Mifflin-St Jeor formula.
                </p>
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-12">
                {/* Input Section */}
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
                            <div className="flex rounded-lg shadow-sm">
                                <button
                                    onClick={() => setGender('male')}
                                    className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-l-lg border transition-all ${gender === 'male' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                >Male</button>
                                <button
                                    onClick={() => setGender('female')}
                                    className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-r-lg border transition-all ${gender === 'female' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                >Female</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Age</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(Number(e.target.value))}
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                                placeholder="Years"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Weight (kg)</label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(Number(e.target.value))}
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                                placeholder="kg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Height (cm)</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(Number(e.target.value))}
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                                placeholder="cm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Activity Level</label>
                        <div className="relative">
                            <select
                                value={activity}
                                onChange={(e) => setActivity(e.target.value as Activity)}
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none appearance-none bg-white transition-all text-slate-700"
                            >
                                <option value="sedentary">Sedentary (Office job)</option>
                                <option value="light">Light Activity (1-2 days/week)</option>
                                <option value="moderate">Moderate Activity (3-5 days/week)</option>
                                <option value="active">Active (6-7 days/week)</option>
                                <option value="very_active">Very Active (Physical job)</option>
                            </select>
                            <div className="absolute right-3 top-3 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Goal</label>
                        <div className="relative">
                            <select
                                value={goal}
                                onChange={(e) => setGoal(e.target.value as Goal)}
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none appearance-none bg-white transition-all text-slate-700"
                            >
                                <option value="lose">Lose Weight</option>
                                <option value="maintain">Maintain Weight</option>
                                <option value="gain">Gain Muscle</option>
                            </select>
                            <div className="absolute right-3 top-3 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={calculate}
                        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                        Calculate Macros <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Results Section */}
                <div className="flex flex-col justify-center">
                    {!results ? (
                        <div className="h-full border-2 border-dashed border-slate-100 rounded-xl flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
                            <div className="p-4 bg-white rounded-full mb-4 shadow-sm border border-slate-100">
                                <RefreshCcw className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-medium">Enter your details to generate your personal plan.</p>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-slate-900 rounded-2xl p-6 text-white text-center shadow-xl shadow-slate-200">
                                <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-1">Target Intake</p>
                                <div className="flex items-baseline justify-center gap-1">
                                    <p className="text-5xl font-black tracking-tight">{results.calories}</p>
                                    <span className="text-lg text-slate-400 font-medium">kcal</span>
                                </div>

                                <div className="w-full h-3 bg-slate-800 rounded-full mt-6 overflow-hidden flex border border-slate-700/50">
                                    <div style={{ width: '5%' }} className="h-full bg-rose-500" title="Carbs" />
                                    <div style={{ width: '25%' }} className="h-full bg-sky-500" title="Protein" />
                                    <div style={{ width: '70%' }} className="h-full bg-amber-400" title="Fat" />
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono uppercase">
                                    <span>5% Carbs</span>
                                    <span>25% Protein</span>
                                    <span>70% Fat</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm text-center group hover:border-rose-200 transition-colors">
                                    <p className="text-xs font-semibold text-rose-500 uppercase tracking-wide mb-1">Carbs</p>
                                    <p className="text-2xl font-bold text-slate-900 group-hover:scale-110 transition-transform">{results.carbs}g</p>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm text-center group hover:border-sky-200 transition-colors">
                                    <p className="text-xs font-semibold text-sky-500 uppercase tracking-wide mb-1">Protein</p>
                                    <p className="text-2xl font-bold text-slate-900 group-hover:scale-110 transition-transform">{results.protein}g</p>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm text-center group hover:border-amber-200 transition-colors">
                                    <p className="text-xs font-semibold text-amber-500 uppercase tracking-wide mb-1">Fat</p>
                                    <p className="text-2xl font-bold text-slate-900 group-hover:scale-110 transition-transform">{results.fat}g</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
