'use client';

import { useState, useMemo, useEffect } from 'react';
import { Calendar, Baby, Clock, Hourglass, Gift, Heart, Wind, Star, Sparkles } from 'lucide-react';

const WESTERN_ZODIAC = [
    { name: 'Capricorn', start: '12-22', end: '12-31' },
    { name: 'Capricorn', start: '01-01', end: '01-19' },
    { name: 'Aquarius', start: '01-20', end: '02-18' },
    { name: 'Pisces', start: '02-19', end: '03-20' },
    { name: 'Aries', start: '03-21', end: '04-19' },
    { name: 'Taurus', start: '04-20', end: '05-20' },
    { name: 'Gemini', start: '05-21', end: '06-20' },
    { name: 'Cancer', start: '06-21', end: '07-22' },
    { name: 'Leo', start: '07-23', end: '08-22' },
    { name: 'Virgo', start: '08-23', end: '09-22' },
    { name: 'Libra', start: '09-23', end: '10-22' },
    { name: 'Scorpio', start: '10-23', end: '11-21' },
    { name: 'Sagittarius', start: '11-22', end: '12-21' },
];

const CHINESE_ZODIAC = [
    'Monkey', 'Rooster', 'Dog', 'Pig', 'Rat', 'Ox',
    'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat'
];

