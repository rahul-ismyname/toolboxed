'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Image, Copy, Check, ExternalLink, Settings2, Share2 } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function PlaceholderGenerator() {
    const [width, setWidth] = useState<number>(600);
    const [height, setHeight] = useState<number>(400);
    const [text, setText] = useState<string>('');
    const [bgColor, setBgColor] = useState<string>('#cccccc');
    const [textColor, setTextColor] = useState<string>('#000000');
    const [format, setFormat] = useState<string>('png');
    const [copied, setCopied] = useState(false);
    const [shareCopied, setShareCopied] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Initialize from URL
    useEffect(() => {
        const urlConfig = searchParams.get('config');
        if (urlConfig) {
            try {
                const decoded = JSON.parse(atob(decodeURIComponent(urlConfig)));
                if (decoded.width) setWidth(decoded.width);
                if (decoded.height) setHeight(decoded.height);
                if (decoded.text !== undefined) setText(decoded.text);
                if (decoded.bgColor) setBgColor(decoded.bgColor);
                if (decoded.textColor) setTextColor(decoded.textColor);
                if (decoded.format) setFormat(decoded.format);
            } catch (e) {
                console.error('Failed to decode config', e);
            }
        }
    }, []); // Run once on mount

    const handleShare = useCallback(() => {
        const config = { width, height, text, bgColor, textColor, format };
        const encoded = encodeURIComponent(btoa(JSON.stringify(config)));
        const url = `${window.location.origin}${pathname}?config=${encoded}`;

        navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);

        // Update URL without refresh
        router.replace(`${pathname}?config=${encoded}`, { scroll: false });
    }, [width, height, text, bgColor, textColor, format, pathname, router]);

    const placeholderUrl = useMemo(() => {
        const bg = bgColor.replace('#', '');
        const textC = textColor.replace('#', '');
        const customText = text ? `&text=${encodeURIComponent(text)}` : '';
        return `https://placehold.co/${width}x${height}/${bg}/${textC}.${format}${customText}`;
    }, [width, height, text, bgColor, textColor, format]);

    const copyToClipboard = (content: string) => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-8 md:p-12 grid lg:grid-cols-2 gap-12">
                {/* Configuration */}
                <div className="space-y-8">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Settings2 className="w-5 h-5 text-emerald-500" />
                        Image Settings
                    </h3>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Width (px)</label>
                            <input
                                type="number"
                                value={width}
                                onChange={(e) => setWidth(Number(e.target.value))}
                                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Height (px)</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(Number(e.target.value))}
                                className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Custom Text (Optional)</label>
                        <input
                            type="text"
                            value={text}
                            placeholder={`${width}x${height}`}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Background</label>
                            <div className="flex gap-3 items-center">
                                <input
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="w-12 h-12 rounded-xl border-0 cursor-pointer p-0 bg-transparent"
                                />
                                <input
                                    type="text"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="flex-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 transition-all font-mono text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Text Color</label>
                            <div className="flex gap-3 items-center">
                                <input
                                    type="color"
                                    value={textColor}
                                    onChange={(e) => setTextColor(e.target.value)}
                                    className="w-12 h-12 rounded-xl border-0 cursor-pointer p-0 bg-transparent"
                                />
                                <input
                                    type="text"
                                    value={textColor}
                                    onChange={(e) => setTextColor(e.target.value)}
                                    className="flex-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 transition-all font-mono text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Format</label>
                        <div className="flex gap-2">
                            {['png', 'jpg', 'webp', 'svg'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFormat(f)}
                                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold border-2 transition-all ${format === f
                                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                                        : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                                        }`}
                                >
                                    {f.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Image className="w-5 h-5 text-emerald-500" />
                        Preview
                    </h3>
                    <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-4 min-h-[300px] overflow-hidden">
                        <img
                            src={placeholderUrl}
                            alt="Placeholder Preview"
                            className="max-w-full max-h-full rounded-lg shadow-lg transition-all duration-300"
                        />
                    </div>
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between gap-4">
                        <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400 truncate flex-1">
                            {placeholderUrl}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => copyToClipboard(placeholderUrl)}
                                className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={handleShare}
                                className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                            >
                                {shareCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                            </button>
                            <a
                                href={placeholderUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Code Samples */}
            <div className="p-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                            <span>HTML Tag</span>
                            <button onClick={() => copyToClipboard(`<img src="${placeholderUrl}" alt="Placeholder" />`)} className="text-emerald-500 hover:underline">Copy</button>
                        </div>
                        <pre className="p-4 bg-white dark:bg-slate-900 rounded-xl font-mono text-xs border border-slate-200 dark:border-slate-800 text-slate-500 overflow-x-auto">
                            {`<img src="${placeholderUrl}" \nalt="Placeholder" />`}
                        </pre>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                            <span>Markdown</span>
                            <button onClick={() => copyToClipboard(`![Placeholder](${placeholderUrl})`)} className="text-emerald-500 hover:underline">Copy</button>
                        </div>
                        <pre className="p-4 bg-white dark:bg-slate-900 rounded-xl font-mono text-xs border border-slate-200 dark:border-slate-800 text-slate-500 overflow-x-auto">
                            {`![Placeholder](${placeholderUrl})`}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
