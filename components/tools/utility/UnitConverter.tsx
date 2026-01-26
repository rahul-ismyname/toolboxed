'use client';

import { useState, useEffect } from 'react';
import {
    ArrowRightLeft, Scale, Ruler, Thermometer,
    Box, Droplets, Gauge, Timer, HardDrive, Copy, Check
} from 'lucide-react';

type Category = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed' | 'time' | 'digital';

const CATEGORIES: { id: Category; name: string; icon: any }[] = [
    { id: 'length', name: 'Length', icon: Ruler },
    { id: 'weight', name: 'Weight', icon: Scale },
    { id: 'temperature', name: 'Temp', icon: Thermometer },
    { id: 'area', name: 'Area', icon: Box },
    { id: 'volume', name: 'Volume', icon: Droplets },
    { id: 'speed', name: 'Speed', icon: Gauge },
    { id: 'time', name: 'Time', icon: Timer },
    { id: 'digital', name: 'Storage', icon: HardDrive },
];

const UNITS: Record<Category, { id: string; name: string; factor?: number }[]> = {
    length: [
        { id: 'm', name: 'Meters', factor: 1 },
        { id: 'km', name: 'Kilometers', factor: 1000 },
        { id: 'cm', name: 'Centimeters', factor: 0.01 },
        { id: 'mm', name: 'Millimeters', factor: 0.001 },
        { id: 'mi', name: 'Miles', factor: 1609.34 },
        { id: 'yd', name: 'Yards', factor: 0.9144 },
        { id: 'ft', name: 'Feet', factor: 0.3048 },
        { id: 'in', name: 'Inches', factor: 0.0254 },
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
    area: [
        { id: 'm2', name: 'Square Meters', factor: 1 },
        { id: 'km2', name: 'Square Kilometers', factor: 1000000 },
        { id: 'sqmi', name: 'Square Miles', factor: 2589988.11 },
        { id: 'ft2', name: 'Square Feet', factor: 0.092903 },
        { id: 'ac', name: 'Acres', factor: 4046.86 },
        { id: 'ha', name: 'Hectares', factor: 10000 },
    ],
    volume: [
        { id: 'l', name: 'Liters', factor: 1 },
        { id: 'ml', name: 'Milliliters', factor: 0.001 },
        { id: 'm3', name: 'Cubic Meters', factor: 1000 },
        { id: 'gal', name: 'Gallons (US)', factor: 3.78541 },
        { id: 'qt', name: 'Quarts (US)', factor: 0.946353 },
        { id: 'pt', name: 'Pints (US)', factor: 0.473176 },
        { id: 'cup', name: 'Cups', factor: 0.24 },
        { id: 'floz', name: 'Fluid Ounces', factor: 0.0295735 },
    ],
    speed: [
        { id: 'mps', name: 'Meters/Second', factor: 1 },
        { id: 'kph', name: 'Kilometers/Hour', factor: 0.277778 },
        { id: 'mph', name: 'Miles/Hour', factor: 0.44704 },
        { id: 'kn', name: 'Knots', factor: 0.514444 },
    ],
    time: [
        { id: 's', name: 'Seconds', factor: 1 },
        { id: 'min', name: 'Minutes', factor: 60 },
        { id: 'h', name: 'Hours', factor: 3600 },
        { id: 'd', name: 'Days', factor: 86400 },
        { id: 'wk', name: 'Weeks', factor: 604800 },
        { id: 'mo', name: 'Months (Avg)', factor: 2628000 },
        { id: 'y', name: 'Years', factor: 31536000 },
    ],
    digital: [
        { id: 'b', name: 'Bytes', factor: 1 },
        { id: 'kb', name: 'Kilobytes', factor: 1024 },
        { id: 'mb', name: 'Megabytes', factor: 1048576 },
        { id: 'gb', name: 'Gigabytes', factor: 1073741824 },
        { id: 'tb', name: 'Terabytes', factor: 1099511627776 },
        { id: 'bit', name: 'Bits', factor: 0.125 },
    ]
};

export function UnitConverter() {
    const [category, setCategory] = useState<Category>('length');
    const [amount, setAmount] = useState<number>(1);
    const [fromUnit, setFromUnit] = useState<string>('m');
    const [toUnit, setToUnit] = useState<string>('ft');
    const [copied, setCopied] = useState(false);

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

        const units = UNITS[cat];
        const fromFactor = units.find(u => u.id === from)?.factor || 1;
        const toFactor = units.find(u => u.id === to)?.factor || 1;

        const inBase = val * fromFactor;
        return inBase / toFactor;
    };

    const handleSwap = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
    };

    const handleCopy = () => {
        const res = convert(amount, fromUnit, toUnit, category);
        const text = `${amount} ${UNITS[category].find(u => u.id === fromUnit)?.name} = ${Number(res.toFixed(4))} ${UNITS[category].find(u => u.id === toUnit)?.name}`;
        navigator.clipboard.writeText(text); // Copy formatted string or just value? Usually helpful to verify
        // Actually user just wants value mostly? Let's copy the number value for utility.
        navigator.clipboard.writeText(String(Number(res.toFixed(6))));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const result = convert(amount, fromUnit, toUnit, category);

    // Calculate rate string
    const rate = convert(1, fromUnit, toUnit, category);
    const fromName = UNITS[category].find(u => u.id === fromUnit)?.name;
    const toName = UNITS[category].find(u => u.id === toUnit)?.name;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            {/* Category Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-hide">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`flex items-center justify-center px-5 py-4 text-sm font-bold transition-all whitespace-nowrap min-w-[100px] hover:bg-slate-50 dark:hover:bg-slate-800/50 ${category === cat.id
                            ? 'bg-slate-50 dark:bg-slate-950 text-emerald-600 dark:text-emerald-500 border-b-2 border-emerald-500'
                            : 'text-slate-500 dark:text-slate-400'
                            }`}
                    >
                        <cat.icon className={`w-4 h-4 mr-2 ${category === cat.id ? 'text-emerald-500' : 'text-slate-400'}`} />
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className="p-6 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-center">
                    {/* Amount */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Value</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xl font-bold font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder-slate-300"
                            placeholder="0"
                        />
                    </div>

                    {/* From */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">From</label>
                        <select
                            value={fromUnit}
                            onChange={(e) => setFromUnit(e.target.value)}
                            className="w-full px-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-base font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer hover:border-slate-300"
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
                            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white text-slate-500 transition-all transform hover:rotate-180 shadow-sm"
                            title="Swap Units"
                        >
                            <ArrowRightLeft className="w-5 h-5" />
                        </button>
                    </div>

                    {/* To */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">To</label>
                        <select
                            value={toUnit}
                            onChange={(e) => setToUnit(e.target.value)}
                            className="w-full px-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-base font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer hover:border-slate-300"
                        >
                            {UNITS[category].map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Result */}
                <div className="mt-10 relative group">
                    <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>

                    <div className="text-center p-10 bg-slate-50 dark:bg-slate-950/50 rounded-3xl border border-slate-100 dark:border-slate-800/50">
                        <div className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-4">
                            Result
                        </div>
                        <div className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight break-all mb-4">
                            {Number(result.toFixed(6))}
                            <span className="text-xl md:text-3xl text-emerald-500 ml-3 font-bold opacity-60">
                                {UNITS[category].find(u => u.id === toUnit)?.id}
                            </span>
                        </div>

                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-full text-xs font-medium text-slate-500 border border-slate-100 dark:border-slate-800 shadow-sm">
                            <span>1 {fromName}</span>
                            <span className="text-slate-300">≈</span>
                            <span className="text-slate-700 dark:text-slate-200">{Number(rate.toFixed(6))} {toName}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
