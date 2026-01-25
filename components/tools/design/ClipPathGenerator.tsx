'use client';

import { useState, useRef, useEffect } from 'react';
import { Copy, Check, Scissors, RefreshCw, Triangle, Circle, Square, Star, Plus, MessageSquare, Image as ImageIcon, LayoutTemplate } from 'lucide-react';

type Point = { x: number; y: number };

const SHAPES = {
    triangle: [{ x: 50, y: 0 }, { x: 0, y: 100 }, { x: 100, y: 100 }],
    square: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }],
    circle: [], // Special case
    pentagon: [{ x: 50, y: 0 }, { x: 100, y: 38 }, { x: 82, y: 100 }, { x: 18, y: 100 }, { x: 0, y: 38 }],
    hexagon: [{ x: 25, y: 0 }, { x: 75, y: 0 }, { x: 100, y: 50 }, { x: 75, y: 100 }, { x: 25, y: 100 }, { x: 0, y: 50 }],
    star: [{ x: 50, y: 0 }, { x: 61, y: 35 }, { x: 98, y: 35 }, { x: 68, y: 57 }, { x: 79, y: 91 }, { x: 50, y: 70 }, { x: 21, y: 91 }, { x: 32, y: 57 }, { x: 2, y: 35 }, { x: 39, y: 35 }],
    cross: [{ x: 10, y: 33 }, { x: 33, y: 33 }, { x: 33, y: 10 }, { x: 66, y: 10 }, { x: 66, y: 33 }, { x: 90, y: 33 }, { x: 90, y: 66 }, { x: 66, y: 66 }, { x: 66, y: 90 }, { x: 33, y: 90 }, { x: 33, y: 66 }, { x: 10, y: 66 }],
    message: [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 75 }, { x: 75, y: 75 }, { x: 75, y: 100 }, { x: 50, y: 75 }, { x: 0, y: 75 }],
    parallelogram: [{ x: 25, y: 0 }, { x: 100, y: 0 }, { x: 75, y: 100 }, { x: 0, y: 100 }],
};

