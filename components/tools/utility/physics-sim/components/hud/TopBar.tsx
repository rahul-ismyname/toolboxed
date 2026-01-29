'use client';

import React, { useState, Dispatch, SetStateAction } from 'react';
import { ChevronDown, Settings2, Wind, Eye, EyeOff, Maximize2, Minimize2, List } from 'lucide-react';
import { PHYSICS_TEMPLATES } from '@/lib/sim-templates';

interface TopBarProps {
    activeTemplateId: string;
    onLoadTemplate: (templateId: string) => void;
    gravity: { x: number, y: number };
    onGravityChange: (g: { x: number, y: number }) => void;
    showVectors: boolean;
    onShowVectorsChange: Dispatch<SetStateAction<boolean>>;
    bgColor: string;
    onBgColorChange: (color: string) => void;
    onToggleHUD: () => void;
    onToggleFullScreen: () => void;
    isFullscreen: boolean;
    showObjectList: boolean;
    onToggleObjectList: () => void;
    timeScale: number;
    onTimeScaleChange: (scale: number) => void;
    onSaveScene: () => void;
    onLoadScene: () => void;
}

export function TopBar({
    activeTemplateId,
    onLoadTemplate,
    gravity,
    onGravityChange,
    showVectors,
    onShowVectorsChange,
    bgColor,
    onBgColorChange,
    onToggleHUD,
    onToggleFullScreen,
    isFullscreen,
    showObjectList,
    onToggleObjectList,
    timeScale,
    onTimeScaleChange,
    onSaveScene,
    onLoadScene
}: TopBarProps) {
    const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
    const activeTemplate = PHYSICS_TEMPLATES.find(t => t.id === activeTemplateId);

    return (
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none z-40">
            {/* Template Selector (Top Left) */}
            <div className="pointer-events-auto relative">
                <button
                    onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
                    className="flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl shadow-lg hover:bg-white dark:hover:bg-slate-900 transition-all active:scale-95"
                >
                    <div className="flex flex-col items-start text-left">
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Template</span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{activeTemplate?.name || 'Select'}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isTemplateMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isTemplateMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden py-2">
                        {PHYSICS_TEMPLATES.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => {
                                    onLoadTemplate(template.id);
                                    setIsTemplateMenuOpen(false);
                                }}
                                className={`w-full px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${activeTemplateId === template.id ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''
                                    }`}
                            >
                                <div className={`text-sm font-bold ${activeTemplateId === template.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-200'
                                    }`}>
                                    {template.name}
                                </div>
                                <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                                    {template.description}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Global Settings (Top Right) */}
            <div className="pointer-events-auto flex items-center gap-2">
                {/* Background Color Picker */}
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 p-2 rounded-2xl shadow-lg flex items-center">
                    <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => onBgColorChange(e.target.value)}
                        className="w-6 h-6 rounded-lg cursor-pointer border-0 p-0"
                        title="Background Color"
                    />
                </div>

                {/* Save/Load (Left of Vectors) */}
                <div className="flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 p-1 rounded-2xl shadow-lg mr-2">
                    <button
                        onClick={onSaveScene}
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-500 transition-all active:scale-95"
                        title="Save Scene (Local Storage)"
                    >
                        <span className="font-bold text-[10px] uppercase tracking-wider px-1">Save</span>
                    </button>
                    <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
                    <button
                        onClick={onLoadScene}
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-500 transition-all active:scale-95"
                        title="Load Scene"
                    >
                        <span className="font-bold text-[10px] uppercase tracking-wider px-1">Load</span>
                    </button>
                </div>

                {/* Vectors Toggle */}
                <button
                    onClick={() => onShowVectorsChange(!showVectors)}
                    className={`p-2.5 rounded-2xl border shadow-lg backdrop-blur-md transition-all active:scale-95 ${showVectors
                        ? 'bg-indigo-500/90 border-indigo-500/50 text-white'
                        : 'bg-white/90 dark:bg-slate-900/90 border-white/20 text-slate-500 hover:text-slate-700'
                        }`}
                    title="Toggle Velocity Vectors"
                >
                    {showVectors ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>

                {/* Gravity Y Controls */}
                <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 p-1 pr-3 rounded-2xl shadow-lg">
                    <div className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500">
                        <span className="text-[10px] font-bold">GY</span>
                    </div>
                    <input
                        type="range"
                        min="-2"
                        max="2"
                        step="0.1"
                        value={gravity.y}
                        onChange={(e) => onGravityChange({ ...gravity, y: parseFloat(e.target.value) })}
                        className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        title={`Gravity Y: ${gravity.y.toFixed(2)}`}
                    />
                </div>

                {/* Gravity X (Wind) Controls */}
                <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 p-1 pr-3 rounded-2xl shadow-lg mr-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500">
                        <Wind className="w-4 h-4" />
                    </div>
                    <input
                        type="range"
                        min="-2"
                        max="2"
                        step="0.1"
                        value={gravity.x}
                        onChange={(e) => onGravityChange({ ...gravity, x: parseFloat(e.target.value) })}
                        className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        title={`Wind (Gravity X): ${gravity.x.toFixed(2)}`}
                    />
                </div>

                {/* Hide HUD & FullScreen */}
                <div className="flex items-center gap-1 ml-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 p-1 rounded-2xl shadow-lg">
                    <button
                        onClick={onToggleObjectList}
                        className={`p-2 rounded-xl transition-all active:scale-95 ${showObjectList
                            ? 'bg-indigo-500 text-white shadow-indigo-500/30 shadow-lg'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                            }`}
                        title="Toggle Object List (L)"
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onToggleHUD}
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all active:scale-95"
                        title="Hide UI (H)"
                    >
                        <EyeOff className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onToggleFullScreen}
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all active:scale-95"
                        title="Toggle FullScreen (F)"
                    >
                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Time Controls (Bottom Right - Floated) */}
            <div className="absolute top-[72px] right-4 pointer-events-auto flex items-center gap-2">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl shadow-lg flex items-center gap-3">
                    <div className="flex flex-col w-24">
                        <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            <span>Time Scale</span>
                            <span>{timeScale.toFixed(2)}x</span>
                        </div>
                        <input
                            type="range"
                            min="0.1"
                            max="2"
                            step="0.1"
                            value={timeScale}
                            onChange={(e) => onTimeScaleChange(parseFloat(e.target.value))}
                            className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                    </div>
                </div>
            </div>
        </div >
    );
}
