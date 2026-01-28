'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileJson, Copy, Check, Trash2, Maximize2, Minimize2, AlertCircle, Share2 } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function JsonFormatter() {
    const [input, setInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [shareCopied, setShareCopied] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Initialize from URL
    useEffect(() => {
        const urlConfig = searchParams.get('config');
        if (urlConfig) {
            try {
                const decoded = JSON.parse(atob(decodeURIComponent(urlConfig)));
                if (decoded.input) setInput(decoded.input);
            } catch (e) {
                console.error('Failed to decode config', e);
            }
        }
    }, []); // Run once on mount

    const handleShare = useCallback(() => {
        const config = { input };
        const encoded = encodeURIComponent(btoa(JSON.stringify(config)));
        const url = `${window.location.origin}${pathname}?config=${encoded}`;

        navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);

        // Update URL without refresh
        router.replace(`${pathname}?config=${encoded}`, { scroll: false });
    }, [input, pathname, router]);

    const formatJson = (minify = false) => {
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            const formatted = minify
                ? JSON.stringify(parsed)
                : JSON.stringify(parsed, null, 2);
            setInput(formatted);
            setError(null);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    const copyToClipboard = () => {
        if (!input) return;
        navigator.clipboard.writeText(input);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clearAll = () => {
        setInput('');
        setError(null);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                {/* Header Evolution */}
                <div className="p-8 sm:p-12 border-b border-slate-50 dark:border-slate-800/50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl shadow-xl">
                                <FileJson className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Structural Validation</h2>
                                <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">JSON Architect</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                onClick={copyToClipboard}
                                disabled={!input}
                                className="flex-1 sm:flex-none p-4 bg-white dark:bg-slate-800 text-slate-400 hover:text-emerald-500 rounded-2xl shadow-lg border border-slate-50 dark:border-slate-800 transition-all active:scale-90 disabled:opacity-30"
                            >
                                {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={handleShare}
                                disabled={!input}
                                className="flex-1 sm:flex-none p-4 bg-white dark:bg-slate-800 text-slate-400 hover:text-emerald-500 rounded-2xl shadow-lg border border-slate-50 dark:border-slate-800 transition-all active:scale-90 disabled:opacity-30"
                            >
                                {shareCopied ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={clearAll}
                                className="flex-1 sm:flex-none p-4 bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-2xl transition-all active:scale-90"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-8 sm:p-12 space-y-8">
                    {/* Action Nexus */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => formatJson(false)}
                            className="py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-4"
                        >
                            <Maximize2 className="w-5 h-5" />
                            Prettify Manifest
                        </button>
                        <button
                            onClick={() => formatJson(true)}
                            className="py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4"
                        >
                            <Minimize2 className="w-5 h-5" />
                            Compress Payload
                        </button>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-[2rem] blur opacity-0 group-focus-within:opacity-5 transition duration-1000"></div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter structural data for analysis..."
                            className={`relative w-full h-[350px] lg:h-[500px] p-8 bg-slate-50 dark:bg-slate-950 border-2 rounded-[2rem] font-mono text-sm leading-relaxed outline-none transition-all resize-none shadow-inner custom-scrollbar ${error
                                ? 'border-red-500/20 focus:border-red-500'
                                : 'border-transparent focus:border-emerald-500/30'
                                }`}
                        />

                        {error && (
                            <div className="absolute bottom-6 left-6 right-6 p-6 bg-red-500/90 backdrop-blur-xl border border-red-400/30 rounded-2xl flex items-start gap-5 animate-in slide-in-from-bottom-4">
                                <AlertCircle className="w-6 h-6 text-white shrink-0 mt-1" />
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Validation Protocol Failure</div>
                                    <div className="text-xs text-white/90 font-mono break-all leading-relaxed">{error}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-50 dark:border-slate-800/50 text-center">
                            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Integrity</div>
                            <div className={`text-[10px] font-black uppercase tracking-widest ${error ? 'text-red-500' : input ? 'text-emerald-500' : 'text-slate-300'}`}>
                                {error ? 'Corrupt' : input ? 'Locked' : 'Standby'}
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-50 dark:border-slate-800/50 text-center">
                            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Magnitude</div>
                            <div className="text-xs font-black text-slate-900 dark:text-white font-mono uppercase">
                                {input.length} CHR
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-50 dark:border-slate-800/50 text-center col-span-2 sm:col-span-1">
                            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Complexity</div>
                            <div className="text-xs font-black text-slate-900 dark:text-white font-mono uppercase">
                                {input ? input.split('\n').length : 0} LNS
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                    Structural Node // JSON Standard 8259
                </p>
            </div>
        </div>
    );
}
