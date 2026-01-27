'use client';

import { useState } from 'react';
import { Activity, Ruler, Weight as WeightIcon, Info } from 'lucide-react';

type UnitSystem = 'metric' | 'imperial';

export function BmiCalculator() {
    const [unit, setUnit] = useState<UnitSystem>('metric');
    const [weight, setWeight] = useState(70); // kg
    const [height, setHeight] = useState(175); // cm
    const [weightLbs, setWeightLbs] = useState(154);
    const [heightFt, setHeightFt] = useState(5);
    const [heightIn, setHeightIn] = useState(9);

    const calculateBMI = () => {
        let weightKg = weight;
        let heightM = height / 100;

        if (unit === 'imperial') {
            weightKg = weightLbs * 0.453592;
            const totalInches = (heightFt * 12) + heightIn;
            heightM = totalInches * 0.0254;
        }

        if (heightM <= 0) return 0;
        return weightKg / (heightM * heightM);
    };

    const bmi = calculateBMI();

    const getCategory = (val: number) => {
        if (val < 18.5) return { label: 'Underweight', color: 'text-blue-500', bg: 'bg-blue-500' };
        if (val < 25) return { label: 'Normal weight', color: 'text-emerald-500', bg: 'bg-emerald-500' };
        if (val < 30) return { label: 'Overweight', color: 'text-orange-500', bg: 'bg-orange-500' };
        return { label: 'Obese', color: 'text-red-500', bg: 'bg-red-500' };
    };

    const category = getCategory(bmi);

    return (
        <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
            {/* Semantic Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6 text-center sm:text-left">
                    <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-2xl">
                        <Activity className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Health Metrics</h2>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">BMI Architect</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                {/* Protocol Toggle */}
                <div className="flex p-2 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => setUnit('metric')}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all rounded-[1.8rem] ${unit === 'metric'
                            ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-xl'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                            }`}
                    >
                        Metric Sequence
                    </button>
                    <button
                        onClick={() => setUnit('imperial')}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all rounded-[1.8rem] ${unit === 'imperial'
                            ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-xl'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                            }`}
                    >
                        Imperial Sequence
                    </button>
                </div>

                <div className="p-8 sm:p-12 lg:p-14">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Parameter Matrix */}
                        <div className="space-y-10 order-2 lg:order-1">
                            {unit === 'metric' ? (
                                <>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center px-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                                                <WeightIcon className="w-4 h-4 text-emerald-500" /> Mass Magnitude (kg)
                                            </label>
                                            <span className="text-sm font-black text-slate-900 dark:text-white font-mono">{weight}</span>
                                        </div>
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                value={weight}
                                                onChange={(e) => setWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                                                className="w-full px-8 py-5 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-[1.8rem] text-xl font-black text-slate-900 dark:text-white outline-none transition-all shadow-inner"
                                            />
                                        </div>
                                        <input
                                            type="range"
                                            min="30"
                                            max="200"
                                            value={weight}
                                            onChange={(e) => setWeight(parseFloat(e.target.value))}
                                            className="w-full accent-emerald-500 bg-slate-100 dark:bg-slate-800 h-2 rounded-full appearance-none cursor-pointer"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center px-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                                                <Ruler className="w-4 h-4 text-emerald-500" /> Elevation Factor (cm)
                                            </label>
                                            <span className="text-sm font-black text-slate-900 dark:text-white font-mono">{height}</span>
                                        </div>
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                value={height}
                                                onChange={(e) => setHeight(Math.max(0, parseFloat(e.target.value) || 0))}
                                                className="w-full px-8 py-5 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-[1.8rem] text-xl font-black text-slate-900 dark:text-white outline-none transition-all shadow-inner"
                                            />
                                        </div>
                                        <input
                                            type="range"
                                            min="100"
                                            max="250"
                                            value={height}
                                            onChange={(e) => setHeight(parseFloat(e.target.value))}
                                            className="w-full accent-emerald-500 bg-slate-100 dark:bg-slate-800 h-2 rounded-full appearance-none cursor-pointer"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3 px-2">
                                            <WeightIcon className="w-4 h-4 text-emerald-500" /> Mass Magnitude (lbs)
                                        </label>
                                        <input
                                            type="number"
                                            value={weightLbs}
                                            onChange={(e) => setWeightLbs(Math.max(0, parseFloat(e.target.value) || 0))}
                                            className="w-full px-8 py-5 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-[1.8rem] text-xl font-black text-slate-900 dark:text-white outline-none transition-all shadow-inner"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3 px-2">
                                                <Ruler className="w-4 h-4 text-emerald-500" /> Ft
                                            </label>
                                            <input
                                                type="number"
                                                value={heightFt}
                                                onChange={(e) => setHeightFt(Math.max(0, parseFloat(e.target.value) || 0))}
                                                className="w-full px-8 py-5 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-[1.8rem] text-xl font-black text-slate-900 dark:text-white outline-none transition-all shadow-inner"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3 px-2">
                                                (in)
                                            </label>
                                            <input
                                                type="number"
                                                value={heightIn}
                                                onChange={(e) => setHeightIn(Math.max(0, parseFloat(e.target.value) || 0))}
                                                className="w-full px-8 py-5 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-[1.8rem] text-xl font-black text-slate-900 dark:text-white outline-none transition-all shadow-inner"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Projection Matrix */}
                        <div className="relative order-1 lg:order-2">
                            <div className="absolute -inset-6 bg-gradient-to-br from-emerald-500/10 via-indigo-500/10 to-emerald-500/10 rounded-[4rem] blur-3xl opacity-50" />
                            <div className="relative flex flex-col items-center justify-center p-12 bg-slate-900 dark:bg-slate-950 rounded-[3rem] border border-white/5 shadow-3xl text-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-4">BMI Manifest</span>
                                <div className={`text-8xl font-black tracking-tighter mb-4 ${category.color.replace('text-', 'text-glow-')}`} style={{ color: category.color.includes('emerald') ? '#10b981' : category.color.includes('blue') ? '#3b82f6' : category.color.includes('orange') ? '#f59e0b' : '#ef4444' }}>
                                    {bmi.toFixed(1)}
                                </div>
                                <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 ${category.color}`}>
                                    {category.label}
                                </div>

                                {/* Immersive Gauge */}
                                <div className="w-full mt-12 space-y-4">
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex shadow-inner">
                                        <div className="h-full bg-blue-500/80 w-[18.5%]" />
                                        <div className="h-full bg-emerald-500/80 w-[16.5%]" />
                                        <div className="h-full bg-orange-500/80 w-[11.5%]" />
                                        <div className="h-full bg-red-500/80 flex-1" />
                                    </div>
                                    <div className="relative h-6 w-full">
                                        <div
                                            className="absolute top-0 -translate-x-1/2 transition-all duration-700 ease-out"
                                            style={{ left: `${Math.min(Math.max((bmi / 40) * 100, 0), 100)}%` }}
                                        >
                                            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-white mx-auto" />
                                            <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto mt-1 shadow-glow" />
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-[0.2em] font-mono">
                                        <span>0</span>
                                        <span>18.5</span>
                                        <span>25</span>
                                        <span>30</span>
                                        <span>40+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Semantic Reconciliation */}
                    <div className="mt-16 flex items-start gap-6 p-8 bg-slate-50 dark:bg-slate-950/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner group">
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-emerald-500 group-hover:scale-110 transition-transform">
                            <Info className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Protocol Disclaimer</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                Body Mass Index (BMI) is a simplified relational index of mass-to-elevation. While useful for rapid category classification, it does not account for muscular density or structural variance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center py-4 opacity-20 border-t border-slate-50 dark:border-slate-800 mt-12">
                <p className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-400">
                    Dimensional Health Translation // BIOMETRIC_X1
                </p>
            </div>
        </div>
    );
}
