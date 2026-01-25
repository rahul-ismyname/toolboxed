'use client';

import { useState, useEffect } from 'react';
import { Calculator, ArrowRight, Ratio, Monitor, Smartphone, Youtube, Image as ImageIcon } from 'lucide-react';

export function AspectRatioCalculator() {
    const [w1, setW1] = useState<number>(1920);
    const [h1, setH1] = useState<number>(1080);
    const [w2, setW2] = useState<number>(0);
    const [h2, setH2] = useState<number>(720);

    // Mode: 'resize' (calculate missing dim) or 'ratio' (find ratio of w1:h1)
    const [mode, setMode] = useState<'resize' | 'ratio'>('resize');
    const [ratio, setRatio] = useState<string>('');
    const [gcd, setGcd] = useState<number>(0);

    const commonRatios = [
        { label: '16:9', w: 16, h: 9, desc: 'HD Video, Monitors' },
        { label: '4:3', w: 4, h: 3, desc: 'Standard TV, Tablet' },
        { label: '1:1', w: 1, h: 1, desc: 'Square, Instagram' },
        { label: '9:16', w: 9, h: 16, desc: 'Stories, TikTok' },
        { label: '21:9', w: 21, h: 9, desc: 'Ultrawide Cinema' },
        { label: '3:2', w: 3, h: 2, desc: 'DSLR, Classic Photo' },
    ];

    // Greatest Common Divisor
    const calcGcd = (a: number, b: number): number => {
        return b === 0 ? a : calcGcd(b, a % b);
    };

    const calculate = () => {
        if (mode === 'resize') {
            // Find ratio from w1/h1, apply to w2/h2 logic
            // We assume user is editing one of w2/h2 to find the other
            // BUT for simplicity in UI, we usually let user type in W2 and we calculate H2, or vice versa.
            // Let's implement dynamic calculation: if W2 changes, calculate H2.
        }

        // Calculate simplified ratio
        if (w1 > 0 && h1 > 0) {
            const divisor = calcGcd(Math.round(w1), Math.round(h1));
            const rw = Math.round(w1) / divisor;
            const rh = Math.round(h1) / divisor;
            setRatio(`${rw}:${rh}`);
            setGcd(divisor);
        }
    };

    useEffect(() => {
        calculate();
    }, [w1, h1]);

    const handleW2Change = (val: number) => {
        setW2(val);
        if (w1 && h1) {
            setH2(Math.round((val * h1) / w1));
        }
    };

    const handleH2Change = (val: number) => {
        setH2(val);
        if (w1 && h1) {
            setW2(Math.round((val * w1) / h1));
        }
    };

    const setPreset = (w: number, h: number) => {
        setW1(w);
        setH1(h);
        // Reset W2/H2 based on new ratio, keeping width scale roughly same
        setW2(w * 100);
        setH2(h * 100);
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Presets Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {commonRatios.map((r) => (
                    <button
                        key={r.label}
                        onClick={() => setPreset(r.w, r.h)}
                        className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md transition-all group"
                    >
                        <span className="text-lg font-black text-slate-700 dark:text-slate-300 group-hover:text-emerald-500">{r.label}</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wide">{r.desc}</span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Calculator Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-8">

                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Ratio className="w-5 h-5 text-emerald-500" />
                            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">Original Dimensions</h2>
                        </div>
                        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-slate-400 pl-2">Width (px)</label>
                                <input
                                    type="number"
                                    value={w1}
                                    onChange={(e) => setW1(Number(e.target.value))}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl p-4 text-center text-xl font-bold focus:border-emerald-500 outline-none transition-colors"
                                />
                            </div>
                            <span className="text-slate-300 dark:text-slate-700 font-bold text-xl pt-6">:</span>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-slate-400 pl-2">Height (px)</label>
                                <input
                                    type="number"
                                    value={h1}
                                    onChange={(e) => setH1(Number(e.target.value))}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl p-4 text-center text-xl font-bold focus:border-emerald-500 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl p-4 text-center border border-emerald-100 dark:border-emerald-900/30">
                            <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                                Aspect Ratio: <span className="font-black text-2xl ml-2">{ratio}</span>
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <div className="bg-white dark:bg-slate-900 px-4">
                                <ArrowRight className="w-6 h-6 text-slate-300 dark:text-slate-700" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Calculator className="w-5 h-5 text-blue-500" />
                            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">New Dimensions</h2>
                        </div>
                        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-slate-400 pl-2">New Width</label>
                                <input
                                    type="number"
                                    value={w2}
                                    onChange={(e) => handleW2Change(Number(e.target.value))}
                                    className="w-full bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-100 dark:border-blue-900/30 rounded-xl p-4 text-center text-xl font-bold focus:border-blue-500 outline-none transition-colors text-blue-700 dark:text-blue-300"
                                />
                            </div>
                            <span className="text-slate-300 dark:text-slate-700 font-bold text-xl pt-6">:</span>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-slate-400 pl-2">New Height</label>
                                <input
                                    type="number"
                                    value={h2}
                                    onChange={(e) => handleH2Change(Number(e.target.value))}
                                    className="w-full bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-100 dark:border-blue-900/30 rounded-xl p-4 text-center text-xl font-bold focus:border-blue-500 outline-none transition-colors text-blue-700 dark:text-blue-300"
                                />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Preview Card */}
                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-3xl border-2 border-slate-100 dark:border-slate-800 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-4 left-4 text-xs font-bold uppercase tracking-widest text-slate-400">Preview</div>

                    {/* Visual box representing the ratio */}
                    <div
                        className="bg-emerald-500 shadow-2xl shadow-emerald-500/20 rounded-lg flex items-center justify-center transition-all duration-500"
                        style={{
                            aspectRatio: `${w1}/${h1}`,
                            width: w1 >= h1 ? '80%' : 'auto',
                            height: w1 < h1 ? '60%' : 'auto',
                            maxHeight: '300px'
                        }}
                    >
                        <span className="text-white font-bold opacity-90 drop-shadow-md text-lg">{ratio}</span>
                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-6 text-center w-full max-w-sm">
                        <div>
                            <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm text-slate-500">
                                <Monitor className="w-5 h-5" />
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Landscape</div>
                        </div>
                        <div>
                            <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm text-slate-500">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Portrait</div>
                        </div>
                        <div>
                            <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm text-slate-500">
                                <Youtube className="w-5 h-5" />
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Video</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
