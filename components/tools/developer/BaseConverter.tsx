'use client';

import { useState, useEffect } from 'react';
import { Hash, Copy, Check, Binary, ChevronRight, Calculator, RefreshCw } from 'lucide-react';

export function BaseConverter() {
    const [values, setValues] = useState({
        decimal: '',
        hex: '',
        binary: '',
        octal: ''
    });
    const [copied, setCopied] = useState<string | null>(null);

    const updateFromDecimal = (decStr: string) => {
        if (!decStr) {
            setValues({ decimal: '', hex: '', binary: '', octal: '' });
            return;
        }
        const dec = BigInt(decStr);
        setValues({
            decimal: decStr,
            hex: dec.toString(16).toUpperCase(),
            binary: dec.toString(2),
            octal: dec.toString(8)
        });
    };

    const updateFromHex = (hexStr: string) => {
        if (!hexStr) {
            setValues({ decimal: '', hex: '', binary: '', octal: '' });
            return;
        }
        try {
            const dec = BigInt('0x' + hexStr);
            setValues({
                decimal: dec.toString(10),
                hex: hexStr.toUpperCase(),
                binary: dec.toString(2),
                octal: dec.toString(8)
            });
        } catch (e) { }
    };

    const updateFromBinary = (binStr: string) => {
        if (!binStr) {
            setValues({ decimal: '', hex: '', binary: '', octal: '' });
            return;
        }
        try {
            const dec = BigInt('0b' + binStr);
            setValues({
                decimal: dec.toString(10),
                hex: dec.toString(16).toUpperCase(),
                binary: binStr,
                octal: dec.toString(8)
            });
        } catch (e) { }
    };

    const updateFromOctal = (octStr: string) => {
        if (!octStr) {
            setValues({ decimal: '', hex: '', binary: '', octal: '' });
            return;
        }
        try {
            const dec = BigInt('0o' + octStr);
            setValues({
                decimal: dec.toString(10),
                hex: dec.toString(16).toUpperCase(),
                binary: dec.toString(2),
                octal: octStr
            });
        } catch (e) { }
    };

    const handleCopy = (key: keyof typeof values) => {
        if (!values[key]) return;
        navigator.clipboard.writeText(values[key]);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 sm:p-12 lg:p-16">
                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
                        <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl shadow-xl">
                            <Binary className="w-8 h-8" />
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Structural Number Systems</h2>
                            <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Base Converter</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                        {/* Decimal Card */}
                        <div className="p-8 bg-slate-50 dark:bg-slate-950/50 rounded-[2rem] border-2 border-transparent focus-within:border-emerald-500/20 transition-all group shadow-inner">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Decimal (Base 10)</span>
                                <button
                                    onClick={() => handleCopy('decimal')}
                                    className="p-3 bg-white dark:bg-slate-800 text-slate-300 hover:text-emerald-500 rounded-xl shadow-lg border border-slate-50 dark:border-slate-800 transition-all active:scale-90"
                                >
                                    {copied === 'decimal' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <input
                                type="text"
                                value={values.decimal}
                                onChange={(e) => updateFromDecimal(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="0..."
                                className="w-full bg-transparent text-4xl font-mono font-bold text-slate-900 dark:text-white outline-none placeholder:opacity-10"
                            />
                        </div>

                        {/* Hex Card */}
                        <div className="p-8 bg-slate-50 dark:bg-slate-950/50 rounded-[2rem] border-2 border-transparent focus-within:border-purple-500/20 transition-all group shadow-inner">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-purple-500">Hexadecimal (Base 16)</span>
                                <button
                                    onClick={() => handleCopy('hex')}
                                    className="p-3 bg-white dark:bg-slate-800 text-slate-400 hover:text-emerald-500 rounded-xl shadow-lg border border-slate-50 dark:border-slate-800 transition-all active:scale-90"
                                >
                                    {copied === 'hex' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-black text-slate-300 dark:text-slate-700">0x</span>
                                <input
                                    type="text"
                                    value={values.hex}
                                    onChange={(e) => updateFromHex(e.target.value.replace(/[^0-9A-Fa-f]/g, ''))}
                                    placeholder="FF"
                                    className="w-full bg-transparent text-4xl font-mono font-bold text-slate-900 dark:text-white outline-none placeholder:opacity-10"
                                />
                            </div>
                        </div>

                        {/* Binary Card */}
                        <div className="p-8 bg-slate-50 dark:bg-slate-950/50 rounded-[2rem] border-2 border-transparent focus-within:border-blue-500/20 transition-all group shadow-inner sm:col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Binary (Base 2)</span>
                                <button
                                    onClick={() => handleCopy('binary')}
                                    className="p-3 bg-white dark:bg-slate-800 text-slate-400 hover:text-emerald-500 rounded-xl shadow-lg border border-slate-50 dark:border-slate-800 transition-all active:scale-90"
                                >
                                    {copied === 'binary' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <textarea
                                value={values.binary}
                                onChange={(e) => updateFromBinary(e.target.value.replace(/[^0-1]/g, ''))}
                                placeholder="10101010..."
                                className="w-full h-24 bg-transparent text-2xl font-mono font-bold text-slate-900 dark:text-white outline-none placeholder:opacity-10 resize-none break-all scrollbar-hide"
                            />
                        </div>

                        {/* Octal Card */}
                        <div className="p-8 bg-slate-50 dark:bg-slate-950/50 rounded-[2rem] border-2 border-transparent focus-within:border-orange-500/20 transition-all group shadow-inner">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Octal (Base 8)</span>
                                <button
                                    onClick={() => handleCopy('octal')}
                                    className="p-3 bg-white dark:bg-slate-800 text-slate-400 hover:text-emerald-500 rounded-xl shadow-lg border border-slate-50 dark:border-slate-800 transition-all active:scale-90"
                                >
                                    {copied === 'octal' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <input
                                type="text"
                                value={values.octal}
                                onChange={(e) => updateFromOctal(e.target.value.replace(/[^0-7]/g, ''))}
                                placeholder="077"
                                className="w-full bg-transparent text-4xl font-mono font-bold text-slate-900 dark:text-white outline-none placeholder:opacity-10"
                            />
                        </div>

                        <div className="p-8 bg-emerald-500 rounded-[2rem] flex flex-col justify-center gap-3 shadow-2xl shadow-emerald-500/20">
                            <div className="flex items-center gap-4 text-white">
                                <Calculator className="w-6 h-6" />
                                <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">64-bit Evolution</span>
                            </div>
                            <p className="text-white/90 text-[10px] sm:text-xs font-bold leading-relaxed">
                                BigInt-powered conversion engine with real-time bidirectional synchronization.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 px-12 py-8 flex flex-wrap justify-center sm:justify-between items-center gap-8 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <RefreshCw className="w-5 h-5 text-emerald-500 animate-spin-slow" />
                            <div className="absolute inset-0 bg-emerald-500/20 blur-sm rounded-full"></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sync Active</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Hash className="w-5 h-5 text-slate-300" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Precision: Infinity</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
