'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Activity } from 'lucide-react';

interface StatsMonitorProps {
    engine: any;
    bodyCount: number;
}

export function StatsMonitor({ engine, bodyCount }: StatsMonitorProps) {
    const [fps, setFps] = useState(60);
    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(performance.now());
    const fpsRef = useRef(60);

    useEffect(() => {
        let animationFrameId: number;

        const loop = () => {
            const now = performance.now();
            frameCountRef.current++;

            if (now >= lastTimeRef.current + 1000) {
                fpsRef.current = frameCountRef.current;
                setFps(frameCountRef.current);
                frameCountRef.current = 0;
                lastTimeRef.current = now;
            }

            animationFrameId = requestAnimationFrame(loop);
        };

        loop();

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // Get color based on FPS
    const getFpsColor = (f: number) => {
        if (f >= 55) return 'text-emerald-500';
        if (f >= 30) return 'text-amber-500';
        return 'text-red-500';
    };

    return (
        <div className="absolute top-4 left-16 z-30 pointer-events-none fade-in">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-xl shadow-sm px-3 py-1.5 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-slate-400" />
                    <span className={`text-[10px] font-mono font-bold ${getFpsColor(fps)}`}>
                        {fps} FPS
                    </span>
                </div>
                <div className="w-px h-3 bg-slate-200 dark:bg-slate-700" />
                <div className="text-[10px] text-slate-500 font-mono">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{bodyCount}</span> NODES
                </div>
            </div>
        </div>
    );
}
