'use client';

import Link from 'next/link';
import { Search, X, Rocket, Grid } from 'lucide-react';
import { useState } from 'react';
import { InlineSearch } from '@/components/ui/InlineSearch';
import { ModeToggle } from '@/components/ui/ModeToggle';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-slate-900 group">
                            <div className="relative w-9 h-9 flex items-center justify-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl group-hover:border-slate-900 dark:group-hover:border-white transition-colors duration-300">
                                <img
                                    src="/logo.svg"
                                    alt="Toolboxed Logo"
                                    className="w-7 h-7 transform group-hover:-translate-y-1 transition-transform duration-300"
                                />
                            </div>
                            <span className="tracking-tight text-slate-900 dark:text-white">Toolboxed</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/about" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                                About
                            </Link>
                            <Link href="/category/developer" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                                Tools
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Menu - Simplified */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Inline Search */}
                        <div className="w-64">
                            <InlineSearch />
                        </div>

                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-2"></div>

                        <ModeToggle />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden gap-4">
                        <ModeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                            aria-label={isOpen ? "Close search" : "Open search"}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Search className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white dark:bg-slate-950">
                    <div className="px-4 pt-4 pb-6">
                        <InlineSearch />
                    </div>
                </div>
            )}
        </nav>
    );
}
