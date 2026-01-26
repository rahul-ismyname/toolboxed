'use client';

import React, { useState, useMemo } from 'react';
import {
    Settings,
    Play,
    Pause,
    Copy,
    Download,
    RefreshCw,
    Palette,
    Maximize2,
    Minimize2,
    Code,
    Check,
    Zap,
    Grid,
    Circle,
    Activity,
    Box,
    Hash,
    Share2
} from 'lucide-react';

type PatternType = 'dots' | 'grid' | 'waves' | 'chevrons' | 'hexagons' | 'triangles' | 'stripes' | 'zigzag' | 'cubes' | 'circuit';

interface PatternConfig {
    type: PatternType;
    color: string;
    bgColor: string;
    scale: number;
    strokeWidth: number;
    opacity: number;
    animationSpeed: number;
    animate: boolean;
}

interface PatternDefinition {
    render: (config: PatternConfig) => React.ReactNode;
    width: (scale: number) => number;
    height: (scale: number) => number;
}

const PATTERNS: Record<PatternType, PatternDefinition> = {
    dots: {
        width: (s) => s,
        height: (s) => s,
        render: (config) => (
            <pattern id="p" x="0" y="0" width={config.scale} height={config.scale} patternUnits="userSpaceOnUse">
                <circle cx={config.scale / 2} cy={config.scale / 2} r={config.scale / 4} fill={config.color} fillOpacity={config.opacity} />
            </pattern>
        )
    },
    grid: {
        width: (s) => s,
        height: (s) => s,
        render: (config) => (
            <pattern id="p" x="0" y="0" width={config.scale} height={config.scale} patternUnits="userSpaceOnUse">
                <path d={`M ${config.scale} 0 L 0 0 0 ${config.scale}`} fill="none" stroke={config.color} strokeWidth={config.strokeWidth} strokeOpacity={config.opacity} />
            </pattern>
        )
    },
    waves: {
        width: (s) => s,
        height: (s) => s,
        render: (config) => (
            <pattern id="p" x="0" y="0" width={config.scale} height={config.scale} patternUnits="userSpaceOnUse">
                <path d={`M 0 ${config.scale / 2} Q ${config.scale / 4} 0 ${config.scale / 2} ${config.scale / 2} T ${config.scale} ${config.scale / 2}`} fill="none" stroke={config.color} strokeWidth={config.strokeWidth} strokeOpacity={config.opacity} />
            </pattern>
        )
    },
    chevrons: {
        width: (s) => s,
        height: (s) => s,
        render: (config) => (
            <pattern id="p" x="0" y="0" width={config.scale} height={config.scale} patternUnits="userSpaceOnUse">
                <path d={`M 0 ${config.scale / 4} L ${config.scale / 2} ${config.scale / 2} L 0 ${config.scale * 0.75} M ${config.scale / 2} ${config.scale / 4} L ${config.scale} ${config.scale / 2} L ${config.scale / 2} ${config.scale * 0.75}`} fill="none" stroke={config.color} strokeWidth={config.strokeWidth} strokeOpacity={config.opacity} />
            </pattern>
        )
    },
    hexagons: {
        width: (s) => s * 1.5,
        height: (s) => s * Math.sqrt(3),
        render: (config) => {
            const s = config.scale;
            const h = s * Math.sqrt(3);
            return (
                <pattern id="p" x="0" y="0" width={s * 1.5} height={h} patternUnits="userSpaceOnUse">
                    <path d={`M ${s / 2} 0 L ${s * 1.5} 0 L ${s * 2} ${h / 2} L ${s * 1.5} ${h} L ${s / 2} ${h} L 0 ${h / 2} Z`} fill="none" stroke={config.color} strokeWidth={config.strokeWidth} strokeOpacity={config.opacity} />
                </pattern>
            );
        }
    },
    triangles: {
        width: (s) => s,
        height: (s) => s,
        render: (config) => (
            <pattern id="p" x="0" y="0" width={config.scale} height={config.scale} patternUnits="userSpaceOnUse">
                <path d={`M ${config.scale / 2} 0 L ${config.scale} ${config.scale} L 0 ${config.scale} Z`} fill="none" stroke={config.color} strokeWidth={config.strokeWidth} strokeOpacity={config.opacity} />
            </pattern>
        )
    },
    stripes: {
        width: (s) => s,
        height: (s) => s,
        render: (config) => (
            <pattern id="p" x="0" y="0" width={config.scale} height={config.scale} patternUnits="userSpaceOnUse">
                <path d={`M 0 ${config.scale} L ${config.scale} 0 M ${-config.scale / 4} ${config.scale / 4} L ${config.scale / 4} ${-config.scale / 4} M ${config.scale * 0.75} ${config.scale * 1.25} L ${config.scale * 1.25} ${config.scale * 0.75}`} fill="none" stroke={config.color} strokeWidth={config.strokeWidth} strokeOpacity={config.opacity} />
            </pattern>
        )
    },
    zigzag: {
        width: (s) => s,
        height: (s) => s / 2,
        render: (config) => (
            <pattern id="p" x="0" y="0" width={config.scale} height={config.scale / 2} patternUnits="userSpaceOnUse">
                <path d={`M 0 ${config.scale / 4} L ${config.scale / 4} 0 L ${config.scale / 2} ${config.scale / 4} L ${config.scale * 0.75} 0 L ${config.scale} ${config.scale / 4}`} fill="none" stroke={config.color} strokeWidth={config.strokeWidth} strokeOpacity={config.opacity} />
            </pattern>
        )
    },
    cubes: {
        width: (s) => s * 2,
        height: (s) => s * Math.sqrt(3),
        render: (config) => {
            const s = config.scale;
            const h = s * Math.sqrt(3);
            return (
                <pattern id="p" x="0" y="0" width={s * 2} height={h} patternUnits="userSpaceOnUse">
                    <path d={`M 0 ${h / 2} L ${s / 2} ${h / 4} L ${s} ${h / 2} L ${s / 2} ${h * 0.75} Z`} fill={config.color} fillOpacity={config.opacity * 0.5} stroke={config.color} strokeWidth={config.strokeWidth} strokeOpacity={config.opacity} />
                    <path d={`M ${s} ${h / 2} L ${s * 1.5} ${h / 4} L ${s * 2} ${h / 2} L ${s * 1.5} ${h * 0.75} Z`} fill={config.color} fillOpacity={config.opacity} stroke={config.color} strokeWidth={config.strokeWidth} strokeOpacity={config.opacity} />
                    <path d={`M ${s / 2} ${h * 0.75} L ${s} ${h / 2} L ${s * 1.5} ${h * 0.75} L ${s} ${h} Z`} fill={config.color} fillOpacity={config.opacity * 0.8} stroke={config.color} strokeWidth={config.strokeWidth} strokeOpacity={config.opacity} />
                </pattern>
            );
        }
    },
    circuit: {
        width: (s) => s * 2,
        height: (s) => s * 2,
        render: (config) => (
            <pattern id="p" x="0" y="0" width={config.scale * 2} height={config.scale * 2} patternUnits="userSpaceOnUse">
                <path d={`M 0 ${config.scale} H ${config.scale} V 0 M ${config.scale} ${config.scale} H ${config.scale * 2} M ${config.scale} ${config.scale} V ${config.scale * 2}`} fill="none" stroke={config.color} strokeWidth={config.strokeWidth} strokeOpacity={config.opacity} />
                <circle cx={config.scale} cy={config.scale} r={config.strokeWidth * 2} fill={config.color} fillOpacity={config.opacity} />
                <circle cx="0" cy={config.scale} r={config.strokeWidth} fill={config.color} fillOpacity={config.opacity} />
                <circle cx={config.scale} cy="0" r={config.strokeWidth} fill={config.color} fillOpacity={config.opacity} />
            </pattern>
        )
    }
};

