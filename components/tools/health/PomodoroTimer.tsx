'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, RotateCcw, Coffee, Briefcase, Bell, BellOff, Hourglass, Sparkles } from 'lucide-react';

const MODES = {
    work: {
        label: 'Deep Focus',
        time: 25 * 60,
        color: 'text-rose-500',
        bg: 'bg-rose-500',
        glow: 'shadow-[0_0_50px_rgba(244,63,94,0.3)]',
        icon: Briefcase,
        flavor: 'Neural Peak Protocol'
    },
    shortBreak: {
        label: 'Pulse Break',
        time: 5 * 60,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500',
        glow: 'shadow-[0_0_50px_rgba(16,185,129,0.3)]',
        icon: Coffee,
        flavor: 'Refreshment Cycle'
    },
    longBreak: {
        label: 'Zen Recovery',
        time: 15 * 60,
        color: 'text-sky-500',
        bg: 'bg-sky-500',
        glow: 'shadow-[0_0_50px_rgba(14,165,233,0.3)]',
        icon: Coffee,
        flavor: 'System Preservation'
    },
};

export function PomodoroTimer() {
    const [mode, setMode] = useState<keyof typeof MODES>('work');
    const [timeLeft, setTimeLeft] = useState(MODES.work.time);
    const [isActive, setIsActive] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const handleComplete = useCallback(() => {
        setIsActive(false);
        if (soundEnabled) {
            if (typeof Notification !== 'undefined') {
                if (Notification.permission === 'granted') {
                    new Notification("Clockout Protocol", { body: `${MODES[mode].label} sequence finalized.` });
                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission();
                }
            }
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

    const progress = useMemo(() => {
        const totalTime = MODES[mode].time;
        return ((totalTime - timeLeft) / totalTime) * 100;
    }, [mode, timeLeft]);

    const dashOffset = 283 - (283 * progress) / 100;
    const currentMode = MODES[mode];
    const ModeIcon = currentMode.icon;

    return (
        <div className="max-w-5xl mx-auto space-y-12 lg:space-y-20 animate-in fade-in duration-500 font-sans">
            {/* Semantic Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6 text-center sm:text-left">
                    <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-2xl">
                        <Hourglass className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Temporal Alignment</h2>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Focus Oracle</p>
                    </div>
                </div>
                <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`p-4 rounded-2xl transition-all ${soundEnabled ? 'bg-emerald-500/10 text-emerald-500 shadow-lg shadow-emerald-500/10' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                >
                    {soundEnabled ? <Bell className="w-6 h-6" /> : <BellOff className="w-6 h-6" />}
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 sm:p-12 lg:p-14">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                        {/* Control Matrix */}
                        <div className="lg:col-span-5 space-y-12">
                            <div className="space-y-6">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 italic">Protocol Selector</label>
                                <div className="grid grid-cols-1 gap-4">
                                    {(Object.keys(MODES) as Array<keyof typeof MODES>).map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => switchMode(m)}
                                            className={`group relative flex items-center justify-between px-8 py-6 rounded-[2rem] border-2 transition-all overflow-hidden ${mode === m
                                                ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900 shadow-2xl scale-[1.02]'
                                                : 'bg-slate-50 dark:bg-slate-950 border-transparent text-slate-400 hover:border-slate-200 dark:hover:border-slate-800'}`}
                                        >
                                            <div className="flex items-center gap-4 relative z-10">
                                                <div className={`p-3 rounded-xl transition-colors ${mode === m ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white dark:bg-slate-800 text-slate-300'}`}>
                                                    {m === 'work' ? <Briefcase className="w-5 h-5" /> : <Coffee className="w-5 h-5" />}
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-black uppercase tracking-widest">{MODES[m].label}</p>
                                                    <p className={`text-[10px] font-bold opacity-60`}>{MODES[m].flavor}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black font-mono relative z-10">{MODES[m].time / 60}:00</span>
                                            {mode === m && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-50" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-6">
                                <button
                                    onClick={toggleTimer}
                                    className={`w-28 h-28 rounded-full flex items-center justify-center shadow-3xl transition-all hover:scale-105 active:scale-90 relative overflow-hidden group ${isActive ? 'bg-white dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-700' : `${currentMode.bg} text-white`}`}
                                >
                                    {isActive ? (
                                        <Pause className="w-10 h-10 fill-slate-950 dark:fill-white transition-transform group-hover:scale-110" />
                                    ) : (
                                        <Play className="w-10 h-10 fill-white ml-2 transition-transform group-hover:scale-110" />
                                    )}
                                    {!isActive && (
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </button>

                                <button
                                    onClick={resetTimer}
                                    className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center justify-center transition-all hover:rotate-180 hover:scale-110"
                                >
                                    <RotateCcw className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Projection Matrix */}
                        <div className="lg:col-span-7 flex flex-col items-center justify-center relative py-12 lg:py-0">
                            <div className={`relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center rounded-full transition-all duration-1000 ${isActive ? currentMode.glow : ''}`}>
                                {/* Outer Tech Ring */}
                                <div className="absolute inset-0 border-[1.5px] border-dashed border-slate-100 dark:border-slate-800 rounded-full animate-spin-slow opacity-50" />

                                {/* SVG Progress Sphere */}
                                <div className="absolute inset-4">
                                    <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_20px_rgba(0,0,0,0.1)]" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-100 dark:text-white/5" />
                                        <circle
                                            cx="50" cy="50" r="48" fill="none"
                                            stroke="currentColor" strokeWidth="4"
                                            strokeLinecap="round"
                                            className={`${currentMode.color} transition-all duration-1000 ease-in-out`}
                                            strokeDasharray="301"
                                            strokeDashoffset={301 - (301 * progress) / 100}
                                        />
                                    </svg>
                                </div>

                                {/* Immersive Display Card */}
                                <div className="w-64 h-64 md:w-72 md:h-72 bg-slate-900 dark:bg-slate-950 rounded-full flex flex-col items-center justify-center text-center shadow-3xl text-white relative overflow-hidden group">
                                    <div className="absolute -inset-2 bg-gradient-to-br from-emerald-500/10 via-indigo-500/10 to-emerald-500/10 opacity-30 blur-3xl group-hover:opacity-50 transition-opacity" />

                                    <div className="relative z-10 space-y-2">
                                        <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.4em] italic mb-2">Chronos Pulse</p>
                                        <div className={`text-7xl md:text-8xl font-black tabular-nums tracking-tighter text-glow-emerald transition-colors ${!isActive && 'opacity-30'}`}>
                                            {formatTime(timeLeft)}
                                        </div>
                                        <div className="flex flex-col items-center gap-2 mt-4">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 italic">
                                                <ModeIcon className="w-3 h-3 text-emerald-500" />
                                                {currentMode.label}
                                            </div>
                                            <div className="flex gap-1">
                                                {[1, 2, 3].map((i) => (
                                                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${isActive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-white/10'}`} style={{ animationDelay: `${i * 200}ms` }} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reconciliation Protocol */}
            <div className="text-center py-8 opacity-20 border-t border-slate-50 dark:border-slate-800 mt-12">
                <p className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-400 flex items-center justify-center gap-4">
                    <Sparkles className="w-4 h-4" /> Temporal Synchronization // CHRONO_POMO_V4
                </p>
            </div>
        </div>
    );
}
