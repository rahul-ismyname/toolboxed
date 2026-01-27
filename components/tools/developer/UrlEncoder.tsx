'use client';

import { useState, useEffect } from 'react';
import { ArrowRightLeft, Copy, Check, Trash2, Link, Search } from 'lucide-react';

export function UrlEncoder() {
    const [decoded, setDecoded] = useState('');
    const [encoded, setEncoded] = useState('');
    const [lastEdited, setLastEdited] = useState<'decoded' | 'encoded'>('decoded');
    const [error, setError] = useState<string | null>(null);
    const [copiedDecoded, setCopiedDecoded] = useState(false);
    const [copiedEncoded, setCopiedEncoded] = useState(false);
    const [queryParams, setQueryParams] = useState<{ key: string; value: string }[]>([]);

    useEffect(() => {
        setError(null);
        try {
            if (lastEdited === 'decoded') {
                const encodedVal = encodeURIComponent(decoded);
                setEncoded(encodedVal);
                parseParams(decoded);
            } else {
                if (encoded) {
                    const decodedVal = decodeURIComponent(encoded);
                    setDecoded(decodedVal);
                    parseParams(decodedVal);
                } else {
                    setDecoded('');
                    setQueryParams([]);
                }
            }
        } catch (e) {
            setError('Invalid URI format');
        }
    }, [decoded, encoded, lastEdited]);

    const parseParams = (urlStr: string) => {
        try {
            // Try to parse as full URL first
            const url = new URL(urlStr);
            const params = Array.from(url.searchParams.entries()).map(([key, value]) => ({ key, value }));
            setQueryParams(params);
        } catch {
            // If not a full URL, try to find query string manually if it looks like one
            if (urlStr.includes('?')) {
                try {
                    const queryString = urlStr.split('?')[1];
                    const params = Array.from(new URLSearchParams(queryString).entries()).map(([key, value]) => ({ key, value }));
                    setQueryParams(params);
                } catch {
                    setQueryParams([]);
                }
            } else {
                setQueryParams([]);
            }
        }
    };

    const handleDecodedChange = (val: string) => {
        setDecoded(val);
        setLastEdited('decoded');
    };

    const handleEncodedChange = (val: string) => {
        setEncoded(val);
        setLastEdited('encoded');
    };

    const copyToClipboard = (text: string, isEncoded: boolean) => {
        navigator.clipboard.writeText(text);
        if (isEncoded) {
            setCopiedEncoded(true);
            setTimeout(() => setCopiedEncoded(false), 2000);
        } else {
            setCopiedDecoded(true);
            setTimeout(() => setCopiedDecoded(false), 2000);
        }
    };

    const clearAll = () => {
        setDecoded('');
        setEncoded('');
        setQueryParams([]);
        setError(null);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
            {/* Engine Header */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 sm:p-10 border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-950/30 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-xl">
                            <Link className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Navigation Synthesis</h2>
                            <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">URL Engine</p>
                        </div>
                    </div>
                    <button
                        onClick={clearAll}
                        className="w-full sm:w-auto px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Purge Buffer
                    </button>
                </div>

                <div className="p-8 sm:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative">
                        {/* Bridge Icon (Desktop) */}
                        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                            <div className="bg-white dark:bg-slate-900 p-4 rounded-full border border-slate-100 dark:border-slate-800 shadow-2xl text-emerald-500 hover:scale-110 transition-transform">
                                <ArrowRightLeft className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Decoded Vector */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Decoded Sequence</label>
                                <button
                                    onClick={() => copyToClipboard(decoded, false)}
                                    className="p-2 text-slate-400 hover:text-emerald-500 transition-colors bg-slate-50 dark:bg-slate-950 rounded-lg"
                                >
                                    {copiedDecoded ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-[2rem] blur opacity-0 group-focus-within:opacity-5 transition duration-1000"></div>
                                <textarea
                                    value={decoded}
                                    onChange={(e) => handleDecodedChange(e.target.value)}
                                    placeholder="Enter raw URL sequence..."
                                    className="relative w-full h-[250px] sm:h-[350px] p-8 bg-slate-50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] font-mono text-xs sm:text-sm leading-relaxed outline-none transition-all resize-none shadow-inner text-slate-600 dark:text-slate-400 placeholder:text-slate-300 dark:placeholder:text-slate-800"
                                />
                            </div>
                        </div>

                        {/* Encoded Vector */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Encoded Sequence</label>
                                <button
                                    onClick={() => copyToClipboard(encoded, true)}
                                    className="p-2 text-slate-400 hover:text-emerald-500 transition-colors bg-slate-50 dark:bg-slate-950 rounded-lg"
                                >
                                    {copiedEncoded ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-[2rem] blur opacity-0 group-focus-within:opacity-5 transition duration-1000"></div>
                                <textarea
                                    value={encoded}
                                    onChange={(e) => handleEncodedChange(e.target.value)}
                                    placeholder="Enter percentile-encoded sequence..."
                                    className={`relative w-full h-[250px] sm:h-[350px] p-8 bg-slate-50 dark:bg-slate-950/50 border-2 rounded-[2rem] font-mono text-xs sm:text-sm leading-relaxed outline-none transition-all resize-none shadow-inner placeholder:text-slate-300 dark:placeholder:text-slate-800 ${error ? 'border-red-500/20 text-red-600' : 'border-transparent text-slate-600 dark:text-slate-400 focus:border-emerald-500/20'}`}
                                />
                                {error && (
                                    <div className="absolute bottom-6 right-6 px-4 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl animate-in fade-in zoom-in">
                                        {error}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Query manifest Section */}
            {queryParams.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom-8">
                    <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                                <Search className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Parameter Manifest</span>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500">
                            {queryParams.length} KEYS FOUND
                        </span>
                    </div>
                    <div className="p-4 sm:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {queryParams.map((param, index) => (
                                <div key={index} className="flex flex-col p-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl group hover:border-emerald-500/20 transition-all">
                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2 group-hover:text-emerald-500 transition-colors">Key: {param.key}</span>
                                    <span className="font-mono text-xs text-slate-600 dark:text-slate-400 break-all select-all leading-relaxed">{param.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
