'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Activity, Apple, Zap, Scale, Info, Copy, Check, Share2 } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function BmrCalculator() {
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [age, setAge] = useState<number>(25);
    const [weight, setWeight] = useState<number>(70);
    const [height, setHeight] = useState<number>(170);

    const [shareCopied, setShareCopied] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Initialize from URL
    useEffect(() => {
        const urlConfig = searchParams.get('config');
        if (urlConfig) {
            try {
                const decoded = JSON.parse(atob(decodeURIComponent(urlConfig)));
                if (decoded.gender) setGender(decoded.gender);
                if (decoded.age) setAge(decoded.age);
                if (decoded.weight) setWeight(decoded.weight);
                if (decoded.height) setHeight(decoded.height);
            } catch (e) {
                console.error('Failed to decode config', e);
            }
        }
    }, []); // Run once on mount

    const handleShare = useCallback(() => {
        const config = { gender, age, weight, height };
        const encoded = encodeURIComponent(btoa(JSON.stringify(config)));
        const url = `${window.location.origin}${pathname}?config=${encoded}`;

        navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);

        // Update URL without refresh
        router.replace(`${pathname}?config=${encoded}`, { scroll: false });
    }, [gender, age, weight, height, pathname, router]);

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
        <div className="max-w-5xl mx-auto space-y-12 lg:space-y-20 animate-in fade-in duration-500">
            {/* Semantic Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6 text-center sm:text-left">
                    <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-2xl">
                        <Zap className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Metabolic Architect</h2>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">BMR Oracle</p>
                    </div>
                </div>
                <button
                    onClick={handleShare}
                    className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px] tracking-widest rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 hover:text-emerald-500 hover:border-emerald-500/20 transition-all active:scale-95"
                >
                    {shareCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                    {shareCopied ? 'Link Copied' : 'Share State'}
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 sm:p-12 lg:p-14">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Parameter Matrix */}
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2 italic">Biological Sex</label>
                                <div className="flex bg-slate-50 dark:bg-slate-950 p-2 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner">
                                    <button
                                        onClick={() => setGender('male')}
                                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] transition-all ${gender === 'male' ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-xl' : 'text-slate-400'}`}
                                    >
                                        Male
                                    </button>
                                    <button
                                        onClick={() => setGender('female')}
                                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] transition-all ${gender === 'female' ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-xl' : 'text-slate-400'}`}
                                    >
                                        Female
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Age</label>
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(Number(e.target.value))}
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500/20 rounded-[1.5rem] outline-none transition-all font-mono font-black text-slate-900 dark:text-white shadow-inner text-center"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Mass (kg)</label>
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(Number(e.target.value))}
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500/20 rounded-[1.5rem] outline-none transition-all font-mono font-black text-slate-900 dark:text-white shadow-inner text-center"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Elevation (cm)</label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(Number(e.target.value))}
                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500/20 rounded-[1.5rem] outline-none transition-all font-mono font-black text-slate-900 dark:text-white shadow-inner text-center"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Projection Matrix */}
                        <div className="relative">
                            <div className="absolute -inset-6 bg-emerald-500/10 rounded-[4rem] blur-3xl opacity-50" />
                            <div className="relative bg-slate-900 dark:bg-slate-950 rounded-[3rem] p-10 sm:p-14 border border-white/5 shadow-3xl overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                                    <Zap className="w-48 h-48 text-white" />
                                </div>
                                <div className="relative z-10 text-center space-y-4">
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500/40 italic">Basal Metabolic Rate</span>
                                    <div className="text-8xl font-black text-white tracking-tighter text-glow-emerald">
                                        {Math.round(bmr)}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Calories / 24H Cycle</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Protocol Reconciliation */}
                    <div className="mt-16 flex items-start gap-6 p-8 bg-slate-50 dark:bg-slate-950/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner group transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/5">
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-emerald-500 group-hover:scale-110 transition-transform">
                            <Info className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Mifflin-St Jeor Protocol</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                This calculation utilizes the Mifflin-St Jeor formula, widely recognized as the most accurate global standard for resting metabolic prediction.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Energy Manifest */}
            <div className="space-y-8 px-2">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-px bg-slate-100 dark:bg-slate-800 flex-1" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 whitespace-nowrap">
                        Dynamic Activity Projections
                    </h3>
                    <div className="w-12 h-px bg-slate-100 dark:bg-slate-800 flex-1" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {calorieTiers.map((tier) => (
                        <div key={tier.label} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:scale-[1.03] hover:border-emerald-500/30 group cursor-default">
                            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-4 group-hover:text-emerald-500 transition-colors italic">{tier.label}</div>
                            <div className="text-3xl font-black text-slate-900 dark:text-white mb-2 font-mono tracking-tighter transition-all group-hover:translate-x-1">{Math.round(bmr * tier.multiplier)}</div>
                            <div className="text-[9px] font-bold text-slate-400 leading-relaxed group-hover:text-slate-500 transition-colors uppercase">{tier.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center py-4 opacity-20 border-t border-slate-50 dark:border-slate-800 mt-12">
                <p className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-400">
                    Dimensional Caloric Translation // METABOLIC_NODE_V7
                </p>
            </div>
        </div>
    );
}
