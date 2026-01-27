'use client';

import { useState, useEffect, useCallback } from 'react';
import { Copy, RefreshCw, Check, Shield, Lock, Unlock, KeyRound } from 'lucide-react';

export function PasswordGenerator() {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [copied, setCopied] = useState(false);
    const [strength, setStrength] = useState(0);

    const generatePassword = useCallback(() => {
        let charset = '';
        if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeNumbers) charset += '0123456789';
        if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

        if (charset === '') {
            setPassword('');
            setStrength(0);
            return;
        }

        let newPassword = '';
        for (let i = 0; i < length; i++) {
            newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        setPassword(newPassword);
        calculateStrength(newPassword);
    }, [length, includeLowercase, includeUppercase, includeNumbers, includeSymbols]);

    const calculateStrength = (pass: string) => {
        let score = 0;
        if (pass.length > 8) score++;
        if (pass.length > 12) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        setStrength(score);
    };

    useEffect(() => {
        generatePassword();
    }, [generatePassword]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getStrengthColor = () => {
        if (strength <= 2) return 'bg-red-500';
        if (strength <= 4) return 'bg-yellow-500';
        return 'bg-emerald-500';
    };

    const getStrengthLabel = () => {
        if (password.length === 0) return '';
        if (strength <= 2) return 'Weak';
        if (strength <= 4) return 'Medium';
        return 'Strong';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
            {/* Security Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-2xl">
                        <Shield className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Entropy Synthesis Node</h2>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Password Architect</p>
                    </div>
                </div>
                <div className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${getStrengthColor().replace('bg-', 'text-').replace('500', '600 dark:text-400')} ${getStrengthColor().replace('bg-', 'bg-').replace('500', '500/10')} ${getStrengthColor().replace('bg-', 'border-').replace('500', '500/20')}`}>
                    {getStrengthLabel() || 'STANDBY'}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 sm:p-12 lg:p-16 space-y-12">
                    {/* Projection Area */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-[2.5rem] blur opacity-5 group-hover:opacity-10 transition duration-1000"></div>
                        <div className="relative w-full bg-slate-50 dark:bg-slate-950 p-10 sm:p-16 rounded-[2.5rem] border-2 border-transparent group-hover:border-emerald-500/10 flex items-center justify-center text-slate-900 dark:text-white font-mono text-2xl sm:text-4xl lg:text-5xl break-all text-center shadow-inner min-h-[180px] px-16 transition-all">
                            {password || <span className="text-slate-200 dark:text-slate-800">VOID_SEQUENCE</span>}
                        </div>
                        <div className="absolute top-6 right-6 flex flex-col gap-3">
                            <button
                                onClick={copyToClipboard}
                                className="p-4 bg-white dark:bg-slate-800 text-emerald-500 rounded-2xl shadow-xl border border-slate-50 dark:border-slate-800 hover:scale-110 active:scale-90 transition-all group/copy"
                            >
                                {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6 group-hover/copy:rotate-12 transition-transform" />}
                            </button>
                            <button
                                onClick={generatePassword}
                                className="p-4 bg-white dark:bg-slate-800 text-slate-400 hover:text-indigo-500 rounded-2xl shadow-xl border border-slate-50 dark:border-slate-800 hover:scale-110 active:scale-90 transition-all group/regen"
                            >
                                <RefreshCw className="w-6 h-6 group-hover/regen:rotate-180 transition-transform duration-700" />
                            </button>
                        </div>
                    </div>

                    {/* Entropy Meter */}
                    <div className="space-y-5 px-2">
                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden flex p-1 border border-slate-50 dark:border-slate-800/50">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ease-out shadow-lg ${getStrengthColor()}`}
                                style={{ width: `${Math.max(8, (strength / 5) * 100)}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                            <span>Complexity Spectrum</span>
                            <span className={getStrengthColor().replace('bg-', 'text-')}>{getStrengthLabel()} ARCHITECTURE</span>
                        </div>
                    </div>

                    {/* Parameter Matrix */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                        <div className="space-y-8">
                            <div className="flex justify-between items-end px-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sequence Magnitude</label>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">{length}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">BITS</span>
                                </div>
                            </div>
                            <div className="relative h-12 flex items-center group">
                                <div className="absolute w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-slate-900 dark:bg-white origin-left"
                                        style={{ width: `${((length - 8) / (64 - 8)) * 100}%` }}
                                    />
                                </div>
                                <input
                                    type="range" min="8" max="64"
                                    value={length} onChange={(e) => setLength(Number(e.target.value))}
                                    className="relative w-full h-12 opacity-0 cursor-pointer z-10"
                                />
                                <div
                                    className="absolute h-8 w-8 bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-white rounded-full shadow-xl pointer-events-none transition-all duration-75 group-hover:scale-125"
                                    style={{ left: `calc(${((length - 8) / (64 - 8)) * 100}% - 16px)` }}
                                />
                            </div>
                            <div className="flex justify-between text-[9px] font-black text-slate-300 uppercase tracking-widest px-1">
                                <span>Min Security</span>
                                <span>Max Entropy</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Protocol Tokens</label>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { state: includeUppercase, setter: setIncludeUppercase, label: 'AZ', desc: 'Uppercase' },
                                    { state: includeLowercase, setter: setIncludeLowercase, label: 'az', desc: 'Lowercase' },
                                    { state: includeNumbers, setter: setIncludeNumbers, label: '09', desc: 'Numbers' },
                                    { state: includeSymbols, setter: setIncludeSymbols, label: '!?', desc: 'Symbols' }
                                ].map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => opt.setter(!opt.state)}
                                        className={`flex items-center gap-4 p-4 rounded-[1.5rem] border transition-all active:scale-95 text-left group ${opt.state
                                            ? 'bg-slate-900 dark:bg-white border-transparent shadow-xl scale-[1.02]'
                                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${opt.state
                                            ? 'bg-white/20 text-white dark:bg-slate-900/10 dark:text-slate-900'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                            {opt.label}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${opt.state
                                                ? 'text-white dark:text-slate-900'
                                                : 'text-slate-500'}`}>{opt.desc}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Protocol Footer */}
            <div className="text-center pb-8 pt-4">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200">
                    Credential Module // AES-256 Grade Entropy
                </p>
            </div>
        </div>
    );
}
