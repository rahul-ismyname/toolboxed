"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Download, Copy, Check, Settings, Upload, Image as ImageIcon, Palette, RefreshCcw, QrCode, Share2 } from "lucide-react"
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H"

export function QrCodeGenerator() {
    const [text, setText] = useState("")
    const [copied, setCopied] = useState(false)
    const [shareCopied, setShareCopied] = useState(false);

    // Customization State
    const [fgColor, setFgColor] = useState("#000000")
    const [bgColor, setBgColor] = useState("#ffffff")
    const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>("H")
    const [logoUrl, setLogoUrl] = useState<string | null>(null)
    const [logoSize, setLogoSize] = useState(24) // Percentage of QR size approx implies 24px default logic adjustment needed
    const [includeMargin, setIncludeMargin] = useState(true)

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Initialize from URL
    useEffect(() => {
        const urlConfig = searchParams.get('config');
        if (urlConfig) {
            try {
                const decoded = JSON.parse(atob(decodeURIComponent(urlConfig)));
                if (decoded.text !== undefined) setText(decoded.text);
                if (decoded.fgColor) setFgColor(decoded.fgColor);
                if (decoded.bgColor) setBgColor(decoded.bgColor);
                if (decoded.errorLevel) setErrorLevel(decoded.errorLevel);
                if (decoded.logoUrl) setLogoUrl(decoded.logoUrl);
                if (decoded.logoSize) setLogoSize(decoded.logoSize);
                if (decoded.includeMargin !== undefined) setIncludeMargin(decoded.includeMargin);
            } catch (e) {
                console.error('Failed to decode config', e);
            }
        }
    }, []); // Run once on mount

    const handleShare = useCallback(() => {
        const config = { text, fgColor, bgColor, errorLevel, logoUrl, logoSize, includeMargin };
        const encoded = encodeURIComponent(btoa(JSON.stringify(config)));
        const url = `${window.location.origin}${pathname}?config=${encoded}`;

        navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);

        // Update URL without refresh
        router.replace(`${pathname}?config=${encoded}`, { scroll: false });
    }, [text, fgColor, bgColor, errorLevel, logoUrl, logoSize, includeMargin, pathname, router]);

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setLogoUrl(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleDownload = (format: "png" | "jpeg" | "svg") => {
        if (!text) return

        const svg = document.getElementById("qr-code-svg")
        if (!svg) return

        if (format === "svg") {
            const svgData = new XMLSerializer().serializeToString(svg)
            const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.download = "qrcode.svg"
            link.href = url
            link.click()
            return
        }

        // For Raster (PNG/JPEG)
        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const img = new Image()

        img.onload = () => {
            // Scale up for better quality
            const scale = 4
            canvas.width = img.width * scale
            canvas.height = img.height * scale

            if (ctx) {
                ctx.fillStyle = bgColor
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                const mimeType = format === "jpeg" ? "image/jpeg" : "image/png"
                const dataUrl = canvas.toDataURL(mimeType)
                const link = document.createElement("a")
                link.download = `qrcode.${format}`
                link.href = dataUrl
                link.click()
            }
        }

        img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }

    const copyToClipboard = () => {
        if (!text) return
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
            {/* Semantic Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6 text-center sm:text-left">
                    <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-2xl">
                        <QrCode className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Visual Encoding</h2>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">QR Oracle</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Control Matrix */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="p-8 sm:p-12 lg:p-14 space-y-10">
                        {/* Content Vector */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">Manifest Content</label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter text, URL, or secure signature..."
                                className="w-full h-32 px-8 py-6 bg-slate-50/50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-[2rem] outline-none transition-all resize-none text-slate-900 dark:text-white placeholder:text-slate-300 font-mono text-sm leading-relaxed shadow-inner"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {/* Chromatic Matrix */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3 px-2">
                                    <Palette className="w-4 h-4 text-emerald-500" /> Chromatic Palette
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-950/50 p-2 rounded-[1.5rem] border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all cursor-pointer group shadow-sm">
                                            <input
                                                type="color"
                                                value={fgColor}
                                                onChange={(e) => setFgColor(e.target.value)}
                                                className="w-10 h-10 rounded-xl cursor-pointer border-none bg-transparent p-0 overflow-hidden"
                                            />
                                            <span className="text-[10px] font-black font-mono text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white uppercase">{fgColor}</span>
                                        </div>
                                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-300 px-3 italic">Foreground</label>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-950/50 p-2 rounded-[1.5rem] border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all cursor-pointer group shadow-sm">
                                            <input
                                                type="color"
                                                value={bgColor}
                                                onChange={(e) => setBgColor(e.target.value)}
                                                className="w-10 h-10 rounded-xl cursor-pointer border-none bg-transparent p-0 overflow-hidden"
                                            />
                                            <span className="text-[10px] font-black font-mono text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white uppercase">{bgColor}</span>
                                        </div>
                                        <label className="text-[9px] font-bold uppercase tracking-widest text-slate-300 px-3 italic">Background</label>
                                    </div>
                                </div>
                            </div>

                            {/* Integrity Protocol */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3 px-2">
                                    <Settings className="w-4 h-4 text-emerald-500" /> Integrity Protocol
                                </h3>
                                <div className="space-y-3">
                                    <div className="relative group">
                                        <select
                                            value={errorLevel}
                                            onChange={(e) => setErrorLevel(e.target.value as ErrorCorrectionLevel)}
                                            className="w-full bg-slate-50/50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/20 rounded-[1.5rem] px-6 py-4 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none appearance-none cursor-pointer shadow-inner"
                                        >
                                            <option value="L">Low Accuracy (7%)</option>
                                            <option value="M">Medium Accuracy (15%)</option>
                                            <option value="Q">Quartile Accuracy (25%)</option>
                                            <option value="H">High Fidelity (30%)</option>
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-emerald-500 transition-colors">
                                            <RefreshCcw className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                    <label className="flex items-center gap-4 cursor-pointer group px-2">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={includeMargin}
                                                onChange={(e) => setIncludeMargin(e.target.checked)}
                                                className="peer sr-only"
                                            />
                                            <div className="w-10 h-6 bg-slate-100 dark:bg-slate-800 rounded-full peer peer-checked:bg-emerald-500 transition-all shadow-inner" />
                                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4 shadow-sm" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Safety Margin</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Signature Overlay */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3 px-2">
                                <ImageIcon className="w-4 h-4 text-emerald-500" /> Core Signature Overlay
                            </h3>
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="flex-1 w-full">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full flex items-center justify-center gap-4 px-8 py-5 bg-slate-50/30 dark:bg-slate-950/30 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] hover:bg-slate-50 dark:hover:bg-slate-950 hover:border-emerald-500/20 transition-all text-[10px] font-black uppercase tracking-widest text-slate-400 active:scale-[0.98]"
                                    >
                                        {logoUrl ? 'Update Signature' : 'Deploy Overlay Signature'}
                                        <Upload className="w-4 h-4" />
                                    </button>
                                </div>
                                {logoUrl && (
                                    <div className="flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner">
                                        <div className="relative w-14 h-14 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden bg-white flex-shrink-0">
                                            <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                            <button
                                                onClick={() => setLogoUrl(null)}
                                                className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white text-xl font-black"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-center px-1">
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Dimension</span>
                                                <span className="text-[8px] font-black text-emerald-500 font-mono italic">{logoSize}px</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="20"
                                                max="60"
                                                value={logoSize}
                                                onChange={(e) => setLogoSize(Number(e.target.value))}
                                                className="w-24 accent-emerald-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Acquisition Protocol */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <div className="flex-1 flex gap-3">
                                <button
                                    onClick={() => handleDownload('png')}
                                    disabled={!text}
                                    className="flex-1 inline-flex items-center justify-center px-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl shadow-indigo-500/10 hover:scale-[1.02] active:scale-95 group"
                                >
                                    <Download className="w-4 h-4 mr-3 group-hover:animate-bounce" />
                                    Acquire PNG
                                </button>
                                <button
                                    onClick={() => handleDownload('svg')}
                                    disabled={!text}
                                    className="flex-1 inline-flex items-center justify-center px-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95"
                                >
                                    <RefreshCcw className="w-4 h-4 mr-3" />
                                    Acquire SVG
                                </button>
                            </div>
                            <button
                                onClick={copyToClipboard}
                                disabled={!text}
                                title="Sync to Buffer"
                                className="inline-flex items-center justify-center px-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-[1.8rem] transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:text-emerald-500 active:scale-95"
                            >
                                {copied ? <Check className="w-5 h-5 text-emerald-500 animate-in zoom-in" /> : <Copy className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={handleShare}
                                disabled={!text}
                                title="Share Oracle State"
                                className="inline-flex items-center justify-center px-8 py-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-[1.8rem] transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:text-emerald-500 active:scale-95"
                            >
                                {shareCopied ? <Check className="w-5 h-5 text-emerald-500 animate-in zoom-in" /> : <Share2 className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Projection Matrix */}
                <div className="lg:col-span-5 flex flex-col h-full">
                    <div className="sticky top-6 flex flex-col items-center justify-center p-10 sm:p-20 bg-slate-900 dark:bg-slate-950 rounded-[3rem] border border-white/5 relative overflow-hidden group shadow-3xl min-h-[500px] h-full">
                        {/* Immersive Pulse */}
                        <div className="absolute -inset-2 bg-gradient-to-br from-emerald-500/10 via-indigo-500/10 to-emerald-500/10 rounded-[4rem] blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000" />

                        <div className="relative z-10 flex flex-col items-center gap-12">
                            <div className="p-10 bg-white rounded-[2.5rem] shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-transform duration-500 hover:scale-[1.03]" style={{ backgroundColor: bgColor }}>
                                {text ? (
                                    <QRCodeSVG
                                        id="qr-code-svg"
                                        value={text}
                                        size={256}
                                        level={errorLevel}
                                        includeMargin={includeMargin}
                                        fgColor={fgColor}
                                        bgColor={bgColor}
                                        imageSettings={logoUrl ? {
                                            src: logoUrl,
                                            x: undefined,
                                            y: undefined,
                                            height: logoSize,
                                            width: logoSize,
                                            excavate: true,
                                        } : undefined}
                                        className="animate-in fade-in zoom-in-95 duration-700"
                                    />
                                ) : (
                                    <div className="w-64 h-64 flex flex-col items-center justify-center gap-6 text-slate-200">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-slate-100 animate-ping rounded-full opacity-20" />
                                            <RefreshCcw className="w-16 h-16 opacity-30 relative z-10 animate-spin-slow" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Awaiting Signal...</span>
                                    </div>
                                )}
                            </div>

                            <div className="text-center space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
                                    {text ? "Scan Projection Matrix to Test" : "Initialize Manifest to Project"}
                                </p>
                                <div className="flex items-center justify-center gap-4 text-white/5">
                                    <div className="w-12 h-px bg-current" />
                                    <Settings className="w-3 h-3" />
                                    <div className="w-12 h-px bg-current" />
                                </div>
                            </div>
                        </div>

                        {/* Decorative Patterns */}
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03)_0%,transparent_70%)] pointer-events-none" />
                        <div className="absolute bottom-10 left-10 font-mono text-[8px] text-white/5 uppercase tracking-widest vertical-rl opacity-50 select-none">
                            FISCAL_ENCODING_PROTOCOL_X24
                        </div>
                    </div>
                </div>
            </div>

            {/* Reconciliation Protocol */}
            <div className="text-center py-8 opacity-20 border-t border-slate-50 dark:border-slate-800 mt-12">
                <p className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-400">
                    Dimensional QR Translation // SECURE_ORACLE_V2
                </p>
            </div>
        </div>
    );
}
