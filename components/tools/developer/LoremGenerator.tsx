'use client';

import { useState, useEffect } from 'react';
import { LoremIpsum } from 'lorem-ipsum';
import { Copy, Check, RefreshCw, Settings2 } from 'lucide-react';

type Unit = 'paragraphs' | 'sentences' | 'words';

export function LoremGenerator() {
    const [count, setCount] = useState(3);
    const [unit, setUnit] = useState<Unit>('paragraphs');
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);

    const lorem = new LoremIpsum({
        sentencesPerParagraph: {
            max: 8,
            min: 4
        },
        wordsPerSentence: {
            max: 16,
            min: 4
        }
    });

    const generateText = () => {
        let generated = '';
        switch (unit) {
            case 'paragraphs':
                generated = lorem.generateParagraphs(count);
                break;
            case 'sentences':
                generated = lorem.generateSentences(count);
                break;
            case 'words':
                generated = lorem.generateWords(count);
                break;
        }
        setText(generated);
    };

    // Generate initial text
    useEffect(() => {
        generateText();
    }, [count, unit]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-6 md:p-8">
                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="space-y-4">
                        <label className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                            <Settings2 className="w-4 h-4 mr-2" />
                            Configuration
                        </label>
                        <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">Count</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={count}
                                    onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div className="flex-[2]">
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">Unit</label>
                                <select
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value as Unit)}
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                >
                                    <option value="paragraphs">Paragraphs</option>
                                    <option value="sentences">Sentences</option>
                                    <option value="words">Words</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={generateText}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Regenerate
                            </button>
                            <button
                                onClick={copyToClipboard}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-lg font-medium transition-colors"
                            >
                                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    {/* Output */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">
                            Generated Text
                        </label>
                        <div className="relative">
                            <textarea
                                value={text}
                                readOnly
                                className="w-full h-80 px-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none text-slate-600 dark:text-slate-300 font-mono text-sm leading-relaxed"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