export function AnimatedPatternMaster() {
    const [config, setConfig] = useState<PatternConfig>({
        type: 'dots',
        color: '#6366f1',
        bgColor: '#ffffff',
        scale: 40,
        strokeWidth: 2,
        opacity: 0.5,
        animationSpeed: 10,
        animate: true,
    });

    const [copied, setCopied] = useState(false);
    const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

    const { width, height } = useMemo(() => ({
        width: PATTERNS[config.type].width(config.scale),
        height: PATTERNS[config.type].height(config.scale)
    }), [config.type, config.scale]);

    const patternSvg = useMemo(() => {
        const patternDef = PATTERNS[config.type];
        return (
            <svg width="100%" height="100%" className="w-full h-full">
                <defs>
                    {patternDef.render(config)}
                </defs>
                <rect width="100%" height="100%" fill={config.bgColor} />
                <rect width="100%" height="100%" fill="url(#p)">
                    {config.animate && (
                        <animateTransform
                            attributeName="transform"
                            attributeType="XML"
                            type="translate"
                            from="0 0"
                            to={`${width} ${height}`}
                            dur={`${25 - config.animationSpeed}s`}
                            repeatCount="indefinite"
                        />
                    )}
                </rect>
            </svg>
        );
    }, [config, width, height]);

    const cssCode = `background-color: ${config.bgColor};
background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cpattern id='p' x='0' y='0' width='${width}' height='${height}' patternUnits='userSpaceOnUse'%3E${encodeURIComponent('<path d="..." fill="none" stroke="' + config.color + '" />')}%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23p)'/%3E%3C/svg%3E");`;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col lg:flex-row h-full min-h-[750px] bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
            {/* Sidebar */}
            <div className="w-full lg:w-[420px] p-10 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl shadow-indigo-500/20">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Pattern Studio</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Infinite SVG Engine</p>
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Pattern Selector */}
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Library</label>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">10 Styles</span>
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                            {(Object.keys(PATTERNS) as PatternType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setConfig(prev => ({ ...prev, type }))}
                                    title={type}
                                    className={`aspect-square rounded-xl border-2 flex items-center justify-center transition-all ${config.type === type
                                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 shadow-lg shadow-indigo-500/10 scale-110'
                                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-400'}`}
                                >
                                    <span className="text-[10px] font-black uppercase">{type.slice(0, 2)}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Animation Control */}
                    <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-[2rem] border border-slate-100 dark:border-slate-800/50">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-sm font-black text-slate-900 dark:text-white">Fluid Animation</h3>
                                <p className="text-[10px] text-slate-500 font-bold">Seamless looping translation</p>
                            </div>
                            <button
                                onClick={() => setConfig(prev => ({ ...prev, animate: !prev.animate }))}
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${config.animate ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'}`}
                            >
                                {config.animate ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                            </button>
                        </div>

                        {config.animate && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cycle Speed</span>
                                    <span className="text-sm font-black text-indigo-600">{config.animationSpeed}x</span>
                                </div>
                                <input
                                    type="range" min="1" max="24" step="1"
                                    value={config.animationSpeed}
                                    onChange={(e) => setConfig(prev => ({ ...prev, animationSpeed: Number(e.target.value) }))}
                                    className="w-full accent-indigo-600"
                                />
                            </div>
                        )}
                    </div>

                    {/* Configuration */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Base Scale</span>
                                <span className="text-sm font-black text-slate-900 dark:text-white">{config.scale}px</span>
                            </div>
                            <input
                                type="range" min="10" max="300" step="5"
                                value={config.scale}
                                onChange={(e) => setConfig(prev => ({ ...prev, scale: Number(e.target.value) }))}
                                className="w-full accent-indigo-600"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-8 mt-2">
                            <div className="space-y-3">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Stroke Weight</span>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number" min="0.5" max="20" step="0.5"
                                        value={config.strokeWidth}
                                        onChange={(e) => setConfig(prev => ({ ...prev, strokeWidth: Number(e.target.value) }))}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-sm font-bold focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Mask Opacity</span>
                                <input
                                    type="range" min="0" max="1" step="0.05"
                                    value={config.opacity}
                                    onChange={(e) => setConfig(prev => ({ ...prev, opacity: Number(e.target.value) }))}
                                    className="w-full accent-indigo-600 h-10"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Pattern</span>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={config.color} onChange={(e) => setConfig(prev => ({ ...prev, color: e.target.value }))} className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" />
                                    <span className="text-xs font-bold font-mono">{config.color.toUpperCase()}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Canvas</span>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={config.bgColor} onChange={(e) => setConfig(prev => ({ ...prev, bgColor: e.target.value }))} className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" />
                                    <span className="text-xs font-bold font-mono">{config.bgColor.toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex gap-3">
                    <button
                        onClick={() => copyToClipboard(cssCode)}
                        className="flex-1 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
                    >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        {copied ? 'Copied' : 'Copy Styles'}
                    </button>

                    <button className="p-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white hover:bg-slate-50 transition-all active:scale-95">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Preview Container */}
            <div className="flex-1 flex flex-col relative">
                {/* Top bar over preview */}
                <div className="absolute top-8 left-8 right-8 z-20 flex items-center justify-between pointer-events-none">
                    <div className="flex gap-2 pointer-events-auto">
                        <button
                            onClick={() => setViewMode('preview')}
                            className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'preview' ? 'bg-slate-900 text-white shadow-2xl' : 'bg-white/80 dark:bg-slate-900/80 text-slate-500 backdrop-blur-xl'}`}
                        >
                            Viewport
                        </button>
                        <button
                            onClick={() => setViewMode('code')}
                            className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'code' ? 'bg-slate-900 text-white shadow-2xl' : 'bg-white/80 dark:bg-slate-900/80 text-slate-500 backdrop-blur-xl'}`}
                        >
                            Snippet
                        </button>
                    </div>

                    <div className="px-5 py-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-full text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                        Live Rendering · {config.type}
                    </div>
                </div>

                <div className="flex-1 overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
                    {viewMode === 'preview' ? (
                        <div className="w-full h-full shadow-inner relative group">
                            {patternSvg}

                            {/* Decorative Frame Overlay */}
                            <div className="absolute inset-10 border-[32px] border-white/10 pointer-events-none rounded-[3rem] transition-all group-hover:inset-12" />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-[#0d1117] p-16 overflow-auto font-mono text-xs leading-relaxed">
                            <div className="max-w-3xl mx-auto space-y-12">
                                <section>
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="text-indigo-400 font-black uppercase tracking-widest text-[10px]">Inline React SVG</h4>
                                        <button onClick={() => copyToClipboard('React Component Code')} className="p-2 text-slate-500 hover:text-white"><Copy className="w-4 h-4" /></button>
                                    </div>
                                    <pre className="text-slate-300 p-8 bg-slate-900/50 rounded-3xl border border-slate-800 shadow-2xl">
                                        {`const Pattern = () => (
  <svg width="100%" height="100%">
    <defs>
      <pattern id="p" ... />
    </defs>
    <rect width="100%" height="100%" fill="url(#p)" />
  </svg>
);`}
                                    </pre>
                                </section>
                                <section>
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">CSS Implementation</h4>
                                        <button onClick={() => copyToClipboard(cssCode)} className="p-2 text-slate-500 hover:text-white"><Copy className="w-4 h-4" /></button>
                                    </div>
                                    <pre className="text-slate-300 p-8 bg-slate-900/50 rounded-3xl border border-slate-800 shadow-2xl overflow-x-auto">
                                        {`.dynamic-bg {
  ${cssCode}
  background-size: ${width}px ${height}px;
}`}
                                    </pre>
                                </section>
                            </div>
                        </div>
                    )}
                </div>

                {/* Floating Scale Indicator */}
                <div className="absolute bottom-8 left-8 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white dark:border-slate-800 rounded-3xl shadow-2xl flex items-center gap-4 transition-all opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-2">
                        <Maximize2 className="w-4 h-4 text-indigo-500" />
                        <span className="text-[10px] font-black text-slate-900 dark:text-white whitespace-nowrap">{Math.round(width)} × {Math.round(height)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnimatedPatternMaster;
