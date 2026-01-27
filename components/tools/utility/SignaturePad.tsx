'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, Trash2, Undo, PenTool, Eraser } from 'lucide-react';

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
        <div className="w-full max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-6 text-center sm:text-left">
                    <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] shadow-2xl">
                        <PenTool className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Identity Vector</h2>
                        <p className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Biometric Canvas</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden p-8 lg:p-12 space-y-8">

                {/* Drawing Monitor */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative w-full aspect-[4/3] sm:aspect-[2/1] bg-white dark:bg-white rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 shadow-inner cursor-crosshair overflow-hidden touch-none" style={{ touchAction: 'none' }}>
                        {/* Background Grid Pattern */}
                        <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-emerald-500/10 rounded-tl-[2rem] pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-indigo-500/10 rounded-br-[2rem] pointer-events-none" />

                        {isEmpty && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4 text-center">
                                <span className="text-2xl lg:text-4xl font-black text-slate-200 uppercase tracking-widest opacity-50 select-none animate-pulse">
                                    Initiate Signing Sequence
                                </span>
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
                            className="w-full h-full block touch-none z-10 relative"
                        />
                    </div>
                </div>

                {/* Control Deck */}
                <div className="flex flex-col xl:flex-row items-center justify-between gap-8 bg-slate-50 dark:bg-slate-950/50 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">

                    {/* Tools */}
                    <div className="flex flex-wrap items-center justify-center gap-6">
                        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            {[
                                { color: '#000000', label: 'Ink' },
                                { color: '#10b981', label: 'Emerald' },
                                { color: '#3b82f6', label: 'Cobalt' }
                            ].map((ink) => (
                                <button
                                    key={ink.color}
                                    onClick={() => setPenColor(ink.color)}
                                    className={`w-11 h-11 rounded-xl transition-all flex items-center justify-center ${penColor === ink.color ? 'ring-2 ring-slate-900 dark:ring-white scale-110' : 'hover:scale-110 opacity-50 hover:opacity-100'}`}
                                    style={{ backgroundColor: ink.color }}
                                />
                            ))}
                            <div className="w-px h-8 bg-slate-100 dark:bg-slate-800 mx-2" />
                            <label className="w-11 h-11 rounded-xl cursor-pointer border-2 border-dashed border-slate-300 flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 transition-colors">
                                <input type="color" value={penColor} onChange={(e) => setPenColor(e.target.value)} className="opacity-0 w-0 h-0" />
                                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-rose-500 via-emerald-500 to-blue-500" />
                            </label>
                        </div>

                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            {[1, 2, 4, 6].map(width => (
                                <button
                                    key={width}
                                    onClick={() => setPenWidth(width)}
                                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${penWidth === width ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400'}`}
                                >
                                    <div className="bg-current rounded-full" style={{ width: width * 1.5, height: width * 1.5 }}></div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={undo}
                            disabled={history.length === 0}
                            className="w-14 h-14 bg-white dark:bg-slate-900 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm flex items-center justify-center disabled:opacity-30 transition-all hover:scale-105 active:scale-95"
                            title="Undo"
                        >
                            <Undo className="w-5 h-5" />
                        </button>
                        <button
                            onClick={clearCanvas}
                            className="w-14 h-14 bg-white dark:bg-slate-900 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-900/50 shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                            title="Clear"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={download}
                            disabled={isEmpty}
                            className="h-14 px-8 bg-slate-900 dark:bg-white hover:bg-emerald-500 dark:hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 text-white dark:text-slate-900 hover:text-white dark:hover:text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-slate-900/10 disabled:shadow-none active:scale-95 transition-all flex items-center justify-center gap-3 min-w-[200px]"
                        >
                            <Download className="w-5 h-5" />
                            <span>Capture Vector</span>
                        </button>
                    </div>
                </div>

                <div className="text-center pt-4 opacity-40">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">
                        High-Definition Vector Output // 200% Scale
                    </p>
                </div>

            </div>
        </div>
    );
}
