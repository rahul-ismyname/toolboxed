'use client';

import { useState } from 'react';
import { FileJson, FileText, Copy, Check, Download, Trash2, ArrowRightLeft } from 'lucide-react';

export function JsonToCsv() {
    const [json, setJson] = useState('');
    const [csv, setCsv] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const convert = () => {
        try {
            setError('');
            const data = JSON.parse(json);

            if (!Array.isArray(data)) {
                setError('Input must be an array of objects.');
                return;
            }

            if (data.length === 0) {
                setCsv('');
                return;
            }

            const headers = Object.keys(data[0]);
            const rows = data.map(obj =>
                headers.map(header => {
                    const val = obj[header];
                    return typeof val === 'object' ? JSON.stringify(val) : val;
                }).join(',')
            );

            setCsv([headers.join(','), ...rows].join('\n'));
        } catch (e) {
            setError('Invalid JSON format.');
        }
    };

    const downloadCsv = () => {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted.csv';
        a.click();
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(csv);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 sm:p-12 lg:p-16">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-20">
                        {/* Input Phase */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20">
                                        <FileJson className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Source Object (JSON)</h3>
                                </div>
                                <button
                                    onClick={() => { setJson(''); setCsv(''); setError(''); }}
                                    className="p-3 bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-100 rounded-xl transition-all active:scale-90"
                                    title="Purge Stream"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-5 transition duration-1000"></div>
                                <textarea
                                    value={json}
                                    onChange={(e) => setJson(e.target.value)}
                                    placeholder='[{"id": 1, "name": "Antigravity"}, {"id": 2, "name": "Protocol"}]'
                                    className="relative w-full h-[400px] p-10 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-indigo-500/20 rounded-[2.5rem] text-slate-900 dark:text-white font-mono text-sm leading-relaxed outline-none shadow-inner resize-none scrollbar-hide"
                                />
                            </div>
                        </div>

                        {/* Output Phase */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Manifest Output (CSV)</h3>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={downloadCsv}
                                        disabled={!csv}
                                        className="p-3 bg-white dark:bg-slate-800 text-slate-400 hover:text-emerald-500 rounded-xl shadow-lg border border-slate-50 dark:border-slate-800 transition-all active:scale-90 disabled:opacity-0"
                                        title="Export Manifest"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={copyToClipboard}
                                        disabled={!csv}
                                        className="p-3 bg-white dark:bg-slate-800 text-slate-400 hover:text-emerald-500 rounded-xl shadow-lg border border-slate-50 dark:border-slate-800 transition-all active:scale-90 disabled:opacity-0"
                                        title="Sync Buffer"
                                    >
                                        {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2.5rem] blur opacity-0 group-hover:opacity-5 transition duration-1000"></div>
                                <textarea
                                    value={csv}
                                    readOnly
                                    placeholder='Manifest will materialize here...'
                                    className="relative w-full h-[400px] p-10 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-transparent rounded-[2.5rem] text-slate-600 dark:text-slate-400 font-mono text-xs leading-relaxed outline-none shadow-inner resize-none scrollbar-hide"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Nexus */}
                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 pt-12 border-t border-slate-50 dark:border-slate-800/50">
                        <button
                            onClick={convert}
                            className="w-full sm:w-auto px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4"
                        >
                            <ArrowRightLeft className="w-5 h-5 animate-pulse" />
                            Synthesize CSV
                        </button>
                    </div>

                    {error && (
                        <div className="mt-8 p-6 bg-red-50/90 dark:bg-red-950/90 backdrop-blur-md border border-red-100 dark:border-red-900/30 rounded-2xl flex items-start gap-4 animate-in fade-in zoom-in-95 duration-300 max-w-2xl mx-auto">
                            <Trash2 className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="space-y-1 text-center sm:text-left">
                                <div className="text-[10px] font-black uppercase tracking-widest text-red-900 dark:text-red-200">Structural Exception</div>
                                <div className="text-xs text-red-600 dark:text-red-400 font-bold leading-relaxed">{error}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                    Structural Transformation Node // JSON {'<>'} CSV
                </p>
            </div>
        </div>
    );
}
