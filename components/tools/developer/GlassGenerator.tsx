'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Palette, Copy, Check, Layout, Wand2, Share2 } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function GlassGenerator() {
    const [blur, setBlur] = useState(10);
    const [transparency, setTransparency] = useState(0.2);
    const [color, setColor] = useState('#ffffff');
    const [outline, setOutline] = useState(0.1);
    const [copied, setCopied] = useState(false);
    const [shareCopied, setShareCopied] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Initialize from URL
    useEffect(() => {
        const config = searchParams.get('config');
        if (config) {
            try {
                const decoded = JSON.parse(atob(decodeURIComponent(config)));
                if (decoded.blur !== undefined) setBlur(decoded.blur);
                if (decoded.transparency !== undefined) setTransparency(decoded.transparency);
                if (decoded.color) setColor(decoded.color);
                if (decoded.outline !== undefined) setOutline(decoded.outline);
            } catch (e) {
                console.error('Failed to decode config', e);
            }
        }
    }, []); // Run once on mount

    const handleShare = useCallback(() => {
        const config = { blur, transparency, color, outline };
        const encoded = encodeURIComponent(btoa(JSON.stringify(config)));
        const url = `${window.location.origin}${pathname}?config=${encoded}`;

        navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);

        // Update URL without refresh
        router.replace(`${pathname}?config=${encoded}`, { scroll: false });
    }, [blur, transparency, color, outline, pathname, router]);

    const cssCode = useMemo(() => {
        const rgba = color.startsWith('#')
            ? hexToRgba(color, transparency)
            : `rgba(255, 255, 255, ${transparency})`;

        return `background: ${rgba};
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: 1px solid rgba(255, 255, 255, ${outline});
border-radius: 20px;
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);`;
    }, [blur, transparency, color, outline]);

    function hexToRgba(hex: string, alpha: number) {
        const r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    const copyCode = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
            {/* Structural Header */}
            <div className="flex flex-col sm:flex-row items-center gap-6 px-4">
                <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-2xl">
                    <Palette className="w-8 h-8" />
                </div>
                <div className="text-center sm:text-left">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Visual Surface Engine</h2>
                    <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Glass Generator</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 sm:p-12 lg:p-16 grid lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Control Matrix */}
                    <div className="space-y-10">
                        <div className="flex items-center gap-4 px-2">
                            <Wand2 className="w-5 h-5 text-emerald-500" />
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Synthesis Controls</h3>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Blur Intensity</span>
                                    <span className="text-xs font-black text-emerald-500 font-mono bg-emerald-500/10 px-3 py-1 rounded-full">{blur}PX</span>
                                </div>
                                <input
                                    type="range" min="0" max="40" step="1"
                                    value={blur} onChange={(e) => setBlur(Number(e.target.value))}
                                    className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 transition-all hover:accent-emerald-400"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Opacity Delta</span>
                                    <span className="text-xs font-black text-emerald-500 font-mono bg-emerald-500/10 px-3 py-1 rounded-full">{transparency}</span>
                                </div>
                                <input
                                    type="range" min="0" max="1" step="0.01"
                                    value={transparency} onChange={(e) => setTransparency(Number(e.target.value))}
                                    className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 transition-all hover:accent-emerald-400"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Chromatic Tint</span>
                                    <span className="text-xs font-black text-emerald-500 font-mono bg-emerald-500/10 px-3 py-1 rounded-full uppercase">{color}</span>
                                </div>
                                <div className="flex flex-wrap gap-4 items-center p-4 bg-slate-50/50 dark:bg-slate-950/50 rounded-2xl border border-slate-50 dark:border-slate-800/50 shadow-inner">
                                    <div className="relative group/color">
                                        <input
                                            type="color" value={color} onChange={(e) => setColor(e.target.value)}
                                            className="w-12 h-12 rounded-xl border-4 border-white dark:border-slate-800 cursor-pointer p-0 bg-transparent shadow-lg transition-transform group-hover/color:scale-110"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        {['#ffffff', '#000000', '#3b82f6', '#10b981', '#f43f5e'].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setColor(c)}
                                                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 active:scale-90 ${color === c ? 'border-emerald-500 shadow-lg scale-110' : 'border-white dark:border-slate-800 shadow-sm'}`}
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Projection Chamber */}
                    <div className="relative flex flex-col justify-center gap-8">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[3rem] opacity-90"></div>

                        {/* Dynamic Background Elements */}
                        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-48 h-48 bg-emerald-400 rounded-full blur-3xl opacity-40 animate-pulse delay-700"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>

                        <div
                            className="w-full aspect-square sm:aspect-video lg:aspect-square flex flex-col items-center justify-center text-center transition-all duration-500 relative z-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] px-12 group hover:scale-[1.02]"
                            style={{
                                background: color.startsWith('#') ? hexToRgba(color, transparency) : color,
                                backdropFilter: `blur(${blur}px)`,
                                WebkitBackdropFilter: `blur(${blur}px)`,
                                border: `1px solid rgba(255, 255, 255, ${outline})`,
                                borderRadius: '3rem'
                            }}
                        >
                            <div className="p-6 bg-white/10 rounded-[2rem] backdrop-blur-md mb-8 ring-1 ring-white/20 transition-transform group-hover:scale-110">
                                <Layout className="w-12 h-12 text-white opacity-90" />
                            </div>
                            <h4 className="text-3xl font-black text-white mb-3 tracking-tight">Synthetic Surface</h4>
                            <p className="text-white/70 text-sm font-medium leading-relaxed max-w-xs">
                                Dynamic glassmorphism rendered via CSS engine protocol.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Manifest Block */}
                <div className="p-8 sm:p-12 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 px-4">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Material CSS Schema</span>
                        </div>
                        <button
                            onClick={handleShare}
                            className="w-full sm:w-auto px-8 py-4 bg-emerald-500 text-white rounded-[1.2rem] shadow-xl border border-emerald-400 flex items-center justify-center gap-4 transition-all hover:bg-emerald-400 active:scale-95 group/share"
                        >
                            {shareCopied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5 transition-colors" />}
                            <span className="text-[10px] font-black uppercase tracking-widest">{shareCopied ? 'Link Copied' : 'Share Design'}</span>
                        </button>
                        <button
                            onClick={copyCode}
                            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-[1.2rem] shadow-xl border border-slate-50 dark:border-slate-800 flex items-center justify-center gap-4 transition-all hover:shadow-2xl active:scale-95 group/copy"
                        >
                            {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-slate-300 group-hover/copy:text-emerald-500 transition-colors" />}
                            <span className="text-[10px] font-black uppercase tracking-widest">{copied ? 'System Copied' : 'Transfer Code'}</span>
                        </button>
                    </div>
                    <div className="relative group/code">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-3xl blur opacity-0 group-hover/code:opacity-5 transition duration-1000"></div>
                        <pre className="relative p-8 sm:p-10 bg-white dark:bg-slate-900 rounded-[2rem] font-mono text-[10px] sm:text-xs leading-relaxed border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 overflow-x-auto shadow-inner custom-scrollbar">
                            {cssCode}
                        </pre>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                    Surface Manifest // Level 4 Visualization
                </p>
            </div>
        </div>
    );
}
