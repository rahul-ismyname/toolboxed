'use client';

import React, { useState } from 'react';
import { ToolContent } from '@/components/tools/ToolContent';
import { TypeRacer } from '@/components/tools/developer/TypeRacer';

export default function TypeRacerPage() {
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [theme, setTheme] = useState('default');

    const themeStyles: Record<string, string> = {
        default: 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white',
        midnight: 'bg-[#020617] text-sky-100',
        sepia: 'bg-[#f4ecd8] text-[#433422]',
        nordic: 'bg-[#2e3440] text-[#eceff4]'
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isFocusMode ? themeStyles[theme] : ''}`}>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className={`${isFocusMode ? 'mb-0' : 'mb-12'}`}>
                    <TypeRacer onFocusChange={setIsFocusMode} onThemeChange={setTheme} />
                </div>

                {!isFocusMode && <ToolContent slug="type-racer" />}
            </div>
        </div>
    );
}
