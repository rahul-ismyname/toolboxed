'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Download, RotateCcw, Save, Trash2, Moon, Sun, Briefcase, Coffee, Zap, User, Keyboard, LayoutTemplate, Printer } from 'lucide-react';
import { toPng } from 'html-to-image';

interface TimeBlock {
    id: number;
    hour: number;
    minute: number; // 0 or 30
    categoryId: string | null;
}

interface Category {
    id: string;
    name: string;
    color: string;
    icon: any;
    textColor: string;
}

const CATEGORIES: Category[] = [
    { id: 'deep', name: 'Deep Work', color: 'bg-indigo-600', textColor: 'text-indigo-100', icon: Zap },
    { id: 'meeting', name: 'Meeting', color: 'bg-rose-500', textColor: 'text-rose-100', icon: Briefcase },
    { id: 'admin', name: 'Admin / Shallow', color: 'bg-blue-500', textColor: 'text-blue-100', icon: Save },
    { id: 'break', name: 'Break / Rest', color: 'bg-emerald-500', textColor: 'text-emerald-100', icon: Coffee },
    { id: 'life', name: 'Life / Personal', color: 'bg-amber-500', textColor: 'text-amber-100', icon: User },
    { id: 'sleep', name: 'Sleep', color: 'bg-slate-800', textColor: 'text-slate-300', icon: Moon },
];

