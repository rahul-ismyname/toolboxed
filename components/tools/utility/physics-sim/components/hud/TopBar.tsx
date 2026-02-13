'use client';

import React, { useState, Dispatch, SetStateAction } from 'react';
import {
    ChevronDown, Wind, Eye, EyeOff, Maximize2, Minimize2, List, BoxSelect, Folder,
    Save, FolderOpen, Share2, Globe, Monitor, Settings2, ZapOff, Snowflake,
    Eraser, Zap, Activity, Send
} from 'lucide-react';
import { ActiveWalls } from '../../hooks/useMatterEngine';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface TopBarProps {
    variant?: 'simulation' | 'creator';
    onSpawnPrefab: (prefabId: string) => void;
    onExportToSim?: () => void;
    customBlueprints?: any[];
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
    showGrid: boolean;
    onShowGridChange: Dispatch<SetStateAction<boolean>>;
    useAccelerometer: boolean;
    onUseAccelerometerChange: (enabled: boolean) => void;
    useHaptics: boolean;
    onUseHapticsChange: (enabled: boolean) => void;
    lowPowerMode: boolean;
    onLowPowerModeChange: (enabled: boolean) => void;
    isMobile: boolean;
    onToggleWorkshop: () => void;
}

export function TopBar({
    variant = 'simulation',
    onSpawnPrefab,
    onExportToSim,
    customBlueprints = [],
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
    onFreezeAll,
    showGrid,
    onShowGridChange,
    useAccelerometer,
    onUseAccelerometerChange,
    useHaptics,
    onUseHapticsChange,
    lowPowerMode,
    onLowPowerModeChange,
    isMobile,
    onToggleWorkshop
}: TopBarProps) {
    const [activeMenu, setActiveMenu] = useState<'scene' | 'world' | 'view' | null>(null);

    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMenu = (menu: 'scene' | 'world' | 'view') => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    return (
        <div ref={menuRef} className="absolute top-0 left-0 right-0 p-4 flex justify-end items-start pointer-events-none z-[100]">
            {/* Right Hand Menus */}
            <div className="pointer-events-auto flex items-center gap-2">

                {/* Unified Mobile Menu */}
                {
                    isMobile ? (
                        <div className="relative">
                            <button
                                onClick={() => toggleMenu('view')} // Re-using 'view' state for mobile main menu
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg ${activeMenu === 'view'
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-500'
                                    }`}
                            >
                                <List className="w-6 h-6" />
                            </button>

                            <AnimatePresence>
                                {activeMenu === 'view' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        className="fixed inset-0 z-[200] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl flex flex-col pointer-events-auto overflow-y-auto"
                                    >
                                        <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                                            <span className="font-bold text-lg">Menu</span>
                                            <button onClick={() => setActiveMenu(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                <Minimize2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="p-4 flex flex-col gap-6">
                                            {/* Section 1: Scene */}
                                            <div className="space-y-2">
                                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scene</h3>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button onClick={() => { onToggleWorkshop(); setActiveMenu(null); }} className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl flex flex-col items-center gap-2">
                                                        <Zap className="w-6 h-6" />
                                                        <span className="text-xs font-medium">Workshop</span>
                                                    </button>
                                                    <button onClick={() => { onSaveScene(); setActiveMenu(null); }} className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex flex-col items-center gap-2">
                                                        <Save className="w-6 h-6" />
                                                        <span className="text-xs font-medium">Save</span>
                                                    </button>
                                                    <button onClick={() => { onLoadScene(); setActiveMenu(null); }} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-600 rounded-xl flex flex-col items-center gap-2">
                                                        <FolderOpen className="w-6 h-6" />
                                                        <span className="text-xs font-medium">Load</span>
                                                    </button>
                                                    <button onClick={() => { onShare(); setActiveMenu(null); }} className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex flex-col items-center gap-2">
                                                        <Share2 className="w-6 h-6" />
                                                        <span className="text-xs font-medium">Share</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Section 2: World */}
                                            <div className="space-y-2">
                                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">World</h3>
                                                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">Gravity</span>
                                                        <input
                                                            type="range" min="0" max="5" step="0.1"
                                                            value={Math.hypot(gravity.x, gravity.y)}
                                                            onChange={(e) => {
                                                                const newMag = parseFloat(e.target.value);
                                                                const angle = Math.atan2(gravity.y, gravity.x);
                                                                onGravityChange({ x: newMag * Math.cos(angle), y: newMag * Math.sin(angle) });
                                                            }}
                                                            className="w-32 h-2 bg-slate-200 rounded-lg accent-indigo-500"
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">Time Speed</span>
                                                        <input
                                                            type="range" min="0.1" max="2" step="0.1"
                                                            value={timeScale}
                                                            onChange={(e) => onTimeScaleChange(parseFloat(e.target.value))}
                                                            className="w-32 h-2 bg-slate-200 rounded-lg accent-amber-500"
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={onFreezeAll} className="flex-1 p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-xs font-bold flex items-center justify-center gap-2">
                                                            <Snowflake className="w-4 h-4 text-sky-500" /> Freeze
                                                        </button>
                                                        <button onClick={onClearConstraints} className="flex-1 p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-xs font-bold flex items-center justify-center gap-2">
                                                            <Eraser className="w-4 h-4 text-red-500" /> Clear Links
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Section 3: Toggles */}
                                            <div className="space-y-2">
                                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Toggles</h3>
                                                <div className="space-y-2">
                                                    <button onClick={() => onShowVectorsChange(!showVectors)} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                                                        <span className="flex items-center gap-3"><Eye className="w-5 h-5 text-indigo-500" /> Show Vectors</span>
                                                        <div className={`w-10 h-6 rounded-full relative transition-colors ${showVectors ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${showVectors ? 'left-5' : 'left-1'}`} />
                                                        </div>
                                                    </button>
                                                    <button onClick={() => onShowGridChange(!showGrid)} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                                                        <span className="flex items-center gap-3"><BoxSelect className="w-5 h-5 text-slate-500" /> Show Grid</span>
                                                        <div className={`w-10 h-6 rounded-full relative transition-colors ${showGrid ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${showGrid ? 'left-5' : 'left-1'}`} />
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        /* Desktop Menus (Existing Code) */
                        <>
                            {/* 1. SCENE MENU (Save, Load, Share) */}
                            <div className="relative">
                                {/* ... existing scene menu content ... */}
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
                                            className="absolute top-full right-0 mt-2 w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden py-1 z-[60]"
                                        >
                                            <button
                                                onClick={() => { onToggleWorkshop(); setActiveMenu(null); }}
                                                className="w-full px-4 py-2.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 group"
                                                title="Open Workshop (W)"
                                            >
                                                <Zap className="w-4 h-4 text-slate-400 group-hover:text-amber-500" />
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">The Workshop</span>
                                            </button>
                                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
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

                            {/* 2. WORLD MENU */}
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
                                            className="absolute top-full right-0 mt-2 p-4 gap-4 min-w-[240px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col z-[60]"
                                        >
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center border-b border-white/10 pb-2">World Environment</div>
                                            {/* Gravity Control */}
                                            <div>
                                                <div className="flex justify-between text-[10px] text-slate-500 mb-2">
                                                    <span>Gravity (Direction & Strength)</span>
                                                </div>

                                                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 flex flex-col items-center gap-3">
                                                    {/* Compass */}
                                                    <div className="relative w-24 h-24 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-inner flex items-center justify-center">
                                                        <div className="absolute top-1 text-[8px] font-bold text-slate-400">N</div>
                                                        <div className="absolute bottom-1 text-[8px] font-bold text-slate-400">S</div>
                                                        <div className="absolute left-1 text-[8px] font-bold text-slate-400">W</div>
                                                        <div className="absolute right-1 text-[8px] font-bold text-slate-400">E</div>

                                                        {/* Indicator Arrow */}
                                                        <div
                                                            className="absolute w-1 h-10 bg-gradient-to-t from-indigo-500 to-transparent origin-bottom left-1/2 -translate-x-1/2 top-2 rounded-full pointer-events-none"
                                                            style={{
                                                                transform: `translateX(-50%) rotate(${Math.atan2(gravity.y, gravity.x) * (180 / Math.PI) + 90}deg) translateY(-50%)`,
                                                                transformOrigin: 'bottom center'
                                                            }}
                                                        />
                                                        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-sm z-10" />
                                                        <div
                                                            className="absolute inset-0 rounded-full cursor-crosshair z-20 active:cursor-grabbing"
                                                            onMouseDown={(e) => {
                                                                const updateGravityFromMouse = (evt: MouseEvent) => {
                                                                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                                                    const centerX = rect.left + rect.width / 2;
                                                                    const centerY = rect.top + rect.height / 2;
                                                                    const dx = evt.clientX - centerX;
                                                                    const dy = evt.clientY - centerY;
                                                                    const angle = Math.atan2(dy, dx);
                                                                    const magnitude = Math.hypot(gravity.x, gravity.y) || 1;
                                                                    onGravityChange({ x: magnitude * Math.cos(angle), y: magnitude * Math.sin(angle) });
                                                                };
                                                                const handleMouseMove = (evt: MouseEvent) => updateGravityFromMouse(evt);
                                                                const handleMouseUp = () => {
                                                                    document.removeEventListener('mousemove', handleMouseMove);
                                                                    document.removeEventListener('mouseup', handleMouseUp);
                                                                };
                                                                updateGravityFromMouse(e.nativeEvent);
                                                                document.addEventListener('mousemove', handleMouseMove);
                                                                document.addEventListener('mouseup', handleMouseUp);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <div className="flex justify-between text-[9px] text-slate-400 mb-1">
                                                            <span>Strength</span>
                                                            <span className="font-mono">{Math.hypot(gravity.x, gravity.y).toFixed(2)}G</span>
                                                        </div>
                                                        <input
                                                            type="range" min="0" max="5" step="0.1"
                                                            value={Math.hypot(gravity.x, gravity.y)}
                                                            onChange={(e) => {
                                                                const newMag = parseFloat(e.target.value);
                                                                const angle = Math.atan2(gravity.y, gravity.x);
                                                                onGravityChange({ x: newMag * Math.cos(angle), y: newMag * Math.sin(angle) });
                                                            }}
                                                            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Time Scale */}
                                            <div>
                                                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                                    <span>Time Scale</span>
                                                    <span className="font-mono">{timeScale.toFixed(2)}x</span>
                                                </div>
                                                <input
                                                    type="range" min="0.1" max="2" step="0.1"
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
                                                <button onClick={onFreezeAll} className="p-2 rounded-xl flex flex-col items-center justify-center gap-1 bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-900/20 text-slate-600 hover:text-sky-500 transition-all border border-transparent hover:border-sky-100">
                                                    <Snowflake className="w-4 h-4" />
                                                    <span className="text-[10px] font-bold">Freeze</span>
                                                </button>
                                                <button onClick={onClearConstraints} className="p-2 rounded-xl flex flex-col items-center justify-center gap-1 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 hover:text-red-500 transition-all border border-transparent hover:border-red-100">
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
                                                <input type="color" value={bgColor} onChange={(e) => onBgColorChange(e.target.value)} className="w-6 h-6 rounded-lg cursor-pointer border-0 p-0" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* 3. VIEW MENU */}
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
                                            className="absolute top-full right-0 mt-2 w-56 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden py-1 z-[60] flex flex-col gap-1 p-2"
                                        >
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center border-b border-white/10 pb-1 mb-1">Display</div>
                                            <button onClick={() => onShowVectorsChange(!showVectors)} className={`w-full px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between group ${showVectors ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600'}`}>
                                                <span className="flex items-center gap-2">{showVectors ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-slate-400" />} Velocity Vectors</span>
                                            </button>
                                            <button onClick={onToggleObjectList} className={`w-full px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between group ${showObjectList ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600'}`}>
                                                <span className="flex items-center gap-2">Object List (L)</span>
                                            </button>
                                            <button onClick={() => onShowGridChange(!showGrid)} className={`w-full px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between group ${showGrid ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600'}`}>
                                                <span className="flex items-center gap-2"><BoxSelect className="w-4 h-4" /> Show Grid</span>
                                            </button>
                                            <button onClick={onToggleFullScreen} className="w-full px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600">
                                                <span className="flex items-center gap-2">{isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />} {isFullscreen ? 'Exit FullScreen (F)' : 'Enter FullScreen (F)'}</span>
                                            </button>
                                            <button onClick={() => onLowPowerModeChange(!lowPowerMode)} className={`w-full px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between group ${lowPowerMode ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600'}`}>
                                                <span className="flex items-center gap-2"><ZapOff className="w-4 h-4" /> Low Power Rendering</span>
                                                <div className={`w-8 h-4 rounded-full relative transition-colors ${lowPowerMode ? 'bg-orange-500' : 'bg-slate-300'}`}><div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${lowPowerMode ? 'left-4.5' : 'left-0.5'}`} /></div>
                                            </button>
                                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                                            <button onClick={onToggleHUD} className="w-full px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 hover:text-red-500">
                                                <span className="flex items-center gap-2">Hide UI (H)</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    )
                }

            </div>
        </div>
    );
}
