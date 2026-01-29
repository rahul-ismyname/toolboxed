"use client"

import { useState, useRef } from 'react'
import { removeBackground, Config } from '@imgly/background-removal'
import {
    Upload,
    Image as ImageIcon,
    Sparkles,
    Download,
    Copy,
    RefreshCcw,
    CheckCircle2,
    Loader2,
    X,
    Maximize2,
    Layers,
    ShieldCheck,
    Zap
} from 'lucide-react'

export default function BackgroundRemover() {
    const [image, setImage] = useState<string | null>(null)
    const [resultImage, setResultImage] = useState<string | null>(null)
    const [bgColor, setBgColor] = useState('transparent')
    const [sliderPos, setSliderPos] = useState(50)
    const [processing, setProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [progressLabel, setProgressLabel] = useState('')
    const [copied, setCopied] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setImage(url)
            setResultImage(null)
            setProgress(0)
        }
    }

    const processImage = async () => {
        if (!image) return

        setProcessing(true)
        setProgress(0)
        setProgressLabel('Initializing AI Models...')

        try {
            const config: Config = {
                progress: (key, current, total) => {
                    const pct = Math.round((current / total) * 100)
                    setProgress(pct)
                    if (key.includes('fetch')) setProgressLabel('Downloading AI Model (first time only)...')
                    else if (key.includes('compute')) setProgressLabel('Removing Background...')
                },
                model: 'isnet',
                output: {
                    format: 'image/png',
                    quality: 1.0
                }
            }

            const resultBlob = await removeBackground(image, config)
            const resultUrl = URL.createObjectURL(resultBlob)
            setResultImage(resultUrl)
        } catch (error) {
            console.error('Background removal failed:', error)
        } finally {
            setProcessing(false)
        }
    }

    const downloadResult = () => {
        if (!resultImage) return
        const link = document.createElement('a')
        link.href = resultImage
        link.download = 'removed-background.png'
        link.click()
    }

    const copyToClipboard = async () => {
        if (!resultImage) return
        try {
            const response = await fetch(resultImage)
            const blob = await response.blob()
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ])
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy image:', err)
        }
    }

    const reset = () => {
        setImage(null)
        setResultImage(null)
        setProcessing(false)
        setProgress(0)
        setBgColor('transparent')
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold border border-emerald-500/20">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    On-Device AI Processing
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                    Pro Background <span className="text-emerald-500">Remover</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
                    Remove backgrounds from any photo instantly and privately.
                    No uploads, unlimited use, 100% free.
                </p>
            </div>

            <div className="relative group">
                <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-[3rem] -z-10 group-hover:bg-emerald-500/10 transition-all duration-500" />

                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden ring-1 ring-slate-200/20">

                    {!image ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault()
                                const file = e.dataTransfer.files?.[0]
                                if (file) {
                                    const url = URL.createObjectURL(file)
                                    setImage(url)
                                }
                            }}
                            className="aspect-[16/9] border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center gap-6 hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] transition-all cursor-pointer group/upload"
                        >
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center group-hover/upload:scale-110 transition-transform duration-300">
                                <Upload className="w-8 h-8 text-slate-400 group-hover/upload:text-emerald-500 transition-colors" />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-xl font-bold text-slate-900 dark:text-white">Drop your image here</p>
                                <p className="text-sm text-slate-500">or click to browse from device</p>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="space-y-6">
                                {resultImage ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                                <Sparkles className="w-3 h-3" />
                                                Drag slider to compare
                                            </div>
                                            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                                                {['transparent', '#ffffff', '#000000', '#3b82f6', '#ef4444', '#10b981'].map(color => (
                                                    <button
                                                        key={color}
                                                        onClick={() => setBgColor(color)}
                                                        className={`w-4 h-4 rounded-full border border-slate-200 transition-all ${bgColor === color ? 'scale-125 ring-2 ring-emerald-500' : 'hover:scale-110'}`}
                                                        style={{
                                                            backgroundColor: color === 'transparent' ? 'transparent' : color,
                                                            backgroundImage: color === 'transparent' ? 'url("/checkered.svg")' : 'none',
                                                            backgroundSize: '8px 8px'
                                                        }}
                                                        title={color === 'transparent' ? 'Transparent' : color}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="relative aspect-video md:aspect-[16/9] rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-50 dark:bg-slate-900 select-none cursor-ew-resize group/slider">
                                            {/* Background Layer (Original) */}
                                            <div className="absolute inset-0">
                                                <img src={image} className="w-full h-full object-contain" alt="Original" />
                                            </div>

                                            {/* Result Layer (Transparent or Colored) */}
                                            <div
                                                className="absolute inset-0 flex items-center justify-center overflow-hidden"
                                                style={{
                                                    clipPath: `inset(0 0 0 ${sliderPos}%)`,
                                                    backgroundColor: bgColor === 'transparent' ? 'transparent' : bgColor,
                                                    backgroundImage: bgColor === 'transparent' ? 'url("/checkered.svg")' : 'none'
                                                }}
                                            >
                                                <img src={resultImage} className="w-full h-full object-contain p-4" alt="Result" />
                                            </div>

                                            {/* Slider Handle */}
                                            <div
                                                className="absolute inset-y-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.3)] z-10 flex items-center justify-center pointer-events-none"
                                                style={{ left: `${sliderPos}%` }}
                                            >
                                                <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full border-4 border-emerald-500 shadow-xl flex items-center justify-center -translate-x-1/2">
                                                    <div className="flex gap-1">
                                                        <div className="w-1 h-3 bg-emerald-500/30 rounded-full" />
                                                        <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                                                        <div className="w-1 h-3 bg-emerald-500/30 rounded-full" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Helper Text */}
                                            <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-xl text-white text-[10px] font-bold uppercase tracking-widest z-20 pointer-events-none opacity-0 group-hover/slider:opacity-100 transition-opacity">
                                                Original
                                            </div>
                                            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-emerald-500/80 backdrop-blur-md rounded-xl text-white text-[10px] font-bold uppercase tracking-widest z-20 pointer-events-none opacity-0 group-hover/slider:opacity-100 transition-opacity">
                                                AI Result
                                            </div>

                                            {/* Invisible Input Range */}
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={sliderPos}
                                                onChange={(e) => setSliderPos(Number(e.target.value))}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Original Image */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                    <ImageIcon className="w-3 h-3" />
                                                    Original
                                                </div>
                                                {!processing && (
                                                    <button onClick={reset} className="text-slate-400 hover:text-red-500 transition-colors">
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-inner">
                                                <img src={image} className="w-full h-full object-contain" alt="Original" />
                                            </div>
                                        </div>

                                        {/* Processing Placeholder */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-emerald-500 self-start">
                                                <Layers className="w-3 h-3" />
                                                Processed Result
                                            </div>
                                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[url('/checkered.svg')] bg-zinc-100 dark:bg-zinc-900 border-2 border-slate-100 dark:border-slate-800 shadow-inner group/result">
                                                {processing ? (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-6">
                                                        <div className="relative">
                                                            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                                                            <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-emerald-600">
                                                                {progress}%
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <p className="font-bold text-slate-900 dark:text-white animate-pulse">{progressLabel}</p>
                                                            <div className="w-48 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mx-auto">
                                                                <div
                                                                    className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                                                                    style={{ width: `${progress}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                                        <p className="text-sm font-medium">Waiting to process...</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
                                {!resultImage && !processing && (
                                    <button
                                        onClick={processImage}
                                        className="w-full md:w-auto px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                    >
                                        <Sparkles className="w-5 h-5 fill-current" />
                                        Remove Background
                                    </button>
                                )}

                                {resultImage && !processing && (
                                    <>
                                        <button
                                            onClick={downloadResult}
                                            className="w-full md:w-auto px-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                        >
                                            <Download className="w-5 h-5" />
                                            Download PNG
                                        </button>
                                        <button
                                            onClick={copyToClipboard}
                                            className={`w-full md:w-auto px-8 py-5 font-black uppercase tracking-widest rounded-2xl border-2 transition-all flex items-center justify-center gap-3 ${copied
                                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                                                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-500 group'
                                                }`}
                                        >
                                            {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5 group-hover:text-emerald-500" />}
                                            {copied ? 'Copied!' : 'Copy Img'}
                                        </button>
                                        <button
                                            onClick={reset}
                                            className="w-full md:w-auto px-8 py-5 border-2 border-slate-100 dark:border-slate-800 text-slate-400 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center justify-center gap-3"
                                        >
                                            <RefreshCcw className="w-5 h-5" />
                                            Try Another
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Warning/Capabilities footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Privacy First', desc: 'Processing happens locally. Your photos are never uploaded.', icon: ShieldCheck },
                    { title: 'HD Quality', desc: 'Export high-resolution transparent PNGs with clean edges.', icon: Maximize2 },
                    { title: 'Zero Limits', desc: 'Completely free to use with no credits or signups required.', icon: Zap }
                ].map((item, i) => (
                    <div key={i} className="p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3">
                        <div className="w-10 h-10 bg-white dark:bg-slate-950 rounded-xl flex items-center justify-center border border-slate-200/50 dark:border-slate-800/50 text-emerald-500 shadow-sm">
                            <item.icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
