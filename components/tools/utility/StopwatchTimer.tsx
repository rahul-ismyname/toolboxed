'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Flag, Bell, Hourglass, Coffee, Brain, Moon, Maximize2, Minimize2, X } from 'lucide-react';

export function StopwatchTimer() {
    const [mode, setMode] = useState<'stopwatch' | 'timer'>('stopwatch');
    const [isEnlarged, setIsEnlarged] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Stopwatch State
    const [swTime, setSwTime] = useState(0);
    const [swRunning, setSwRunning] = useState(false);
    const [laps, setLaps] = useState<{ time: number; delta: number }[]>([]);

    // Timer State
    const [tmTime, setTmTime] = useState(1500); // 25 mins in seconds
    const [tmInitial, setTmInitial] = useState(1500);
    const [tmRunning, setTmRunning] = useState(false);
    const [tmEditing, setTmEditing] = useState(false);

    // Idle Controls logic
    const resetControlsTimeout = useCallback(() => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isEnlarged) setShowControls(false);
        }, 3000);
    }, [isEnlarged]);

    useEffect(() => {
        if (isEnlarged) {
            window.addEventListener('mousemove', resetControlsTimeout);
            window.addEventListener('mousedown', resetControlsTimeout);
            window.addEventListener('touchstart', resetControlsTimeout);
            resetControlsTimeout(); // Initial call to start the timeout
        } else {
            setShowControls(true); // Always show controls when not enlarged
        }
        return () => {
            window.removeEventListener('mousemove', resetControlsTimeout);
            window.removeEventListener('mousedown', resetControlsTimeout);
            window.removeEventListener('touchstart', resetControlsTimeout);
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        };
    }, [isEnlarged, resetControlsTimeout]);

    // Stopwatch Effect
    useEffect(() => {
        let swInterval: any;
        if (swRunning) {
            const start = Date.now() - swTime;
            swInterval = setInterval(() => {
                setSwTime(Date.now() - start);
            }, 10);
        }
        return () => clearInterval(swInterval);
    }, [swRunning]);

    // Timer Effect
    useEffect(() => {
        let tmInterval: any;
        if (tmRunning && tmTime > 0) {
            tmInterval = setInterval(() => {
                setTmTime((prev) => prev - 1);
            }, 1000);
        } else if (tmTime === 0 && tmRunning) {
            setTmRunning(false);
            if (typeof window !== 'undefined') {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.play().catch(() => console.log('Audio playback prevented'));
            }
        }
        return () => clearInterval(tmInterval);
    }, [tmRunning, tmTime]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !tmEditing) {
                e.preventDefault();
                if (mode === 'stopwatch') setSwRunning(!swRunning);
                else if (tmTime > 0) setTmRunning(!tmRunning);
            }
            if (e.code === 'Escape' && isEnlarged) {
                setIsEnlarged(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [swRunning, tmRunning, mode, tmEditing, tmTime, isEnlarged]);

    const formatSw = (ms: number) => {
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        const msPart = Math.floor((ms % 1000) / 10);
        const parts = [m, s].map(v => v.toString().padStart(2, '0'));
        if (h > 0) parts.unshift(h.toString().padStart(2, '0'));
        return `${parts.join(':')}.${msPart.toString().padStart(2, '0')}`;
    };

    const formatTm = (s: number) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        const parts = [m, sec].map(v => v.toString().padStart(2, '0'));
        if (h > 0) parts.unshift(h.toString().padStart(2, '0'));
        return parts.join(':');
    };

    const addLap = () => {
        const lastLapTime = laps.length > 0 ? laps[0].time : 0;
        setLaps([{ time: swTime, delta: swTime - lastLapTime }, ...laps]);
    };

    const setTimerPreset = (seconds: number) => {
        setTmTime(seconds);
        setTmInitial(seconds);
        setTmRunning(false);
    };

    // SVG Progress Calculation
    const progressProgress = useMemo(() => {
        return tmTime === 0 ? 0 : (tmTime / tmInitial) * 100;
    }, [tmTime, tmInitial]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden max-w-4xl mx-auto relative">
            {/* Fullscreen Overlay */}
            {isEnlarged && (
                <div
                    className="fixed inset-0 z-[9999] bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-8 transition-all animate-in fade-in duration-300 cursor-none"
                    style={{ cursor: showControls ? 'auto' : 'none' }}
                >
                    <button
                        onClick={() => setIsEnlarged(false)}
                        className={`absolute top-8 right-8 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-500 transform ${showControls ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-90 pointer-events-none'}`}
                    >
                        <X className="w-12 h-12" />
                    </button>

                    <div className="w-full max-w-4xl space-y-16 text-center">
                        {mode === 'timer' ? (
                            <div className="relative w-80 h-80 md:w-[500px] md:h-[500px] mx-auto flex items-center justify-center">
                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                    <circle cx="50%" cy="50%" r="48%" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-slate-100 dark:text-slate-900" />
                                    <circle
                                        cx="50%" cy="50%" r="48%"
                                        fill="transparent"
                                        stroke="#10b981"
                                        strokeWidth="12"
                                        strokeDasharray="1570"
                                        strokeDashoffset={1570 - (progressProgress * 15.7)}
                                        className="transition-all duration-1000 ease-linear"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="text-[100px] md:text-[160px] font-black font-mono tracking-tighter text-slate-950 dark:text-white relative z-10 transition-colors">
                                    {formatTm(tmTime)}
                                </div>
                            </div>
                        ) : (
                            <div className="text-[100px] md:text-[180px] font-black font-mono tracking-tighter text-slate-950 dark:text-white transition-colors">
                                {formatSw(swTime)}
                            </div>
                        )}

                        <div className={`flex justify-center gap-12 transition-all duration-500 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                            {mode === 'timer' ? (
                                <>
                                    <button
                                        onClick={() => tmTime > 0 && setTmRunning(!tmRunning)}
                                        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${tmRunning ? 'bg-red-500 text-white shadow-xl shadow-red-500/20' : 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20'}`}
                                    >
                                        {tmRunning ? <Pause className="w-16 h-16 fill-current" /> : <Play className="w-16 h-16 fill-current ml-2" />}
                                    </button>
                                    <button
                                        onClick={() => { setTmTime(tmInitial); setTmRunning(false); }}
                                        className="w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                                    >
                                        <RotateCcw className="w-16 h-16" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setSwRunning(!swRunning)}
                                        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${swRunning ? 'bg-red-500 text-white shadow-xl shadow-red-500/20' : 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20'}`}
                                    >
                                        {swRunning ? <Pause className="w-16 h-16 fill-current" /> : <Play className="w-16 h-16 fill-current ml-2" />}
                                    </button>
                                    <button
                                        onClick={() => { setSwTime(0); setSwRunning(false); setLaps([]); }}
                                        className="w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                                    >
                                        <RotateCcw className="w-16 h-16" />
                                    </button>
                                    <button
                                        onClick={addLap}
                                        disabled={!swRunning}
                                        className="w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 hover:text-emerald-500 transition-all border border-slate-200 dark:border-slate-700 shadow-sm disabled:opacity-20"
                                    >
                                        <Flag className="w-16 h-16" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex bg-slate-50 dark:bg-slate-950 p-1 border-b border-slate-100 dark:border-slate-800">
                <button
                    onClick={() => { setMode('stopwatch'); setTmEditing(false); }}
                    className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all rounded-2xl flex items-center justify-center gap-2 ${mode === 'stopwatch' ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-400 opacity-60'}`}
                >
                    <Timer className="w-4 h-4" /> Stopwatch
                </button>
                <button
                    onClick={() => { setMode('timer'); setTmEditing(false); }}
                    className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all rounded-2xl flex items-center justify-center gap-2 ${mode === 'timer' ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-400 opacity-60'}`}
                >
                    <Hourglass className="w-4 h-4" /> Timer / Pomodoro
                </button>
            </div>

            <div className="p-8 md:p-16 flex flex-col items-center">
                {mode === 'stopwatch' ? (
                    <div className="w-full space-y-12">
                        <div className="text-7xl md:text-9xl font-black text-slate-900 dark:text-white font-mono tracking-tighter text-center transition-all">
                            {formatSw(swTime)}
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                            <button
                                onClick={() => setSwRunning(!swRunning)}
                                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${swRunning ? 'bg-red-500 text-white shadow-xl shadow-red-500/30' : 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30'}`}
                            >
                                {swRunning ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
                            </button>
                            <button
                                onClick={() => { setSwTime(0); setSwRunning(false); setLaps([]); }}
                                className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm"
                                title="Reset (R)"
                            >
                                <RotateCcw className="w-10 h-10" />
                            </button>
                            <button
                                onClick={addLap}
                                disabled={!swRunning}
                                className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-500 transition-all flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm disabled:opacity-20"
                                title="Lap (L)"
                            >
                                <Flag className="w-10 h-10" />
                            </button>
                            <button
                                onClick={() => setIsEnlarged(true)}
                                className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-500 transition-all flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm"
                                title="Enlarge"
                            >
                                <Maximize2 className="w-10 h-10" />
                            </button>
                        </div>

                        {laps.length > 0 && (
                            <div className="space-y-2 mt-8 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                {laps.map((lap, i) => (
                                    <div key={i} className="flex justify-between items-center p-5 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 group hover:border-emerald-500/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-black text-slate-400 uppercase w-12 text-center py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                                                L{laps.length - i}
                                            </span>
                                            <span className="font-mono font-bold text-slate-700 dark:text-slate-200 text-lg">{formatSw(lap.time)}</span>
                                        </div>
                                        <span className="font-mono text-sm text-emerald-500 font-medium">
                                            +{formatSw(lap.delta)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full space-y-12 text-center">
                        <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto flex items-center justify-center">
                            {/* SVG Progress Ring */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle
                                    cx="50%" cy="50%" r="48%"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    className="text-slate-100 dark:text-slate-800"
                                />
                                <circle
                                    cx="50%" cy="50%" r="48%"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    strokeDasharray="1000"
                                    strokeDashoffset={1000 - (progressProgress * 10)}
                                    className="text-emerald-500 transition-all duration-1000 ease-linear"
                                    strokeLinecap="round"
                                />
                            </svg>

                            <div
                                className={`text-6xl md:text-8xl font-black font-mono tracking-tighter relative z-10 p-4 rounded-3xl transition-all ${tmRunning ? 'text-emerald-500 scale-105' : 'text-slate-900 dark:text-white'}`}
                            >
                                {tmEditing ? (
                                    <div
                                        className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-300"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="flex items-center gap-3 text-4xl md:text-7xl">
                                            <div className="flex flex-col items-center gap-2">
                                                <input
                                                    autoFocus
                                                    type="number"
                                                    min="0"
                                                    max="23"
                                                    placeholder="00"
                                                    defaultValue={Math.floor(tmTime / 3600)}
                                                    id="tm-h"
                                                    className="w-24 md:w-32 bg-slate-50 dark:bg-slate-800 border-4 border-slate-300 dark:border-slate-600 rounded-3xl p-4 text-center outline-none focus:border-emerald-500 transition-all font-mono text-slate-950 dark:text-white text-4xl font-bold"
                                                />
                                                <span className="text-sm uppercase font-black text-slate-950 dark:text-white tracking-widest">Hours</span>
                                            </div>
                                            <span className="mb-12 text-slate-950 dark:text-white text-5xl font-black">:</span>
                                            <div className="flex flex-col items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="59"
                                                    placeholder="00"
                                                    defaultValue={Math.floor((tmTime % 3600) / 60)}
                                                    id="tm-m"
                                                    className="w-24 md:w-32 bg-slate-50 dark:bg-slate-800 border-4 border-slate-300 dark:border-slate-600 rounded-3xl p-4 text-center outline-none focus:border-emerald-500 transition-all font-mono text-slate-950 dark:text-white text-4xl font-bold"
                                                />
                                                <span className="text-sm uppercase font-black text-slate-950 dark:text-white tracking-widest">Minutes</span>
                                            </div>
                                            <span className="mb-12 text-slate-950 dark:text-white text-5xl font-black">:</span>
                                            <div className="flex flex-col items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="59"
                                                    placeholder="00"
                                                    defaultValue={tmTime % 60}
                                                    id="tm-s"
                                                    className="w-24 md:w-32 bg-slate-50 dark:bg-slate-800 border-4 border-slate-300 dark:border-slate-600 rounded-3xl p-4 text-center outline-none focus:border-emerald-500 transition-all font-mono text-slate-950 dark:text-white text-4xl font-bold"
                                                />
                                                <span className="text-sm uppercase font-black text-slate-950 dark:text-white tracking-widest">Seconds</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-6 mt-4">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setTmEditing(false); }}
                                                className="min-w-[140px] px-10 py-4 rounded-2xl bg-slate-200 dark:bg-slate-700 text-base font-black text-slate-950 dark:text-white hover:bg-red-500 hover:text-white transition-all shadow-md transform active:scale-95"
                                            >
                                                CANCEL
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const h = parseInt((document.getElementById('tm-h') as HTMLInputElement).value) || 0;
                                                    const m = parseInt((document.getElementById('tm-m') as HTMLInputElement).value) || 0;
                                                    const s = parseInt((document.getElementById('tm-s') as HTMLInputElement).value) || 0;
                                                    const total = (h * 3600) + (m * 60) + s;
                                                    setTimerPreset(total);
                                                    setTmEditing(false);
                                                }}
                                                className="min-w-[140px] px-12 py-4 rounded-2xl bg-emerald-600 dark:bg-emerald-500 text-white shadow-2xl shadow-emerald-500/40 text-base font-black transition-all hover:bg-emerald-700 dark:hover:bg-emerald-400 transform active:scale-95 uppercase tracking-widest"
                                            >
                                                SET TIMER
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4">
                                        <div
                                            className="group relative cursor-pointer"
                                            onClick={() => !tmRunning && setTmEditing(true)}
                                        >
                                            {formatTm(tmTime)}
                                        </div>
                                        {!tmRunning && (
                                            <div className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest animate-pulse py-3 px-6 bg-emerald-100/50 dark:bg-emerald-950/50 rounded-full border-2 border-emerald-200 dark:border-emerald-800/50 shadow-sm">
                                                Click time to set custom duration
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setIsEnlarged(true)}
                                            className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-500 transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mt-4 shadow-sm"
                                        >
                                            <Maximize2 className="w-4 h-4" /> Focus Mode
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!tmEditing && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex flex-wrap justify-center gap-3">
                                    <button
                                        onClick={() => setTimerPreset(1500)}
                                        className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-500 hover:text-emerald-500 hover:border-emerald-500/50 transition-all shadow-sm flex items-center gap-2"
                                    >
                                        <Brain className="w-4 h-4" /> Focus (25m)
                                    </button>
                                    <button
                                        onClick={() => setTimerPreset(300)}
                                        className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-500 hover:text-emerald-500 hover:border-emerald-500/50 transition-all shadow-sm flex items-center gap-2"
                                    >
                                        <Coffee className="w-4 h-4" /> Break (5m)
                                    </button>
                                    <button
                                        onClick={() => setTimerPreset(900)}
                                        className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-500 hover:text-emerald-500 hover:border-emerald-500/50 transition-all shadow-sm flex items-center gap-2"
                                    >
                                        <Moon className="w-4 h-4" /> Long (15m)
                                    </button>
                                </div>

                                <div className="flex justify-center gap-8">
                                    <button
                                        onClick={() => tmTime > 0 && setTmRunning(!tmRunning)}
                                        disabled={tmTime === 0}
                                        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${tmRunning ? 'bg-red-500 text-white shadow-xl shadow-red-500/30' : 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 disabled:opacity-20'}`}
                                    >
                                        {tmRunning ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
                                    </button>
                                    <button
                                        onClick={() => { setTmTime(tmInitial); setTmRunning(false); }}
                                        className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm"
                                    >
                                        <RotateCcw className="w-10 h-10" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {tmTime === 0 && (
                            <div className="flex items-center justify-center gap-2 text-red-500 font-black animate-bounce mt-4">
                                <Bell className="w-5 h-5 fill-current" /> TIME IS UP
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 px-8 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="p-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200">Space</span>
                    Start / Pause
                </p>
            </div>
        </div>
    );
}
