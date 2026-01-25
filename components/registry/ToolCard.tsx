'use client';

import Link from 'next/link';
import { Tool } from '@/config/tools';
import { ArrowUpRight } from 'lucide-react';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export function ToolCard({ tool, icon }: { tool: Omit<Tool, 'icon'>, icon: ReactNode }) {
    return (
        <Link
            href={tool.path}
            className="block h-full"
        >
            <motion.div
                whileHover={{ y: -5 }}
                className="group flex flex-col h-full p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors duration-200 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-black/50"
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-100 dark:border-slate-700 group-hover:bg-slate-900 dark:group-hover:bg-emerald-500 group-hover:text-white dark:group-hover:text-white transition-colors duration-300">
                        {icon}
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-300 dark:text-slate-700 group-hover:text-slate-900 dark:group-hover:text-emerald-500 transition-colors" />
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {tool.name}
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {tool.description}
                </p>
            </motion.div>
        </Link>
    );
}
