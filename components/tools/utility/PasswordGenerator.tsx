'use client';

import { useState, useEffect, useCallback } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';

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
        <div className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/50">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                    Secure Password Generator
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                    Generate strong, random passwords to keep your accounts safe.
                </p>
            </div>

            <div className="p-8 space-y-8">
                {/* Display Area */}
                <div className="relative">
                    <div className="w-full bg-slate-100 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-slate-800 dark:text-slate-200 font-mono text-xl md:text-2xl break-all">
                        {password || <span className="text-slate-400 text-base">Select options</span>}
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2">
                        <button
                            onClick={generatePassword}
                            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Regenerate"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        <button
                            onClick={copyToClipboard}
                            className="p-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm"
                            title="Copy to Clipboard"
                        >
                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Strength Meter */}
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                        className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${(strength / 5) * 100}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 -mt-6">
                    <span>Strength</span>
                    <span>{getStrengthLabel()}</span>
                </div>

                {/* Controls */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Length Slider */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex justify-between">
                            <span>Password Length</span>
                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-900 dark:text-slate-100">{length}</span>
                        </label>
                        <input
                            type="range"
                            min="8"
                            max="64"
                            value={length}
                            onChange={(e) => setLength(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-900 dark:accent-slate-100"
                        />
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Options</label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={includeUppercase}
                                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                                    className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900"
                                />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">ABC</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={includeLowercase}
                                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                                    className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900"
                                />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">abc</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={includeNumbers}
                                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                                    className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900"
                                />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">123</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={includeSymbols}
                                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                                    className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900"
                                />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">#$@</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
