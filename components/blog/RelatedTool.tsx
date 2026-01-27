'use client';

import { tools } from '@/config/tools';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface RelatedToolProps {
    tool: string; // Slug of the tool
}

export function RelatedTool({ tool }: RelatedToolProps) {
    const foundTool = tools.find(t => t.slug === tool);

    if (!foundTool) return null;

    const Icon = foundTool.icon;

    return (
        <div className="my-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 group hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
            <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <Icon className="w-8 h-8" />
            </div>

            <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Recommended Tool</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {foundTool.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-0">
                    {foundTool.description}
                </p>
            </div>

            <Link
                href={foundTool.path}
                className="flex-shrink-0 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-1"
            >
                Try It Free <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}
