'use client';

import { useState, useEffect } from 'react';
import {
    ArrowRightLeft, Scale, Ruler, Thermometer,
    Box, Droplets, Gauge, Timer, HardDrive, Copy, Check, ChevronDown, Sparkles
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
        <div className="max-w-5xl mx-auto space-y-12 lg:space-y-20 animate-in fade-in duration-500 font-sans">
            {/* Semantic Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6 text-center sm:text-left">
                    <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-2xl">
                        <ArrowRightLeft className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Dimensional Synchronizer</h2>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Unit Oracle</p>
                    </div>
                </div>
            </div>

            {/* Category Navigation - Semantic Horizontal Stream */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 p-3 overflow-hidden">
                <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-1 px-1">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={`flex items-center gap-4 px-8 py-5 rounded-[2rem] transition-all whitespace-nowrap group relative ${category === cat.id
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-[1.02]'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                }`}
                        >
                            {category === cat.id && (
                                <div className="absolute -inset-1 bg-emerald-500/20 rounded-[2.2rem] blur-lg animate-pulse" />
                            )}
                            <cat.icon className={`w-4 h-4 relative z-10 transition-transform group-hover:rotate-12 ${category === cat.id ? 'text-emerald-500' : ''}`} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 sm:p-16 lg:p-24 space-y-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
                        {/* Magnitude Vector */}
                        <div className="lg:col-span-4 space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/60 ml-4 italic">Magnitude Vector</label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                    className="w-full px-10 py-8 bg-slate-50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-[2.5rem] text-4xl font-mono font-black text-slate-900 dark:text-white outline-none transition-all shadow-inner tabular-nums"
                                    placeholder="0"
                                />
                                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-200 dark:text-slate-800 font-black text-xs uppercase tracking-widest pointer-events-none group-focus-within:text-emerald-500/20 transition-colors">
                                    Scalar
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-1 sm:grid-cols-11 gap-6 items-center bg-slate-50 dark:bg-slate-950/30 p-4 rounded-[3rem] border border-slate-100 dark:border-slate-800/50 shadow-inner">
                                {/* Origin Node */}
                                <div className="sm:col-span-5 space-y-3 p-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic ml-2">Origin Node</label>
                                    <div className="relative group">
                                        <select
                                            value={fromUnit}
                                            onChange={(e) => setFromUnit(e.target.value)}
                                            className="w-full px-8 py-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:border-emerald-500/20 rounded-[2rem] text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 outline-none transition-all appearance-none cursor-pointer shadow-sm hover:shadow-md"
                                        >
                                            {UNITS[category].map(u => (
                                                <option key={u.id} value={u.id}>{u.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-emerald-500 transition-colors">
                                            <ChevronDown className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Swap Protocol */}
                                <div className="sm:col-span-1 flex justify-center">
                                    <button
                                        onClick={handleSwap}
                                        className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center hover:scale-110 active:rotate-180 transition-all shadow-xl group z-10"
                                    >
                                        <ArrowRightLeft className="w-5 h-5 group-hover:text-emerald-500 transition-colors" />
                                    </button>
                                </div>

                                {/* Destination Node */}
                                <div className="sm:col-span-5 space-y-3 p-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic ml-2">Target Node</label>
                                    <div className="relative group">
                                        <select
                                            value={toUnit}
                                            onChange={(e) => setToUnit(e.target.value)}
                                            className="w-full px-8 py-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:border-emerald-500/20 rounded-[2rem] text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 outline-none transition-all appearance-none cursor-pointer shadow-sm hover:shadow-md"
                                        >
                                            {UNITS[category].map(u => (
                                                <option key={u.id} value={u.id}>{u.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-emerald-500 transition-colors">
                                            <ChevronDown className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Synthesis Core */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-emerald-500/10 rounded-[5rem] blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                        <div className="relative p-10 sm:p-20 bg-slate-900 dark:bg-slate-950 rounded-[4.5rem] border border-white/5 shadow-3xl overflow-hidden">
                            <div className="flex flex-col items-center">
                                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-12 flex items-center gap-4">
                                    <div className="w-12 h-px bg-emerald-500/20" />
                                    Synthesis Manifest
                                    <div className="w-12 h-px bg-emerald-500/20" />
                                </div>

                                <div className="flex flex-col items-center gap-4 text-center">
                                    <div className="flex flex-wrap items-baseline justify-center gap-x-6 gap-y-4">
                                        <div className="text-7xl sm:text-[10rem] font-black text-white tracking-tighter tabular-nums leading-none">
                                            {Number(result.toFixed(6))}
                                        </div>
                                        <div className="text-3xl sm:text-5xl font-black text-emerald-500 uppercase tracking-tighter">
                                            {UNITS[category].find(u => u.id === toUnit)?.id}
                                        </div>
                                    </div>

                                    <div className="text-sm font-bold text-white/30 uppercase tracking-widest mt-4">
                                        Calculated from {amount} {fromName}
                                    </div>
                                </div>

                                <div className="mt-16 sm:mt-20 flex flex-col sm:flex-row items-center gap-8 w-full">
                                    <div className="flex-1 inline-flex items-center gap-6 px-10 py-6 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-md w-full sm:w-auto">
                                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                                            <Gauge className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">Ratio Matrix</div>
                                            <div className="text-xs font-bold text-white/60">
                                                1 {UNITS[category].find(u => u.id === fromUnit)?.id} <span className="mx-3 text-emerald-500/40 font-black">≋</span> <span className="text-white font-mono">{Number(rate.toFixed(6))}</span> {UNITS[category].find(u => u.id === toUnit)?.id}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCopy}
                                        className="h-20 px-10 bg-white dark:bg-slate-900 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-4 rounded-[2rem] active:scale-95 shadow-2xl group w-full sm:w-auto justify-center"
                                    >
                                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                                        {copied ? 'Outcome Captured' : 'Sync Outcome'}
                                    </button>
                                </div>
                            </div>

                            {/* Decorative Background Projections */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03)_0%,transparent_70%)] pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reconciliation Protocol */}
            <div className="pb-20 pt-8 px-10 flex flex-col sm:flex-row items-center justify-between gap-6 opacity-40">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                        Dimensional Translation Protocol // Sequence v2.1
                    </p>
                </div>
                <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-widest text-slate-400 italic">
                    <span className="flex items-center gap-2 font-mono"><span className="text-emerald-500">√</span> Lossless Scalar Extraction</span>
                    <span className="opacity-20 text-[14px]">/</span>
                    <span className="flex items-center gap-2 font-mono"><span className="text-emerald-500">√</span> 100% Precision Matrix</span>
                </div>
            </div>
        </div>
    );
}
