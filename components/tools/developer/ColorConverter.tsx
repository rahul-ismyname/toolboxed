'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Palette } from 'lucide-react';
import { colord, extend } from 'colord';
import cmykPlugin from 'colord/plugins/cmyk';
import namesPlugin from 'colord/plugins/names';

extend([cmykPlugin, namesPlugin]);

interface ColorState {
    hex: string;
    rgb: string;
    hsl: string;
    cmyk: string;
}

export function ColorConverter() {
    const [colors, setColors] = useState<ColorState>({
        hex: '#3B82F6',
        rgb: 'rgb(59, 130, 246)',
        hsl: 'hsl(217, 91%, 60%)',
        cmyk: 'cmyk(76%, 47%, 0%, 4%)' // Approx
    });

    // Track which input is being edited to avoid overwriting it with re-formatted values while typing
    const [activeInput, setActiveInput] = useState<keyof ColorState | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const updateColors = (value: string, source: keyof ColorState | 'picker') => {
        // Always update the input field immediately
        const newColors = { ...colors };
        if (source !== 'picker') {
            newColors[source] = value;
        }

        const color = colord(value);
        if (color.isValid()) {
            const hex = color.toHex();
            const rgb = color.toRgbString();
            const hsl = color.toHslString();
            const cmyk = color.toCmykString();

            // Setup new state, but preserve the exact text of the active input to allow free typing
            setColors({
                hex: source === 'hex' ? value : hex,
                rgb: source === 'rgb' ? value : rgb,
                hsl: source === 'hsl' ? value : hsl,
                cmyk: source === 'cmyk' ? value : cmyk,
            });
        } else {
            // If invalid, just update the changed field (so user can type)
            if (source !== 'picker') {
                setColors(newColors);
            }
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Preview & Picker Section */}
                    <div className="lg:w-1/3 space-y-6">
                        <div className="relative aspect-square rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800 overflow-hidden group">
                            <div
                                className="absolute inset-0 transition-colors duration-200"
                                style={{ backgroundColor: colord(colors.hex).isValid() ? colors.hex : 'transparent' }}
                            />

                            {/* Color Input overlay */}
                            <input
                                type="color"
                                value={colord(colors.hex).isValid() ? colors.hex : '#000000'}
                                onChange={(e) => updateColors(e.target.value, 'picker')}
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                            />

                            <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-3 rounded-xl flex items-center justify-center border border-black/5 dark:border-white/10 shadow-lg pointer-events-none">
                                <span className="font-mono font-bold text-slate-900 dark:text-white text-lg tracking-wider">
                                    {colord(colors.hex).isValid() ? colors.hex.toUpperCase() : 'INVALID'}
                                </span>
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                                    Click to change
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Inputs Section */}
                    <div className="flex-1 space-y-5">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
                            <Palette className="w-5 h-5 mr-2 text-emerald-500" />
                            Color Definitions
                        </h3>

                        {[
                            { id: 'hex', label: 'HEX', placeholder: '#000000' },
                            { id: 'rgb', label: 'RGB', placeholder: 'rgb(0, 0, 0)' },
                            { id: 'hsl', label: 'HSL', placeholder: 'hsl(0, 0%, 0%)' },
                            { id: 'cmyk', label: 'CMYK', placeholder: 'cmyk(0, 0, 0, 100)' },
                        ].map((format) => (
                            <div key={format.id} className="group">
                                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5 ml-1">
                                    {format.label}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={colors[format.id as keyof ColorState]}
                                        onChange={(e) => updateColors(e.target.value, format.id as keyof ColorState)}
                                        onFocus={() => setActiveInput(format.id as keyof ColorState)}
                                        onBlur={() => setActiveInput(null)}
                                        className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-base font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
                                        placeholder={format.placeholder}
                                    />
                                    <button
                                        onClick={() => copyToClipboard(colors[format.id as keyof ColorState], format.id)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                                    >
                                        {copied === format.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
