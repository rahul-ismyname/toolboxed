"use client"

import { useState, useRef, useEffect, MouseEvent, TouchEvent } from "react"
import {
    Play, Pause, SkipBack, SkipForward, Plus, Trash2, Download, Maximize, Minimize,
    RotateCcw, Eye, EyeOff, Scissors, Circle as CircleIcon, Move, Pencil, Layers, Info,
    Copy, ClipboardCheck, ArrowLeftRight, Target, ChevronRight, ChevronLeft, UserPlus, Users, ArrowUp, ArrowDown,
    Image as ImageIcon, Video, Undo, Redo, ZoomIn, ZoomOut
} from "lucide-react"

// --- Types ---

interface Point {
    x: number
    y: number
}

interface Node extends Point {
    id: string
    name: string
    parent?: string
    thickness: number
    type: 'line' | 'circle'
    color?: string // Override figure color
}

interface Figure {
    id: string
    name: string
    nodes: Node[]
    color: string // Base color for the figure (e.g., 'blue', 'red', 'black')
    zIndex: number
    visible: boolean
}

interface Keyframe {
    frameIndex: number
    figures: Figure[]
    easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'elastic'
}

const EASING_FUNCTIONS = {
    'linear': (t: number) => t,
    'ease-in': (t: number) => t * t,
    'ease-out': (t: number) => t * (2 - t),
    'ease-in-out': (t: number) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    'elastic': (t: number) => t === 0 || t === 1 ? t : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1 - 0.075) * (2 * Math.PI) / 0.3)
}

// --- Constants ---

const DEFAULT_STICKMAN_NODES: Node[] = [
    { id: "torso", name: "Torso", x: 0, y: 0, thickness: 2, type: 'line' },
    { id: "neck", name: "Neck", x: 0, y: -35, parent: "torso", thickness: 2, type: 'line' },
    { id: "head", name: "Head", x: 0, y: -55, parent: "neck", thickness: 2, type: 'circle' },
    { id: "shoulderL", name: "Shoulder L", x: -20, y: -25, parent: "neck", thickness: 1.5, type: 'line' },
    { id: "elbowL", name: "Elbow L", x: -40, y: 0, parent: "shoulderL", thickness: 1.5, type: 'line' },
    { id: "handL", name: "Hand L", x: -60, y: 25, parent: "elbowL", thickness: 1.5, type: 'line' },
    { id: "shoulderR", name: "Shoulder R", x: 20, y: -25, parent: "neck", thickness: 1.5, type: 'line' },
    { id: "elbowR", name: "Elbow R", x: 40, y: 0, parent: "shoulderR", thickness: 1.5, type: 'line' },
    { id: "handR", name: "Hand R", x: 60, y: 25, parent: "elbowR", thickness: 1.5, type: 'line' },
    { id: "hips", name: "Hips", x: 0, y: 55, parent: "torso", thickness: 2, type: 'line' },
    { id: "kneeL", name: "Knee L", x: -15, y: 105, parent: "hips", thickness: 1.5, type: 'line' },
    { id: "footL", name: "Foot L", x: -20, y: 155, parent: "kneeL", thickness: 1.5, type: 'line' },
    { id: "kneeR", name: "Knee R", x: 15, y: 105, parent: "hips", thickness: 1.5, type: 'line' },
    { id: "footR", name: "Foot R", x: 20, y: 155, parent: "kneeR", thickness: 1.5, type: 'line' },
]

const DEFAULT_TIMELINE_LENGTH = 200
const FPS = 24

