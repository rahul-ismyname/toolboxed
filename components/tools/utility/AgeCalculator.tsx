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
        <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium text-lg"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                Calculate Age At
                            </label>
                            <button
                                onClick={() => setIsCustomMode(!isCustomMode)}
                                className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${isCustomMode
                                    ? 'bg-emerald-500 text-white border-emerald-500'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-emerald-500'}`}
                            >
                                {isCustomMode ? 'Custom Date' : 'Present (Today)'}
                            </button>
                        </div>

                        {isCustomMode ? (
                            <input
                                type="date"
                                value={customTargetDate}
                                onChange={(e) => setCustomTargetDate(e.target.value)}
                                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium text-lg animate-in fade-in"
                            />
                        ) : (
                            <div className="w-full p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 font-medium text-lg flex items-center justify-between cursor-not-allowed opacity-70">
                                <span>Today (Live)</span>
                                <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded">Auto</span>
                            </div>
                        )}
                    </div>
                </div>


                {result && 'error' in result && (
                    <div className="mt-8 p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl text-center font-medium border border-red-100 dark:border-red-900/30">
                        {result.error}
                    </div>
                )}
            </div>

            {result && !('error' in result) && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Main Age Card */}
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 text-center">
                            <div className="text-sm font-bold uppercase tracking-widest opacity-80 mb-4 flex items-center justify-center gap-2">
                                <Baby className="w-4 h-4" /> You are exactly
                            </div>
                            <div className="flex flex-wrap items-baseline justify-center gap-4 md:gap-8 mb-6">
                                <div className="flex flex-col">
                                    <span className="text-5xl md:text-7xl font-black">{result.years}</span>
                                    <span className="text-sm uppercase tracking-wider opacity-80 font-bold">Years</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-5xl md:text-7xl font-black">{result.months}</span>
                                    <span className="text-sm uppercase tracking-wider opacity-80 font-bold">Months</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-5xl md:text-7xl font-black">{result.days}</span>
                                    <span className="text-sm uppercase tracking-wider opacity-80 font-bold">Days</span>
                                </div>
                            </div>
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-mono border border-white/20">
                                <Clock className="w-4 h-4" />
                                {result.totalSeconds.toLocaleString()} seconds old
                            </div>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    </div>

                    {/* Zodiac & Birthday Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Star className="w-24 h-24 text-indigo-500" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-indigo-500" />
                                Astrology
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">Western Zodiac</span>
                                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{result.westernZodiac}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">Chinese Zodiac</span>
                                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{result.chineseZodiac}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Gift className="w-4 h-4 text-pink-500" />
                                Next Celebration
                            </h3>
                            <div className="flex flex-col items-center justify-center h-24">
                                <span className="text-4xl font-black text-slate-900 dark:text-white mb-1">
                                    {result.daysToNext}
                                </span>
                                <span className="text-sm text-slate-500 font-medium">Days until your birthday</span>
                            </div>
                        </div>
                    </div>

                    {/* Biological Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-500">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Heartbeats</div>
                            </div>
                            <div className="text-xl font-bold text-slate-900 dark:text-white truncate">
                                ~{result.heartbeats.toLocaleString()}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-500">
                                    <Wind className="w-5 h-5" />
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Breaths</div>
                            </div>
                            <div className="text-xl font-bold text-slate-900 dark:text-white truncate">
                                ~{result.breaths.toLocaleString()}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-500">
                                    <Hourglass className="w-5 h-5" />
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Days</div>
                            </div>
                            <div className="text-xl font-bold text-slate-900 dark:text-white truncate">
                                {result.totalDays.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
