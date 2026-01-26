'use client';

import { tools } from '@/config/tools';
import { ToolCard } from './ToolCard';
import { Star } from 'lucide-react';

// Curated list of high-value tools to feature
const FEATURED_SLUGS = [
    'landing-page-builder',
    'mind-map',
    'resume-builder',
    'kanban-board',
    'mermaid-visualizer',
    'image-converter',
    'sql-formatter',
];

export function FeaturedTools() {
    // Fallback to first 4 if specific slugs aren't found (safety check)
    const featured = tools.filter(t => FEATURED_SLUGS.includes(t.slug));
    const displayTools = featured.length > 0 ? featured : tools.slice(0, 4);

    return (
        <section className="py-12 border-b border-slate-100 dark:border-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 mb-8">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Popular Utilities
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayTools.map((tool) => {
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
            </div>
        </section>
    );
}
