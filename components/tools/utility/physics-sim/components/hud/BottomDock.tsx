'use client';

import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Box, Circle, Triangle, Hexagon, Minus, Link, GripHorizontal, MapPin, Eraser, Zap, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomDockProps {
    paused: boolean;
    onPausedChange: (paused: boolean) => void;
    onReset: () => void;
    activeTool: string | null;
    onSelectTool: (tool: string, size?: number) => void;
    onClearTrails: () => void;
}

export function BottomDock({
    paused,
    onPausedChange,
    onReset,
    activeTool,
    onSelectTool,
    onClearTrails,
}: BottomDockProps) {
    const [spawnSize, setSpawnSize] = useState(30);

    const tools = [
        { type: 'box' as const, icon: Box, label: 'Box', color: 'hover:text-blue-500', instruction: 'Click to spawn a box' },
        { type: 'circle' as const, icon: Circle, label: 'Circle', color: 'hover:text-green-500', instruction: 'Click to spawn a circle' },
        { type: 'triangle' as const, icon: Triangle, label: 'Triangle', color: 'hover:text-purple-500', instruction: 'Click to spawn a triangle' },
        { type: 'polygon' as const, icon: Hexagon, label: 'Polygon', color: 'hover:text-orange-500', instruction: 'Click to spawn a polygon' },
        { type: 'wall' as const, icon: Minus, label: 'Wall', color: 'hover:text-slate-500', instruction: 'Click to spawn a wall' },
        { type: 'spring' as const, icon: Link, label: 'Spring', color: 'hover:text-amber-500', instruction: 'Drag between two objects to connect' },
        { type: 'rod' as const, icon: GripHorizontal, label: 'Rod', color: 'hover:text-indigo-500', instruction: 'Drag between two objects to connect with a fixed rod' },
        { type: 'pin' as const, icon: MapPin, label: 'Pin', color: 'hover:text-red-500', instruction: 'Click an object to pin it to background' },
        { type: 'thruster' as const, icon: Zap, label: 'Thruster', color: 'hover:text-yellow-500', instruction: 'Drag on an object to apply force' },
        { type: 'draw' as const, icon: Pencil, label: 'Draw', color: 'hover:text-slate-500', instruction: 'Draw path to create terrain' },
    ];

    return (
        <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto cursor-grab active:cursor-grabbing"
        >
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 p-3 rounded-3xl shadow-2xl flex items-center gap-2">
                {/* Drag Handle */}
                <div className="pl-1 pr-2 border-r border-slate-200 dark:border-slate-700 text-slate-300">
                    <GripHorizontal className="w-5 h-5" />
                </div>

                {/* Playback Controls */}
                <div className="flex items-center gap-1 pr-3 border-r border-slate-200 dark:border-slate-700">
                    <button
                        type="button"
                        onClick={() => onPausedChange(!paused)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-lg ${paused
                            ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                            : 'bg-amber-500 text-white shadow-amber-500/30'
                            }`}
                        title={paused ? "Play (Space)" : "Pause (Space)"}
                    >
                        {paused ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6 fill-current" />}
                    </button>
                    <button
                        type="button"
                        onClick={onReset}
                        className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all active:scale-95"
                        title="Reset Simulation (R)"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        onClick={onClearTrails}
                        className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-amber-600 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all active:scale-95 ml-1"
                        title="Clear Trails"
                    >
                        <Eraser className="w-5 h-5" />
                    </button>
                </div>

                {/* Size Slider */}
                <div className="flex flex-col items-center px-2 border-r border-slate-200 dark:border-slate-700">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">Size: {spawnSize}</span>
                    <input
                        type="range"
                        min="15"
                        max="80"
                        value={spawnSize}
                        onChange={(e) => setSpawnSize(parseInt(e.target.value))}
                        className="w-20 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        title="Object Size"
                    />
                </div>

                {/* Tools */}
                <div className="flex items-center gap-1 ml-1">
                    {tools.map((tool) => (
                        <button
                            key={tool.type}
                            type="button"
                            onClick={() => onSelectTool(tool.type, spawnSize)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 group relative ${activeTool === tool.type
                                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 shadow-inner ring-2 ring-indigo-500/20'
                                : `bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 ${tool.color}`
                                }`}
                            title={tool.label}
                        >
                            <tool.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                            <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-slate-700">
                                <span className="font-bold">{tool.label}</span>
                                <span className="opacity-75 block text-[9px] font-normal">{tool.instruction}</span>
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
