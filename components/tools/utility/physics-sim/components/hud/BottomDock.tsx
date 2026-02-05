import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Box, Circle, Triangle, Hexagon, Minus, Link, GripHorizontal, MapPin, Eraser, Zap, Pencil, Bomb, Package, Infinity, ChevronUp, PinOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MATERIALS } from '../../hooks/useMatterEngine';

interface BottomDockProps {
    paused: boolean;
    onPausedChange: (paused: boolean) => void;
    onReset: () => void;
    activeTool: string | null;
    onSelectTool: (tool: string, size?: number) => void;
    onClearTrails: () => void;
    activeMaterial: string;
    onSelectMaterial: (material: string) => void;
    multiSpawnMode: boolean;
    onMultiSpawnModeChange: (enabled: boolean) => void;
}

export function BottomDock({
    paused,
    onPausedChange,
    onReset,
    activeTool,
    onSelectTool,
    onClearTrails,
    activeMaterial,
    onSelectMaterial,
    multiSpawnMode,
    onMultiSpawnModeChange
}: BottomDockProps) {
    const [spawnSize, setSpawnSize] = useState(30);
    const [showMaterials, setShowMaterials] = useState(false);
    const [activeGroup, setActiveGroup] = useState<string | null>(null);
    const dockRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dockRef.current && !dockRef.current.contains(event.target as Node)) {
                setActiveGroup(null);
                setShowMaterials(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toolGroups = {
        shapes: {
            label: 'Shapes',
            icon: Box, // Default icon
            tools: [
                { type: 'box' as const, icon: Box, label: 'Box (B)', color: 'hover:text-blue-500', instruction: 'Click to spawn a box' },
                { type: 'circle' as const, icon: Circle, label: 'Circle (C)', color: 'hover:text-green-500', instruction: 'Click to spawn a circle' },
                { type: 'triangle' as const, icon: Triangle, label: 'Triangle (T)', color: 'hover:text-purple-500', instruction: 'Click to spawn a triangle' },
                { type: 'polygon' as const, icon: Hexagon, label: 'Polygon (P)', color: 'hover:text-orange-500', instruction: 'Click to spawn a polygon' },
                { type: 'wall' as const, icon: Minus, label: 'Wall', color: 'hover:text-slate-500', instruction: 'Click to spawn a wall' },
            ]
        },
        constraints: {
            label: 'Links',
            icon: Link,
            tools: [
                { type: 'spring' as const, icon: Link, label: 'Spring', color: 'hover:text-amber-500', instruction: 'Drag between objects' },
                { type: 'rod' as const, icon: GripHorizontal, label: 'Rod', color: 'hover:text-indigo-500', instruction: 'Fixed connection' },
                { type: 'pin' as const, icon: MapPin, label: 'Pin', color: 'hover:text-red-500', instruction: 'Pin object to background' },
                { type: 'remove_pin' as const, icon: PinOff, label: 'Unpin', color: 'hover:text-red-500', instruction: 'Click to unpin' },
            ]
        },
        forces: {
            label: 'Actions',
            icon: Zap,
            tools: [
                { type: 'thruster' as const, icon: Zap, label: 'Thruster', color: 'hover:text-yellow-500', instruction: 'Apply force' },
                { type: 'explosion' as const, icon: Bomb, label: 'Explosion', color: 'hover:text-orange-600', instruction: 'Boom!' },
                { type: 'draw' as const, icon: Pencil, label: 'Draw', color: 'hover:text-slate-500', instruction: 'Draw terrain' },
            ]
        }
    };

    const getActiveGroupTool = (groupKey: string) => {
        // Find if the currently active tool belongs to this group
        const group = toolGroups[groupKey as keyof typeof toolGroups];
        return group.tools.find(t => t.type === activeTool);
    };

    return (
        <motion.div
            ref={dockRef}
            drag
            dragMomentum={false}
            dragElastic={0}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto cursor-grab active:cursor-grabbing"
        >
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 p-2 rounded-3xl shadow-2xl flex items-center gap-2">
                {/* Drag Handle */}
                <div className="pl-1 pr-2 text-slate-300">
                    <GripHorizontal className="w-5 h-5" />
                </div>

                {/* Main Controls (Play/Pause) */}
                <button
                    type="button"
                    onClick={() => onPausedChange(!paused)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-md ${paused
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-500 text-white'
                        }`}
                    title={paused ? "Play (Space)" : "Pause (Space)"}
                >
                    {paused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
                </button>

                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1" />

                {/* Tool Groups */}
                <div className="flex items-center gap-2">
                    {Object.entries(toolGroups).map(([key, group]) => {
                        const activeToolInGroup = getActiveGroupTool(key);
                        const isActive = !!activeToolInGroup;
                        const DisplayIcon = activeToolInGroup ? activeToolInGroup.icon : group.icon;

                        return (
                            <div key={key} className="relative">
                                <button
                                    onClick={() => setActiveGroup(activeGroup === key ? null : key)}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 relative ${isActive
                                        ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                    title={group.label}
                                >
                                    <DisplayIcon className="w-5 h-5" />
                                    {/* Indicator if active but menu closed */}
                                    {isActive && !activeGroup && (
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                        </div>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {activeGroup === key && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 p-2 rounded-2xl shadow-xl flex flex-col gap-1 min-w-[140px]"
                                        >
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-1 px-2">{group.label}</div>
                                            {group.tools.map((tool) => (
                                                <button
                                                    key={tool.type}
                                                    onClick={() => {
                                                        onSelectTool(tool.type, spawnSize);
                                                        setActiveGroup(null);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors text-left ${activeTool === tool.type
                                                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold'
                                                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                                                        }`}
                                                >
                                                    <tool.icon className={`w-4 h-4 ${activeTool === tool.type ? '' : 'text-slate-400'}`} />
                                                    <span>{tool.label}</span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1" />

                {/* Utils Popover trigger */}
                <div className="relative">
                    <button
                        onClick={() => setActiveGroup(activeGroup === 'utils' ? null : 'utils')}
                        className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all active:scale-95"
                        title="Utilities"
                    >
                        <ChevronUp className={`w-5 h-5 transition-transform ${activeGroup === 'utils' ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {activeGroup === 'utils' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute bottom-full right-0 mb-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 p-3 rounded-2xl shadow-xl flex flex-col gap-3 min-w-[200px]"
                            >
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Sim Controls</div>

                                {/* Reset & Clear */}
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={onReset}
                                        className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 transition-colors"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        <span className="text-[10px]">Reset</span>
                                    </button>
                                    <button
                                        onClick={onClearTrails}
                                        className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-amber-600 transition-colors"
                                    >
                                        <Eraser className="w-4 h-4" />
                                        <span className="text-[10px]">Clear</span>
                                    </button>
                                </div>

                                {/* Multi-Spawn Toggle */}
                                <button
                                    onClick={() => onMultiSpawnModeChange(!multiSpawnMode)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors ${multiSpawnMode
                                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold'
                                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600'
                                        }`}
                                >
                                    <Infinity className="w-4 h-4" />
                                    <span>Multi-Spawn</span>
                                </button>

                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                                {/* Size Slider */}
                                <div>
                                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                        <span>Spawn Size</span>
                                        <span>{spawnSize}px</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="15"
                                        max="80"
                                        value={spawnSize}
                                        onChange={(e) => setSpawnSize(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                </div>

                                {/* Material Selector */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowMaterials(!showMaterials)}
                                        className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Package className="w-4 h-4 text-slate-400" />
                                            {MATERIALS[activeMaterial]?.name || 'Default'}
                                        </span>
                                    </button>

                                    <AnimatePresence>
                                        {showMaterials && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className="absolute right-full bottom-0 mr-2 w-32 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden py-1 z-50"
                                            >
                                                {Object.entries(MATERIALS).map(([key, mat]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => {
                                                            onSelectMaterial(key);
                                                            setShowMaterials(false);
                                                        }}
                                                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 ${activeMaterial === key ? 'text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-900/20' : 'text-slate-600 dark:text-slate-400'}`}
                                                    >
                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: mat.color }} />
                                                        {mat.name}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </motion.div>
    );
}
