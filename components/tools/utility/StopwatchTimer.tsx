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
        <div className="max-w-4xl mx-auto space-y-12 lg:space-y-16 animate-in fade-in duration-500">
            {/* Semantic Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6 text-center sm:text-left">
                    <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-2xl">
                        <Timer className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Temporal Engine</h2>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Chrono Oracle</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden relative">
                {/* Fullscreen Overlay - Agentic 2.0 Focus Mode */}
                {isEnlarged && (
                    <div
                        className="fixed inset-0 z-[9999] bg-slate-900 dark:bg-slate-950 flex flex-col items-center justify-center p-8 transition-all animate-in fade-in duration-500 cursor-none relative overflow-hidden"
                        style={{ cursor: showControls ? 'auto' : 'none' }}
                    >
                        {/* Immersive Pulse Backdrop */}
                        <div className="absolute -inset-20 bg-gradient-to-br from-emerald-500/5 via-indigo-500/5 to-emerald-500/5 rounded-full blur-[100px] animate-spin-slow opacity-50" />

                        <button
                            onClick={() => setIsEnlarged(false)}
                            className={`absolute top-12 right-12 p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white hover:bg-white/10 transition-all duration-500 transform ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
                        >
                            <Minimize2 className="w-8 h-8" />
                        </button>

                        <div className="w-full max-w-5xl space-y-20 text-center relative z-10">
                            {mode === 'timer' ? (
                                <div className="relative w-96 h-96 md:w-[600px] md:h-[600px] mx-auto flex items-center justify-center">
                                    <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                        <circle cx="50%" cy="50%" r="48%" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-white/5" />
                                        <circle
                                            cx="50%" cy="50%" r="48%"
                                            fill="transparent"
                                            stroke="#10b981"
                                            strokeWidth="12"
                                            strokeDasharray="1884"
                                            strokeDashoffset={1884 - (progressProgress * 18.84)}
                                            className="transition-all duration-1000 ease-linear shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[12px] font-black uppercase tracking-[0.8em] text-emerald-500/40 mb-4 italic">Cycle Remaining</span>
                                        <div className="text-[120px] md:text-[200px] font-black font-mono tracking-tighter text-white text-glow-emerald leading-none">
                                            {formatTm(tmTime)}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <span className="text-[12px] font-black uppercase tracking-[1em] text-emerald-500/40 mb-8 italic">Elapsed Duration</span>
                                    <div className="text-[120px] md:text-[220px] font-black font-mono tracking-tighter text-white text-glow-emerald leading-none">
                                        {formatSw(swTime)}
                                    </div>
                                </div>
                            )}

                            <div className={`flex justify-center gap-12 transition-all duration-700 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
                                <div className="p-4 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 flex items-center gap-8 shadow-2xl">
                                    {mode === 'timer' ? (
                                        <>
                                            <button
                                                onClick={() => { setTmTime(tmInitial); setTmRunning(false); }}
                                                className="p-6 rounded-full bg-white/5 text-white/30 hover:text-white transition-all hover:bg-white/10"
                                            >
                                                <RotateCcw className="w-10 h-10" />
                                            </button>
                                            <button
                                                onClick={() => tmTime > 0 && setTmRunning(!tmRunning)}
                                                className={`w-28 h-28 rounded-full flex items-center justify-center transition-all ${tmRunning ? 'bg-rose-500/20 text-rose-500 shadow-2xl shadow-rose-500/20' : 'bg-emerald-500 text-slate-900 shadow-2xl shadow-emerald-500/40'}`}
                                            >
                                                {tmRunning ? <Pause className="w-12 h-12 fill-current" /> : <Play className="w-12 h-12 fill-current ml-2" />}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => { setSwTime(0); setSwRunning(false); setLaps([]); }}
                                                className="p-6 rounded-full bg-white/5 text-white/30 hover:text-white transition-all hover:bg-white/10"
                                            >
                                                <RotateCcw className="w-10 h-10" />
                                            </button>
                                            <button
                                                onClick={() => setSwRunning(!swRunning)}
                                                className={`w-28 h-28 rounded-full flex items-center justify-center transition-all ${swRunning ? 'bg-rose-500/20 text-rose-500 shadow-2xl shadow-rose-500/20' : 'bg-emerald-500 text-slate-900 shadow-2xl shadow-emerald-500/40'}`}
                                            >
                                                {swRunning ? <Pause className="w-12 h-12 fill-current" /> : <Play className="w-12 h-12 fill-current ml-2" />}
                                            </button>
                                            <button
                                                onClick={addLap}
                                                disabled={!swRunning}
                                                className="p-6 rounded-full bg-white/5 text-white/30 hover:text-emerald-500 transition-all hover:bg-white/10 disabled:opacity-10"
                                            >
                                                <Flag className="w-10 h-10" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Primary Mode Matrix */}
                <div className="flex bg-slate-50 dark:bg-slate-950 p-2 border-b border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => { setMode('stopwatch'); setTmEditing(false); }}
                        className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest transition-all rounded-[1.5rem] flex items-center justify-center gap-3 ${mode === 'stopwatch' ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-xl border border-slate-200 dark:border-slate-800' : 'text-slate-400 opacity-60'}`}
                    >
                        <Timer className="w-4 h-4" /> Stop-Sync
                    </button>
                    <button
                        onClick={() => { setMode('timer'); setTmEditing(false); }}
                        className={`flex-1 py-5 text-[10px] font-black uppercase tracking-widest transition-all rounded-[1.5rem] flex items-center justify-center gap-3 ${mode === 'timer' ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-xl border border-slate-200 dark:border-slate-800' : 'text-slate-400 opacity-60'}`}
                    >
                        <Hourglass className="w-4 h-4" /> Temporal Flow
                    </button>
                </div>

                <div className="p-8 sm:p-12 lg:p-16 flex flex-col items-center">
                    {mode === 'stopwatch' ? (
                        <div className="w-full space-y-16">
                            <div className="relative">
                                <div className="absolute -inset-10 bg-emerald-500/5 rounded-full blur-3xl opacity-50" />
                                <div className="text-8xl lg:text-[10rem] font-black text-slate-900 dark:text-white font-mono tracking-tighter text-center transition-all relative z-10 leading-none py-10">
                                    {formatSw(swTime)}
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center gap-6">
                                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-inner flex items-center gap-4">
                                    <button
                                        onClick={() => { setSwTime(0); setSwRunning(false); setLaps([]); }}
                                        className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 text-slate-400 hover:text-rose-500 transition-all flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-sm"
                                        title="Reset"
                                    >
                                        <RotateCcw className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => setSwRunning(!swRunning)}
                                        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${swRunning ? 'bg-rose-500 text-white shadow-2xl shadow-rose-500/30 active:scale-95' : 'bg-emerald-500 text-slate-900 shadow-2xl shadow-emerald-500/30 active:scale-95'}`}
                                    >
                                        {swRunning ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
                                    </button>
                                    <button
                                        onClick={addLap}
                                        disabled={!swRunning}
                                        className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 text-slate-400 hover:text-emerald-500 transition-all flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-sm disabled:opacity-20"
                                        title="Split"
                                    >
                                        <Flag className="w-6 h-6" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => setIsEnlarged(true)}
                                    className="w-16 h-16 self-center rounded-[1.5rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-110 transition-all flex items-center justify-center shadow-xl"
                                    title="Immersive Focus"
                                >
                                    <Maximize2 className="w-6 h-6" />
                                </button>
                            </div>

                            {laps.length > 0 && (
                                <div className="space-y-4 max-h-[320px] overflow-y-auto pr-4 custom-scrollbar-premium">
                                    <div className="flex items-center gap-4 px-4">
                                        <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Temporal Splits</span>
                                        <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1" />
                                    </div>
                                    {laps.map((lap, i) => (
                                        <div key={i} className="flex justify-between items-center p-6 bg-slate-50 dark:bg-slate-950/30 rounded-[1.8rem] border border-slate-100 dark:border-slate-800/50 group transition-all hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl hover:shadow-indigo-500/5">
                                            <div className="flex items-center gap-6">
                                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                                    Split {laps.length - i}
                                                </span>
                                                <span className="font-mono font-black text-slate-900 dark:text-white text-2xl tracking-tight">{formatSw(lap.time)}</span>
                                            </div>
                                            <span className="font-mono text-sm text-slate-400 font-bold group-hover:text-emerald-500 transition-colors">
                                                +{formatSw(lap.delta)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-full space-y-16 text-center">
                            <div className="relative w-80 h-80 lg:w-[450px] lg:h-[450px] mx-auto flex items-center justify-center">
                                {/* SVG Progress Ring */}
                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                    <circle cx="50%" cy="50%" r="48%" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-50 dark:text-slate-950" />
                                    <circle
                                        cx="50%" cy="50%" r="48%"
                                        fill="transparent"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        strokeDasharray="1356"
                                        strokeDashoffset={1356 - (progressProgress * 13.56)}
                                        className="text-emerald-500 transition-all duration-1000 ease-linear drop-shadow-glow"
                                        strokeLinecap="round"
                                    />
                                </svg>

                                <div className={`relative z-10 transition-all ${tmRunning ? 'scale-110' : ''}`}>
                                    {tmEditing ? (
                                        <div className="flex flex-col items-center gap-10 animate-in zoom-in duration-300">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <input id="tm-h" type="number" min="0" max="23" defaultValue={Math.floor(tmTime / 3600)} className="w-24 px-4 py-8 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] text-4xl font-black text-center outline-none focus:border-emerald-500 transition-all shadow-inner" />
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hrs</span>
                                                </div>
                                                <span className="text-4xl font-black text-slate-200">:</span>
                                                <div className="flex flex-col gap-2">
                                                    <input id="tm-m" type="number" min="0" max="59" defaultValue={Math.floor((tmTime % 3600) / 60)} className="w-24 px-4 py-8 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] text-4xl font-black text-center outline-none focus:border-emerald-500 transition-all shadow-inner" />
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Min</span>
                                                </div>
                                                <span className="text-4xl font-black text-slate-200">:</span>
                                                <div className="flex flex-col gap-2">
                                                    <input id="tm-s" type="number" min="0" max="59" defaultValue={tmTime % 60} className="w-24 px-4 py-8 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] text-4xl font-black text-center outline-none focus:border-emerald-500 transition-all shadow-inner" />
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sec</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={() => setTmEditing(false)} className="px-8 py-4 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 transition-colors">Discard</button>
                                                <button
                                                    onClick={() => {
                                                        const h = parseInt((document.getElementById('tm-h') as HTMLInputElement).value) || 0;
                                                        const m = parseInt((document.getElementById('tm-m') as HTMLInputElement).value) || 0;
                                                        const s = parseInt((document.getElementById('tm-s') as HTMLInputElement).value) || 0;
                                                        setTimerPreset(h * 3600 + m * 60 + s);
                                                        setTmEditing(false);
                                                    }}
                                                    className="px-10 py-4 bg-emerald-500 text-slate-900 rounded-full text-[10px] font-black uppercase shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                                                >Commit Config</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-6">
                                            <div
                                                onClick={() => !tmRunning && setTmEditing(true)}
                                                className={`text-[80px] lg:text-[120px] font-black font-mono tracking-tighter cursor-pointer transition-all hover:scale-105 active:scale-95 ${tmRunning ? 'text-emerald-500 text-glow-emerald' : 'text-slate-900 dark:text-white'}`}
                                            >
                                                {formatTm(tmTime)}
                                            </div>
                                            {!tmRunning && (
                                                <div className="px-6 py-2 bg-emerald-500/5 rounded-full border border-emerald-500/10 text-[9px] font-black text-emerald-500/60 uppercase tracking-[0.2em] italic">
                                                    Awaiting Initiation // Cycle: {tmInitial / 60}m
                                                </div>
                                            )}
                                            <button
                                                onClick={() => setIsEnlarged(true)}
                                                className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-emerald-500 transition-all shadow-sm"
                                            >
                                                <Maximize2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {!tmEditing && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {[
                                            { label: 'Deep Work', time: 1500, icon: Brain, color: 'emerald' },
                                            { label: 'Break', time: 300, icon: Coffee, color: 'rose' },
                                            { label: 'Recovery', time: 900, icon: Moon, color: 'indigo' }
                                        ].map((preset) => (
                                            <button
                                                key={preset.label}
                                                onClick={() => setTimerPreset(preset.time)}
                                                className="px-8 py-5 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/5 group text-left flex items-center gap-6"
                                            >
                                                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl group-hover:bg-emerald-500 group-hover:text-slate-900 transition-all">
                                                    <preset.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic group-hover:text-emerald-500">{preset.label}</p>
                                                    <p className="text-lg font-black text-slate-900 dark:text-white font-mono">{preset.time / 60}:00</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-inner inline-flex items-center gap-4">
                                        <button
                                            onClick={() => { setTmTime(tmInitial); setTmRunning(false); }}
                                            className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 text-slate-400 hover:text-rose-500 transition-all flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-sm"
                                        >
                                            <RotateCcw className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={() => tmTime > 0 && setTmRunning(!tmRunning)}
                                            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${tmRunning ? 'bg-rose-500 text-white shadow-2xl shadow-rose-500/30' : 'bg-emerald-500 text-slate-900 shadow-2xl shadow-emerald-500/30'}`}
                                        >
                                            {tmRunning ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {tmTime === 0 && (
                                <div className="flex items-center justify-center gap-4 py-8 px-12 bg-rose-500/10 rounded-[2rem] border-2 border-rose-500 animate-pulse inline-block">
                                    <Bell className="w-8 h-8 text-rose-500 fill-current" />
                                    <span className="text-xl font-black text-rose-500 tracking-[0.3em] uppercase">Temporal Expiration</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 px-12 py-8 border-t border-slate-100 dark:border-slate-800 w-full flex justify-between items-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-4 underline underline-offset-8 decoration-emerald-500/30">
                        <span className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white shadow-sm font-mono">[SPACE]</span>
                        Toggle Flow
                    </p>
                    <p className="text-[10px] font-black text-slate-400/30 uppercase tracking-[0.5em] italic">
                        Temporal Orchestration Node
                    </p>
                </div>
            </div>
        </div>
    );
}