export function AgeCalculator() {
    const [birthDate, setBirthDate] = useState('');
    const [isCustomMode, setIsCustomMode] = useState(false);
    const [customTargetDate, setCustomTargetDate] = useState(new Date().toISOString().split('T')[0]);
    const [now, setNow] = useState(new Date());

    // Live Ticker for Seconds (only runs if not in custom mode)
    useEffect(() => {
        if (!isCustomMode) {
            const timer = setInterval(() => setNow(new Date()), 1000);
            return () => clearInterval(timer);
        }
    }, [isCustomMode]);

    const result = useMemo(() => {
        if (!birthDate) return null;

        // Determine effective target date
        const target = isCustomMode ? new Date(customTargetDate) : now;
        const birth = new Date(birthDate);

        if (birth > target) return { error: 'Birth date cannot be in the future of the target date!' };

        // Precise Age
        let years = target.getFullYear() - birth.getFullYear();
        let months = target.getMonth() - birth.getMonth();
        let days = target.getDate() - birth.getDate();

        if (days < 0) {
            months -= 1;
            const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0);
            days += lastMonth.getDate();
        }
        if (months < 0) {
            years -= 1;
            months += 12;
        }

        // Total Stats
        const diffTime = Math.abs(target.getTime() - birth.getTime());
        const totalSeconds = Math.floor(diffTime / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);
        const totalWeeks = Math.floor(totalDays / 7);

        // Fun Stats (Estimates)
        const heartbeats = Math.floor(totalMinutes * 80); // Avg 80 bpm
        const breaths = Math.floor(totalMinutes * 16); // Avg 16 bpm

        // Astrology
        const month = birth.getMonth() + 1;
        const day = birth.getDate();

        let westernZodiac = 'Unknown';
        const dateStr = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        // Simple range check
        for (const sign of WESTERN_ZODIAC) {
            if (dateStr >= sign.start && dateStr <= sign.end) {
                westernZodiac = sign.name;
                break;
            }
        }

        const chineseZodiac = CHINESE_ZODIAC[birth.getFullYear() % 12];

        // Next Birthday
        const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
        if (nextBirthday < target) {
            nextBirthday.setFullYear(target.getFullYear() + 1);
        }
        const diffNext = nextBirthday.getTime() - target.getTime();
        const daysToNext = Math.ceil(diffNext / (1000 * 60 * 60 * 24));

        return {
            years, months, days,
            totalSeconds, totalMinutes, totalHours, totalDays, totalWeeks,
            heartbeats, breaths,
            westernZodiac, chineseZodiac,
            daysToNext
        };
    }, [birthDate, isCustomMode, customTargetDate, now]);

    return (
        <div className="max-w-4xl mx-auto space-y-12 lg:space-y-16 animate-in fade-in duration-500">
            {/* Semantic Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6 text-center sm:text-left">
                    <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-2xl">
                        <Gift className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Temporal Milestone</h2>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Life Oracle</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 sm:p-12 lg:p-14 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 italic">Origin Epoch (Birth)</label>
                            <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500/20 rounded-[1.8rem] outline-none transition-all font-mono font-black text-slate-900 dark:text-white shadow-inner"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Target Horizon</label>
                                <button
                                    onClick={() => setIsCustomMode(!isCustomMode)}
                                    className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${isCustomMode
                                        ? 'bg-emerald-500 text-slate-900 border-emerald-500'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-emerald-500'}`}
                                >
                                    {isCustomMode ? 'Manual Switch' : 'Auto Sync'}
                                </button>
                            </div>

                            {isCustomMode ? (
                                <input
                                    type="date"
                                    value={customTargetDate}
                                    onChange={(e) => setCustomTargetDate(e.target.value)}
                                    className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500/20 rounded-[1.8rem] outline-none transition-all font-mono font-black text-slate-900 dark:text-white shadow-inner animate-in slide-in-from-top-2 duration-300"
                                />
                            ) : (
                                <div className="w-full px-8 py-5 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[1.8rem] text-slate-300 dark:text-slate-600 font-mono font-bold flex items-center justify-between opacity-50">
                                    <span>REALTIME_MODE_ACTIVE</span>
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                </div>
                            )}
                        </div>
                    </div>

                    {result && 'error' in result && (
                        <div className="p-6 bg-rose-500/5 border-2 border-rose-500/20 rounded-[2rem] text-rose-500 text-center font-black text-xs uppercase tracking-widest animate-in zoom-in duration-300">
                            Anomaly: {result.error}
                        </div>
                    )}

                    {result && !('error' in result) && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {/* Projection Matrix */}
                            <div className="bg-slate-900 dark:bg-slate-950 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-3xl group">
                                <div className="absolute -inset-2 bg-gradient-to-br from-emerald-500/10 via-indigo-500/10 to-emerald-500/10 opacity-30 blur-3xl group-hover:opacity-50 transition-opacity" />
                                <div className="relative z-10 text-center space-y-10">
                                    <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.6em] italic">Current Dimensional Resonance</p>

                                    <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-20">
                                        <div className="flex flex-col items-center">
                                            <span className="text-7xl lg:text-9xl font-black tracking-tighter text-glow-emerald leading-none">{result.years}</span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-4 italic">Solar Cycles</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-7xl lg:text-9xl font-black tracking-tighter text-glow-emerald leading-none">{result.months}</span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-4 italic">Lunar Phases</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-7xl lg:text-9xl font-black tracking-tighter text-glow-emerald leading-none">{result.days}</span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-4 italic">Rotations</span>
                                        </div>
                                    </div>

                                    <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4 rounded-full text-[10px] font-black font-mono uppercase tracking-[0.2em] text-white/40 shadow-inner">
                                        <Clock className="w-4 h-4 text-emerald-500" />
                                        Total Magnitude: {result.totalSeconds.toLocaleString()} s
                                    </div>
                                </div>
                            </div>

                            {/* Bio-Metadata Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-slate-50 dark:bg-slate-950/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 group transition-all hover:bg-white dark:hover:bg-slate-900 hover:shadow-2xl hover:shadow-indigo-500/5">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-rose-500 group-hover:scale-110 transition-transform">
                                            <Heart className="w-6 h-6 fill-current opacity-20" />
                                        </div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Pulsations</span>
                                    </div>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tighter truncate">
                                        {result.heartbeats.toLocaleString()}
                                    </p>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-950/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 group transition-all hover:bg-white dark:hover:bg-slate-900 hover:shadow-2xl hover:shadow-indigo-500/5">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-sky-500 group-hover:scale-110 transition-transform">
                                            <Wind className="w-6 h-6" />
                                        </div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Respirations</span>
                                    </div>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tighter truncate">
                                        {result.breaths.toLocaleString()}
                                    </p>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-950/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 group transition-all hover:bg-white dark:hover:bg-slate-900 hover:shadow-2xl hover:shadow-indigo-500/5">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-amber-500 group-hover:scale-110 transition-transform">
                                            <Hourglass className="w-6 h-6" />
                                        </div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Total Cycles</span>
                                    </div>
                                    <p className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tighter truncate">
                                        {result.totalDays.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Celestial Mapping */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-900 dark:bg-slate-950 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                                        <Star className="w-32 h-32 text-indigo-500" />
                                    </div>
                                    <div className="relative z-10 space-y-8">
                                        <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] flex items-center gap-4 italic">
                                            <Sparkles className="w-4 h-4" /> Celestial Mapping
                                        </h3>
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Western Zodiac</span>
                                                <span className="text-2xl font-black text-white">{result.westernZodiac}</span>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Chinese Manifest</span>
                                                <span className="text-2xl font-black text-white">{result.chineseZodiac}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                                    <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] flex items-center gap-4 italic">
                                        <Gift className="w-4 h-4" /> Next Celebration
                                    </h3>
                                    <div className="flex flex-col items-center">
                                        <span className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
                                            {result.daysToNext}
                                        </span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mt-2">Days until next solar return</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reconciliation Protocol */}
            <div className="text-center py-8 opacity-20 border-t border-slate-50 dark:border-slate-800 mt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-400">
                    Dimensional Age Translation // CHRONO_MANIFEST_V2
                </p>
            </div>
        </div>
    );
}
