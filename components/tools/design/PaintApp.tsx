"use client"

import { useState, useRef, useEffect } from "react"
import { Pencil, Eraser, Square, Circle, Minus, RotateCcw, RotateCw, Download, Palette, Trash2, Maximize, Minimize, PaintBucket, Type, Image as ImageIcon, Wand2, Upload as UploadIcon } from "lucide-react"

type Tool = "pencil" | "line" | "rect" | "circle" | "eraser" | "fill" | "text"

export function PaintApp() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // State
    const [tool, setTool] = useState<Tool>("pencil")
    const [color, setColor] = useState("#000000")
    const [lineWidth, setLineWidth] = useState(5)
    const [isDrawing, setIsDrawing] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null)
    const [snapshot, setSnapshot] = useState<ImageData | null>(null)

    // Text Tool State
    const [textInput, setTextInput] = useState<{ x: number, y: number, value: string, visible: boolean } | null>(null)

    // History
    const [history, setHistory] = useState<ImageData[]>([])
    const [historyStep, setHistoryStep] = useState(-1)
    const HISTORY_LIMIT = 20

    // Setup Canvas
    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const ctx = canvas.getContext("2d", { willReadFrequently: true })
        if (!ctx) return

        // Set canvas size to match container
        const resizeCanvas = () => {
            // Save current content
            const tempCanvas = document.createElement('canvas')
            tempCanvas.width = canvas.width
            tempCanvas.height = canvas.height
            const tempCtx = tempCanvas.getContext('2d')
            if (tempCtx) {
                tempCtx.drawImage(canvas, 0, 0)
            }

            // Resize
            canvas.width = container.clientWidth
            canvas.height = container.clientHeight

            // Restore content
            setBgWhite()
            if (tempCtx) {
                ctx.drawImage(tempCanvas, 0, 0)
            }
        }

        const setBgWhite = () => {
            ctx.fillStyle = "white"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        // Initial History
        saveHistory()

        return () => window.removeEventListener("resize", resizeCanvas)
    }, [])

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }, [])

    const toggleFullscreen = async () => {
        if (!wrapperRef.current) return

        if (!document.fullscreenElement) {
            try {
                await wrapperRef.current.requestFullscreen()
            } catch (err) {
                console.error("Error attempting to enable full-screen mode:", err)
            }
        } else {
            if (document.exitFullscreen) {
                await document.exitFullscreen()
            }
        }
    }

    const saveHistory = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const newStep = historyStep + 1
        const newHistory = history.slice(0, newStep) // Clear redo stack

        // Limit history size to prevent memory issues
        if (newHistory.length > HISTORY_LIMIT) {
            newHistory.shift()
        }

        newHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height))

        setHistory(newHistory)
        setHistoryStep(newHistory.length - 1)
    }

    const undo = () => {
        if (historyStep > 0) {
            const newStep = historyStep - 1
            setHistoryStep(newStep)
            const imageData = history[newStep]
            putImageData(imageData)
        }
    }

    const redo = () => {
        if (historyStep < history.length - 1) {
            const newStep = historyStep + 1
            setHistoryStep(newStep)
            const imageData = history[newStep]
            putImageData(imageData)
        }
    }

    const putImageData = (imageData: ImageData) => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (ctx) ctx.putImageData(imageData, 0, 0)
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (canvas && ctx) {
            ctx.fillStyle = "white"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            saveHistory()
        }
    }

    const getMousePos = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current
        if (!canvas) return { x: 0, y: 0 }

        const rect = canvas.getBoundingClientRect()
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        }
    }

    // --- Flood Fill Algorithm ---
    const floodFill = (startX: number, startY: number, fillColor: string) => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) return

        // Get Image Data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const { width, height, data } = imageData

        // Helper to get pixel color
        const getPixel = (x: number, y: number) => {
            const i = (y * width + x) * 4
            return [data[i], data[i + 1], data[i + 2], data[i + 3]]
        }

        const startRgb = getPixel(startX, startY)

        // Convert hex color to RGB
        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
            return result ? [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
            ] : [0, 0, 0]
        }
        const fillRgb = hexToRgb(fillColor)

        // If trying to fill with same color, return
        if (startRgb[0] === fillRgb[0] && startRgb[1] === fillRgb[1] && startRgb[2] === fillRgb[2]) return

        const pixelStack = [[startX, startY]]

        const matchStartColor = (i: number) => {
            return data[i] === startRgb[0] && data[i + 1] === startRgb[1] && data[i + 2] === startRgb[2]
        }

        while (pixelStack.length) {
            const newPos = pixelStack.pop()
            if (!newPos) continue
            let x = newPos[0]
            let y = newPos[1]

            let pixelPos = (y * width + x) * 4

            // Go up as long as the color matches
            while (y-- >= 0 && matchStartColor(pixelPos)) {
                pixelPos -= width * 4
            }

            pixelPos += width * 4
            y++

            let reachLeft = false
            let reachRight = false

            while (y++ < height - 1 && matchStartColor(pixelPos)) {
                // Color pixel
                data[pixelPos] = fillRgb[0]
                data[pixelPos + 1] = fillRgb[1]
                data[pixelPos + 2] = fillRgb[2]
                data[pixelPos + 3] = 255 // Alpha

                if (x > 0) {
                    if (matchStartColor(pixelPos - 4)) {
                        if (!reachLeft) {
                            pixelStack.push([x - 1, y])
                            reachLeft = true
                        }
                    } else if (reachLeft) {
                        reachLeft = false
                    }
                }

                if (x < width - 1) {
                    if (matchStartColor(pixelPos + 4)) {
                        if (!reachRight) {
                            pixelStack.push([x + 1, y])
                            reachRight = true
                        }
                    } else if (reachRight) {
                        reachRight = false
                    }
                }

                pixelPos += width * 4
            }
        }

        ctx.putImageData(imageData, 0, 0)
        saveHistory()
    }

    // --- Filters ---
    const applyFilter = (filter: 'grayscale' | 'invert' | 'sepia') => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) return

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const { data } = imageData

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]

            if (filter === 'grayscale') {
                const avg = (r + g + b) / 3
                data[i] = avg
                data[i + 1] = avg
                data[i + 2] = avg
            } else if (filter === 'invert') {
                data[i] = 255 - r
                data[i + 1] = 255 - g
                data[i + 2] = 255 - b
            } else if (filter === 'sepia') {
                data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189))
                data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168))
                data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131))
            }
        }

        ctx.putImageData(imageData, 0, 0)
        saveHistory()
    }

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const img = new Image()
            img.onload = () => {
                const canvas = canvasRef.current
                const ctx = canvas?.getContext("2d")
                if (canvas && ctx) {
                    // Center image
                    const scale = Math.min(canvas.width / img.width, canvas.height / img.height, 1) // Fit to screen if easier
                    const w = img.width * scale * 0.8
                    const h = img.height * scale * 0.8
                    const x = (canvas.width - w) / 2
                    const y = (canvas.height - h) / 2
                    ctx.drawImage(img, x, y, w, h)
                    saveHistory()
                }
            }
            img.src = event.target?.result as string
        }
        reader.readAsDataURL(file)
    }


    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const pos = getMousePos(e)

        // Handle Text Tool
        if (tool === 'text') {
            setTextInput({ x: pos.x, y: pos.y, value: "", visible: true })
            setTimeout(() => {
                document.getElementById('floating-text-input')?.focus()
            }, 50)
            return
        }

        // Handle Fill Tool
        if (tool === 'fill') {
            floodFill(Math.floor(pos.x), Math.floor(pos.y), color)
            return
        }

        // Normal Drawing
        setIsDrawing(true)
        setStartPos(pos)

        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (canvas && ctx) {
            ctx.beginPath()
            ctx.moveTo(pos.x, pos.y)
            // Save snapshot for shape preview
            setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height))
        }
    }

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return

        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx || !startPos) return

        const pos = getMousePos(e)

        ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color
        ctx.lineWidth = lineWidth
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        if (tool === "pencil" || tool === "eraser") {
            ctx.lineTo(pos.x, pos.y)
            ctx.stroke()
        } else if (snapshot) {
            // Restore snapshot to draw shape preview
            ctx.putImageData(snapshot, 0, 0)
            ctx.beginPath()

            if (tool === "line") {
                ctx.moveTo(startPos.x, startPos.y)
                ctx.lineTo(pos.x, pos.y)
            } else if (tool === "rect") {
                ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y)
            } else if (tool === "circle") {
                const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2))
                ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI)
            }
            ctx.stroke()
        }
    }

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false)
            saveHistory()
        }
    }

    const finalizeText = () => {
        if (!textInput || !textInput.value.trim()) {
            setTextInput(null)
            return
        }

        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (canvas && ctx) {
            ctx.font = `${lineWidth * 5}px Arial` // Scale font by line width
            ctx.fillStyle = color
            ctx.fillText(textInput.value, textInput.x, textInput.y + (lineWidth * 4)) // Adjust baseline
            saveHistory()
        }
        setTextInput(null)
    }

    const downloadImage = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const link = document.createElement("a")
        link.download = `drawing-${Date.now()}.png`
        link.href = canvas.toDataURL()
        link.click()
    }

    return (
        <div ref={wrapperRef} className={`flex flex-col gap-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 p-4' : 'h-[calc(100vh-200px)] min-h-[600px]'}`}>
            {/* Toolbar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-wrap items-center gap-6 shadow-sm">

                {/* Tools */}
                <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-800 pr-6">
                    <ToolBtn active={tool === "pencil"} onClick={() => setTool("pencil")} icon={Pencil} label="Pencil" />
                    <ToolBtn active={tool === "line"} onClick={() => setTool("line")} icon={Minus} label="Line" />
                    <ToolBtn active={tool === "rect"} onClick={() => setTool("rect")} icon={Square} label="Rectangle" />
                    <ToolBtn active={tool === "circle"} onClick={() => setTool("circle")} icon={Circle} label="Circle" />
                    <ToolBtn active={tool === "fill"} onClick={() => setTool("fill")} icon={PaintBucket} label="Fill Bucket" />
                    <ToolBtn active={tool === "text"} onClick={() => setTool("text")} icon={Type} label="Text" />
                    <ToolBtn active={tool === "eraser"} onClick={() => setTool("eraser")} icon={Eraser} label="Eraser" />
                </div>

                {/* Properties */}
                <div className="flex items-center gap-4 border-r border-slate-200 dark:border-slate-800 pr-6">
                    <div className="flex items-center gap-2">
                        <Palette className="w-5 h-5 text-slate-500" />
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border-none bg-transparent p-0"
                            disabled={tool === "eraser"}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Size</span>
                        <input
                            type="range"
                            min="1"
                            max="50"
                            value={lineWidth}
                            onChange={(e) => setLineWidth(Number(e.target.value))}
                            className="w-24 accent-slate-900 dark:accent-white"
                        />
                        <span className="text-xs w-6 text-center">{lineWidth}</span>
                    </div>
                </div>

                {/* Extras */}
                <div className="flex items-center gap-2 border-r border-slate-200 dark:border-slate-800 pr-6">
                    <button onClick={() => applyFilter('grayscale')} className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-500 flex items-center gap-1">
                        <Wand2 className="w-3 h-3" /> Gray
                    </button>
                    <button onClick={() => applyFilter('invert')} className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-500 flex items-center gap-1">
                        <Wand2 className="w-3 h-3" /> Invert
                    </button>
                    <label className="cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-500 flex items-center gap-1">
                        <UploadIcon className="w-3 h-3" /> Upload
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                    </label>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-auto">
                    <button onClick={undo} disabled={historyStep <= 0} className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-50" title="Undo">
                        <RotateCcw className="w-5 h-5" />
                    </button>
                    <button onClick={redo} disabled={historyStep >= history.length - 1} className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-50" title="Redo">
                        <RotateCw className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2" />
                    <button onClick={toggleFullscreen} className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </button>
                    <button onClick={clearCanvas} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors" title="Clear Canvas">
                        <Trash2 className="w-5 h-5" />
                    </button>
                    <button onClick={downloadImage} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors ml-2">
                        <Download className="w-4 h-4" />
                        Save
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div
                ref={containerRef}
                className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shadow-inner relative touch-none"
            >
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="absolute inset-0 w-full h-full bg-white cursor-crosshair"
                />

                {textInput && textInput.visible && (
                    <input
                        id="floating-text-input"
                        type="text"
                        value={textInput.value}
                        onChange={(e) => setTextInput({ ...textInput, value: e.target.value })}
                        onKeyDown={(e) => { if (e.key === 'Enter') finalizeText() }}
                        onBlur={finalizeText}
                        className="absolute bg-transparent border border-emerald-500 outline-none p-1 text-slate-900"
                        style={{
                            left: textInput.x,
                            top: textInput.y,
                            fontSize: `${lineWidth * 5}px`,
                            color: color,
                            fontFamily: 'Arial',
                            minWidth: '100px'
                        }}
                    />
                )}
            </div>
        </div>
    )
}

function ToolBtn({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`p-2 rounded-lg transition-all ${active
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md transform scale-105"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
            title={label}
        >
            <Icon className="w-5 h-5" />
        </button>
    )
}
