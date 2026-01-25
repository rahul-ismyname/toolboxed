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
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-8 py-10 space-y-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl">
                            <Binary className="w-8 h-8 text-emerald-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Base Converter</h2>
                            <p className="text-sm text-slate-500 font-medium">BigInt support for massive numbers</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Decimal Card */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 group hover:border-emerald-500/30 transition-all">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Decimal (Base 10)</span>
                                <button onClick={() => handleCopy('decimal')} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all">
                                    {copied === 'decimal' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                                </button>
                            </div>
                            <input
                                type="text"
                                value={values.decimal}
                                onChange={(e) => updateFromDecimal(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="Enter decimal number..."
                                className="w-full bg-transparent text-3xl font-mono font-bold text-slate-900 dark:text-white outline-none placeholder:opacity-20"
                            />
                        </div>

                        {/* Hex Card */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 group hover:border-emerald-500/30 transition-all">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-purple-500">Hexadecimal (Base 16)</span>
                                <button onClick={() => handleCopy('hex')} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all">
                                    {copied === 'hex' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-black text-slate-300 dark:text-slate-700">0x</span>
                                <input
                                    type="text"
                                    value={values.hex}
                                    onChange={(e) => updateFromHex(e.target.value.replace(/[^0-9A-Fa-f]/g, ''))}
                                    placeholder="FF"
                                    className="w-full bg-transparent text-3xl font-mono font-bold text-slate-900 dark:text-white outline-none placeholder:opacity-20"
                                />
                            </div>
                        </div>

                        {/* Binary Card */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 md:col-span-2 group hover:border-emerald-500/30 transition-all">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Binary (Base 2)</span>
                                <button onClick={() => handleCopy('binary')} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all">
                                    {copied === 'binary' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                                </button>
                            </div>
                            <textarea
                                value={values.binary}
                                onChange={(e) => updateFromBinary(e.target.value.replace(/[^0-1]/g, ''))}
                                placeholder="1010..."
                                className="w-full h-24 bg-transparent text-2xl font-mono font-bold text-slate-900 dark:text-white outline-none placeholder:opacity-20 resize-none break-all"
                            />
                        </div>

                        {/* Octal Card */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 group hover:border-emerald-500/30 transition-all">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Octal (Base 8)</span>
                                <button onClick={() => handleCopy('octal')} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all">
                                    {copied === 'octal' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                                </button>
                            </div>
                            <input
                                type="text"
                                value={values.octal}
                                onChange={(e) => updateFromOctal(e.target.value.replace(/[^0-7]/g, ''))}
                                placeholder="377"
                                className="w-full bg-transparent text-3xl font-mono font-bold text-slate-900 dark:text-white outline-none placeholder:opacity-20"
                            />
                        </div>

                        <div className="p-6 bg-emerald-500 rounded-3xl flex flex-col justify-center gap-2 shadow-xl shadow-emerald-500/20">
                            <div className="flex items-center gap-3 text-white">
                                <Calculator className="w-6 h-6" />
                                <span className="text-sm font-black uppercase tracking-widest">Precision Tools</span>
                            </div>
                            <p className="text-white/80 text-xs font-medium leading-relaxed">
                                Instantly convert between bases with 64-bit precision and clean code-ready output.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-6 flex justify-center gap-12 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <RefreshCw className="w-4 h-4 text-slate-400 animate-spin-slow" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-time Sync</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Hash className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">BigInt Support</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
