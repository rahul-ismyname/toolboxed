'use client';

import { useState, useMemo } from 'react';
import { tools, ToolCategory } from '@/config/tools';
import { ToolCard } from './ToolCard';
import { Search, X, SlidersHorizontal, PackageOpen } from 'lucide-react';

export function ToolExplorer() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');

    // Get unique categories dynamically
    const categories: (ToolCategory | 'All')[] = useMemo(() => {
        const cats = new Set(tools.map(t => t.category));
        return ['All', ...Array.from(cats)];
    }, []);

    // Filter tools based on search and category
    const filteredTools = useMemo(() => {
        return tools.filter(tool => {
            const matchesSearch =
                tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tool.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory]);

    // Grouping for "All" view is optional, but flat list is better for search results
    // We'll stick to a flat grid for this explorer view to make it feel fast and responsive.

    return (
        <div className="space-y-12">

            {/* Search and Filters Header */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between sticky top-4 z-30 p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-300">

                {/* Search Bar */}
                <div className="relative w-full md:max-w-md group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-3 border-2 border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                        placeholder="Search tools..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Categories */}
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide mask-fade">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${activeCategory === category
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg shadow-emerald-500/10 scale-105'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:text-emerald-500 hover:-translate-y-0.5'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Grid */}
            <div className="min-h-[400px]">
                {filteredTools.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {filteredTools.map((tool) => {
                            const { icon: _icon, ...safeTool } = tool;
                            return (
                                <ToolCard
                                    key={tool.slug}
                                    tool={safeTool}
                                    icon={<tool.icon className="w-6 h-6" />}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6">
                            <PackageOpen className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No tools found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            We couldn't find any tools matching "{searchQuery}" in the {activeCategory} category.
                        </p>
                        <button
                            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                            className="mt-6 text-emerald-500 font-bold hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
}
