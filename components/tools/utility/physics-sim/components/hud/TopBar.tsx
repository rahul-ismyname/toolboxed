'use client';

import React, { useState } from 'react';
import { ChevronDown, Settings2, Wind, Eye, EyeOff } from 'lucide-react';
import { PHYSICS_TEMPLATES } from '@/lib/sim-templates';

interface TopBarProps {
    activeTemplateId: string;
    onLoadTemplate: (template: any) => void;
    gravity: number;
    onGravityChange: (g: number) => void;
    showVectors: boolean;
    onShowVectorsChange: (show: boolean) => void;
    bgColor: string;
    onBgColorChange: (color: string) => void;
}

export function TopBar({
    activeTemplateId,
    onLoadTemplate,
    gravity,
    onGravityChange,
    showVectors,
    onShowVectorsChange,
    bgColor,
    onBgColorChange
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

                {/* Gravity Slider (Simplified) */}
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl shadow-lg flex items-center gap-3">
                    <Wind className="w-4 h-4 text-slate-400" />
                    <div className="flex flex-col w-24">
                        <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            <span>Gravity</span>
                            <span>{gravity.toFixed(1)}G</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="3"
                            step="0.1"
                            value={gravity}
                            onChange={(e) => onGravityChange(parseFloat(e.target.value))}
                            className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
