'use client';

import { useState, useEffect } from 'react';
import { ArrowRightLeft, Scale, Ruler, Thermometer } from 'lucide-react';

type Category = 'length' | 'weight' | 'temperature';

const CATEGORIES: { id: Category; name: string; icon: any }[] = [
    { id: 'length', name: 'Length', icon: Ruler },
    { id: 'weight', name: 'Weight', icon: Scale },
    { id: 'temperature', name: 'Temperature', icon: Thermometer },
];

const UNITS: Record<Category, { id: string; name: string; factor?: number }[]> = {
    length: [
        { id: 'm', name: 'Meters', factor: 1 },
        { id: 'km', name: 'Kilometers', factor: 1000 },
        { id: 'cm', name: 'Centimeters', factor: 0.01 },
        { id: 'mm', name: 'Millimeters', factor: 0.001 },
        { id: 'ft', name: 'Feet', factor: 0.3048 },
        { id: 'in', name: 'Inches', factor: 0.0254 },
        { id: 'mi', name: 'Miles', factor: 1609.34 },
        { id: 'yd', name: 'Yards', factor: 0.9144 },
    ],
    weight: [
        { id: 'kg', name: 'Kilograms', factor: 1 },
        { id: 'g', name: 'Grams', factor: 0.001 },
        { id: 'mg', name: 'Milligrams', factor: 0.000001 },
        { id: 'lb', name: 'Pounds', factor: 0.453592 },
        { id: 'oz', name: 'Ounces', factor: 0.0283495 },
    ],
    temperature: [
        { id: 'c', name: 'Celsius' },
        { id: 'f', name: 'Fahrenheit' },
        { id: 'k', name: 'Kelvin' },
    ],
};

export function UnitConverter() {
    const [category, setCategory] = useState<Category>('length');
    const [amount, setAmount] = useState<number>(1);
    const [fromUnit, setFromUnit] = useState<string>('m');
    const [toUnit, setToUnit] = useState<string>('ft');

    // Reset units when category changes
    useEffect(() => {
        const defaultUnits = UNITS[category];
        setFromUnit(defaultUnits[0].id);
        setToUnit(defaultUnits[1].id);
    }, [category]);

    const convert = (val: number, from: string, to: string, cat: Category): number => {
        if (cat === 'temperature') {
            if (from === to) return val;
            if (from === 'c') return to === 'f' ? (val * 9 / 5) + 32 : val + 273.15;
            if (from === 'f') return to === 'c' ? (val - 32) * 5 / 9 : (val - 32) * 5 / 9 + 273.15;
            if (from === 'k') return to === 'c' ? val - 273.15 : (val - 273.15) * 9 / 5 + 32;
            return val;
        }

        // Linear conversion for length/weight
        const units = UNITS[cat];
        const fromFactor = units.find(u => u.id === from)?.factor || 1;
        const toFactor = units.find(u => u.id === to)?.factor || 1;

        // Convert to base unit (e.g., meters) then to target
        const inBase = val * fromFactor;
        return inBase / toFactor;
    };

    const handleSwap = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
    };

    const result = convert(amount, fromUnit, toUnit, category);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            {/* Category Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`flex-1 flex items-center justify-center px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${category === cat.id
                                ? 'bg-slate-50 dark:bg-slate-950 text-emerald-600 dark:text-emerald-500 border-b-2 border-emerald-500'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                    >
                        <cat.icon className="w-4 h-4 mr-2" />
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                    {/* Amount */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Value</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-lg font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        />
                    </div>

                    {/* From */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">From</label>
                        <select
                            value={fromUnit}
                            onChange={(e) => setFromUnit(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        >
                            {UNITS[category].map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Swap */}
                    <div className="flex justify-center md:pt-6">
                        <button
                            onClick={handleSwap}
                            className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white text-slate-500 transition-all transform hover:rotate-180"
                        >
                            <ArrowRightLeft className="w-5 h-5" />
                        </button>
                    </div>

                    {/* To */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">To</label>
                        <select
                            value={toUnit}
                            onChange={(e) => setToUnit(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        >
                            {UNITS[category].map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Result */}
                <div className="mt-12 text-center p-8 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                    <div className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight break-all">
                        {Number(result.toFixed(4))}
                        <span className="text-2xl md:text-3xl text-emerald-500 ml-3">
                            {UNITS[category].find(u => u.id === toUnit)?.name}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
