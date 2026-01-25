'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Briefcase, Settings, Bell, BellOff } from 'lucide-react';

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

    // Audio ref (using a simple beep or alert for now, or browser Notification)
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleComplete();
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft]);

    const handleComplete = () => {
        setIsActive(false);
        if (soundEnabled) {
            // Simple beep using AudioContext or Audio element if available
            // For simplicity, we trigger a system notification if permitted
            if (Notification.permission === 'granted') {
                new Notification("Timer Complete!", { body: `${MODES[mode].label} session finished.` });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission();
            }
            // Beep sound effect
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(() => { });
        }
    };

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
        <div className="w-full max-w-lg mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Timer Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 relative overflow-hidden">

                {/* Background Gradient pulse */}
                <div className={`absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none transition-colors duration-1000 ${MODES[mode].bg}`}></div>

                {/* Mode Selector */}
                <div className="flex justify-center gap-2 mb-12 relative z-10">
                    {(Object.keys(MODES) as Array<keyof typeof MODES>).map((m) => (
                        <button
                            key={m}
                            onClick={() => switchMode(m)}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${mode === m ? `bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg scale-105` : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                        >
                            {MODES[m].label}
                        </button>
                    ))}
                </div>

                {/* Clock Display */}
                <div className="relative w-64 h-64 mx-auto mb-12 flex items-center justify-center">
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

                    <div className="text-center z-10">
                        <div className={`text-6xl font-black tabular-nums tracking-tighter ${MODES[mode].color}`}>
                            {formatTime(timeLeft)}
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-2 text-slate-400 font-medium">
                            <ModeIcon className="w-4 h-4" />
                            <span className="uppercase text-xs tracking-widest">{isActive ? 'Running' : 'Paused'}</span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6 relative z-10">
                    <button
                        onClick={toggleTimer}
                        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl shadow-slate-200/50 dark:shadow-none transition-all hover:scale-110 active:scale-95 ${isActive ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-700' : `${MODES[mode].bg} text-white`}`}
                    >
                        {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                    </button>

                    <button
                        onClick={resetTimer}
                        className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center justify-center transition-all hover:rotate-180"
                    >
                        <RotateCcw className="w-6 h-6" />
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
