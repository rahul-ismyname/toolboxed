import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Box, Circle, Triangle, Hexagon, Minus, Link, GripHorizontal, MapPin, Eraser, Zap, Pencil, Bomb, Package, Infinity, ChevronUp, PinOff, Link2Off, CircleDot, Combine } from 'lucide-react';
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
    pendingReset?: boolean;
    isMobile?: boolean;
}

function Tooltip({ children, content, shortcut, isMobile }: { children: React.ReactNode, content: string, shortcut?: string, isMobile?: boolean }) {
    const [isVisible, setIsVisible] = useState(false);

    // Disable tooltips on mobile because they obscure the UI when tapped
    if (isMobile) return <>{children}</>;

    return (
        <div className="relative" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900/90 backdrop-blur-md rounded-xl shadow-xl border border-white/10 flex items-center gap-3 whitespace-nowrap pointer-events-none z-[100]"
                    >
                        <span className="text-[10px] font-bold text-white tracking-wide">{content}</span>
                        {shortcut && (
                            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[9px] font-black text-white/80 border border-white/10 uppercase">
                                {shortcut}
                            </span>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
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
    onMultiSpawnModeChange,
    pendingReset,
    isMobile
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
                { type: 'connector' as const, icon: Link, label: 'Connector', color: 'hover:text-indigo-500', instruction: 'Drag to connect bodies' },
                { type: 'spring' as const, icon: Link, label: 'Spring', color: 'hover:text-amber-500', instruction: 'Drag between objects' },
                { type: 'rod' as const, icon: GripHorizontal, label: 'Rod', color: 'hover:text-indigo-500', instruction: 'Fixed connection' },
                { type: 'remove_constraint' as const, icon: Link2Off, label: 'Remove Link', color: 'hover:text-amber-600', instruction: 'Click to remove rod/spring' },
                { type: 'axle' as const, icon: CircleDot, label: 'Axle (A)', color: 'hover:text-indigo-400', instruction: 'Fixed pivot point' },
                { type: 'pin' as const, icon: MapPin, label: 'Pin', color: 'hover:text-red-500', instruction: 'Pin object to background' },
                { type: 'remove_pin' as const, icon: PinOff, label: 'Unpin (U)', color: 'hover:text-red-500', instruction: 'Click to unpin' },
                { type: 'fuse' as const, icon: Combine, label: 'Fuse (F)', color: 'hover:text-indigo-600', instruction: 'Click two objects to fuse' },
                { type: 'rope' as const, icon: Infinity, label: 'Rope', color: 'hover:text-orange-500', instruction: 'Drag to create rope' },
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
            className={`absolute ${isMobile ? 'bottom-2 w-[95%] max-w-md' : 'bottom-6'} left-1/2 -translate-x-1/2 z-10 pointer-events-auto cursor-grab active:cursor-grabbing`}
        >
            <div className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 p-2 rounded-3xl shadow-2xl flex items-center gap-2 ${isMobile ? 'overflow-x-auto no-scrollbar justify-between' : ''}`}>
                {/* Drag Handle */}
                <div className="pl-1 pr-2 text-slate-300">
                    <GripHorizontal className="w-5 h-5" />
                </div>

                {/* Main Controls (Play/Pause) */}
                <Tooltip isMobile={isMobile} content={paused ? "Resume Simulation" : "Pause Simulation"} shortcut="Space">
                    <button
                        type="button"
                        onClick={() => onPausedChange(!paused)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-md ${paused
                            ? 'bg-emerald-500 text-white'
                            : 'bg-amber-500 text-white'
                            }`}
                    >
                        {paused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
                    </button>
                </Tooltip>

                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1" />

                {/* Tool Groups */}
                <div className="flex items-center gap-2">
                    {Object.entries(toolGroups).map(([key, group]) => {
                        const activeToolInGroup = getActiveGroupTool(key);
                        const isActive = !!activeToolInGroup;
                        const DisplayIcon = activeToolInGroup ? activeToolInGroup.icon : group.icon;

                        return (
                            <div key={key} className="relative">
                                <Tooltip isMobile={isMobile} content={activeToolInGroup ? activeToolInGroup.label : group.label} shortcut={activeToolInGroup?.type.slice(0, 1)}>
                                    <button
                                        onClick={() => setActiveGroup(activeGroup === key ? null : key)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 relative ${isActive
                                            ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        <DisplayIcon className="w-5 h-5" />
                                        {/* Indicator if active but menu closed */}
                                        {isActive && !activeGroup && (
                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                            </div>
                                        )}
                                    </button>
                                </Tooltip>

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
                    <Tooltip isMobile={isMobile} content="Reset & Utilities">
                        <button
                            onClick={() => setActiveGroup(activeGroup === 'utils' ? null : 'utils')}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 ${activeGroup === 'utils'
                                ? 'bg-indigo-500 text-white shadow-indigo-500/20 shadow-lg'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                        >
                            <ChevronUp className={`w-5 h-5 transition-transform ${activeGroup === 'utils' ? 'rotate-180' : ''}`} />
                        </button>
                    </Tooltip>

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
                                    <Tooltip isMobile={isMobile} content={pendingReset ? "Click to Confirm" : "Clear Simulation"} shortcut="R">
                                        <button
                                            onClick={onReset}
                                            className={`w-full flex items-center justify-center gap-2 p-2 rounded-xl transition-all font-bold text-[10px] ${pendingReset
                                                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50'
                                                : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                                }`}
                                        >
                                            <RotateCcw className={`w-3.5 h-3.5 ${pendingReset ? 'animate-spin' : ''}`} />
                                            {pendingReset ? 'Confirm?' : 'Reset'}
                                        </button>
                                    </Tooltip>
                                    <Tooltip isMobile={isMobile} content="Cleanup Trails">
                                        <button
                                            onClick={onClearTrails}
                                            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-500/10 text-slate-500 hover:bg-slate-500/20 transition-all font-bold text-[10px]"
                                        >
                                            <Eraser className="w-3.5 h-3.5" />
                                            Clear
                                        </button>
                                    </Tooltip>
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
