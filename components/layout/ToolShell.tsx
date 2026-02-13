'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Maximize, Minimize, Moon, Sun, Info } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getToolById, tools } from '@/lib/tools/registry'; // Adjust import path if needed

interface ToolShellProps {
    children: React.ReactNode;
    toolId?: string; // Optional, tries to infer from path if missing
    className?: string;
    fullWidth?: boolean;
    noPadding?: boolean;
}

export function ToolShell({ children, toolId, className = '', fullWidth = false, noPadding = false }: ToolShellProps) {
    const pathname = usePathname();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    // Attempt to identify tool
    const activeToolId = toolId || tools.find(t => t.path === pathname)?.id;
    const tool = activeToolId ? getToolById(activeToolId) : null;

    useEffect(() => {
        // Simple dark mode detection/init
        if (document.documentElement.classList.contains('dark')) {
            setIsDark(true);
        }
    }, []);

    const toggleTheme = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        if (newDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((e) => {
                console.error(`Error attempting to enable full-screen mode: ${e.message} (${e.name})`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300 ${isFullscreen ? 'p-0' : ''}`}>

            {/* Header - Hidden in fullscreen usually, or auto-hides? Let's keep it visible for now or collapsible */}
            <header className={`sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 h-16 flex items-center justify-between transition-all ${isFullscreen ? '-mt-16 hover:mt-0 opacity-0 hover:opacity-100' : ''}`}>
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>

                    {tool ? (
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                <tool.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="font-bold text-sm md:text-base leading-tight">{tool.name}</h1>
                                {/* <p className="text-[10px] text-slate-500 hidden md:block">{tool.description}</p> */}
                            </div>
                        </div>
                    ) : (
                        <h1 className="font-bold text-sm md:text-base">Toolbox</h1>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={toggleTheme} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500">
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <button onClick={toggleFullscreen} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500 hidden md:block">
                        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </button>
                </div>
            </header>

            <main className={`flex-1 flex flex-col ${noPadding ? '' : 'p-4 md:p-6'} ${fullWidth ? 'w-full' : 'max-w-7xl mx-auto w-full'} ${className}`}>
                {children}
            </main>

        </div>
    );
}
