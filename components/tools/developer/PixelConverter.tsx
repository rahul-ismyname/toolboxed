'use client';

import { useState, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';

export function PixelConverter() {
    const [px, setPx] = useState<number | ''>(16);
    const [base, setBase] = useState<number>(16);
    const [rem, setRem] = useState<number | ''>(1);

    useEffect(() => {
        if (typeof px === 'number') {
            const calculatedRem = px / base;
            // Avoid infinite loop if values match, but update if different
            if (calculatedRem !== rem) {
                setRem(parseFloat(calculatedRem.toFixed(4)));
            }
        } else {
            setRem('');
        }
    }, [px, base]);

    const handleRemChange = (val: number | '') => {
        setRem(val);
        if (typeof val === 'number') {
            setPx(parseFloat((val * base).toFixed(0)));
        } else {
            setPx('');
        }
    };

    return (
        <div className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/50">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                    Pixel to Rem Converter
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                    Convert pixels to REM units for responsive web design.
                </p>
            </div>

            <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                    {/* Pixels Input */}
                    <div className="w-full max-w-xs">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Pixels (px)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={px}
                                onChange={(e) => setPx(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full pl-4 pr-12 py-4 text-2xl font-bold text-center border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-slate-900 dark:focus:border-slate-500 outline-none transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                placeholder="16"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">px</span>
                        </div>
                    </div>

                    {/* Icon */}
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 rotate-90 md:rotate-0">
                        <ArrowLeftRight className="w-6 h-6" />
                    </div>

                    {/* Rem Input */}
                    <div className="w-full max-w-xs">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">REM</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={rem}
                                onChange={(e) => handleRemChange(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full pl-4 pr-12 py-4 text-2xl font-bold text-center border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-slate-900 dark:focus:border-slate-500 outline-none transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                placeholder="1"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">rem</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Base Font Size:</label>
                        <input
                            type="number"
                            value={base}
                            onChange={(e) => setBase(Number(e.target.value))}
                            className="w-16 px-2 py-1 text-center font-bold text-slate-900 dark:text-white bg-transparent border-b border-slate-300 dark:border-slate-600 focus:border-slate-900 outline-none"
                        />
                        <span className="text-sm text-slate-500">px</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
