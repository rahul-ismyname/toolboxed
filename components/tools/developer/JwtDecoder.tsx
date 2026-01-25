'use client';

import { useState, useEffect } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { AlertCircle, CheckCircle2, Clock, Key, Shield, User } from 'lucide-react';

export function JwtDecoder() {
    const [token, setToken] = useState('');
    const [header, setHeader] = useState<any>(null);
    const [payload, setPayload] = useState<any>(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'payload' | 'header'>('payload');

    useEffect(() => {
        if (!token.trim()) {
            setHeader(null);
            setPayload(null);
            setError('');
            return;
        }

        try {
            // Manual decoding to get header as jwt-decode main function returns payload
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format (must have 3 parts)');
            }

            const decodePart = (part: string) => JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/')));

            const decodedHeader = decodePart(parts[0]);
            const decodedPayload = decodePart(parts[1]);

            setHeader(decodedHeader);
            setPayload(decodedPayload);
            setError('');
        } catch (err) {
            setError('Invalid JWT Token');
            setHeader(null);
            setPayload(null);
        }
    }, [token]);

    const formatTime = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    const isExpired = payload?.exp ? (Date.now() / 1000) > payload.exp : false;

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Column */}
                <div className="space-y-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 h-full flex flex-col">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex justify-between items-center">
                            <span>Encoded Token</span>
                            {token && (
                                <span className={`flex items-center gap-1.5 ${error ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {error ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                    {error ? 'Invalid' : 'Valid Format'}
                                </span>
                            )}
                        </label>
                        <textarea
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="Paste your JWT here (eyJhbGciOi...)"
                            className={`w-full flex-1 min-h-[300px] bg-slate-50 dark:bg-slate-950/50 border-2 rounded-2xl p-6 font-mono text-sm leading-relaxed resize-none outline-none transition-all ${error ? 'border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 focus:border-red-500' : 'border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 focus:border-emerald-500'}`}
                        />
                        <div className="mt-4 text-xs text-slate-400 text-center">
                            Tokens are decoded locally in your browser. No data leaves your device.
                        </div>
                    </div>
                </div>

                {/* Output Column */}
                <div className="space-y-4">
                    {payload ? (
                        <div className="space-y-6">
                            {/* Status Card */}
                            <div className={`rounded-2xl p-4 border flex items-center gap-4 ${isExpired ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30' : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isExpired ? 'bg-red-100 dark:bg-red-900/50 text-red-500' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-500'}`}>
                                    {isExpired ? <Clock className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h3 className={`font-bold ${isExpired ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
                                        {isExpired ? 'Token Expired' : 'Token Active'}
                                    </h3>
                                    {payload.exp && (
                                        <p className={`text-xs ${isExpired ? 'text-red-600/80 dark:text-red-400/80' : 'text-emerald-600/80 dark:text-emerald-400/80'}`}>
                                            Expires: {formatTime(payload.exp)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                <div className="flex border-b border-slate-100 dark:border-slate-800">
                                    <button
                                        onClick={() => setActiveTab('payload')}
                                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'payload' ? 'text-emerald-500 bg-slate-50 dark:bg-slate-800/50' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                    >
                                        Payload (Data)
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('header')}
                                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'header' ? 'text-emerald-500 bg-slate-50 dark:bg-slate-800/50' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                    >
                                        Header (Algorithm)
                                    </button>
                                </div>
                                <div className="p-0">
                                    <pre className="p-6 overflow-x-auto text-sm font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900">
                                        {JSON.stringify(activeTab === 'payload' ? payload : header, null, 2)}
                                    </pre>
                                </div>
                            </div>

                            {/* Standard Claims */}
                            <div className="grid grid-cols-2 gap-4">
                                {payload.sub && (
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2 mb-1 text-slate-400">
                                            <User className="w-3 h-3" />
                                            <span className="text-[10px] uppercase font-bold tracking-wider">Subject (sub)</span>
                                        </div>
                                        <div className="font-mono text-sm truncate" title={payload.sub}>{payload.sub}</div>
                                    </div>
                                )}
                                {payload.iss && (
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2 mb-1 text-slate-400">
                                            <Shield className="w-3 h-3" />
                                            <span className="text-[10px] uppercase font-bold tracking-wider">Issuer (iss)</span>
                                        </div>
                                        <div className="font-mono text-sm truncate" title={payload.iss}>{payload.iss}</div>
                                    </div>
                                )}
                            </div>

                        </div>
                    ) : (
                        <div className="h-full min-h-[300px] flex items-center justify-center bg-slate-50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-center p-8">
                            <div className="max-w-xs space-y-2">
                                <Key className="w-8 h-8 mx-auto opacity-50 mb-4" />
                                <h3 className="font-bold text-slate-500 dark:text-slate-400">Waiting for Token</h3>
                                <p className="text-sm opacity-60">Paste a JSON Web Token on the left to inspect its contents.</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
