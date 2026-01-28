'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Palette, Copy, Check, RefreshCw, Share2 } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';

extend([namesPlugin]);

export function ColorTool() {
    const [color, setColor] = useState('#10b981');
    const [copied, setCopied] = useState<string | null>(null);
    const [shareCopied, setShareCopied] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Initialize from URL
    useEffect(() => {
        const config = searchParams.get('config');
        if (config) {
            try {
                const hex = atob(decodeURIComponent(config));
                if (colord(hex).isValid()) {
                    setColor(hex);
                }
            } catch (e) {
                console.error('Failed to decode config', e);
            }
        }
    }, []); // Run once on mount

    const handleShare = useCallback(() => {
        const encoded = encodeURIComponent(btoa(color));
        const url = `${window.location.origin}${pathname}?config=${encoded}`;

        navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);

        // Update URL without refresh
        router.replace(`${pathname}?config=${encoded}`, { scroll: false });
    }, [color, pathname, router]);

    const colorData = useMemo(() => {
        const c = colord(color);
        return {
            hex: c.toHex(),
            rgb: c.toRgbString(),
            hsl: c.toHslString(),
            isDark: c.isDark(),
            name: c.toName({ closest: true })
        };
    }, [color]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000);
    };

    const randomizeColor = () => {
        const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        setColor(randomHex);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 lg:space-y-10 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 sm:p-12">
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

                        {/* Visual Interaction Zone */}
                        <div className="lg:w-2/5 space-y-8">
                            <div
                                className="aspect-square rounded-[2.5rem] shadow-2xl border-8 border-white dark:border-slate-800 transition-all duration-500 relative group overflow-hidden"
                                style={{ backgroundColor: colorData.hex }}
                            >
                                <input
                                    type="color"
                                    value={colorData.hex}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer scale-150"
                                />
                                <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-500 ${colorData.isDark ? 'text-white' : 'text-slate-900'}`}>
                                    <Palette className="w-12 h-12 mb-4 opacity-20 group-hover:scale-110 transition-transform" />
                                    <span className="bg-black/10 backdrop-blur-md px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all">
                                        Tap to Surface
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Primary Vector (HEX)</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="w-full py-5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-50 dark:border-slate-800 rounded-3xl outline-none focus:border-emerald-500 transition-all font-mono font-black text-2xl text-center shadow-inner"
                                    />
                                    <button
                                        onClick={randomizeColor}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-50 dark:border-slate-700 text-slate-400 hover:text-emerald-500 transition-all active:rotate-180"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Spectral Synthesis */}
                        <div className="flex-1 space-y-8">
                            <div className="grid gap-4">
                                {[
                                    { label: 'Hex Code', value: colorData.hex },
                                    { label: 'RGB Logic', value: colorData.rgb },
                                    { label: 'HSL Shift', value: colorData.hsl },
                                    { label: 'Identity', value: colorData.name || 'Custom' },
                                ].map((item) => (
                                    <div key={item.label} className="bg-slate-50/50 dark:bg-slate-950/50 p-6 rounded-3xl border border-slate-50 dark:border-slate-800/50 flex items-center justify-between group hover:bg-white dark:hover:bg-slate-900 transition-all hover:shadow-xl hover:shadow-indigo-500/5">
                                        <div>
                                            <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-1">{item.label}</div>
                                            <div className="text-lg font-black text-slate-900 dark:text-white font-mono tracking-tight">{item.value}</div>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(item.value)}
                                            className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-50 dark:border-slate-800 text-slate-300 hover:text-emerald-500 hover:border-emerald-500/30 transition-all active:scale-90"
                                        >
                                            {copied === item.value ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Share & Randomize Controls */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleShare}
                                    className={`flex-1 py-5 rounded-3xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] border shadow-xl ${shareCopied
                                        ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20'
                                        : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {shareCopied ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Vector Shared
                                        </>
                                    ) : (
                                        <>
                                            <Share2 className="w-5 h-5" />
                                            Share Spectrum
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={randomizeColor}
                                    className="px-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    New Data
                                </button>
                            </div>

                            <div className="pt-6 border-t border-slate-50 dark:border-slate-800/50">
                                <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6 px-1">Global Presets</div>
                                <div className="flex flex-wrap gap-4">
                                    {['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#0f172a', '#ffffff', '#000000'].map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setColor(p)}
                                            className="w-12 h-12 rounded-2xl border-4 border-white dark:border-slate-800 shadow-xl transition-all hover:scale-110 active:scale-95 hover:rotate-6"
                                            style={{ backgroundColor: p }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 justify-center">
                <Palette className="w-4 h-4" />
                Spectral Processor Ready
            </div>
        </div>
    );
}
