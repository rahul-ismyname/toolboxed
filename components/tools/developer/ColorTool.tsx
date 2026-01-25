'use client';

import { useState, useMemo } from 'react';
import { Palette, Copy, Check, RefreshCw } from 'lucide-react';
import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';

extend([namesPlugin]);

export function ColorTool() {
    const [color, setColor] = useState('#10b981');
    const [copied, setCopied] = useState<string | null>(null);

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

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-8 md:p-12 lg:flex gap-12">
                {/* Visual Picker & Preview */}
                <div className="lg:w-1/3 mb-8 lg:mb-0">
                    <div
                        className="aspect-square rounded-3xl shadow-inner border border-black/5 dark:border-white/10 mb-6 transition-colors duration-300 relative group"
                        style={{ backgroundColor: colorData.hex }}
                    >
                        <input
                            type="color"
                            value={colorData.hex}
                            onChange={(e) => setColor(e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity ${colorData.isDark ? 'text-white' : 'text-black'}`}>
                            <span className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold">Click to Pick</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">HEX Input</label>
                        <input
                            type="text"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-mono font-bold text-center"
                        />
                    </div>
                </div>

                {/* Conversion Details */}
                <div className="flex-1 space-y-6">
                    <div className="grid gap-6">
                        {[
                            { label: 'HEX', value: colorData.hex },
                            { label: 'RGB', value: colorData.rgb },
                            { label: 'HSL', value: colorData.hsl },
                            { label: 'Name', value: colorData.name || 'Custom' },
                        ].map((item) => (
                            <div key={item.label} className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group">
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{item.label}</div>
                                    <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">{item.value}</div>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(item.value)}
                                    className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-emerald-500 hover:border-emerald-500 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    {copied === item.value ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                        {['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#0f172a'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setColor(p)}
                                className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm transition-transform hover:scale-110 active:scale-95"
                                style={{ backgroundColor: p }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
