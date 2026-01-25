'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Context requires mounting to access theme safely
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-16 h-8 bg-slate-200 rounded-full" />; // Placeholder
    }

    const isDark = theme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`
                relative w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
                ${isDark ? 'bg-slate-800' : 'bg-slate-200'}
            `}
            aria-label="Toggle theme"
            role="switch"
            aria-checked={isDark}
        >
            <span className="sr-only">Toggle Dark Mode</span>

            {/* Sliding Circle */}
            <span
                className={`
                    absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform duration-300
                    ${isDark ? 'translate-x-8' : 'translate-x-0'}
                `}
            >
                {isDark ? (
                    <Moon className="w-3.5 h-3.5 text-slate-900" />
                ) : (
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                )}
            </span>

            {/* Background Icons (purely visual) */}
            <Sun className={`absolute left-2 top-2 w-4 h-4 text-slate-400 transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0'}`} />
            <Moon className={`absolute right-2 top-2 w-4 h-4 text-slate-400 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-100'}`} />
        </button>
    );
}
