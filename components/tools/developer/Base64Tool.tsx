'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileCode, Copy, Check, Trash2, ArrowLeftRight, AlertCircle, Share2 } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function Base64Tool() {
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

    const encode = () => {
        if (!input.trim()) return;
        try {
            const encoded = btoa(input);
            setInput(encoded);
            setError(null);
        } catch (e: any) {
            setError('Character out of range (Unicode is not natively supported by btoa). Try ASCII text.');
        }
    };

    const decode = () => {
        if (!input.trim()) return;
        try {
            const decoded = atob(input);
            setInput(decoded);
            setError(null);
        } catch (e: any) {
            setError('Invalid Base64 string.');
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
            {/* Control Node */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 sm:p-12 border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-950/30 flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-xl">
                            <FileCode className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Stream Synthesis</h2>
                            <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Base64 Processor</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={encode}
                            className="flex-1 sm:px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                        >
                            Encode
                        </button>
                        <button
                            onClick={decode}
                            className="flex-1 sm:px-8 py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all"
                        >
                            Decode
                        </button>
                    </div>
                </div>

                <div className="p-8 sm:p-12 space-y-10">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-5 transition duration-1000"></div>
                        <textarea
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                setError(null);
                            }}
                            placeholder='Initiate data sequence for transformation...'
                            className={`relative w-full h-[350px] lg:h-[450px] p-8 sm:p-10 bg-slate-50 dark:bg-slate-950 border-2 rounded-[2.5rem] font-mono text-xs sm:text-sm leading-relaxed outline-none transition-all resize-none shadow-inner placeholder:text-slate-300 dark:placeholder:text-slate-800 ${error
                                ? 'border-red-500/20 text-red-600 focus:border-red-500'
                                : 'border-transparent focus:border-emerald-500/30 text-slate-600 dark:text-slate-400'
                                }`}
                        />

                        {/* Control Float */}
                        <div className="absolute top-6 right-6 flex flex-col gap-3">
                            <button
                                onClick={copyToClipboard}
                                disabled={!input}
                                className="p-4 bg-white dark:bg-slate-800 text-emerald-500 rounded-2xl shadow-xl border border-slate-50 dark:border-slate-800 hover:scale-110 active:scale-90 transition-all disabled:opacity-0"
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={handleShare}
                                disabled={!input}
                                className="p-4 bg-white dark:bg-slate-800 text-emerald-500 rounded-2xl shadow-xl border border-slate-50 dark:border-slate-800 hover:scale-110 active:scale-90 transition-all disabled:opacity-0"
                            >
                                {shareCopied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={clearAll}
                                disabled={!input}
                                className="p-4 bg-white dark:bg-slate-800 text-red-500 rounded-2xl shadow-xl border border-slate-50 dark:border-slate-800 hover:scale-110 active:scale-90 transition-all disabled:opacity-0"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        {error && (
                            <div className="absolute inset-x-8 bottom-8 p-6 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-[2rem] flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4">
                                <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-red-500">Protocol Exception</div>
                                    <div className="text-xs text-red-600 dark:text-red-400 font-bold leading-relaxed">{error}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Meta Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="p-8 bg-slate-50 dark:bg-slate-950/50 rounded-[2rem] border border-transparent hover:border-emerald-500/20 transition-all group/stat">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 group-hover:text-emerald-500 transition-colors">Payload Magnitude</div>
                            <div className="flex items-baseline gap-2 font-mono">
                                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{input.length.toLocaleString()}</span>
                                <span className="text-[10px] text-slate-300 font-black uppercase">Bytes</span>
                            </div>
                        </div>
                        <div className="p-8 bg-slate-50 dark:bg-slate-950/50 rounded-[2rem] border border-transparent hover:border-emerald-500/20 transition-all group/stat">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 group-hover:text-emerald-500 transition-colors">Engine Integrity</div>
                            <div className={`text-2xl font-black uppercase tracking-widest ${error ? 'text-red-500' : input ? 'text-emerald-500' : 'text-slate-300'}`}>
                                {error ? 'Fault' : input ? 'Active' : 'Standby'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-10 text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    UTF-8 Compliant Node
                </div>
                <div>RFC 4648 Specification</div>
            </div>
        </div>
    );
}