export function StickmanAnimator() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const rootRef = useRef<HTMLDivElement>(null)

    // Core State
    const [figures, setFigures] = useState<Figure[]>([
        { id: "u1", name: "Stickman 1", nodes: translateNodes(DEFAULT_STICKMAN_NODES, 200, 180), color: 'black', zIndex: 1, visible: true }
    ])

    const [keyframes, setKeyframes] = useState<Keyframe[]>([{
        frameIndex: 0,
        figures: [
            { id: "u1", name: "Stickman 1", nodes: translateNodes(DEFAULT_STICKMAN_NODES, 200, 180), color: 'black', zIndex: 1, visible: true }
        ]
    }])

    const [currentFrame, setCurrentFrame] = useState(0)
    const [timelineLength, setTimelineLength] = useState(DEFAULT_TIMELINE_LENGTH)

    // UI State
    const [selectedFigureId, setSelectedFigureId] = useState<string>("u1")
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

    const [isPlaying, setIsPlaying] = useState(false)
    const [isBuilderMode, setIsBuilderMode] = useState(false)
    const [dragNodeId, setDragNodeId] = useState<string | null>(null)
    const [hoverNodeId, setHoverNodeId] = useState<string | null>(null)
    const [showOnionSkin, setShowOnionSkin] = useState(true)
    const [zoom, setZoom] = useState(1)
    const [poseClipboard, setPoseClipboard] = useState<Figure[] | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)
    const [showFigurePanel, setShowFigurePanel] = useState(false)

    // Migration & Persistence
    useEffect(() => {
        const saved = localStorage.getItem("stickman_keyframes")
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                // Basic migration check: if element 0 has 'figures', it's new format. Else it's old 'nodes' format
                if (parsed[0] && parsed[0].figures) {
                    setKeyframes(parsed)
                    setFigures(parsed[0].figures)
                    setSelectedFigureId(parsed[0].figures[0]?.id || "")
                } else if (parsed[0] && parsed[0].nodes) {
                    // Migrate old single-figure data
                    const migratedKeyframes = parsed.map((k: { frameIndex: number, nodes: Node[] }) => ({
                        frameIndex: k.frameIndex,
                        figures: [{
                            id: "u1",
                            name: "Stickman 1",
                            nodes: k.nodes,
                            color: 'black',
                            zIndex: 1,
                            visible: true
                        }]
                    }))
                    setKeyframes(migratedKeyframes)
                    setFigures(migratedKeyframes[0].figures)
                    setSelectedFigureId("u1")
                    showSuccess("Project Migrated to Multi-Figure")
                }
            } catch (e) { console.error("Load failed", e) }
        }
    }, [])

    // Background State
    const [background, setBackground] = useState<{ type: 'color' | 'image', value: string }>({ type: 'color', value: '#ffffff' })
    const bgImageRef = useRef<HTMLImageElement | null>(null)

    // Load Background Image
    useEffect(() => {
        if (background.type === 'image' && background.value) {
            const img = new Image()
            img.src = background.value
            img.onload = () => {
                bgImageRef.current = img
                // render() // Can't call render directly here easily if it's not in dependency, but the state change triggers re-render anyway
            }
        } else {
            bgImageRef.current = null
        }
    }, [background])

    // Save to LocalStorage
    useEffect(() => {
        if (keyframes.length > 0) {
            localStorage.setItem("stickman_keyframes", JSON.stringify(keyframes))
            localStorage.setItem("stickman_background", JSON.stringify(background))
        }
    }, [keyframes, background])

    // Load Background
    useEffect(() => {
        const savedBg = localStorage.getItem("stickman_background")
        if (savedBg) setBackground(JSON.parse(savedBg))
    }, [])

    // Setup Canvas
    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1
            canvas.width = container.clientWidth * dpr
            canvas.height = container.clientHeight * dpr
            // Force valid size to prevent 0x0 errors
            if (canvas.width === 0) canvas.width = 800
            if (canvas.height === 0) canvas.height = 600
            render()
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)
        return () => window.removeEventListener("resize", resizeCanvas)
    }, [])

    // Video Export State
    const [isRecording, setIsRecording] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])

    // History State (Undo/Redo)
    // We track the entire keyframes array + background? Or simpler to track specific actions?
    // For high reliability, tracking keyframes array is safest for now.
    const [history, setHistory] = useState<{ keyframes: Keyframe[], figures: Figure[] }[]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)

    const addToHistory = () => {
        const newState = {
            keyframes: JSON.parse(JSON.stringify(keyframes)),
            figures: JSON.parse(JSON.stringify(figures)) // Current frame figures
        }
        const newHistory = [...history.slice(0, historyIndex + 1), newState]
        // Limit history size
        if (newHistory.length > 20) newHistory.shift()

        setHistory(newHistory)
        setHistoryIndex(newHistory.length - 1)
    }

    // Initial history
    useEffect(() => {
        if (history.length === 0 && keyframes.length > 0) {
            addToHistory()
        }
    }, []) // Run once

    const undo = () => {
        if (historyIndex > 0) {
            const prevState = history[historyIndex - 1]
            setKeyframes(prevState.keyframes)
            setFigures(prevState.figures)
            setHistoryIndex(historyIndex - 1)
            showSuccess("Undo")
        }
    }

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const nextState = history[historyIndex + 1]
            setKeyframes(nextState.keyframes)
            setFigures(nextState.figures)
            setHistoryIndex(historyIndex + 1)
            showSuccess("Redo")
        }
    }

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Undo/Redo
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                if (e.shiftKey) redo()
                else undo()
                e.preventDefault()
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                redo()
                e.preventDefault()
            }

            // Space: Add Frame (if not playing) or Toggle Play
            if (e.code === 'Space' && !e.repeat && (e.target as HTMLElement).tagName !== 'INPUT') {
                e.preventDefault()
                if (isPlaying) setIsPlaying(false)
                else addFrame() // Pivot style: Space adds frame
            }

            // Delete
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedNodeId && selectedNodeId !== 'torso' && isBuilderMode) {
                    builderDeleteBone()
                } else if (selectedFigureId && !isBuilderMode) {
                    // Confirm delete figure?
                }
            }

            // Arrows
            if (e.key === 'ArrowRight') {
                setCurrentFrame(prev => prev + 1)
            }
            if (e.key === 'ArrowLeft') {
                setCurrentFrame(prev => Math.max(0, prev - 1))
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [history, historyIndex, isPlaying, keyframes, figures, selectedNodeId, selectedFigureId, isBuilderMode])

    // Helper to capture state *before* an action? Or after?
    // Best is to capture before making a change, OR capture every time a change commits (mouse up)

    // Wrap state changers
    const commitAction = () => addToHistory()

    // Animation Loop
    useEffect(() => {
        let animationId: number
        let lastTime = 0
        const animate = (time: number) => {
            if (!isPlaying) return
            const delta = time - lastTime
            if (delta >= 1000 / FPS) {
                // Determine Loop point
                const lastKeyframe = Math.max(...keyframes.map(k => k.frameIndex))
                const loopPoint = Math.max(lastKeyframe, 0)

                setCurrentFrame(prev => {
                    const next = prev + 1

                    // Stop recording if we pass end
                    if (isRecording) {
                        if (next > loopPoint + 5) { // Stop a bit after last keyframe
                            stopExport()
                            return 0
                        }
                        return next
                    }

                    // Smart Loop (only when NOT recording)
                    return next > loopPoint ? 0 : next
                })
                lastTime = time
            }
            animationId = requestAnimationFrame(animate)
        }
        if (isPlaying) animationId = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationId)
    }, [isPlaying, isRecording, keyframes])

    // Interpolation Engine
    useEffect(() => {
        const keyframe = keyframes.find(k => k.frameIndex === currentFrame)
        if (keyframe) {
            setFigures(JSON.parse(JSON.stringify(keyframe.figures)))

            // If the selected figure exists in this frame, keep selection, else fallback
            if (!keyframe.figures.find(f => f.id === selectedFigureId)) {
                if (keyframe.figures.length > 0) setSelectedFigureId(keyframe.figures[0].id)
            }
        } else {
            // Interpolate
            const sorted = [...keyframes].sort((a, b) => a.frameIndex - b.frameIndex)
            if (sorted.length === 0) return

            let prev = sorted.filter(k => k.frameIndex < currentFrame).pop()
            let next = sorted.filter(k => k.frameIndex > currentFrame).shift()

            // Jump logic for loop
            if (!prev) prev = sorted[sorted.length - 1]
            if (!next) next = sorted[0]

            if (prev && next) {
                if (next.frameIndex > prev.frameIndex) {
                    let rawFactor = (currentFrame - prev.frameIndex) / (next.frameIndex - prev.frameIndex)

                    // Apply Easing (defined on the NEXT keyframe, i.e., "motion towards next")
                    const easeType = next.easing || 'linear'
                    const factor = EASING_FUNCTIONS[easeType](rawFactor)

                    // Match figures by ID
                    const interpolatedFigures = prev.figures.map(pFig => {
                        const nFig = next!.figures.find(f => f.id === pFig.id)
                        if (!nFig) return pFig // Figure missing in next frame, hold position

                        const iNodes = pFig.nodes.map(pNode => {
                            const nNode = nFig.nodes.find(n => n.id === pNode.id)
                            if (!nNode) return pNode
                            return {
                                ...pNode,
                                x: pNode.x + (nNode.x - pNode.x) * factor,
                                y: pNode.y + (nNode.y - pNode.y) * factor
                            }
                        })

                        return { ...pFig, nodes: iNodes }
                    })

                    setFigures(interpolatedFigures)
                } else {
                    // Instant Jump back to start
                    setFigures(JSON.parse(JSON.stringify(prev.figures)))
                }
            }
        }
    }, [currentFrame, keyframes])

    // Re-render trigger
    useEffect(() => {
        render()
    }, [figures, currentFrame, showOnionSkin, zoom, hoverNodeId, dragNodeId, selectedNodeId, selectedFigureId, isBuilderMode, background])

    const render = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const dpr = window.devicePixelRatio || 1
        const width = canvas.width / dpr
        const height = canvas.height / dpr

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.save()
        ctx.scale(dpr, dpr)

        // Draw Background if Recording (to capture in video)
        if (isRecording) {
            if (background.type === 'color') {
                ctx.fillStyle = background.value
                ctx.fillRect(0, 0, width, height)
            } else if (background.type === 'image' && bgImageRef.current) {
                const img = bgImageRef.current
                const canvasAspect = width / height
                const imgAspect = img.width / img.height
                let drawW, drawH, drawX, drawY

                if (canvasAspect > imgAspect) {
                    drawW = width
                    drawH = width / imgAspect
                    drawX = 0
                    drawY = (height - drawH) / 2
                } else {
                    drawH = height
                    drawW = height * imgAspect
                    drawY = 0
                    drawX = (width - drawW) / 2
                }
                ctx.drawImage(img, drawX, drawY, drawW, drawH)
            } else {
                // Default White background for video if nothing selected
                ctx.fillStyle = '#ffffff'
                ctx.fillRect(0, 0, width, height)
            }
        }

        ctx.translate(width / 2, height / 2)
        ctx.scale(zoom, zoom)
        ctx.translate(-200, -200)

        // Sort figures by zIndex
        const visibleFigures = [...figures].filter(f => f.visible).sort((a, b) => a.zIndex - b.zIndex)

        // Onion Skin
        if (showOnionSkin && !isPlaying && !isRecording) {
            const sorted = [...keyframes].sort((a, b) => a.frameIndex - b.frameIndex)
            const prevKey = sorted.filter(k => k.frameIndex < currentFrame).pop()
            if (prevKey) {
                prevKey.figures.forEach(fig => {
                    // Only ghost active figures? Or all? Let's do all for now
                    drawSkeleton(ctx, fig.nodes, "rgba(59, 130, 246, 0.15)")
                })
            }
        }

        // Draw Figures
        visibleFigures.forEach(fig => {
            const color = fig.id === selectedFigureId && !isRecording ? "currentColor" : (isRecording ? (fig.color || '#000') : "#94a3b8")
            // When recording, use actual color. When editing, use selection interaction colors.
            // Actually, keep logic simple: 
            // If selected -> currentColor (uses node colors or blue/red hints).
            // If not selected -> grey.
            // THIS logic is for EDITING.
            // For RECORDING, we want "Final Render" look.
            // Final render means: No selection highlights, no dimming.
            // So if isRecording: Always use actual colors.

            if (isRecording) {
                drawSkeleton(ctx, fig.nodes, "render_mode")
            } else {
                const color = fig.id === selectedFigureId ? "currentColor" : "#94a3b8"
                drawSkeleton(ctx, fig.nodes, color)
            }
        })

        // Draw HUD (Joints) - Only for Selected Figure (Never in recording)
        if (!isPlaying && !isRecording) {
            const activeFig = figures.find(f => f.id === selectedFigureId)
            if (activeFig) {
                drawJoints(ctx, activeFig.nodes)
            }
        }

        ctx.restore()
    }

    const drawSkeleton = (ctx: CanvasRenderingContext2D, nodes: Node[], color: string) => {
        const isDark = document.documentElement.classList.contains('dark')
        const defaultColor = isDark ? '#e2e8f0' : '#1e293b'
        const activeColor = color === "currentColor" ? defaultColor : color

        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        nodes.forEach(node => {
            if (node.parent) {
                const parentNode = nodes.find(n => n.id === node.parent)
                if (parentNode) {
                    ctx.beginPath()
                    ctx.lineWidth = node.thickness

                    let strokeStyle: string
                    if (color === "render_mode") {
                        strokeStyle = node.color || (isDark ? '#e2e8f0' : '#1e293b')
                    } else if (color === "currentColor") {
                        // Priority: Node Color -> Limb Color -> Default User Color
                        if (node.color) strokeStyle = node.color
                        else if (node.id.includes("L")) strokeStyle = "#f87171"
                        else if (node.id.includes("R")) strokeStyle = "#60a5fa"
                        else strokeStyle = activeColor
                    } else {
                        // Ghost/Dimmed figures
                        strokeStyle = color
                    }
                    ctx.strokeStyle = strokeStyle

                    if (node.type === 'line') {
                        ctx.moveTo(parentNode.x, parentNode.y)
                        ctx.lineTo(node.x, node.y)
                        ctx.stroke()
                    } else if (node.type === 'circle') {
                        const radius = Math.sqrt(Math.pow(node.x - parentNode.x, 2) + Math.pow(node.y - parentNode.y, 2))
                        ctx.moveTo(node.x + radius, node.y)
                        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
                        ctx.stroke()
                    }
                }
            }
        })
    }

    const drawJoints = (ctx: CanvasRenderingContext2D, nodes: Node[]) => {
        nodes.forEach(node => {
            const isHovered = hoverNodeId === node.id || dragNodeId === node.id
            const isSelected = selectedNodeId === node.id

            ctx.beginPath()
            ctx.arc(node.x, node.y, (isHovered || isSelected) ? 6 : 4, 0, Math.PI * 2)

            if (isSelected) ctx.fillStyle = "#3b82f6"
            else if (node.id.endsWith("L")) ctx.fillStyle = "#ef4444"
            else if (node.id.endsWith("R")) ctx.fillStyle = "#3b82f6"
            else ctx.fillStyle = "#10b981"

            ctx.fill()
            ctx.strokeStyle = "white"
            ctx.lineWidth = 1.5
            ctx.stroke()

            // Hover halo
            if (isHovered && !isSelected) {
                ctx.beginPath()
                ctx.arc(node.x, node.y, 10, 0, Math.PI * 2)
                ctx.strokeStyle = "rgba(16, 185, 129, 0.4)"
                ctx.stroke()
            }
        })
    }

    // --- Actions ---

    const addFigure = () => {
        const id = `u${Date.now()}`
        const newFig: Figure = {
            id,
            name: `Stickman ${figures.length + 1}`,
            nodes: translateNodes(DEFAULT_STICKMAN_NODES, 200 + (figures.length * 20), 180),
            color: 'black',
            zIndex: figures.length + 1,
            visible: true
        }

        const newFigures = [...figures, newFig]
        setFigures(newFigures)
        setSelectedFigureId(id)

        // Propagate to current keyframe
        updateKeyframe(newFigures)
        showSuccess(`Added ${newFig.name}`)
    }

    function translateNodes(nodes: Node[], dx: number, dy: number): Node[] {
        return JSON.parse(JSON.stringify(nodes)).map((n: Node) => ({
            ...n, x: n.x + dx, y: n.y + dy
        }))
    }

    const deleteFigure = () => {
        if (figures.length <= 1) return
        const newFigures = figures.filter(f => f.id !== selectedFigureId)
        setFigures(newFigures)
        setSelectedFigureId(newFigures[0].id)
        updateKeyframe(newFigures)
        showSuccess("Figure Deleted")
    }

    const updateKeyframe = (currentFigures: Figure[]) => {
        const ki = keyframes.findIndex(k => k.frameIndex === currentFrame)
        const newKeyframes = [...keyframes]

        if (ki !== -1) {
            newKeyframes[ki] = { ...newKeyframes[ki], figures: currentFigures }
        } else {
            newKeyframes.push({ frameIndex: currentFrame, figures: currentFigures })
        }
        setKeyframes(newKeyframes)
    }

    const updateActiveFigure = (newNodes: Node[]) => {
        const updatedFigures = figures.map(f => f.id === selectedFigureId ? { ...f, nodes: newNodes } : f)
        setFigures(updatedFigures)
        updateKeyframe(updatedFigures)
    }

    const addFrame = () => {
        updateKeyframe(figures) // Save current state first

        if (currentFrame + 5 >= timelineLength) {
            setTimelineLength(l => l + 50)
        }

        if (!isPlaying) {
            const nextF = currentFrame + 5
            setCurrentFrame(nextF)
        }
        showSuccess(`Frame Added at ${currentFrame}`)
    }

    // --- Interaction ---

    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
        if (isPlaying) return

        // Find hit in ACTIVE figure first, then others
        const activeFig = figures.find(f => f.id === selectedFigureId)
        if (activeFig) {
            const hit = findHitNode(activeFig.nodes, e)
            if (hit) {
                setDragNodeId(hit.id)
                setSelectedNodeId(hit.id)
                return
            }
        }

        // If no hit on active, try selecting another figure
        for (const fig of [...figures].reverse()) { // Check top zIndex first
            if (fig.id === selectedFigureId) continue // Already checked
            const hit = findHitNode(fig.nodes, e)
            if (hit) {
                setSelectedFigureId(fig.id)
                setDragNodeId(hit.id)
                setSelectedNodeId(hit.id)
                showSuccess(`Selected ${fig.name}`)
                return
            }
        }

        setSelectedNodeId(null)
    }

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
        if (!dragNodeId) {
            // Hover logic
            const activeFig = figures.find(f => f.id === selectedFigureId)
            if (activeFig) {
                const hit = findHitNode(activeFig.nodes, e)
                setHoverNodeId(hit ? hit.id : null)
            }
            return
        }

        const pos = getMousePos(e)
        const activeFig = figures.find(f => f.id === selectedFigureId)
        if (!activeFig) return

        const canvas = canvasRef.current
        if (!canvas) return
        const rect = canvas.getBoundingClientRect()
        const mouseX = (pos.x - rect.width / 2) / zoom + 200
        const mouseY = (pos.y - rect.height / 2) / zoom + 200

        const draggedNode = activeFig.nodes.find(n => n.id === dragNodeId)
        if (!draggedNode) return

        let newNodes = [...activeFig.nodes]
        const isCtrlHeld = (e as MouseEvent).ctrlKey || (e as MouseEvent).metaKey

        // Case 1: Root Node (Torso) - Translate Whole Figure
        if (!draggedNode.parent) {
            const dx = mouseX - draggedNode.x
            const dy = mouseY - draggedNode.y
            newNodes = newNodes.map(n => ({
                ...n,
                x: n.x + dx,
                y: n.y + dy
            }))
        } else {
            // Case 2: Joint Node - Rotate Subtree around Parent
            const parent = newNodes.find(n => n.id === draggedNode.parent)
            if (parent) {
                // Calculate current vector (Parent -> Node)
                const dxOld = draggedNode.x - parent.x
                const dyOld = draggedNode.y - parent.y
                const angleOld = Math.atan2(dyOld, dxOld)
                const distOld = Math.sqrt(dxOld * dxOld + dyOld * dyOld)

                // Calculate target vector (Parent -> Mouse)
                const dxNew = mouseX - parent.x
                const dyNew = mouseY - parent.y
                const angleNew = Math.atan2(dyNew, dxNew)
                const distNew = Math.sqrt(dxNew * dxNew + dyNew * dyNew)

                // Determine effective distance (Constrain unless Ctrl held)
                const distEff = isCtrlHeld ? distNew : distOld
                const angleDiff = angleNew - angleOld

                // Helper to check lineage
                const isDescendant = (childId: string, rootId: string, allNodes: Node[]): boolean => {
                    let curr = allNodes.find(n => n.id === childId)
                    while (curr && curr.parent) {
                        if (curr.parent === rootId) return true
                        curr = allNodes.find(n => n.id === curr!.parent)
                    }
                    return false
                }

                // Rotate entire subtree
                const transformNode = (n: Node): Node => {
                    // Start with the dragged node itself
                    if (n.id === draggedNode.id) {
                        return {
                            ...n,
                            x: parent.x + Math.cos(angleNew) * distEff,
                            y: parent.y + Math.sin(angleNew) * distEff
                        }
                    }

                    if (isDescendant(n.id, draggedNode.id, newNodes)) {
                        const dx = n.x - parent.x
                        const dy = n.y - parent.y

                        // Standard 2D Rotation around Parent
                        const cos = Math.cos(angleDiff)
                        const sin = Math.sin(angleDiff)
                        const xRot = parent.x + (dx * cos - dy * sin)
                        const yRot = parent.y + (dx * sin + dy * cos)

                        return { ...n, x: xRot, y: yRot }
                    }
                    return n
                }

                // First pass: Rotate
                let rotatedNodes = newNodes.map(transformNode)

                // Second pass: Handle Stretch Translation if needed
                if (isCtrlHeld) {
                    // If distance changed, we've essentially moved the pivot for the children relative to parent?
                    // No, "transformNode" moves the DraggedNode to `distEff`.
                    // BUT, the descendants were rotated to match the Angle, providing they maintain distance from Parent.
                    // However, DraggedNode *also* moved radially if `distEff != distOld`.
                    // The children of DraggedNode need to move with DraggedNode.
                    // Currently transformNode rotated them around Parent. This preserves Angle, but does NOT account for the Radial translation of DraggedNode.

                    // We need to calculate the shift of DraggedNode relative to its "Pure Rotation" position.
                    const draggedAfterRot = rotatedNodes.find(n => n.id === draggedNode.id)!

                    // Pure Rotation Pos of DraggedNode:
                    const xPure = parent.x + Math.cos(angleNew) * distOld
                    const yPure = parent.y + Math.sin(angleNew) * distOld

                    const dxStretch = draggedAfterRot.x - xPure
                    const dyStretch = draggedAfterRot.y - yPure

                    rotatedNodes = rotatedNodes.map(n => {
                        if (isDescendant(n.id, draggedNode.id, rotatedNodes)) {
                            return { ...n, x: n.x + dxStretch, y: n.y + dyStretch }
                        }
                        return n
                    })
                }

                newNodes = rotatedNodes
            }
        }

        updateActiveFigure(newNodes)
    }

    const isDescendant = (childId: string, rootId: string, allNodes: Node[]): boolean => {
        let curr = allNodes.find(n => n.id === childId)
        while (curr && curr.parent) {
            if (curr.parent === rootId) return true
            curr = allNodes.find(n => n.id === curr!.parent)
        }
        return false
    }

    const findHitNode = (nodes: Node[], e: MouseEvent | TouchEvent) => {
        const pos = getMousePos(e)
        const canvas = canvasRef.current
        if (!canvas) return null
        const rect = canvas.getBoundingClientRect()
        const correctedX = (pos.x - rect.width / 2) / zoom + 200
        const correctedY = (pos.y - rect.height / 2) / zoom + 200
        return nodes.find(n => Math.sqrt(Math.pow(n.x - correctedX, 2) + Math.pow(n.y - correctedY, 2)) < 20 / zoom)
    }

    const getMousePos = (e: MouseEvent | TouchEvent) => {
        const canvas = canvasRef.current
        if (!canvas) return { x: 0, y: 0 }
        const rect = canvas.getBoundingClientRect()
        const client = 'touches' in e ? e.touches[0] : (e as MouseEvent)
        return { x: client.clientX - rect.left, y: client.clientY - rect.top }
    }

    const handleMouseUp = () => {
        if (dragNodeId) {
            setDragNodeId(null)
            commitAction() // Save state after drag
        }
    }

    // --- Figure Builder Actions ---

    const builderAddBone = (type: 'line' | 'circle') => {
        const activeFig = figures.find(f => f.id === selectedFigureId)
        if (!activeFig || !selectedNodeId) return

        const parent = activeFig.nodes.find(n => n.id === selectedNodeId)!
        const id = `node_${Date.now()}`
        const newNode: Node = {
            id, name: "New Bone", parent: parent.id, x: parent.x + 30, y: parent.y + 30, thickness: 2, type
        }

        const newNodes = [...activeFig.nodes, newNode]
        updateActiveFigure(newNodes)
        setSelectedNodeId(id)
    }

    const builderDeleteBone = () => {
        const activeFig = figures.find(f => f.id === selectedFigureId)
        if (!activeFig || !selectedNodeId || selectedNodeId === "torso") return
        const newNodes = activeFig.nodes.filter(n => n.id !== selectedNodeId && n.parent !== selectedNodeId)
        updateActiveFigure(newNodes)
        setSelectedNodeId(null)
    }

    const updateNodeProperty = (props: Partial<Node>) => {
        if (!selectedFigureId || !selectedNodeId) return
        const activeFig = figures.find(f => f.id === selectedFigureId)
        if (!activeFig) return

        const newNodes = activeFig.nodes.map(node =>
            node.id === selectedNodeId ? { ...node, ...props } : node
        )
        updateActiveFigure(newNodes)
    }

    // --- Layout Actions ---

    const exportVideo = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        setIsPlaying(false)
        setCurrentFrame(0)
        setIsRecording(true)
        setSuccessMsg("Starting Render...")

        const stream = canvas.captureStream(FPS)
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' })

        mediaRecorderRef.current = mediaRecorder
        chunksRef.current = []

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data)
        }

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `stickman-animation-${Date.now()}.webm`
            a.click()
            setIsRecording(false)
            showSuccess("Export Complete!")
            setIsPlaying(false)
        }

        mediaRecorder.start()

        // Start playing to generate frames
        setTimeout(() => setIsPlaying(true), 100)
    }

    const stopExport = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop()
        }
    }

    const downloadProject = () => {
        const data = { keyframes, background, config: { fps: FPS } }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `stickman-ultimate-${Date.now()}.json`
        a.click()
    }

    const bringToFront = () => {
        const activeIndex = figures.findIndex(f => f.id === selectedFigureId)
        if (activeIndex === -1 || activeIndex === figures.length - 1) return

        const newFigs = [...figures]
        const temp = newFigs[activeIndex]
        newFigs[activeIndex] = newFigs[activeIndex + 1]
        newFigs[activeIndex + 1] = temp

        // Reassign zIndex
        newFigs.forEach((f, i) => f.zIndex = i + 1)

        setFigures(newFigs)
        updateKeyframe(newFigs)
    }

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            rootRef.current?.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }

    const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(null), 2000); }

    return (
        <div ref={rootRef} className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 relative bg-slate-50 dark:bg-slate-950 overflow-y-auto">
            {/* Success Toast */}
            {successMsg && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl animate-in fade-in slide-in-from-top-4">
                    {successMsg}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[700px]">
                {/* Left Toolbar */}
                <div className="flex lg:flex-col gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl lg:rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-x-auto lg:overflow-x-visible no-scrollbar">
                    <ToolbarBtn icon={Move} active={!isBuilderMode} onClick={() => setIsBuilderMode(false)} label="Animate" />
                    <ToolbarBtn icon={ValidatorsIcon} active={isBuilderMode} onClick={() => setIsBuilderMode(true)} label="Builder" />
                    <div className="w-px lg:w-full h-auto lg:h-px bg-slate-100 dark:bg-slate-800 mx-2 lg:my-2 shrink-0" />
                    <div className="flex lg:flex-col gap-3">
                        {isBuilderMode ? (
                            <>
                                <ToolbarBtn icon={Plus} onClick={() => builderAddBone('line')} label="Add Line" disabled={!selectedNodeId} />
                                <ToolbarBtn icon={CircleIcon} onClick={() => builderAddBone('circle')} label="Add Circle" disabled={!selectedNodeId} />
                                <ToolbarBtn icon={Trash2} onClick={builderDeleteBone} label="Delete Bone" color="text-red-500" disabled={!selectedNodeId || selectedNodeId === "torso"} />
                                <div className="hidden lg:block w-full h-px bg-slate-100 dark:bg-slate-800 my-2" />
                                <div className="hidden lg:flex flex-col gap-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node</h4>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            onChange={(e) => updateNodeProperty({ color: e.target.value })}
                                            className="w-8 h-8 rounded-full cursor-pointer border-2 border-slate-200"
                                            title="Limb Color"
                                        />
                                        <button onClick={() => updateNodeProperty({ color: undefined })} className="text-[10px] font-bold text-slate-400">Reset</button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <ToolbarBtn icon={UserPlus} onClick={addFigure} label="Add Figure" />
                                <ToolbarBtn icon={Users} active={showFigurePanel} onClick={() => setShowFigurePanel(!showFigurePanel)} label="Figures" />
                                <ToolbarBtn icon={ArrowUp} onClick={bringToFront} label="Bring Fwd" />
                                <div className="hidden lg:block w-full h-px bg-slate-100 dark:bg-slate-800 my-2" />
                                <div className="flex lg:flex-col gap-2 items-center">
                                    <input
                                        type="color"
                                        value={background.type === 'color' ? background.value : '#ffffff'}
                                        onChange={(e) => setBackground({ type: 'color', value: e.target.value })}
                                        className="w-10 h-10 rounded-full cursor-pointer shadow-md border-2 border-white shrink-0"
                                        title="BG Color"
                                    />
                                    <label className="cursor-pointer shrink-0">
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                const reader = new FileReader()
                                                reader.onload = (ev) => setBackground({ type: 'image', value: ev.target?.result as string })
                                                reader.readAsDataURL(e.target.files[0])
                                            }
                                        }} />
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200">
                                            <ImageIcon className="w-5 h-5 text-slate-500" />
                                        </div>
                                    </label>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Figure Panel Sidebar (Floating Overlay) */}
                {showFigurePanel && (
                    <div className="absolute left-4 lg:left-24 top-24 lg:top-4 z-40 w-56 h-[calc(100%-8rem)] lg:h-[calc(100%-2rem)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-left-4">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Figures</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {figures.map(fig => (
                                <div
                                    key={fig.id}
                                    onClick={() => setSelectedFigureId(fig.id)}
                                    className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${selectedFigureId === fig.id ? 'bg-blue-500 text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
                                >
                                    <span className="text-xs font-bold truncate">{fig.name}</span>
                                    {figures.length > 1 && <button onClick={(e) => { e.stopPropagation(); if (confirm('Delete?')) deleteFigure() }} className="p-1 hover:bg-black/20 rounded"><Trash2 className="w-3 h-3" /></button>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Canvas */}
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2rem] lg:rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl relative flex flex-col overflow-hidden min-h-[400px] lg:min-h-0">
                    <div className="absolute top-4 right-4 z-20 flex gap-2 scale-75 lg:scale-100 origin-top-right">
                        <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="p-2 bg-white/80 rounded-xl shadow border hover:bg-white"><ZoomOut className="w-4 h-4 text-slate-700" /></button>
                        <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="p-2 bg-white/80 rounded-xl shadow border hover:bg-white"><ZoomIn className="w-4 h-4 text-slate-700" /></button>
                        <button onClick={toggleFullScreen} className="p-2 bg-slate-900 text-white rounded-xl shadow border border-slate-900 hover:bg-slate-800"><Maximize className="w-4 h-4" /></button>
                    </div>

                    <div ref={containerRef} className="flex-1 relative cursor-crosshair touch-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:32px_32px]">
                        <canvas
                            ref={canvasRef}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            className="absolute inset-0 w-full h-full"
                        />
                        {/* Rendering Overlay */}
                        {isRecording && (
                            <div className="absolute inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4 mx-4">
                                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                    <span className="font-black text-xs uppercase tracking-widest text-slate-700 dark:text-slate-200 text-center">Processing Video...</span>
                                </div>
                            </div>
                        )}
                        {background.type === 'image' && (
                            <img
                                src={background.value}
                                className="absolute inset-0 w-full h-full object-cover pointer-events-none -z-10 opacity-50"
                                alt="bg"
                            />
                        )}
                        {background.type === 'color' && (
                            <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none" style={{ backgroundColor: background.value }} />
                        )}
                    </div>
                </div>

                {/* Right Controls */}
                <div className="w-full lg:w-64 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl p-4 lg:p-6 flex flex-col gap-4">
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                        <button onClick={() => setIsPlaying(!isPlaying)} className={`w-full py-4 rounded-xl font-black text-[10px] lg:text-xs uppercase tracking-widest flex items-center justify-center gap-2 ${isPlaying ? 'bg-slate-900 text-white' : 'bg-emerald-500 text-white'}`}>
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} {isPlaying ? 'Stop' : 'Play'}
                        </button>
                        <button onClick={addFrame} className="w-full py-4 rounded-xl bg-blue-500 text-white font-black text-[10px] lg:text-xs uppercase tracking-widest flex items-center justify-center gap-2 text-center leading-none">
                            <Plus className="w-3 h-3 lg:w-4 lg:h-4" /> Add Frame
                        </button>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                        <button onClick={downloadProject} className="py-4 lg:py-5 rounded-2xl lg:rounded-[2rem] bg-slate-100 dark:bg-slate-800 text-slate-500 font-black text-[9px] lg:text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 lg:gap-3 shadow-sm lg:shadow-xl hover:opacity-90 active:scale-95 transition-all">
                            <Download className="w-4 h-4" /> Save
                        </button>
                        <button onClick={exportVideo} disabled={isRecording} className={`py-4 lg:py-5 rounded-2xl lg:rounded-[2rem] ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'} font-black text-[9px] lg:text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 lg:gap-3 shadow-sm lg:shadow-2xl hover:opacity-90 active:scale-95 transition-all shrink-0`}>
                            {isRecording ? <div className="w-3 h-3 bg-white rounded-sm animate-spin" /> : <Video className="w-4 h-4" />}
                            {isRecording ? 'Render' : 'Export'}
                        </button>
                    </div>

                    <div className="hidden lg:flex gap-2 justify-center pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button onClick={() => isPlaying ? setIsPlaying(false) : addFrame()} className="text-[10px] font-bold text-slate-400 uppercase">
                            Space: Add Frame
                        </button>
                        <button onClick={undo} disabled={historyIndex <= 0} className={`text-[10px] font-bold uppercase ${historyIndex > 0 ? 'text-blue-500' : 'text-slate-300'}`}>
                            Ctrl+Z: Undo
                        </button>
                    </div>

                    <div className="flex-1 min-h-[100px] overflow-y-auto mt-2 lg:mt-4 grid grid-cols-4 lg:grid-cols-3 gap-2 content-start no-scrollbar">
                        {keyframes.map(k => (
                            <div
                                key={k.frameIndex}
                                onClick={() => { setCurrentFrame(k.frameIndex); setIsPlaying(false) }}
                                className={`aspect-square rounded-lg border-2 flex items-center justify-center cursor-pointer text-[10px] font-bold ${currentFrame === k.frameIndex ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-100 text-slate-300 dark:border-slate-800'}`}
                            >
                                F{k.frameIndex}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] lg:rounded-[3rem] p-4 lg:p-8 shadow-xl border border-slate-200 dark:border-slate-800">
                <input
                    type="range" min="0" max={Math.max(timelineLength, keyframes[keyframes.length - 1]?.frameIndex + 50 || 0)} value={currentFrame}
                    onChange={e => setCurrentFrame(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                />
                <div className="flex justify-between mt-2 text-[10px] lg:text-xs font-black text-slate-400 uppercase">
                    <span>Frame 0</span>
                    <span className="text-emerald-500 text-base lg:text-lg">Frame {currentFrame}</span>
                    <span className="hidden sm:inline">Bitrate: {FPS}</span>
                </div>
            </div>
        </div >
    )
}

// Helper for icon consistency (Scissors was renamed to ValidatorsIcon temporarily in my head, fixing back to Scissors)
const ValidatorsIcon = Scissors;

function ToolbarBtn({ icon: Icon, active, onClick, label, disabled, color }: { icon: React.ElementType, active?: boolean, onClick: () => void, label: string, disabled?: boolean, color?: string }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all relative group/btn shrink-0 ${disabled ? 'opacity-20 cursor-not-allowed' : 'hover:scale-110'} ${active ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500'}`}
        >
            <Icon className={`w-5 h-5 ${color || ''}`} />
            <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                {label}
            </div>
        </button>
    )
}
