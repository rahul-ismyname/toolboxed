'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Check, Fingerprint, Settings, Trash2 } from 'lucide-react';
import { v1 as uuidv1, v3 as uuidv3, v4 as uuidv4, v5 as uuidv5 } from 'uuid';

export function UuidGenerator() {
    const [uuids, setUuids] = useState<string[]>([]);
    const [version, setVersion] = useState<'v1' | 'v3' | 'v4' | 'v5'>('v4');
    const [count, setCount] = useState(1);
    const [namespace, setNamespace] = useState('');
    const [name, setName] = useState('');
    const [uppercase, setUppercase] = useState(false);
    const [copied, setCopied] = useState(false);

    // Initial generation
    if (uuids.length === 0) {
        setUuids([uuidv4()]);
    }

    const generateUUIDs = () => {
        const newUuids: string[] = [];
        for (let i = 0; i < count; i++) {
            let id = '';
            try {
                switch (version) {
                    case 'v1':
                        id = uuidv1();
                        break;
                    case 'v3':
                        if (namespace && name) id = uuidv3(name, namespace);
                        else id = 'Requires Namespace (UUID) and Name';
                        break;
                    case 'v4':
                        id = uuidv4();
                        break;
                    case 'v5':
                        if (namespace && name) id = uuidv5(name, namespace);
                        else id = 'Requires Namespace (UUID) and Name';
                        break;
                }
            } catch (e) {
                id = 'Invalid Input';
            }
            if (uppercase) id = id.toUpperCase();
            newUuids.push(id);
        }
        setUuids(newUuids);
        setCopied(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(uuids.join('\n'));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 md:p-8 space-y-6">

                    {/* Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Version</label>
                            <div className="relative">
                                <select
                                    value={version}
                                    onChange={(e) => setVersion(e.target.value as any)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl p-3 appearance-none focus:border-emerald-500 outline-none transition-colors font-semibold"
                                >
                                    <option value="v1">Version 1 (Timestamp)</option>
                                    <option value="v4">Version 4 (Random)</option>
                                    <option value="v3">Version 3 (MD5)</option>
                                    <option value="v5">Version 5 (SHA-1)</option>
                                </select>
                                <Settings className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Quantity: {count}</label>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                value={count}
                                onChange={(e) => setCount(Number(e.target.value))}
                                className="w-full accent-emerald-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer mt-3"
                            />
                        </div>

                        <div className="flex items-end pb-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${uppercase ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600'}`}>
                                    {uppercase && <Check className="w-4 h-4 text-white" />}
                                </div>
                                <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="hidden" />
                                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 group-hover:text-emerald-500 transition-colors">Uppercase</span>
                            </label>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={generateUUIDs}
                                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-5 h-5" /> Generate
                            </button>
                        </div>
                    </div>

                    {/* V3/V5 Inputs */}
                    {(version === 'v3' || version === 'v5') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Namespace UUID</label>
                                <input
                                    type="text"
                                    value={namespace}
                                    onChange={(e) => setNamespace(e.target.value)}
                                    placeholder="e.g. 6ba7b810-9dad-11d1-80b4-00c04fd430c8"
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm font-mono focus:border-emerald-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. example.com"
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Output */}
                    <div className="relative group">
                        <div className="absolute -top-3 left-4 bg-white dark:bg-slate-900 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Generated UUIDs
                        </div>
                        <div className="w-full min-h-[200px] max-h-[400px] overflow-y-auto bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl p-6 font-mono text-slate-600 dark:text-slate-300 leading-relaxed shadow-inner">
                            {uuids.map((id, i) => (
                                <div key={i} className="py-1 border-b border-slate-100 dark:border-slate-800/50 last:border-0 hover:text-emerald-500 transition-colors">
                                    {id}
                                </div>
                            ))}
                        </div>
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                onClick={copyToClipboard}
                                className="p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-800 text-emerald-500 hover:scale-110 transition-all active:scale-95"
                                title="Copy all"
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Info Section */}
            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/30">
                <div className="flex items-start gap-3">
                    <Fingerprint className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mt-1" />
                    <div className="space-y-2">
                        <h3 className="font-bold text-emerald-900 dark:text-emerald-100">About UUID Versions</h3>
                        <ul className="text-sm text-emerald-800 dark:text-emerald-200 space-y-1 list-disc list-inside">
                            <li><span className="font-bold">Version 1 (Timestamp):</span> Generated from the current time and MAC address. Ordered chronologically.</li>
                            <li><span className="font-bold">Version 3 (MD5):</span> Generated from a namespace and name using MD5 hashing. Deterministic.</li>
                            <li><span className="font-bold">Version 4 (Random):</span> Generated using random numbers. Most common for unique IDs.</li>
                            <li><span className="font-bold">Version 5 (SHA-1):</span> Generated from a namespace and name using SHA-1 hashing. Recommended over V3.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
