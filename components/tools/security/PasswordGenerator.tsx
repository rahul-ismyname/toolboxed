'use client';

import { useState, useCallback, useEffect } from 'react';
import { ShieldCheck, Copy, Check, RefreshCw, Lock, ArrowRight } from 'lucide-react';

export function PasswordGenerator() {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        upper: true,
        lower: true,
        numbers: true,
        symbols: true,
    });
    const [copied, setCopied] = useState(false);
    const [strength, setStrength] = useState({ label: '', color: '', width: '0%' });

    const generatePassword = useCallback(() => {
        const charSets = {
            upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lower: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
        };

        let characters = '';
        if (options.upper) characters += charSets.upper;
        if (options.lower) characters += charSets.lower;
        if (options.numbers) characters += charSets.numbers;
        if (options.symbols) characters += charSets.symbols;

        if (characters === '') {
            setPassword('');
            return;
        }

        let generated = '';
        for (let i = 0; i < length; i++) {
            generated += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setPassword(generated);
    }, [length, options]);

    useEffect(() => {
        generatePassword();
    }, [generatePassword]);

    useEffect(() => {
        const calculateStrength = () => {
            let score = 0;
            if (password.length > 12) score += 2;
            else if (password.length > 8) score += 1;

            const hasUpper = /[A-Z]/.test(password);
            const hasLower = /[a-z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            const hasSymbol = /[^A-Za-z0-9]/.test(password);

            const variety = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
            score += variety;

            if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
            if (score <= 4) return { label: 'Medium', color: 'bg-orange-500', width: '50%' };
            if (score <= 5) return { label: 'Strong', color: 'bg-emerald-500', width: '75%' };
            return { label: 'Very Strong', color: 'bg-emerald-600', width: '100%' };
        };
        setStrength(calculateStrength());
    }, [password]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-6 md:p-8">
                {/* Result Display */}
                <div className="relative mb-8">
                    <div className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex items-center justify-between group transition-all hover:border-emerald-500/30">
                        <div className="font-mono text-xl md:text-3xl font-bold text-slate-800 dark:text-white break-all tracking-wider">
                            {password || 'Select options...'}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                            <button
                                onClick={generatePassword}
                                className="p-2.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl transition-all hover:rotate-180 duration-500"
                                title="Regenerate"
                            >
                                <RefreshCw className="w-6 h-6" />
                            </button>
                            <button
                                onClick={copyToClipboard}
                                className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white rounded-xl transition-all"
                            >
                                {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Strength Bar */}
                    <div className="absolute -bottom-2 left-6 right-6 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 rounded-full ${strength.color}`}
                            style={{ width: password ? strength.width : '0%' }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4">
                    {/* Settings */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                                    Password Length
                                </label>
                                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-lg font-bold font-mono">
                                    {length}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="8"
                                max="64"
                                value={length}
                                onChange={(e) => setLength(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <div className="flex justify-between text-xs text-slate-400 font-mono mt-2">
                                <span>8</span>
                                <span>32</span>
                                <span>64</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { id: 'upper', label: 'Uppercase', desc: 'A-Z' },
                                { id: 'lower', label: 'Lowercase', desc: 'a-z' },
                                { id: 'numbers', label: 'Numbers', desc: '0-9' },
                                { id: 'symbols', label: 'Symbols', desc: '!@#$' },
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setOptions(prev => ({ ...prev, [opt.id]: !prev[opt.id as keyof typeof options] }))}
                                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all group ${options[opt.id as keyof typeof options]
                                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 text-slate-900 dark:text-white'
                                            : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                                        }`}
                                >
                                    <div className="text-left">
                                        <div className="font-bold text-sm">{opt.label}</div>
                                        <div className="text-xs opacity-60 font-mono">{opt.desc}</div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${options[opt.id as keyof typeof options]
                                            ? 'border-emerald-500 bg-emerald-500 text-white'
                                            : 'border-slate-200 dark:border-slate-700'
                                        }`}>
                                        {options[opt.id as keyof typeof options] && <Check className="w-3.5 h-3.5" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Security Info */}
                    <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800/50 flex flex-col justify-center">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white font-bold mb-4">
                            <ShieldCheck className="w-6 h-6 text-emerald-500" />
                            Password Strength: {password ? strength.label : 'N/A'}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed space-y-2">
                            {password ? (
                                strength.label === 'Weak' ? "Try increasing the length or adding more character types to make it more secure." :
                                    strength.label === 'Medium' ? "This is okay for some accounts, but longer is always better." :
                                        "This is an excellent, secure password. Keep it in a safe place!"
                            ) : "Choose at least one character type above."}
                        </p>

                        <div className="mt-8 space-y-3">
                            <div className="flex items-center text-xs text-slate-400 font-medium uppercase tracking-wider">
                                <Lock className="w-3 h-3 mr-2" /> Security Tips
                            </div>
                            <div className="grid gap-2">
                                {[
                                    "Use at least 12-16 characters",
                                    "Mix different character types",
                                    "Avoid using common words",
                                    "Use a unique password for every site"
                                ].map((tip, i) => (
                                    <div key={i} className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                        <ArrowRight className="w-3 h-3 mr-2 text-emerald-500" />
                                        {tip}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
