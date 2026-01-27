'use client';

import { useState, useEffect } from 'react';
import { Clock, RefreshCw, ArrowRight, Copy, Check } from 'lucide-react';

export function TimestampConverter() {
    const [now, setNow] = useState<number>(Math.floor(Date.now() / 1000));
    const [epochInput, setEpochInput] = useState<string>('');
    const [dateInput, setDateInput] = useState<string>('');
    const [humanResult, setHumanResult] = useState<string>('');
    const [epochResult, setEpochResult] = useState<string>('');
    const [copied, setCopied] = useState<string | null>(null);
    const [isMilliseconds, setIsMilliseconds] = useState(false);

    // Live Clock
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Math.floor(Date.now() / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleEpochConvert = () => {
        if (!epochInput) return;
        const ts = parseInt(epochInput);
        if (isNaN(ts)) {
            setHumanResult('Invalid Timestamp');
            return;
        }
        // Heuristic: If < 100 billion, assume seconds. Else milliseconds.
        const date = new Date(ts > 100000000000 ? ts : ts * 1000);
        setHumanResult(date.toUTCString() + ' / ' + date.toLocaleString());
    };

    const handleDateConvert = () => {
        if (!dateInput) return;
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) {
            setEpochResult('Invalid Date');
            return;
        }
        const ts = isMilliseconds ? date.getTime() : Math.floor(date.getTime() / 1000);
        setEpochResult(ts.toString());
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 lg:space-y-10 animate-in fade-in duration-500">
            {/* Live Clock Nexus */}
            <div className="bg-slate-900 dark:bg-slate-950 rounded-[3rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
                <div className="relative z-10 text-center">
                    <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-6">
                        <Clock className="w-5 h-5" />
                        Live Unix Temporal Index
                    </div>
                    <div className="text-5xl sm:text-8xl font-black text-white tracking-tighter mb-10 font-mono">
                        {now}
                    </div>
                    <button
                        onClick={() => copyToClipboard(now.toString(), 'live')}
                        className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-md border border-white/5 active:scale-95 flex items-center gap-3 mx-auto"
                    >
                        {copied === 'live' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        {copied === 'live' ? 'Synchronized' : 'Sync Index'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Epoch to Human Date */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 p-8 sm:p-10 transition-all hover:shadow-indigo-500/10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 px-1">Epoch Nexus Conversion</h3>
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-300 px-1">Source Index</label>
                            <input
                                type="number"
                                value={epochInput}
                                onChange={(e) => setEpochInput(e.target.value)}
                                placeholder="1672322..."
                                className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-50 dark:border-slate-800 rounded-2xl font-mono text-xl font-black text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all shadow-inner"
                            />
                        </div>
                        <button
                            onClick={handleEpochConvert}
                            className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-3"
                        >
                            Deconstruct Index <ArrowRight className="w-4 h-4" />
                        </button>

                        {humanResult && (
                            <div className="mt-8 p-8 bg-slate-50/50 dark:bg-slate-950/50 rounded-[2rem] border border-slate-50 dark:border-slate-800 group animate-in slide-in-from-top-4 duration-500">
                                <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-4">Human Manifest</div>
                                <div className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed break-words">
                                    {humanResult}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(humanResult, 'human-res')}
                                    className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-600 transition-colors"
                                >
                                    {copied === 'human-res' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied === 'human-res' ? 'Manifest Synced' : 'Sync Manifest'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Human Date to Epoch */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 p-8 sm:p-10 transition-all hover:shadow-indigo-500/10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 px-1">Manifest Nexus Conversion</h3>
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-300 px-1">Temporal Value</label>
                            <input
                                type="datetime-local"
                                value={dateInput}
                                onChange={(e) => {
                                    setNow(Math.floor(new Date(e.target.value).getTime() / 1000));
                                    setDateInput(e.target.value);
                                }}
                                className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-950 border-2 border-slate-50 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all shadow-sm"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
                            <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer select-none group">
                                <div className={`w-10 h-6 rounded-full transition-all relative ${isMilliseconds ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}>
                                    <input
                                        type="checkbox"
                                        checked={isMilliseconds}
                                        onChange={(e) => setIsMilliseconds(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all ${isMilliseconds ? 'translate-x-4' : ''}`} />
                                </div>
                                Milliseconds
                            </label>
                            <button
                                onClick={handleDateConvert}
                                className="flex-1 sm:flex-none px-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-3"
                            >
                                Generate Index <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {epochResult && (
                            <div className="mt-8 relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-[2rem] blur opacity-5"></div>
                                <div className="relative p-8 bg-slate-50/50 dark:bg-slate-950/50 rounded-[2rem] border border-slate-50 dark:border-slate-800 flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
                                    <div className="space-y-1">
                                        <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Calculated Index</div>
                                        <div className="text-2xl font-black font-mono text-slate-900 dark:text-white tracking-widest">{epochResult}</div>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(epochResult, 'epoch-res')}
                                        className="p-5 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-50 dark:border-slate-800 text-slate-300 hover:text-emerald-500 transition-all active:scale-90"
                                    >
                                        {copied === 'epoch-res' ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
