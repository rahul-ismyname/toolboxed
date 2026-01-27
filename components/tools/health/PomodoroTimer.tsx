'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Briefcase, Bell, BellOff } from 'lucide-react';

const MODES = {
    work: { label: 'Focus', time: 25 * 60, color: 'text-rose-500', bg: 'bg-rose-500', icon: Briefcase },
    shortBreak: { label: 'Short Break', time: 5 * 60, color: 'text-emerald-500', bg: 'bg-emerald-500', icon: Coffee },
    longBreak: { label: 'Long Break', time: 15 * 60, color: 'text-blue-500', bg: 'bg-blue-500', icon: Coffee },
};

export function PomodoroTimer() {
    const [mode, setMode] = useState<keyof typeof MODES>('work');
    const [timeLeft, setTimeLeft] = useState(MODES.work.time);
    const [isActive, setIsActive] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);


    const handleComplete = useCallback(() => {
        setIsActive(false);
        if (soundEnabled) {
            // Simple beep using AudioContext or Audio element if available
            // For simplicity, we trigger a system notification if permitted
            if (typeof Notification !== 'undefined') {
                if (Notification.permission === 'granted') {
                    new Notification("Timer Complete!", { body: `${MODES[mode].label} session finished.` });
                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission();
                }
            }
            // Beep sound effect
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(() => { });
        }
    }, [mode, soundEnabled]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, handleComplete]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(MODES[mode].time);
    };

    const switchMode = (newMode: keyof typeof MODES) => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(MODES[newMode].time);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Calculate progress for circle
    const totalTime = MODES[mode].time;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    const dashOffset = 283 - (283 * progress) / 100; // 2 * PI * 45 (r) approx 283

    const ModeIcon = MODES[mode].icon;

    return (
        <div className="w-full max-w-lg mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500">

            {/* Timer Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-12 relative overflow-hidden">

                {/* Background Gradient pulse */}
                <div className={`absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none transition-colors duration-1000 ${MODES[mode].bg}`}></div>

                {/* Mode Selector */}
                <div className="flex flex-wrap justify-center gap-2 mb-8 md:mb-12 relative z-10">
                    {(Object.keys(MODES) as Array<keyof typeof MODES>).map((m) => (
                        <button
                            key={m}
                            onClick={() => switchMode(m)}
                            className={`px-3 md:px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all ${mode === m ? `bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg scale-105` : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                        >
                            {MODES[m].label}
                        </button>
                    ))}
                </div>

                {/* Clock Display */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 md:mb-12 flex items-center justify-center">
                    {/* SVG Progress Circle */}
                    <div className="absolute inset-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-100 dark:text-slate-800" />
                            <circle
                                cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                                className={`${MODES[mode].color} transition-all duration-1000 ease-in-out`}
                                strokeDasharray="283"
                                strokeDashoffset={dashOffset}
                            />
                        </svg>
                    </div>

                    <div className="text-center z-10 px-4">
                        <div className={`text-4xl md:text-6xl font-black tabular-nums tracking-tighter ${MODES[mode].color}`}>
                            {formatTime(timeLeft)}
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-1 md:mt-2 text-slate-400 font-medium">
                            <ModeIcon className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="uppercase text-[10px] md:text-xs tracking-widest">{isActive ? 'Running' : 'Paused'}</span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 md:gap-6 relative z-10">
                    <button
                        onClick={toggleTimer}
                        className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-xl shadow-slate-200/50 dark:shadow-none transition-all hover:scale-110 active:scale-95 ${isActive ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-700' : `${MODES[mode].bg} text-white`}`}
                    >
                        {isActive ? <Pause className="w-6 h-6 md:w-8 md:h-8 fill-current" /> : <Play className="w-6 h-6 md:w-8 md:h-8 fill-current ml-1" />}
                    </button>

                    <button
                        onClick={resetTimer}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center justify-center transition-all hover:rotate-180"
                    >
                        <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>

                {/* Volume Toggle */}
                <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="absolute top-8 right-8 text-slate-300 hover:text-slate-500 transition-colors"
                >
                    {soundEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                </button>

            </div>

            <p className="text-center text-slate-400 text-sm">
                Notifications will play when the timer ends.
            </p>
        </div>
    );
}