export function ClipPathGenerator() {
    const [activeShape, setActiveShape] = useState<'polygon' | 'circle'>('polygon');
    const [points, setPoints] = useState<Point[]>(SHAPES.pentagon);
    const [circleVal, setCircleVal] = useState(50);
    const [copied, setCopied] = useState(false);
    const [draggingPoint, setDraggingPoint] = useState<number | null>(null);
    const [bgImage, setBgImage] = useState('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80');
    const [showGhost, setShowGhost] = useState(true);
    const [showGrid, setShowGrid] = useState(true);
    const [snapToGrid, setSnapToGrid] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    const getClipPath = () => {
        if (activeShape === 'circle') {
            return `circle(${circleVal}% at 50% 50%)`;
        }
        return `polygon(${points.map(p => `${Math.round(p.x)}% ${Math.round(p.y)}%`).join(', ')})`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(`clip-path: ${getClipPath()};`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Drag Logic
    const handleMouseDown = (index: number) => {
        setDraggingPoint(index);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (draggingPoint === null || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        let x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        let y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

        if (snapToGrid) {
            x = Math.round(x / 5) * 5;
            y = Math.round(y / 5) * 5;
        }

        setPoints(prev => {
            const newPoints = [...prev];
            newPoints[draggingPoint] = { x, y };
            return newPoints;
        });
    };

    const handleMouseUp = () => {
        setDraggingPoint(null);
    };

    useEffect(() => {
        if (draggingPoint !== null) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingPoint]);


    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* Editor Surface */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center min-h-[500px] relative select-none">

                        <div className="absolute top-4 left-4 flex flex-col gap-1">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Editor</span>
                                {draggingPoint !== null && (
                                    <span className="text-xs font-mono text-emerald-500">
                                        X: {Math.round(points[draggingPoint].x)}% Y: {Math.round(points[draggingPoint].y)}%
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Ghost Image (Background) for reference */}
                        <div
                            className={`absolute w-64 h-64 sm:w-80 sm:h-80 transition-opacity duration-300 ${showGhost ? 'opacity-30' : 'opacity-0'}`}
                            style={{
                                backgroundImage: `url(${bgImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                filter: 'grayscale(100%) blur(1px)'
                            }}
                        />

                        {/* Grid Overlay */}
                        {showGrid && (
                            <div className="absolute w-64 h-64 sm:w-80 sm:h-80 pointer-events-none opacity-20 z-0">
                                <svg width="100%" height="100%">
                                    <defs>
                                        <pattern id="grid" width="10%" height="10%" patternUnits="userSpaceOnUse">
                                            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.5" />
                                        </pattern>
                                        <pattern id="grid-sub" width="5%" height="5%" patternUnits="userSpaceOnUse">
                                            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.2" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#grid-sub)" className="text-slate-400" />
                                    <rect width="100%" height="100%" fill="url(#grid)" className="text-slate-600" />
                                </svg>
                            </div>
                        )}

                        {/* The Clipped Element */}
                        <div
                            ref={containerRef}
                            className="relative w-64 h-64 sm:w-80 sm:h-80 shadow-2xl transition-[clip-path] duration-75 ease-linear z-10"
                            style={{
                                clipPath: getClipPath(),
                                backgroundImage: `url(${bgImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            {/* Overlay generic texture if no image is loaded properly (fallback) */}
                            {!bgImage && <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-blue-500"></div>}
                        </div>

                        {/* Interactive Handles */}
                        {activeShape === 'polygon' && (
                            <div
                                className="absolute w-64 h-64 sm:w-80 sm:h-80 pointer-events-none z-20"
                            >
                                {/* SVG Lines connecting points */}
                                <svg className="absolute inset-0 w-full h-full burst-none pointer-events-none opacity-50">
                                    <polygon
                                        points={points.map(p => `${p.x}%,${p.y}%`).join(' ')}
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeDasharray="4 2"
                                    />
                                </svg>

                                {points.map((p, i) => (
                                    <div
                                        key={i}
                                        onMouseDown={() => handleMouseDown(i)}
                                        className={`absolute w-4 h-4 sm:w-6 sm:h-6 bg-white border-4 ${draggingPoint === i ? 'border-emerald-400 scale-125' : 'border-emerald-500'} rounded-full shadow-lg cursor-move pointer-events-auto hover:scale-125 transition-transform`}
                                        style={{
                                            left: `${p.x}%`,
                                            top: `${p.y}%`,
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    >
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 hover:opacity-100 whitespace-nowrap pointer-events-none font-mono">
                                            {Math.round(p.x)},{Math.round(p.y)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Controls Toolbar (Bottom) */}
                        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-4 justify-between items-center text-xs text-slate-400">
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer hover:text-emerald-500 transition-colors select-none">
                                    <input type="checkbox" checked={showGhost} onChange={e => setShowGhost(e.target.checked)} className="rounded accent-emerald-500" />
                                    Outside Area
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer hover:text-emerald-500 transition-colors select-none">
                                    <input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)} className="rounded accent-emerald-500" />
                                    Grid
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer hover:text-emerald-500 transition-colors select-none">
                                    <input type="checkbox" checked={snapToGrid} onChange={e => setSnapToGrid(e.target.checked)} className="rounded accent-emerald-500" />
                                    Snap (5%)
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Shape Presets */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block pl-1">Shapes</label>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { label: 'Triangle', icon: Triangle, points: SHAPES.triangle },
                                { label: 'Square', icon: Square, points: SHAPES.square },
                                { label: 'Circle', icon: Circle, isCircle: true },
                                { label: 'Pentagon', icon: LayoutTemplate, points: SHAPES.pentagon },
                                { label: 'Hexagon', icon: LayoutTemplate, points: SHAPES.hexagon },
                                { label: 'Star', icon: Star, points: SHAPES.star },
                                { label: 'Cross', icon: Plus, points: SHAPES.cross },
                                { label: 'Message', icon: MessageSquare, points: SHAPES.message },
                                { label: 'Frame', icon: LayoutTemplate, points: SHAPES.parallelogram },
                            ].map((shape, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setActiveShape(shape.isCircle ? 'circle' : 'polygon');
                                        if (shape.points) setPoints(shape.points);
                                    }}
                                    className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold hover:border-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all flex items-center gap-2 shadow-sm"
                                >
                                    <shape.icon className="w-4 h-4" /> {shape.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeShape === 'circle' && (
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 block">Circle Radius: {circleVal}%</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={circleVal}
                                onChange={(e) => setCircleVal(Number(e.target.value))}
                                className="w-full accent-emerald-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    )}
                </div>

                {/* Settings & Code */}
                <div className="space-y-8">

                    {/* Background Settings */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <ImageIcon className="w-5 h-5 text-emerald-500" />
                            <h3 className="font-bold text-slate-700 dark:text-slate-200">Background Image</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Image URL</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={bgImage}
                                    onChange={(e) => setBgImage(e.target.value)}
                                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none transition-colors"
                                    placeholder="https://..."
                                />
                                <button
                                    onClick={() => setBgImage(`https://picsum.photos/800/800?random=${Date.now()}`)}
                                    className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-500 hover:text-emerald-500 transition-colors"
                                    title="Random Image"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400">
                                Paste any image URL to see how the clip path affects it.
                            </p>
                        </div>
                    </div>

                    {/* Output */}
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
                        <div className="p-6 text-sm leading-relaxed font-bold">
                            <span className="text-purple-400">clip-path</span>: <span className="text-orange-300">{getClipPath()}</span>;
                        </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/30">
                        <div className="flex items-start gap-3">
                            <Scissors className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mt-1" />
                            <div className="space-y-2">
                                <h3 className="font-bold text-emerald-900 dark:text-emerald-100">Pro Tip</h3>
                                <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed">
                                    Use the "Show Outside Area" toggle to verify exactly what parts of your image are being cropped out. Standard CSS transitions work beautifully between polygon shapes with the same number of points!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
