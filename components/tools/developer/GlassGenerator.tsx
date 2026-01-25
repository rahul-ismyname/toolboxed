'use client';

import { useState, useMemo } from 'react';
import { Palette, Copy, Check, Layout, Wand2 } from 'lucide-react';

export function GlassGenerator() {
    const [blur, setBlur] = useState(10);
    const [transparency, setTransparency] = useState(0.2);
    const [color, setColor] = useState('#ffffff');
    const [outline, setOutline] = useState(0.1);
    const [copied, setCopied] = useState(false);

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
        let r = parseInt(hex.slice(1, 3), 16),
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
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-8 md:p-12 grid lg:grid-cols-2 gap-12">
                {/* Controls */}
                <div className="space-y-8">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Wand2 className="w-5 h-5 text-emerald-500" />
                        Styling Controls
                    </h3>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm font-bold text-slate-500 uppercase tracking-wider">
                                <span>Blur Radius</span>
                                <span className="text-slate-900 dark:text-white">{blur}px</span>
                            </div>
                            <input
                                type="range" min="0" max="40" step="1"
                                value={blur} onChange={(e) => setBlur(Number(e.target.value))}
                                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm font-bold text-slate-500 uppercase tracking-wider">
                                <span>Transparency</span>
                                <span className="text-slate-900 dark:text-white">{transparency}</span>
                            </div>
                            <input
                                type="range" min="0" max="1" step="0.01"
                                value={transparency} onChange={(e) => setTransparency(Number(e.target.value))}
                                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm font-bold text-slate-500 uppercase tracking-wider">
                                <span>Color Tint</span>
                                <span className="text-slate-900 dark:text-white font-mono">{color}</span>
                            </div>
                            <div className="flex gap-4 items-center">
                                <input
                                    type="color" value={color} onChange={(e) => setColor(e.target.value)}
                                    className="w-12 h-12 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                                />
                                <div className="flex gap-2">
                                    {['#ffffff', '#000000', '#3b82f6', '#10b981', '#ef4444'].map(c => (
                                        <button key={c} onClick={() => setColor(c)} className="w-8 h-8 rounded-full border border-slate-200" style={{ backgroundColor: c }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 flex items-center justify-center min-h-[300px] relative overflow-hidden">
                    {/* Background Noise/Shapes */}
                    <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full blur-2xl opacity-50 animate-pulse" />
                    <div className="absolute bottom-10 right-10 w-48 h-48 bg-emerald-400 rounded-full blur-3xl opacity-50" />

                    <div
                        className="w-full max-w-sm p-8 shadow-2xl flex flex-col items-center justify-center text-center transition-all duration-300"
                        style={{
                            background: color.startsWith('#') ? hexToRgba(color, transparency) : color,
                            backdropFilter: `blur(${blur}px)`,
                            border: `1px solid rgba(255, 255, 255, ${outline})`,
                            borderRadius: '24px'
                        }}
                    >
                        <Layout className="w-12 h-12 text-white mb-4 opacity-80" />
                        <h4 className="text-2xl font-black text-white mb-2">Glass Card</h4>
                        <p className="text-white/80 text-sm">Perfect for modern UI designs with a premium aesthetic.</p>
                    </div>
                </div>
            </div>

            {/* Code Output */}
            <div className="p-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Generated CSS</span>
                    <button
                        onClick={copyCode}
                        className="flex items-center gap-2 text-sm font-bold text-emerald-500 hover:text-emerald-600 transition-colors"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                </div>
                <pre className="p-6 bg-white dark:bg-slate-900 rounded-2xl font-mono text-sm leading-relaxed border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 overflow-x-auto">
                    {cssCode}
                </pre>
            </div>
        </div>
    );
}
