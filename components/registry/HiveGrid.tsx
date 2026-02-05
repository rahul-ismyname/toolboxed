'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { tools, Tool, ToolCategory } from '@/config/tools';
import Link from 'next/link';
import { useState } from 'react';
import { Search, Hexagon } from 'lucide-react';

// Map categories to colors
const CATEGORY_COLORS: Record<ToolCategory, string> = {
    'Design': 'bg-pink-500',
    'Developer': 'bg-blue-500',
    'Business': 'bg-purple-500',
    'Utility': 'bg-orange-500',
    'Health': 'bg-emerald-500',
};

export function HiveGrid() {
    const [filter, setFilter] = useState<ToolCategory | 'All'>('All');
    const [search, setSearch] = useState('');

    const filteredTools = tools.filter(t =>
        (filter === 'All' || t.category === filter) &&
        (t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="w-full">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-6 mb-16 items-center justify-between">
                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 overflow-x-auto w-full md:w-auto">
                    {['All', 'Design', 'Developer', 'Business', 'Utility', 'Health'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat as any)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filter === cat
                                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search hive..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-emerald-500/50 rounded-full pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                    />
                </div>
            </div>

            {/* HIVE GRID */}
            <div className="flex flex-wrap justify-center gap-4 py-8">
                <AnimatePresence mode='popLayout'>
                    {filteredTools.map((tool, index) => {
                        const colorClass = CATEGORY_COLORS[tool.category];

                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.3 }}
                                key={tool.slug}
                                className="relative w-40 h-44 -ml-4 first:ml-0 md:-ml-8 md:first:ml-0 group perspective"
                            >
                                <Link href={process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}${tool.path}` : tool.path} className="block w-full h-full relative">
                                    {/* Hexagon Shape */}
                                    <div
                                        className="absolute inset-0 bg-slate-100 dark:bg-slate-900 clip-hex transition-all duration-300 group-hover:scale-110 z-0 group-hover:z-10 shadow-xl"
                                        style={{
                                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                                        }}
                                    >
                                        {/* Inner Content */}
                                        <div className="absolute inset-[2px] bg-white dark:bg-[#0B0F1A] clip-hex flex flex-col items-center justify-center p-4 text-center group-hover:bg-slate-50 dark:group-hover:bg-slate-900 transition-colors"
                                            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                                        >
                                            <div className="mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                                                <tool.icon className={`w-10 h-10 ${colorClass.replace('bg-', 'text-')} drop-shadow-sm`} strokeWidth={1.5} />
                                            </div>
                                            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                                {tool.name}
                                            </div>
                                        </div>

                                        {/* Hover Border Glow */}
                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${colorClass}`} style={{ mixBlendMode: 'overlay' }} />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {filteredTools.length === 0 && (
                <div className="text-center py-20 text-slate-400 font-medium">
                    <Hexagon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    No modules found in this sector.
                </div>
            )}
        </div>
    );
}
