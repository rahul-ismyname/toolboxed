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
        <div className="max-w-6xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
            {/* Functional Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-2xl">
                        <Shield className="w-8 h-8" />
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Cryptographic Analysis</h2>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">JWT Decoder</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-950 rounded-full border border-slate-100 dark:border-slate-800">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Local Sandbox</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                {/* Vector Entry Column */}
                <div className="flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden group">
                    <div className="p-8 sm:p-10 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/30 dark:bg-slate-950/30">
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bearer Token Vector</span>
                        </div>
                        {token && (
                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black border tracking-widest transition-all ${error ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                                {error ? 'MALFORMED' : 'SYNTAX_OK'}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 p-8 sm:p-10">
                        <div className="relative h-full group/input">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-[2rem] blur opacity-0 group-focus-within/input:opacity-5 transition duration-1000"></div>
                            <textarea
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Paste encrypted JWT sequence here..."
                                className={`relative w-full h-[350px] lg:h-full lg:min-h-[450px] bg-slate-50 dark:bg-slate-950/50 border-2 rounded-[2rem] p-8 font-mono text-sm leading-relaxed resize-none outline-none transition-all shadow-inner placeholder:text-slate-300 dark:placeholder:text-slate-700 ${error ? 'border-red-500/20 text-red-600 focus:border-red-500' : 'border-transparent text-slate-600 dark:text-slate-400 focus:border-emerald-500/30'}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Analysis Column */}
                <div className="space-y-8">
                    {payload ? (
                        <div className="space-y-8 animate-in slide-in-from-right-4">
                            {/* Integrity Card */}
                            <div className={`rounded-[2.5rem] p-8 border-2 flex flex-col sm:flex-row items-center gap-8 shadow-2xl ${isExpired ? 'bg-red-500/5 border-red-500/10' : 'bg-emerald-500/5 border-emerald-500/10'}`}>
                                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl shrink-0 transition-transform hover:scale-110 ${isExpired ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-emerald-500 text-white shadow-emerald-500/20'}`}>
                                    {isExpired ? <Clock className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
                                </div>
                                <div className="space-y-3 text-center sm:text-left">
                                    <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isExpired ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {isExpired ? 'Lifecycle Expired' : 'Lifecycle Active'}
                                    </h3>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                        {isExpired ? 'Invalid Integrity' : 'Validated Claims'}
                                    </p>
                                    {payload.exp && (
                                        <div className="font-mono text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-xl inline-block">
                                            EXP: {payload.exp} // {formatTime(payload.exp)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Manifest Tabs */}
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                                <div className="flex p-3 bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-50 dark:border-slate-800">
                                    <button
                                        onClick={() => setActiveTab('payload')}
                                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'payload' ? 'text-emerald-500 bg-white dark:bg-slate-800 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Payload Schema
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('header')}
                                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'header' ? 'text-emerald-500 bg-white dark:bg-slate-800 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Header Specs
                                    </button>
                                </div>
                                <div className="relative group/json">
                                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none z-10 opacity-50"></div>
                                    <pre className="p-8 sm:p-10 overflow-x-auto text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-400 leading-relaxed custom-scrollbar max-h-[400px]">
                                        {JSON.stringify(activeTab === 'payload' ? payload : header, null, 2)}
                                    </pre>
                                </div>
                            </div>

                            {/* Claims Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {payload.sub && (
                                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-emerald-500/30 transition-all">
                                        <div className="flex items-center gap-4 mb-4 text-slate-300 group-hover:text-emerald-500 transition-colors">
                                            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg"><User className="w-4 h-4" /></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">Subscriber (sub)</span>
                                        </div>
                                        <div className="font-mono text-xs text-slate-500 truncate leading-relaxed select-all" title={payload.sub}>{payload.sub}</div>
                                    </div>
                                )}
                                {payload.iss && (
                                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-emerald-500/30 transition-all">
                                        <div className="flex items-center gap-4 mb-4 text-slate-300 group-hover:text-emerald-500 transition-colors">
                                            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg"><Shield className="w-4 h-4" /></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">Authority (iss)</span>
                                        </div>
                                        <div className="font-mono text-xs text-slate-500 truncate leading-relaxed select-all" title={payload.iss}>{payload.iss}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[450px] flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-950/30 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-900 space-y-8 p-12 group">
                            <div className="w-24 h-24 rounded-[2rem] bg-white dark:bg-slate-900 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform ring-1 ring-slate-100 dark:ring-slate-800">
                                <Key className="w-10 h-10 text-slate-200 group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <div className="text-center space-y-3">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Processor Idle</h3>
                                <p className="text-xs font-medium text-slate-400 max-w-[200px] leading-relaxed mx-auto">
                                    Awaiting encrypted JWT sequence for localized claiming cycle.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Specifications */}
            <div className="text-center pb-8 border-t border-slate-50 dark:border-slate-900 pt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200">
                    Cryptographic Node // RFC 7519 Standards
                </p>
            </div>
        </div>
    );
}
