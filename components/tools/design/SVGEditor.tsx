'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Download,
    Copy,
    Check,
    Maximize2,
    Minimize2,
    Palette,
    MousePointer2,
    Code2,
    Settings2,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_SVG = `<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" rx="40" fill="#10B981" fill-opacity="0.1"/>
  <circle cx="100" cy="100" r="50" stroke="#10B981" stroke-width="8"/>
  <path d="M70 100L90 120L130 80" stroke="#10B981" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export function SVGEditor() {
    const [code, setCode] = useState(DEFAULT_SVG);
    const [previewCode, setPreviewCode] = useState(DEFAULT_SVG);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [fillColor, setFillColor] = useState('#10B981');
    const [strokeColor, setStrokeColor] = useState('#10B981');
    const [scale, setScale] = useState(1);
    const [viewMode, setViewMode] = useState<'both' | 'code' | 'preview'>('both');
    const [mobileTab, setMobileTab] = useState<'code' | 'preview'>('preview');

    // Handle initial view mode and resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setViewMode('preview'); // Default to preview on mobile
            } else {
                setViewMode('both');
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Sync preview with code, but with basic validation
    useEffect(() => {
        try {
            // Very basic SVG validation
            if (code.trim().startsWith('<svg') && code.trim().endsWith('</svg>')) {
                setPreviewCode(code);
                setError(null);
            } else {
                setError('Invalid SVG structure. Must start with <svg and end with </svg>');
            }
        } catch (e) {
            setError('Error parsing SVG code.');
        }
    }, [code]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([code], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'edited-graphic.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const applyVisualChanges = () => {
        // This is a simple regex-based replacement for demonstration.
        // A more robust solution would use DOMParser.
        let updatedCode = code;

        // Update all stroke-width attributes
        updatedCode = updatedCode.replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`);

        // Update all fill attributes that aren't 'none'
        updatedCode = updatedCode.replace(/fill="(?!none)[^"]*"/g, `fill="${fillColor}"`);

        // Update all stroke attributes that aren't 'none'
        updatedCode = updatedCode.replace(/stroke="(?!none)[^"]*"/g, `stroke="${strokeColor}"`);

        setCode(updatedCode);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[650px]">

            {/* Mobile Tab Switcher */}
            <div className="md:hidden flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
                <button
                    onClick={() => setMobileTab('preview')}
                    className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${mobileTab === 'preview' ? 'border-emerald-500 text-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5' : 'border-transparent text-slate-500'}`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <MousePointer2 className="w-3.5 h-3.5" />
                        Preview
                    </div>
                </button>
                <button
                    onClick={() => setMobileTab('code')}
                    className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${mobileTab === 'code' ? 'border-emerald-500 text-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5' : 'border-transparent text-slate-500'}`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <Code2 className="w-3.5 h-3.5" />
                        Code
                    </div>
                </button>
            </div>

            {/* Left Panel: Code & Controls */}
            <div className={`${mobileTab === 'code' ? 'flex' : 'hidden'} md:flex w-full md:w-1/2 border-r border-slate-200 dark:border-slate-800 flex-col min-h-[400px] md:min-h-0`}>
                <div className="hidden md:flex p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">SVG Source</span>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-emerald-500"
                        title="Copy Code"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>

                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="flex-grow p-4 md:p-6 font-mono text-sm bg-transparent outline-none resize-none text-slate-600 dark:text-slate-400 leading-relaxed custom-scrollbar min-h-[300px]"
                    placeholder="Paste your SVG code here..."
                    spellCheck={false}
                />

                <div className="p-4 md:hidden border-t border-slate-200 dark:border-slate-800 flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied' : 'Copy Code'}
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-500/10 border-t border-red-100 dark:border-red-900/30 flex items-center gap-2 text-red-600 dark:text-red-400 text-xs font-medium">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}
            </div>

            {/* Right Panel: Preview & Visual Ops */}
            <div className={`${mobileTab === 'preview' ? 'flex' : 'hidden'} md:flex w-full md:w-1/2 flex-col bg-slate-50/30 dark:bg-slate-950/30 min-h-[400px] md:min-h-0`}>
                <div className="hidden md:flex p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 justify-between items-center">
                    <div className="flex items-center gap-2">
                        <MousePointer2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Visual Workspace</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-emerald-500/20"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Preview Canvas */}
                <div className="flex-grow relative overflow-hidden flex items-center justify-center p-6 md:p-8 bg-grid-slate-100 dark:bg-grid-slate-800/20 min-h-[300px]">
                    <div
                        className="relative transition-transform duration-300 ease-out"
                        style={{ transform: `scale(${scale})` }}
                        dangerouslySetInnerHTML={{ __html: previewCode }}
                    />
                </div>

                {/* Properties Toolbar */}
                <div className="p-4 md:p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="flex md:hidden items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Properties</span>
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-bold rounded-lg"
                        >
                            <Download className="w-3 h-3" />
                            Export
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {/* Fill & Stroke Colors */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between md:block">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest md:mb-2">Primary Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={fillColor}
                                        onChange={(e) => setFillColor(e.target.value)}
                                        className="w-8 h-8 rounded-lg overflow-hidden cursor-pointer border-none bg-transparent"
                                    />
                                    <span className="hidden md:inline text-xs font-mono text-slate-500 uppercase">{fillColor}</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 flex justify-between">
                                    Stroke Width
                                    <span className="text-emerald-500">{strokeWidth}px</span>
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    value={strokeWidth}
                                    onChange={(e) => setStrokeWidth(Number(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                            </div>
                        </div>

                        {/* Scale & Actions */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 flex justify-between">
                                    Scale
                                    <span className="text-emerald-500">{(scale * 100).toFixed(0)}%</span>
                                </label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2.5"
                                    step="0.1"
                                    value={scale}
                                    onChange={(e) => setScale(Number(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                            </div>
                            <button
                                onClick={applyVisualChanges}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all border border-slate-800/50 shadow-lg shadow-slate-900/10"
                            >
                                <Settings2 className="w-4 h-4" />
                                Sync Visual Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
