'use client';

import Link from 'next/link';
import { tools } from '@/config/tools';
import { Menu, X, Rocket, Grid } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-slate-900">
                            <div className="bg-slate-900 text-white p-1.5 rounded-md">
                                <Rocket className="w-4 h-4" />
                            </div>
                            <span className="tracking-tight">Toolboxed</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                            Overview
                        </Link>
                        <div className="relative group">
                            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5">
                                Tools <Grid className="w-3.5 h-3.5 opacity-50" />
                            </button>
                            <div className="absolute top-full right-0 w-64 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 p-1">
                                <div className="grid gap-0.5">
                                    {tools.map(tool => (
                                        <Link
                                            key={tool.slug}
                                            href={tool.path}
                                            className="block px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                                        >
                                            {tool.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <a
                            href="https://github.com"
                            target="_blank"
                            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            GitHub
                        </a>
                        <div className="w-px h-4 bg-slate-200 mx-2"></div>
                        <a
                            href="#"
                            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-all shadow-sm hover:shadow"
                        >
                            Get Started
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
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
                <div className="md:hidden border-t border-slate-100 bg-white">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        <Link
                            href="/"
                            className="block px-3 py-2 text-base font-medium text-slate-900 hover:bg-slate-50 rounded-md"
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
                                className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md"
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
