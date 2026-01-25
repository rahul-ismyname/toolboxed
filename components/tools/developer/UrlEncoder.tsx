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
        <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center space-x-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                        <Link className="w-4 h-4" />
                        <span>URL Encoder / Decoder</span>
                    </div>
                    <button
                        onClick={clearAll}
                        className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center px-2 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                        Clear All
                    </button>
                </div>

                <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative">
                        {/* Center Icon (Desktop) */}
                        <div className="hidden lg:flex absolute left-1/2 top-32 -translate-x-1/2 z-10 pointer-events-none">
                            <div className="bg-white dark:bg-slate-900 p-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm text-slate-400">
                                <ArrowRightLeft className="w-5 h-5" />
                            </div>
                        </div>

                        {/* Decoded Input */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Decoded URL
                                </label>
                                <button
                                    onClick={() => copyToClipboard(decoded, false)}
                                    className="text-xs flex items-center text-slate-500 hover:text-emerald-500 transition-colors"
                                >
                                    {copiedDecoded ? <Check className="w-3 H-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                                    {copiedDecoded ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                            <textarea
                                value={decoded}
                                onChange={(e) => handleDecodedChange(e.target.value)}
                                placeholder="https://example.com/search?q=hello world"
                                className="w-full h-80 px-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none text-slate-900 dark:text-white placeholder:text-slate-400 font-mono text-sm leading-relaxed"
                            />
                        </div>

                        {/* Encoded Input */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Encoded URL
                                </label>
                                <button
                                    onClick={() => copyToClipboard(encoded, true)}
                                    className="text-xs flex items-center text-slate-500 hover:text-emerald-500 transition-colors"
                                >
                                    {copiedEncoded ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                                    {copiedEncoded ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                            <div className="relative">
                                <textarea
                                    value={encoded}
                                    onChange={(e) => handleEncodedChange(e.target.value)}
                                    placeholder="https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world"
                                    className={`w-full h-80 px-4 py-4 bg-slate-50 dark:bg-slate-950 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none text-slate-900 dark:text-white placeholder:text-slate-400 font-mono text-sm leading-relaxed ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 dark:border-slate-800'}`}
                                />
                                {error && (
                                    <div className="absolute bottom-4 right-4 text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-950/50 px-2 py-1 rounded">
                                        {error}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Query Parameters Section */}
            {queryParams.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                            <Search className="w-4 h-4" />
                            <span>Query Parameters</span>
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-500">
                                {queryParams.length}
                            </span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Key</th>
                                    <th className="px-6 py-3 font-medium">Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {queryParams.map((param, index) => (
                                    <tr key={index} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                            {param.key}
                                        </td>
                                        <td className="px-6 py-3 font-mono text-slate-900 dark:text-slate-200 break-all">
                                            {param.value}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
