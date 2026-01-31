'use client';

import React, { useState, Dispatch, SetStateAction } from 'react';
import { ChevronDown, Wind, Eye, EyeOff, Maximize2, Minimize2, List, BoxSelect, Folder, Save, FolderOpen, Share2, Globe, Monitor, Settings2, ZapOff, Snowflake, Eraser } from 'lucide-react';
import { PHYSICS_TEMPLATES } from '@/lib/sim-templates';
import { ActiveWalls } from '../../hooks/useMatterEngine';
import { motion, AnimatePresence } from 'framer-motion';

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
    onShare: () => void;
    activeWalls: ActiveWalls;
    onActiveWallsChange: (walls: ActiveWalls) => void;
    vacuumMode: boolean;
    onVacuumModeChange: (enabled: boolean) => void;
    onClearConstraints: () => void;
    onFreezeAll: () => void;
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
    onLoadScene,
    onShare,
    activeWalls,
    onActiveWallsChange,
    vacuumMode,
    onVacuumModeChange,
    onClearConstraints,
    onFreezeAll
}: TopBarProps) {
    const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState<'scene' | 'world' | 'view' | null>(null);

    const activeTemplate = PHYSICS_TEMPLATES.find(t => t.id === activeTemplateId);
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenu(null);
                setIsTemplateMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMenu = (menu: 'scene' | 'world' | 'view') => {
        setActiveMenu(activeMenu === menu ? null : menu);
        setIsTemplateMenuOpen(false); // Close other menu
    };

    return (
        <div ref={menuRef} className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none z-40">
            {/* Template Selector (Top Left) */}
            <div className="pointer-events-auto relative">
                <button
                    onClick={() => {
                        setIsTemplateMenuOpen(!isTemplateMenuOpen);
                        setActiveMenu(null); // Close other menus
                    }}
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

            {/* Right Hand Menus */}
            <div className="pointer-events-auto flex items-center gap-2">

                {/* 1. SCENE MENU (Save, Load, Share) */}
                <div className="relative">
                    <button
                        onClick={() => toggleMenu('scene')}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg ${activeMenu === 'scene'
                            ? 'bg-indigo-500 text-white'
                            : 'bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-500'
                            }`}
                        title="Scene (Save/Load/Share)"
                    >
                        <Folder className="w-5 h-5" />
                    </button>

                    <AnimatePresence>
                        {activeMenu === 'scene' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                className="absolute top-full right-0 mt-2 w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden py-1 z-50"
                            >
                                <button
                                    onClick={() => { onSaveScene(); setActiveMenu(null); }}
                                    className="w-full px-4 py-2.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 group"
                                >
                                    <Save className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Save to Browser</span>
                                </button>
                                <button
                                    onClick={() => { onLoadScene(); setActiveMenu(null); }}
                                    className="w-full px-4 py-2.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 group"
                                >
                                    <FolderOpen className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Load from Browser</span>
                                </button>
                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                                <button
                                    onClick={() => { onShare(); setActiveMenu(null); }}
                                    className="w-full px-4 py-2.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 group"
                                >
                                    <Share2 className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Share Scene</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 2. WORLD MENU (Environment: Gravity, Wind, Time, Walls, BG) */}
                <div className="relative">
                    <button
                        onClick={() => toggleMenu('world')}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg ${activeMenu === 'world'
                            ? 'bg-indigo-500 text-white'
                            : 'bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-500'
                            }`}
                        title="World Settings"
                    >
                        <Globe className="w-5 h-5" />
                    </button>

                    <AnimatePresence>
                        {activeMenu === 'world' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                className="absolute top-full right-0 mt-2 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col gap-4 min-w-[240px] z-50"
                            >
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center border-b border-white/10 pb-2">World Environment</div>

                                {/* Gravity Y */}
                                <div>
                                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                        <span>Gravity (Y)</span>
                                        <span className="font-mono">{gravity.y.toFixed(2)}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="-2"
                                        max="2"
                                        step="0.1"
                                        value={gravity.y}
                                        onChange={(e) => onGravityChange({ ...gravity, y: parseFloat(e.target.value) })}
                                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                </div>

                                {/* Gravity X (Wind) */}
                                <div>
                                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                        <div className="flex items-center gap-1">
                                            <Wind className="w-3 h-3" />
                                            <span>Wind (X)</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="range"
                                            min="-2"
                                            max="2"
                                            step="0.1"
                                            value={gravity.x}
                                            onChange={(e) => onGravityChange({ ...gravity, x: parseFloat(e.target.value) })}
                                            className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                        />
                                        <input
                                            type="number"
                                            min="-5"
                                            max="5"
                                            step="0.1"
                                            value={gravity.x}
                                            onChange={(e) => onGravityChange({ ...gravity, x: parseFloat(e.target.value) || 0 })}
                                            className="w-12 text-[10px] p-1 bg-slate-100 dark:bg-slate-800 rounded-md border-0 focus:ring-2 focus:ring-sky-500 text-center font-mono"
                                        />
                                    </div>
                                </div>

                                {/* Time Scale */}
                                <div>
                                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                        <span>Time Scale</span>
                                        <span className="font-mono">{timeScale.toFixed(2)}x</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="2"
                                        step="0.1"
                                        value={timeScale}
                                        onChange={(e) => onTimeScaleChange(parseFloat(e.target.value))}
                                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                </div>

                                {/* Vacuum Mode */}
                                <button
                                    onClick={() => onVacuumModeChange(!vacuumMode)}
                                    className={`w-full p-2 rounded-xl flex items-center justify-between transition-all ${vacuumMode
                                        ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 border border-sky-200 dark:border-sky-800'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <ZapOff className="w-4 h-4" />
                                        <span className="text-xs font-bold">Ideal Vacuum</span>
                                    </div>
                                    <div className={`w-8 h-4 rounded-full relative transition-colors ${vacuumMode ? 'bg-sky-500' : 'bg-slate-300'}`}>
                                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${vacuumMode ? 'left-4.5' : 'left-0.5'}`} />
                                    </div>
                                </button>

                                <div className="grid grid-cols-2 gap-2 mt-1">
                                    <button
                                        onClick={onFreezeAll}
                                        className="p-2 rounded-xl flex flex-col items-center justify-center gap-1 bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-900/20 text-slate-600 hover:text-sky-500 transition-all border border-transparent hover:border-sky-100"
                                    >
                                        <Snowflake className="w-4 h-4" />
                                        <span className="text-[10px] font-bold">Freeze</span>
                                    </button>
                                    <button
                                        onClick={onClearConstraints}
                                        className="p-2 rounded-xl flex flex-col items-center justify-center gap-1 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                                    >
                                        <Eraser className="w-4 h-4" />
                                        <span className="text-[10px] font-bold">Unlink All</span>
                                    </button>
                                </div>

                                {/* Walls */}
                                <div>
                                    <div className="text-[10px] text-slate-500 mb-2 text-center">Boundaries</div>
                                    <div className="grid grid-cols-3 gap-1 w-20 h-20 mx-auto">
                                        <div className="col-start-1 col-end-4 flex justify-center">
                                            <button onClick={() => onActiveWallsChange({ ...activeWalls, top: !activeWalls.top })} className={`w-full h-4 rounded-sm transition-colors ${activeWalls.top ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`} title="Top Wall" />
                                        </div>
                                        <div className="col-start-1 col-end-2 flex items-center"><button onClick={() => onActiveWallsChange({ ...activeWalls, left: !activeWalls.left })} className={`w-4 h-full rounded-sm transition-colors ${activeWalls.left ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`} title="Left Wall" /></div>
                                        <div className="col-start-2 col-end-3 flex items-center justify-center"><div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" /></div>
                                        <div className="col-start-3 col-end-4 flex items-center justify-end"><button onClick={() => onActiveWallsChange({ ...activeWalls, right: !activeWalls.right })} className={`w-4 h-full rounded-sm transition-colors ${activeWalls.right ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`} title="Right Wall" /></div>
                                        <div className="col-start-1 col-end-4 flex justify-center">
                                            <button onClick={() => onActiveWallsChange({ ...activeWalls, bottom: !activeWalls.bottom })} className={`w-full h-4 rounded-sm transition-colors ${activeWalls.bottom ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`} title="Bottom Wall" />
                                        </div>
                                    </div>
                                </div>

                                {/* BG Color */}
                                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                                    <span className="text-xs text-slate-500">Background</span>
                                    <input
                                        type="color"
                                        value={bgColor}
                                        onChange={(e) => onBgColorChange(e.target.value)}
                                        className="w-6 h-6 rounded-lg cursor-pointer border-0 p-0"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 3. VIEW MENU (Settings/Monitor) */}
                <div className="relative">
                    <button
                        onClick={() => toggleMenu('view')}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg ${activeMenu === 'view'
                            ? 'bg-indigo-500 text-white'
                            : 'bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-500'
                            }`}
                        title="View Settings"
                    >
                        <Monitor className="w-5 h-5" />
                    </button>

                    <AnimatePresence>
                        {activeMenu === 'view' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                className="absolute top-full right-0 mt-2 w-56 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden py-1 z-50 flex flex-col gap-1 p-2"
                            >
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center border-b border-white/10 pb-1 mb-1">Display</div>

                                <button
                                    onClick={() => onShowVectorsChange(!showVectors)}
                                    className={`w-full px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between group ${showVectors ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600'}`}
                                >
                                    <span className="flex items-center gap-2">
                                        {showVectors ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                                        Velocity Vectors
                                    </span>
                                </button>

                                <button
                                    onClick={onToggleObjectList}
                                    className={`w-full px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between group ${showObjectList ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600'}`}
                                >
                                    <span className="flex items-center gap-2">
                                        Object List (L)
                                    </span>
                                </button>

                                <button
                                    onClick={onToggleFullScreen}
                                    className="w-full px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600"
                                >
                                    <span className="flex items-center gap-2">
                                        {isFullscreen ? 'Exit FullScreen (F)' : 'Enter FullScreen (F)'}
                                    </span>
                                </button>

                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                                <button
                                    onClick={onToggleHUD}
                                    className="w-full px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 hover:text-red-500"
                                >
                                    <span className="flex items-center gap-2">
                                        Hide UI (H)
                                    </span>
                                </button>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}
