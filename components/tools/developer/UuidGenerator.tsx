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
        <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                {/* Protocol Header */}
                <div className="p-8 sm:p-12 border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-950/30">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-xl">
                                <Fingerprint className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Identity Vector Engine</h2>
                                <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">UUID Generator</p>
                            </div>
                        </div>
                        <button
                            onClick={generateUUIDs}
                            className="w-full sm:w-auto px-8 py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-4"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Execute Generation
                        </button>
                    </div>
                </div>

                <div className="p-8 sm:p-12 space-y-12">
                    {/* Control Matrix */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Protocol Version</label>
                            <div className="relative group">
                                <select
                                    value={version}
                                    onChange={(e) => setVersion(e.target.value as any)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-emerald-500 rounded-2xl p-5 appearance-none outline-none transition-all font-bold text-sm text-slate-700 dark:text-slate-200 shadow-inner"
                                >
                                    <option value="v1">V1 (Timestamp)</option>
                                    <option value="v4">V4 (Randomized)</option>
                                    <option value="v3">V3 (MD5 Hash)</option>
                                    <option value="v5">V5 (SHA-1 Hash)</option>
                                </select>
                                <Settings className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Batch Volume</label>
                                <span className="text-xs font-black text-emerald-500 font-mono bg-emerald-500/10 px-3 py-1 rounded-full">{count}</span>
                            </div>
                            <div className="pt-4 px-1">
                                <input
                                    type="range" min="1" max="50"
                                    value={count} onChange={(e) => setCount(Number(e.target.value))}
                                    className="w-full accent-emerald-500 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer appearance-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Case Format</label>
                            <button
                                onClick={() => setUppercase(!uppercase)}
                                className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all active:scale-95 ${uppercase ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white shadow-xl' : 'bg-slate-50 dark:bg-slate-950 border-transparent shadow-inner'}`}
                            >
                                <span className={`text-[10px] font-black uppercase tracking-widest ${uppercase ? 'text-white dark:text-slate-900' : 'text-slate-400'}`}>Uppercase</span>
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${uppercase ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}>
                                    {uppercase && <Check className="w-4 h-4 text-white" />}
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* V3/V5 Extended Matrix */}
                    {(version === 'v3' || version === 'v5') && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-8 bg-slate-50/50 dark:bg-slate-950/50 rounded-3xl border border-slate-50 dark:border-slate-800/50 animate-in slide-in-from-top-4">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 text-emerald-500">Namespace Vector</label>
                                <input
                                    type="text" value={namespace} onChange={(e) => setNamespace(e.target.value)}
                                    placeholder="Enter UUID namespace..."
                                    className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-emerald-500 rounded-2xl p-4 text-xs font-mono outline-none transition-all shadow-sm"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 text-emerald-500">Identity Name</label>
                                <input
                                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. toolboxed.online"
                                    className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-emerald-500 rounded-2xl p-4 text-xs font-mono outline-none transition-all shadow-sm"
                                />
                            </div>
                        </div>
                    )}

                    {/* Output Terminal */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-[2.5rem] blur opacity-0 group-hover:opacity-5 transition duration-1000"></div>
                        <div className="relative w-full min-h-[300px] max-h-[450px] overflow-hidden bg-slate-50 dark:bg-slate-950/80 border-2 border-transparent rounded-[2.5rem] shadow-inner flex flex-col">
                            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-900/50 flex items-center justify-between bg-white/50 dark:bg-slate-900/50">
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">Generated Sequence</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={copyToClipboard}
                                        className="p-3 bg-white dark:bg-slate-800 text-emerald-500 rounded-xl shadow-lg border border-slate-50 dark:border-slate-800 hover:scale-110 active:scale-90 transition-all group/copy"
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 group-hover/copy:rotate-12 transition-transform" />}
                                    </button>
                                    <button
                                        onClick={() => setUuids([uuidv4()])}
                                        className="p-3 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-xl shadow-lg border border-red-100 dark:border-red-900/30 hover:scale-110 active:scale-90 transition-all flex items-center justify-center"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 font-mono text-slate-600 dark:text-slate-400 text-xs sm:text-sm custom-scrollbar space-y-3">
                                {uuids.map((id, i) => (
                                    <div key={i} className="flex items-center gap-6 group/id p-3 hover:bg-emerald-500/5 rounded-xl transition-colors">
                                        <span className="text-[10px] font-black opacity-30 select-none w-6">{(i + 1).toString().padStart(2, '0')}</span>
                                        <span className="truncate select-all group-hover/id:text-emerald-500 transition-colors tracking-tighter sm:tracking-normal">{id}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Technical Footer */}
            <div className="text-center pb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                    ID Synthesis Protocol // RFC 4122 Compliant
                </p>
            </div>
        </div>
    );
}
