'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Search, Sparkles, Car, Activity, Zap,
    Construction, Microscope, Package, Box,
    ArrowRight, User, Tag
} from 'lucide-react';
import { PREFABS, Prefab } from '@/lib/prefabs';
import { Button } from '@/components/ui/button';

interface WorkshopPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSpawn: (id: string) => void;
}

const CATEGORY_ICONS = {
    'Vehicles': Car,
    'Machines': Construction,
    'Experiments': Microscope,
    'Basic': Package
};

export function WorkshopPanel({ isOpen, onClose, onSpawn }: WorkshopPanelProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = Array.from(new Set(PREFABS.map(p => p.category)));

    const filteredPrefabs = PREFABS.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = !selectedCategory || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[1001]"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-[1002] flex flex-col border-l border-white/10"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                    <Sparkles className="w-6 h-6 text-amber-500 fill-amber-500/20" />
                                    The Workshop
                                </h2>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Community Blueprints</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Search & Categories */}
                        <div className="p-4 space-y-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search machines, tools..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-transparent focus:border-indigo-500 rounded-xl text-sm transition-all outline-none"
                                />
                            </div>

                            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${!selectedCategory ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}
                                >
                                    All
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${selectedCategory === cat ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}
                                    >
                                        {React.createElement(CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS] || Package, { className: "w-3 h-3" })}
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {filteredPrefabs.length > 0 ? (
                                filteredPrefabs.map((prefab) => (
                                    <div
                                        key={prefab.id}
                                        className="group p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/5"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                                                <div className="text-2xl" style={{ color: prefab.color }}>
                                                    {/* Placeholder for icon/thumbnail. Using emoji/icon from data */}
                                                    <Box className="w-8 h-8 opacity-20 absolute" />
                                                    <span className="relative z-10">{prefab.icon.length > 2 ? '📦' : prefab.icon}</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-bold text-slate-900 dark:text-white">{prefab.name}</h3>
                                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter bg-indigo-500/10 px-1.5 py-0.5 rounded">
                                                        {prefab.category}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                                    {prefab.description}
                                                </p>

                                                <div className="flex items-center gap-3 mt-3">
                                                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                                        <User className="w-3 h-3" />
                                                        {prefab.author}
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {prefab.tags?.map(tag => (
                                                            <span key={tag} className="text-[9px] text-slate-500 bg-slate-200 dark:bg-slate-700/50 px-1.5 py-0.5 rounded">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => {
                                                onSpawn(prefab.id);
                                                onClose();
                                            }}
                                            size="sm"
                                            className="w-full mt-4 bg-white dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 transition-all gap-2 py-5"
                                        >
                                            <ArrowRight className="w-4 h-4 text-indigo-500" />
                                            Import to Scene
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
                                    <Construction className="w-12 h-12 opacity-20" />
                                    <p className="text-sm font-medium">No blueprints found.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 text-center">
                            <p className="text-[10px] text-slate-500 font-medium">
                                Professional Physics Assemblies • Safe & Private
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
