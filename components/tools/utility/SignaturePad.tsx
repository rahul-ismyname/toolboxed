'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, Trash2, Undo } from 'lucide-react';

export function SignaturePad() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [penColor, setPenColor] = useState('#000000');
    const [penWidth, setPenWidth] = useState(2);
    const [isEmpty, setIsEmpty] = useState(true);
    const [history, setHistory] = useState<ImageData[]>([]);

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set initial scale for HD
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        ctx.scale(2, 2);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = '#ffffff'; // Transparent conceptually, but we draw strokes.
        // If we want transparency, we don't fill.
    }, []);

    // Resize observer
    useEffect(() => {
        const handleResize = () => {
            // Optional: Handle resize logic if needed to preserve drawing
            // For now, simplicity: fixed aspect or clear on major resize might be safer
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const saveState = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            setHistory(prev => [...prev.slice(-10), ctx.getImageData(0, 0, canvas.width, canvas.height)]);
        }
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        saveState(); // Save before new stroke

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penWidth;
        setIsEmpty(false);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        // Prevent scrolling on touch
        if ('touches' in e) {
            // e.preventDefault(); // Warning: passive listener issue in React 18+ usually requires CSS touch-action: none
        }

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx) ctx.closePath();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        saveState();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsEmpty(true);
    };

    const undo = () => {
        if (history.length === 0) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const newHistory = [...history];
        const lastState = newHistory.pop();
        setHistory(newHistory);

        if (lastState) {
            ctx.putImageData(lastState, 0, 0);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const download = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = 'signature.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">

            <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden p-5 lg:p-8 space-y-6">

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label className="w-8 h-8 lg:w-6 lg:h-6 rounded-full cursor-pointer border shadow-sm flex items-center justify-center transition-transform hover:scale-110 active:scale-95" style={{ backgroundColor: penColor }}>
                                <input type="color" value={penColor} onChange={(e) => setPenColor(e.target.value)} className="opacity-0 w-0 h-0" />
                            </label>
                        </div>
                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                            {[1, 2, 4, 6].map(width => (
                                <button
                                    key={width}
                                    onClick={() => setPenWidth(width)}
                                    className={`w-10 h-10 lg:w-8 lg:h-8 min-w-[40px] lg:min-w-[32px] rounded-lg flex items-center justify-center transition-all ${penWidth === width ? 'bg-slate-100 dark:bg-slate-800 text-emerald-500 ring-2 ring-emerald-500/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-400'}`}
                                >
                                    <div className="bg-current rounded-full" style={{ width: width * 1.5, height: width * 1.5 }}></div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={undo}
                            disabled={history.length === 0}
                            className="p-3 lg:p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30 transition-colors"
                            title="Undo"
                        >
                            <Undo className="w-5 h-5 lg:w-4 lg:h-4" />
                        </button>
                        <button
                            onClick={clearCanvas}
                            className="p-3 lg:p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                            title="Clear"
                        >
                            <Trash2 className="w-5 h-5 lg:w-4 lg:h-4" />
                        </button>
                    </div>
                </div>

                {/* Drawing Area */}
                <div className="relative w-full aspect-[4/3] sm:aspect-[2/1] bg-white dark:bg-white rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-inner cursor-crosshair overflow-hidden touch-none" style={{ touchAction: 'none' }}>
                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    {isEmpty && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 px-4 text-center">
                            <span className="text-2xl lg:text-4xl font-handwriting text-slate-400 select-none">Draw your signature here</span>
                        </div>
                    )}

                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-full block touch-none"
                    />
                </div>

                {/* Footer / Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                    <div className="text-[10px] lg:text-xs text-slate-400 font-medium order-2 sm:order-1">
                        SVG/Canvas Engine · Transparent background
                    </div>
                    <button
                        onClick={download}
                        disabled={isEmpty}
                        className="w-full sm:w-auto py-4 px-10 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
                    >
                        <Download className="w-5 h-5" />
                        Download Signature
                    </button>
                </div>

            </div>
        </div>
    );
}
