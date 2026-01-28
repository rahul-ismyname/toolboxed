'use client';

import { useState, useCallback, useEffect } from 'react';
import { Layers, Copy, Check, Plus, Trash2, Share2 } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface ShadowLayer {
    id: string;
    x: number;
    y: number;
    blur: number;
    spread: number;
    color: string;
    inset: boolean;
}

export function BoxShadowGenerator() {
    const [layers, setLayers] = useState<ShadowLayer[]>([
        { id: '1', x: 0, y: 10, blur: 15, spread: -3, color: 'rgba(0,0,0,0.1)', inset: false },
        { id: '2', x: 0, y: 4, blur: 6, spread: -2, color: 'rgba(0,0,0,0.05)', inset: false }
    ]);
    const [bgColor, setBgColor] = useState('#f8fafc');
    const [boxColor, setBoxColor] = useState('#ffffff');
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
                if (decoded.layers) setLayers(decoded.layers);
                if (decoded.bgColor) setBgColor(decoded.bgColor);
                if (decoded.boxColor) setBoxColor(decoded.boxColor);
            } catch (e) {
                console.error('Failed to decode config', e);
            }
        }
    }, []); // Run once on mount

    const getShadowValue = useCallback(() => {
        return layers.map(l =>
            `${l.inset ? 'inset ' : ''}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`
        ).join(', ');
    }, [layers]);

    const addLayer = () => {
        setLayers([...layers, {
            id: crypto.randomUUID(),
            x: 0,
            y: 10,
            blur: 20,
            spread: 0,
            color: 'rgba(0,0,0,0.1)',
            inset: false
        }]);
    };

    const updateLayer = useCallback((id: string, updates: Partial<ShadowLayer>) => {
        setLayers(current => current.map(l => l.id === id ? { ...l, ...updates } : l));
    }, []);

    const removeLayer = useCallback((id: string) => {
        setLayers(current => current.filter(l => l.id !== id));
    }, []);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(`box-shadow: ${getShadowValue()};`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [getShadowValue]);

    const handleShare = useCallback(() => {
        const config = { layers, bgColor, boxColor };
        const encoded = encodeURIComponent(btoa(JSON.stringify(config)));
        const url = `${window.location.origin}${pathname}?config=${encoded}`;

        navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);

        // Update URL without refresh
        router.replace(`${pathname}?config=${encoded}`, { scroll: false });
    }, [layers, bgColor, boxColor, pathname, router]);

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* Editor Surface */}
                <div className="space-y-6">
                    <div
                        className="rounded-3xl shadow-inner border border-slate-200 dark:border-slate-800 p-8 flex items-center justify-center min-h-[500px] relative transition-colors duration-300"
                        style={{ backgroundColor: bgColor }}
                    >
                        <div className="absolute top-4 left-4 flex gap-4">
                            <div className="flex items-center gap-2 bg-white/50 backdrop-blur rounded-lg p-1 pr-3 border border-slate-200/50">
                                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" />
                                <span className="text-xs font-bold text-slate-500 uppercase">Canvas</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/50 backdrop-blur rounded-lg p-1 pr-3 border border-slate-200/50">
                                <input type="color" value={boxColor} onChange={(e) => setBoxColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" />
                                <span className="text-xs font-bold text-slate-500 uppercase">Box</span>
                            </div>
                        </div>

                        {/* The Box */}
                        <div
                            className="w-48 h-48 sm:w-64 sm:h-64 rounded-3xl transition-all duration-200 ease-out flex items-center justify-center"
                            style={{
                                backgroundColor: boxColor,
                                boxShadow: getShadowValue()
                            }}
                        >
                            {/* Optional: Add content inside box later */}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">

                    {/* Layers List */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 md:p-6 space-y-4 md:space-y-6 max-h-[500px] md:max-h-[600px] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Layers className="w-5 h-5 text-emerald-500" />
                                <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm md:text-base">Shadow Layers</h3>
                            </div>
                            <button
                                onClick={addLayer}
                                className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] md:text-xs font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-3 h-3" /> Add Layer
                            </button>
                        </div>

                        <div className="space-y-6 md:space-y-8">
                            {layers.map((layer, index) => (
                                <div key={layer.id} className="space-y-4 relative group">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Layer {index + 1}</span>
                                        <button onClick={() => removeLayer(layer.id)} className="text-slate-300 hover:text-red-500 transition-colors p-2">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] md:text-xs text-slate-500 font-medium">
                                                <span>X Offset</span>
                                                <span>{layer.x}px</span>
                                            </div>
                                            <input
                                                type="range" min="-100" max="100" value={layer.x}
                                                onChange={(e) => updateLayer(layer.id, { x: Number(e.target.value) })}
                                                className="w-full accent-emerald-500 h-2 md:h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] md:text-xs text-slate-500 font-medium">
                                                <span>Y Offset</span>
                                                <span>{layer.y}px</span>
                                            </div>
                                            <input
                                                type="range" min="-100" max="100" value={layer.y}
                                                onChange={(e) => updateLayer(layer.id, { y: Number(e.target.value) })}
                                                className="w-full accent-emerald-500 h-2 md:h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] md:text-xs text-slate-500 font-medium">
                                                <span>Blur</span>
                                                <span>{layer.blur}px</span>
                                            </div>
                                            <input
                                                type="range" min="0" max="100" value={layer.blur}
                                                onChange={(e) => updateLayer(layer.id, { blur: Number(e.target.value) })}
                                                className="w-full accent-emerald-500 h-2 md:h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] md:text-xs text-slate-500 font-medium">
                                                <span>Spread</span>
                                                <span>{layer.spread}px</span>
                                            </div>
                                            <input
                                                type="range" min="-50" max="50" value={layer.spread}
                                                onChange={(e) => updateLayer(layer.id, { spread: Number(e.target.value) })}
                                                className="w-full accent-emerald-500 h-2 md:h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <div className="w-6 h-6 rounded-full border border-slate-200 shadow-sm shrink-0" style={{ backgroundColor: layer.color }}></div>
                                            <input
                                                type="text"
                                                value={layer.color}
                                                onChange={(e) => updateLayer(layer.id, { color: e.target.value })}
                                                className="bg-transparent text-[10px] md:text-xs font-mono w-full outline-none text-slate-600 dark:text-slate-400"
                                            />
                                        </div>
                                        <label className="flex items-center gap-2 p-2.5 px-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px] md:text-xs font-bold text-slate-500 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={layer.inset}
                                                onChange={(e) => updateLayer(layer.id, { inset: e.target.checked })}
                                                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
                                            />
                                            Inset
                                        </label>
                                    </div>
                                    {index < layers.length - 1 && <div className="h-px bg-slate-100 dark:bg-slate-800 w-full mt-2 md:mt-4"></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Output Code */}
                    <div className="bg-slate-900 rounded-3xl shadow-xl overflow-hidden text-slate-300 font-mono relative group">
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                onClick={handleCopy}
                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 transition-colors border border-slate-700"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                        <div className="flex bg-slate-950/50 p-4 border-b border-slate-800">
                            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">CSS Output</span>
                        </div>
                        <div className="p-6 text-sm leading-relaxed overflow-x-auto">
                            <span className="text-purple-400">box-shadow</span>: <span className="text-orange-300">{getShadowValue()}</span>;
                        </div>
                    </div>

                    {/* Share Action */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleShare}
                            className="flex-1 flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-3xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
                        >
                            {shareCopied ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    Link Copied!
                                </>
                            ) : (
                                <>
                                    <Share2 className="w-5 h-5" />
                                    Share Design Link
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
