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
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            {/* Unit Toggle */}
            <div className="flex border-b border-slate-100 dark:border-slate-800">
                <button
                    onClick={() => setUnit('metric')}
                    className={`flex-1 py-4 text-sm font-medium transition-colors ${unit === 'metric'
                            ? 'bg-slate-50 dark:bg-slate-950 text-emerald-600 dark:text-emerald-500 border-b-2 border-emerald-500'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                >
                    Metric (kg / cm)
                </button>
                <button
                    onClick={() => setUnit('imperial')}
                    className={`flex-1 py-4 text-sm font-medium transition-colors ${unit === 'imperial'
                            ? 'bg-slate-50 dark:bg-slate-950 text-emerald-600 dark:text-emerald-500 border-b-2 border-emerald-500'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                >
                    Imperial (lbs / ft)
                </button>
            </div>

            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Inputs */}
                    <div className="flex-1 space-y-6">
                        {unit === 'metric' ? (
                            <>
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        <WeightIcon className="w-4 h-4 mr-2 text-slate-400" />
                                        Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-lg font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    />
                                    <input
                                        type="range"
                                        min="30"
                                        max="200"
                                        value={weight}
                                        onChange={(e) => setWeight(parseFloat(e.target.value))}
                                        className="w-full accent-emerald-500 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        <Ruler className="w-4 h-4 mr-2 text-slate-400" />
                                        Height (cm)
                                    </label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(Math.max(0, parseFloat(e.target.value) || 0))}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-lg font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    />
                                    <input
                                        type="range"
                                        min="100"
                                        max="250"
                                        value={height}
                                        onChange={(e) => setHeight(parseFloat(e.target.value))}
                                        className="w-full accent-emerald-500 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        <WeightIcon className="w-4 h-4 mr-2 text-slate-400" />
                                        Weight (lbs)
                                    </label>
                                    <input
                                        type="number"
                                        value={weightLbs}
                                        onChange={(e) => setWeightLbs(Math.max(0, parseFloat(e.target.value) || 0))}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-lg font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                                            <Ruler className="w-4 h-4 mr-2 text-slate-400" />
                                            Height (ft)
                                        </label>
                                        <input
                                            type="number"
                                            value={heightFt}
                                            onChange={(e) => setHeightFt(Math.max(0, parseFloat(e.target.value) || 0))}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-lg font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                                            (in)
                                        </label>
                                        <input
                                            type="number"
                                            value={heightIn}
                                            onChange={(e) => setHeightIn(Math.max(0, parseFloat(e.target.value) || 0))}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-lg font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Result */}
                    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                        <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Your BMI Score</div>
                        <div className={`text-6xl font-bold mb-4 ${category.color}`}>
                            {bmi.toFixed(1)}
                        </div>
                        <div className={`inline-flex px-4 py-1.5 rounded-full text-sm font-bold bg-white dark:bg-slate-900 shadow-sm ${category.color}`}>
                            {category.label}
                        </div>

                        {/* Gauge */}
                        <div className="w-full mt-10 space-y-2">
                            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                                <div className="h-full bg-blue-400 w-[18.5%]" />
                                <div className="h-full bg-emerald-400 w-[16.5%]" /> {/* 18.5 to 25 */}
                                <div className="h-full bg-orange-400 w-[11.5%]" /> {/* 25 to 30 */}
                                <div className="h-full bg-red-400 flex-1" />
                            </div>
                            <div className="relative h-4 w-full">
                                <div
                                    className="absolute top-0 -translate-x-1/2 transition-all duration-300"
                                    style={{ left: `${Math.min(Math.max((bmi / 40) * 100, 0), 100)}%` }}
                                >
                                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-slate-800 dark:border-b-white mx-auto mb-1" />
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 font-mono">
                                <span>0</span>
                                <span>18.5</span>
                                <span>25</span>
                                <span>30</span>
                                <span>40+</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-start p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        Body Mass Index (BMI) is a simple index of weight-for-height that is commonly used to classify underweight, overweight and obesity in adults. It is not a diagnostic tool.
                    </p>
                </div>
            </div>
        </div>
    );
}
