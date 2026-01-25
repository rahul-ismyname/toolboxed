'use client';

import Link from 'next/link';
import { tools } from '@/config/tools';
import { Menu, X, Rocket, Grid } from 'lucide-react';
import { useState } from 'react';
import { InlineSearch } from '@/components/ui/InlineSearch';
import { ModeToggle } from '@/components/ui/ModeToggle';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-slate-900">
                            <div className="bg-slate-900 dark:bg-emerald-500 text-white p-1.5 rounded-md">
                                <Rocket className="w-4 h-4" />
                            </div>
                            <span className="tracking-tight text-slate-900 dark:text-white">Toolboxed</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors">
                            Overview
                        </Link>
                        <div className="relative group">
                            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors flex items-center gap-1.5">
                                Tools <Grid className="w-3.5 h-3.5 opacity-50" />
                            </button>
                            <div className="absolute top-full right-0 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 p-1">
                                <div className="grid gap-0.5">
                                    {tools.map(tool => (
                                        <Link
                                            key={tool.slug}
                                            href={tool.path}
                                            className="block px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            {tool.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <a
                            href="https://github.com/toolboxed"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors"
                        >
                            GitHub
                        </a>
                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-2"></div>

                        {/* Inline Search */}
                        <div className="w-64">
                            <InlineSearch />
                        </div>

                        <ModeToggle />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden gap-4">
                        <ModeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white dark:bg-slate-950">
                    <div className="px-4 pt-4 pb-6 space-y-4">
                        <div className="mb-4">
                            <InlineSearch />
                        </div>
                        <Link
                            href="/"
                            className="block px-3 py-2 text-base font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md"
                            onClick={() => setIsOpen(false)}
                        >
                            Overview
                        </Link>
                        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mt-4">
                            Available Tools
                        </div>
                        {tools.map(tool => (
                            <Link
                                key={tool.slug}
                                href={tool.path}
                                className="block px-3 py-2 text-base font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md"
                                onClick={() => setIsOpen(false)}
                            >
                                {tool.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
