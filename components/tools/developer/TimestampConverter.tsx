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
        <div className="space-y-8">
            {/* Live Timer */}
            <div className="bg-emerald-500 text-white rounded-2xl p-8 shadow-lg shadow-emerald-500/20 flex flex-col items-center justify-center text-center">
                <div className="flex items-center text-emerald-100 font-medium mb-2">
                    <Clock className="w-5 h-5 mr-2" />
                    Current Unix Timestamp
                </div>
                <div className="text-5xl md:text-7xl font-mono font-bold tracking-tight mb-4">
                    {now}
                </div>
                <button
                    onClick={() => copyToClipboard(now.toString(), 'live')}
                    className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
                >
                    {copied === 'live' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied === 'live' ? 'Copied' : 'Copy Timestamp'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Epoch to Human */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Epoch to Human Date</h3>
                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="number"
                                value={epochInput}
                                onChange={(e) => setEpochInput(e.target.value)}
                                placeholder="1672322..."
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            />
                        </div>
                        <button
                            onClick={handleEpochConvert}
                            className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
                        >
                            Convert <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                        {humanResult && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800 break-all text-sm font-mono text-slate-600 dark:text-slate-300">
                                {humanResult}
                            </div>
                        )}
                    </div>
                </div>

                {/* Human to Epoch */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Human Date to Epoch</h3>
                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="datetime-local"
                                value={dateInput}
                                onChange={(e) => setDateInput(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="flex items-center text-sm text-slate-500 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={isMilliseconds}
                                    onChange={(e) => setIsMilliseconds(e.target.checked)}
                                    className="mr-2 accent-emerald-500 w-4 h-4"
                                />
                                Use Milliseconds
                            </label>
                            <button
                                onClick={handleDateConvert}
                                className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center"
                            >
                                Convert <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                        {epochResult && (
                            <div className="relative p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group">
                                <span className="text-lg font-mono font-medium text-slate-900 dark:text-white">{epochResult}</span>
                                <button
                                    onClick={() => copyToClipboard(epochResult, 'epoch-res')}
                                    className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    {copied === 'epoch-res' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
