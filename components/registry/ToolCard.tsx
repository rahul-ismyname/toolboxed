'use client';

import Link from 'next/link';
import { Tool } from '@/config/tools';
import { ArrowUpRight } from 'lucide-react';
import { ReactNode } from 'react';

export function ToolCard({ tool, icon }: { tool: Omit<Tool, 'icon'>, icon: ReactNode }) {
    return (
        <Link
            href={tool.path}
            className="group flex flex-col p-5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-slate-50 text-slate-700 rounded-lg border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                    {icon}
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-colors" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2">
                {tool.name}
            </h3>

            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                {tool.description}
            </p>
        </Link>
    );
}
