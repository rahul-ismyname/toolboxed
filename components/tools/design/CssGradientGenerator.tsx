'use client';

import { useState, useMemo } from 'react';
import { Palette, Copy, Check, Wand2, Plus, Trash2, RotateCw, Circle, MousePointer2 } from 'lucide-react';

interface ColorStop {
    id: string;
    color: string;
    position: number;
}

export function CssGradientGenerator() {
    const [type, setType] = useState<'linear' | 'radial'>('linear');
    const [angle, setAngle] = useState(90); // For linear
    const [shape, setShape] = useState<'circle' | 'ellipse'>('circle'); // For radial
    const [stops, setStops] = useState<ColorStop[]>([
        { id: '1', color: '#6366f1', position: 0 },
        { id: '2', color: '#ec4899', position: 100 }
    ]);
    const [copied, setCopied] = useState(false);

    const gradientCss = useMemo(() => {
        const sortedStops = [...stops].sort((a, b) => a.position - b.position);
        const stopsStr = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');

        if (type === 'linear') {
            return `linear-gradient(${angle}deg, ${stopsStr})`;
        } else {
            return `radial-gradient(${shape}, ${stopsStr})`;
        }
    }, [type, angle, shape, stops]);

    const addStop = () => {
        if (stops.length >= 5) return;
        const newStop = {
            id: Math.random().toString(36).substr(2, 9),
            color: '#ffffff',
            position: 50
        };
        setStops([...stops, newStop]);
    };

    const removeStop = (id: string) => {
        if (stops.length <= 2) return;
        setStops(stops.filter(s => s.id !== id));
    };

    const updateStop = (id: string, updates: Partial<ColorStop>) => {
        setStops(stops.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const copyCode = () => {
        navigator.clipboard.writeText(`background: ${gradientCss};`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center gap-6 px-4">
                <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-2xl">
                    <Palette className="w-8 h-8" />
                </div>
                <div className="text-center sm:text-left">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Visual Design Engine</h2>
                    <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Gradient Generator</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 sm:p-12 lg:p-16 grid lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Controls */}
                    <div className="space-y-10 order-2 lg:order-1">
                        <div className="flex items-center gap-4 px-2 pb-4 border-b border-slate-100 dark:border-slate-800/50">
                            <Wand2 className="w-5 h-5 text-emerald-500" />
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Configuration</h3>
                        </div>

                        {/* Type Selection */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setType('linear')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${type === 'linear'
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'}`}
                            >
                                <MousePointer2 className="w-6 h-6 rotate-[-45deg]" />
                                <span className="text-xs font-bold uppercase tracking-wider">Linear</span>
                            </button>
                            <button
                                onClick={() => setType('radial')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${type === 'radial'
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200'}`}
                            >
                                <Circle className="w-6 h-6" />
                                <span className="text-xs font-bold uppercase tracking-wider">Radial</span>
                            </button>
                        </div>

                        {/* Angle / Shape Control */}
                        {type === 'linear' ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Angle</span>
                                    <span className="text-xs font-black text-emerald-500 font-mono bg-emerald-500/10 px-3 py-1 rounded-full">{angle}°</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <RotateCw className="w-4 h-4 text-slate-400" />
                                    <input
                                        type="range" min="0" max="360" step="1"
                                        value={angle} onChange={(e) => setAngle(Number(e.target.value))}
                                        className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                {(['circle', 'ellipse'] as const).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setShape(s)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${shape === s
                                            ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                                            : 'bg-transparent text-slate-500 border-slate-200 dark:border-slate-800'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Stops Editor */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Color Stops</span>
                                <button
                                    onClick={addStop} disabled={stops.length >= 5}
                                    className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 hover:text-emerald-600 disabled:opacity-50 flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" /> Add Stop
                                </button>
                            </div>

                            <div className="space-y-3">
                                {stops.map((stop) => (
                                    <div key={stop.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800 relative group">
                                        <input
                                            type="color"
                                            value={stop.color}
                                            onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                                            className="w-8 h-8 rounded-lg border-2 border-white dark:border-slate-700 cursor-pointer p-0 bg-transparent"
                                        />
                                        <input
                                            type="range"
                                            min="0" max="100"
                                            value={stop.position}
                                            onChange={(e) => updateStop(stop.id, { position: Number(e.target.value) })}
                                            className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-900 dark:accent-white"
                                        />
                                        <span className="text-xs font-mono text-slate-500 w-8 text-right">{stop.position}%</span>

                                        {stops.length > 2 && (
                                            <button
                                                onClick={() => removeStop(stop.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Preview Area */}
                    <div className="order-1 lg:order-2 space-y-8">
                        <div
                            className="w-full aspect-square rounded-[3rem] shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 relative overflow-hidden group"
                            style={{ background: gradientCss }}
                        >
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>

                            <div className="absolute bottom-8 left-8 right-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <p className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate">
                                    {gradientCss}
                                </p>
                            </div>
                        </div>

                        {/* Copy Block */}
                        <div className="p-1">
                            <button
                                onClick={copyCode}
                                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 group"
                            >
                                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                                <span className="font-bold tracking-wide">{copied ? 'COPIED TO CLIPBOARD' : 'COPY CSS CODE'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