export function TimeBlockPlanner() {
    const [blocks, setBlocks] = useState<TimeBlock[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('deep');
    const [isDragging, setIsDragging] = useState(false);
    const exportRef = useRef<HTMLDivElement>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update current time every minute
    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key >= '1' && e.key <= '6') {
                const index = parseInt(e.key) - 1;
                if (CATEGORIES[index]) {
                    setSelectedCategory(CATEGORIES[index].id);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Initialize blocks (48 blocks for 24 hours, 30 min intervals)
    useEffect(() => {
        const saved = localStorage.getItem('time-block-planner-data');
        if (saved) {
            try {
                setBlocks(JSON.parse(saved));
                return;
            } catch (e) {
                console.error('Failed to load saved schedule', e);
            }
        }

        const initialBlocks: TimeBlock[] = [];
        for (let i = 0; i < 24; i++) {
            initialBlocks.push({ id: i * 2, hour: i, minute: 0, categoryId: null });
            initialBlocks.push({ id: i * 2 + 1, hour: i, minute: 30, categoryId: null });
        }
        setBlocks(initialBlocks);
    }, []);

    // Save to localStorage whenever blocks change
    useEffect(() => {
        if (blocks.length > 0) {
            localStorage.setItem('time-block-planner-data', JSON.stringify(blocks));
        }
    }, [blocks]);

    const handleMouseDown = (id: number) => {
        setIsDragging(true);
        updateBlock(id);
    };

    const handleMouseEnter = (id: number) => {
        if (isDragging) {
            updateBlock(id);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const updateBlock = (id: number) => {
        setBlocks(prev => prev.map(block =>
            block.id === id ? { ...block, categoryId: selectedCategory } : block
        ));
    };

    const applyTemplate = (type: 'work' | 'weekend') => {
        if (!confirm('Apply template? This will overwrite your current plan.')) return;

        const newBlocks = [...blocks].map(b => ({ ...b, categoryId: null as string | null }));

        if (type === 'work') {
            newBlocks.forEach(b => {
                if (b.hour >= 23 || b.hour < 7) b.categoryId = 'sleep';
                else if (b.hour >= 9 && b.hour < 12) b.categoryId = 'deep';
                else if (b.hour >= 12 && b.hour < 13) b.categoryId = 'break';
                else if (b.hour >= 13 && b.hour < 17) b.categoryId = 'meeting';
                else if (b.hour >= 17 && b.hour < 18) b.categoryId = 'admin';
                else b.categoryId = 'life';
            });
        } else {
            newBlocks.forEach(b => {
                if (b.hour >= 23 || b.hour < 9) b.categoryId = 'sleep';
                else if (b.hour >= 12 && b.hour < 14) b.categoryId = 'life';
                else b.categoryId = 'break';
            });
        }
        setBlocks(newBlocks);
    };

    const downloadImage = useCallback(async () => {
        if (exportRef.current === null) {
            return;
        }

        try {
            const dataUrl = await toPng(exportRef.current, { cacheBust: true });
            const link = document.createElement('a');
            link.download = 'my-day-plan.png';
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error(err);
        }
    }, [exportRef]);

    const handlePrint = () => {
        window.print();
    };

    const clearBoard = () => {
        if (confirm('Clear entire daily plan?')) {
            setBlocks(prev => prev.map(b => ({ ...b, categoryId: null })));
        }
    };

    // Calculate stats
    const stats = CATEGORIES.map(cat => {
        const count = blocks.filter(b => b.categoryId === cat.id).length;
        return {
            ...cat,
            hours: count * 0.5,
            percentage: Math.round((count / 48) * 100)
        };
    }).filter(s => s.hours > 0);

    const formatTime = (hour: number, minute: number) => {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const h = hour % 12 || 12;
        return `${h}:${minute === 0 ? '00' : '30'} ${ampm}`;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const blockId = element?.getAttribute('data-block-id');
        if (blockId) {
            updateBlock(Number(blockId));
        }
    };

    const renderGridSection = (subsetBlocks: TimeBlock[], showCurrentTime = false) => (
        <div
            className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden select-none relative print:shadow-none print:border print:rounded-none"
            style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
        >
            {/* Current Time Indicator */}
            {showCurrentTime && (() => {
                const now = currentTime;
                const totalMinutes = now.getHours() * 60 + now.getMinutes();
                const percentage = (totalMinutes / 1440) * 100;
                return (
                    <div
                        className="absolute left-0 right-0 z-10 pointer-events-none flex items-center group"
                        style={{ top: `${percentage}%` }}
                    >
                        <div className="w-full border-t-2 border-red-500/50 dashed" />
                        <span className="absolute right-4 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            Current Time
                        </span>
                    </div>
                );
            })()}

            <div className="grid grid-cols-[50px_1fr] md:grid-cols-[80px_1fr]">
                {/* Time Labels Column */}
                <div className="border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                    {subsetBlocks.filter((_, i) => i % 2 === 0).map(block => (
                        <div key={`label-${block.hour}`} className="h-16 lg:h-24 flex items-start justify-center pt-2 text-[10px] lg:text-xs font-bold text-slate-400 border-b border-transparent">
                            {formatTime(block.hour, 0)}
                        </div>
                    ))}
                </div>

                {/* Paintable Area */}
                <div onTouchMove={handleTouchMove}>
                    {subsetBlocks.map((block) => {
                        const category = CATEGORIES.find(c => c.id === block.categoryId);
                        return (
                            <div
                                key={block.id}
                                data-block-id={block.id}
                                onMouseDown={() => handleMouseDown(block.id)}
                                onMouseEnter={() => handleMouseEnter(block.id)}
                                onTouchStart={() => handleMouseDown(block.id)}
                                className={`h-8 lg:h-12 border-b border-slate-50 dark:border-slate-800/50 transition-colors duration-100 cursor-n-resize flex items-center px-2 lg:px-4 group
                                    ${category ? category.color : 'hover:bg-slate-50 dark:hover:bg-slate-800'}
                                `}
                            >
                                <div className={`text-[10px] lg:text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity ${category ? category.textColor : 'text-slate-400'}`}>
                                    {formatTime(block.hour, block.minute)}
                                    {category && ` - ${category.name}`}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onTouchEnd={handleMouseUp}>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Time Sculptor</h1>
                    <p className="text-sm lg:text-base text-slate-500 dark:text-slate-400">Paint your perfect day, block by block.</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 print:hidden">
                        <button onClick={() => applyTemplate('work')} className="px-3 py-2 text-[10px] lg:text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-500 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all" title="Work Day Template">
                            Work
                        </button>
                        <button onClick={() => applyTemplate('weekend')} className="px-3 py-2 text-[10px] lg:text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all" title="Weekend Template">
                            Wknd
                        </button>
                    </div>
                    <button onClick={downloadImage} className="p-2 lg:p-3 text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all print:hidden" title="Download PNG">
                        <Download className="w-5 h-5" />
                    </button>
                    <button onClick={handlePrint} className="p-2 lg:p-3 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all print:hidden" title="Print Plan">
                        <Printer className="w-5 h-5" />
                    </button>
                    <button onClick={clearBoard} className="p-2 lg:p-3 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all print:hidden" title="Clear Board">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8" ref={exportRef}>

                {/* Tools & Stats Sidebar */}
                <div className="lg:col-span-4 space-y-6 lg:space-y-8 order-2 lg:order-1">

                    {/* Palette */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-xl border border-slate-100 dark:border-slate-800 print:hidden overflow-hidden">
                        <h2 className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Palette</h2>
                        <div className="flex lg:grid lg:grid-cols-1 gap-2 lg:gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 no-scrollbar">
                            {CATEGORIES.map((cat, index) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl lg:rounded-2xl transition-all border shrink-0 ${selectedCategory === cat.id
                                        ? 'border-slate-900 dark:border-white ring-2 ring-slate-900 dark:ring-white ring-offset-2 dark:ring-offset-slate-900'
                                        : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full ${cat.color} flex items-center justify-center shadow-sm shrink-0`}>
                                        <cat.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${cat.textColor}`} />
                                    </div>
                                    <div className="flex-1 text-left flex justify-between items-center gap-4">
                                        <span className="block font-bold text-slate-900 dark:text-white whitespace-nowrap text-xs lg:text-base">{cat.name}</span>
                                        <kbd className="hidden sm:inline-flex h-5 px-2 items-center gap-1 font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-400 rounded border border-slate-200 dark:border-slate-700">
                                            {index + 1}
                                        </kbd>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    {stats.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 print:hidden">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Summary</h2>
                            <div className="space-y-4">
                                {stats.map(stat => (
                                    <div key={stat.id}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-slate-700 dark:text-slate-300">{stat.name}</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{stat.hours} hrs</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${stat.color} transition-all duration-500`}
                                                style={{ width: `${stat.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <span className="text-slate-500 text-sm">Total Planned</span>
                                    <span className="text-xl font-black text-slate-900 dark:text-white">
                                        {stats.reduce((acc, curr) => acc + curr.hours, 0)} <span className="text-sm font-medium text-slate-400">/ 24 hrs</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Grid Area */}
                <div className="lg:col-span-8 order-1 lg:order-2 print:col-span-12">
                    {/* Screen View (Single Column) */}
                    <div className="print:hidden">
                        {renderGridSection(blocks, true)}
                    </div>

                    {/* Print View (Compact Square Grid - 4 Rows x 6 Hours) */}
                    <div className="hidden print:block space-y-8">
                        {[
                            { title: 'Night (00:00 - 06:00)', range: [0, 12] },
                            { title: 'Morning (06:00 - 12:00)', range: [12, 24] },
                            { title: 'Afternoon (12:00 - 18:00)', range: [24, 36] },
                            { title: 'Evening (18:00 - 24:00)', range: [36, 48] },
                        ].map((section) => (
                            <div key={section.title} className="break-inside-avoid">
                                <h3 className="font-bold text-slate-900 border-b border-slate-200 mb-2 pb-1 text-sm uppercase tracking-wider">
                                    {section.title}
                                </h3>
                                <div className="grid grid-cols-12 border-l border-t border-slate-200">
                                    {blocks.slice(section.range[0], section.range[1]).map((block) => {
                                        const category = CATEGORIES.find(c => c.id === block.categoryId);
                                        return (
                                            <div
                                                key={block.id}
                                                className={`
                                                    h-16 border-r border-b border-slate-200 flex flex-col justify-between p-1
                                                    ${category ? category.color : 'bg-white'}
                                                `}
                                                style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
                                            >
                                                <span className="text-[10px] font-bold text-slate-400 leading-none">
                                                    {block.minute === 0 ? block.hour : ''}
                                                </span>
                                                {category && (
                                                    <span className={`text-[9px] font-bold leading-tight truncate ${category.textColor}`}>
                                                        {category.name}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        <div className="mt-8 pt-4 border-t border-slate-200">
                            <div className="grid grid-cols-3 gap-4">
                                {stats.map(stat => (
                                    <div key={stat.id} className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full ${stat.color} border border-slate-200`} style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }} />
                                        <span className="text-xs font-medium text-slate-600">
                                            {stat.name}: <b>{stat.hours}h</b>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
