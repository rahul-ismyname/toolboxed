"use client"

import { useState, useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Download, Copy, Check, Settings, Upload, Image as ImageIcon, Palette, RefreshCcw } from "lucide-react"

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H"

export function QrCodeGenerator() {
    const [text, setText] = useState("")
    const [copied, setCopied] = useState(false)

    // Customization State
    const [fgColor, setFgColor] = useState("#000000")
    const [bgColor, setBgColor] = useState("#ffffff")
    const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>("H")
    const [logoUrl, setLogoUrl] = useState<string | null>(null)
    const [logoSize, setLogoSize] = useState(24) // Percentage of QR size approx implies 24px default logic adjustment needed
    const [includeMargin, setIncludeMargin] = useState(true)

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
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">

                    {/* Controls Section */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Input Content */}
                        <div className="space-y-4">
                            <label htmlFor="content" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Content
                            </label>
                            <textarea
                                id="content"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter text, URL, or contact info..."
                                className="w-full h-28 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Colors */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                    <Palette className="w-4 h-4" /> Colors
                                </h3>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-xs text-slate-500 mb-1 block">Foreground</label>
                                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2">
                                            <input
                                                type="color"
                                                value={fgColor}
                                                onChange={(e) => setFgColor(e.target.value)}
                                                className="w-8 h-8 rounded cursor-pointer border-none bg-transparent p-0"
                                            />
                                            <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{fgColor}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs text-slate-500 mb-1 block">Background</label>
                                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2">
                                            <input
                                                type="color"
                                                value={bgColor}
                                                onChange={(e) => setBgColor(e.target.value)}
                                                className="w-8 h-8 rounded cursor-pointer border-none bg-transparent p-0"
                                            />
                                            <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{bgColor}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Settings */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                    <Settings className="w-4 h-4" /> Settings
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-slate-500 mb-1 block">Error Correction</label>
                                        <select
                                            value={errorLevel}
                                            onChange={(e) => setErrorLevel(e.target.value as ErrorCorrectionLevel)}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 outline-none"
                                        >
                                            <option value="L">Low (7%)</option>
                                            <option value="M">Medium (15%)</option>
                                            <option value="Q">Quartile (25%)</option>
                                            <option value="H">High (30%)</option>
                                        </select>
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={includeMargin}
                                            onChange={(e) => setIncludeMargin(e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                                        />
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Include Margin</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Logo Upload */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" /> Logo Overlay
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-sm text-slate-600 dark:text-slate-400"
                                    >
                                        {logoUrl ? 'Change Logo' : 'Upload Logo'}
                                        <Upload className="w-4 h-4" />
                                    </button>
                                </div>
                                {logoUrl && (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="relative w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-white">
                                            <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                            <button
                                                onClick={() => setLogoUrl(null)}
                                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white"
                                            >
                                                <span className="sr-only">Remove</span>
                                                ×
                                            </button>
                                        </div>
                                        <input
                                            type="range"
                                            min="20"
                                            max="60"
                                            value={logoSize}
                                            onChange={(e) => setLogoSize(Number(e.target.value))}
                                            className="w-20 accent-emerald-500"
                                            title="Logo Size"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4">
                            <div className="flex-1 flex gap-2">
                                <button
                                    onClick={() => handleDownload('png')}
                                    disabled={!text}
                                    className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    PNG
                                </button>
                                <button
                                    onClick={() => handleDownload('svg')}
                                    disabled={!text}
                                    className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    SVG
                                </button>
                            </div>
                            <button
                                onClick={copyToClipboard}
                                disabled={!text}
                                className="flex-initial inline-flex items-center justify-center px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="lg:col-span-5 flex flex-col">
                        <div className="sticky top-6 flex flex-col items-center justify-center p-8 bg-slate-100 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800/80 h-full min-h-[400px]">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all duration-300" style={{ backgroundColor: bgColor }}>
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
                                    />
                                ) : (
                                    <div className="w-64 h-64 flex flex-col items-center justify-center gap-4 text-slate-300 dark:text-slate-600">
                                        <RefreshCcw className="w-12 h-12 opacity-50" />
                                        <span className="text-sm font-medium">Preview will appear here</span>
                                    </div>
                                )}
                            </div>
                            <p className="mt-8 text-sm font-medium text-slate-500 dark:text-slate-400 text-center animate-pulse">
                                {text ? "Scan to test content" : "Enter text to start generating"}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
