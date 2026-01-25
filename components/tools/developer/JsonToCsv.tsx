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
        <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
                        <span className="flex items-center gap-2"><FileJson className="w-4 h-4" /> JSON Input</span>
                    </div>
                    <textarea
                        value={json}
                        onChange={(e) => setJson(e.target.value)}
                        placeholder='[{"id": 1, "name": "John"}, {"id": 2, "name": "Jane"}]'
                        className="w-full h-80 p-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500/50 transition-all font-mono text-sm resize-none shadow-sm"
                    />
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-widest pl-2">
                        <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> CSV Output</span>
                    </div>
                    <textarea
                        value={csv}
                        readOnly
                        placeholder='CSV result will appear here...'
                        className="w-full h-80 p-6 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl outline-none font-mono text-sm resize-none shadow-inner text-slate-600 dark:text-slate-400"
                    />
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
                <button
                    onClick={convert}
                    className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 uppercase tracking-widest text-xs"
                >
                    <ArrowRightLeft className="w-4 h-4" /> Convert to CSV
                </button>
                <button
                    onClick={copyToClipboard}
                    disabled={!csv}
                    className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-black rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 uppercase tracking-widest text-xs disabled:opacity-30"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copy Result
                </button>
                <button
                    onClick={downloadCsv}
                    disabled={!csv}
                    className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-black rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 uppercase tracking-widest text-xs disabled:opacity-30"
                >
                    <Download className="w-4 h-4" /> Download .csv
                </button>
                <button
                    onClick={() => { setJson(''); setCsv(''); setError(''); }}
                    className="p-3 text-slate-400 hover:text-red-500 transition-colors"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            {error && (
                <div className="max-w-md mx-auto p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm font-bold text-center">
                    {error}
                </div>
            )}
        </div>
    );
}
