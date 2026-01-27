'use client';

import { useState, useCallback, useEffect } from 'react';
import { Upload, Download, Settings, X, AlertCircle, Lock, Unlock, FileText, Trash2 } from 'lucide-react';

type Format = 'image/png' | 'image/jpeg' | 'image/webp' | 'application/pdf';

export function ImageConverter() {
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [format, setFormat] = useState<Format>('image/webp');
    const [quality, setQuality] = useState(0.8);
    const [isProcessing, setIsProcessing] = useState(false);
    const [loadingPdf, setLoadingPdf] = useState(false);

    // Resize state
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [lockRatio, setLockRatio] = useState(true);
    const [originalAspectRatio, setOriginalAspectRatio] = useState<number>(1);

    // Initial load of first file dimensions
    useEffect(() => {
        if (previewUrls.length > 0) {
            const img = new Image();
            img.onload = () => {
                if (width === 0) {
                    setWidth(img.naturalWidth);
                    setHeight(img.naturalHeight);
                    setOriginalAspectRatio(img.naturalWidth / img.naturalHeight);
                }
            };
            img.src = previewUrls[0];
        } else {
            setWidth(0);
            setHeight(0);
        }
    }, [previewUrls]);

    const handleFileProcess = async (selectedFile: File) => {
        if (selectedFile.type === 'application/pdf') {
            setLoadingPdf(true);
            try {
                // Dynamic import for client-side only to fix DOMMatrix error
                // Force load the browser build to ensure DOMMatrix and Canvas are available
                // @ts-ignore
                const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
                pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

                const arrayBuffer = await selectedFile.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                const totalPages = pdf.numPages;
                const extractedImages: string[] = [];

                // Render all pages to images
                for (let i = 1; i <= totalPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 2 }); // High res for quality
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    if (context) {
                        // @ts-ignore
                        const renderTask = page.render({ canvasContext: context, viewport });
                        await renderTask.promise;
                        extractedImages.push(canvas.toDataURL('image/jpeg', 0.9)); // Use standard JPEG intermediate
                    }
                }
                setPreviewUrls(prev => [...prev, ...extractedImages]);
                setFiles(prev => [...prev, selectedFile]);
            } catch (err) {
                console.error(err);
                alert("Failed to load PDF. Ensure it is not password protected.");
            } finally {
                setLoadingPdf(false);
            }
        } else if (selectedFile.type.startsWith('image/')) {
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrls(prev => [...prev, url]);
            setFiles(prev => [...prev, selectedFile]);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files?.[0]) {
            handleFileProcess(e.dataTransfer.files[0]);
        }
    }, []);

    const changeDimension = (dim: 'w' | 'h', val: number) => {
        if (val < 1) return;
        if (dim === 'w') {
            setWidth(val);
            if (lockRatio) setHeight(Math.round(val / originalAspectRatio));
        } else {
            setHeight(val);
            if (lockRatio) setWidth(Math.round(val * originalAspectRatio));
        }
    };

    const processAndDownload = async () => {
        setIsProcessing(true);
        try {
            // Lazy load jsPDF only when needed
            let jsPDFObj: any = null;
            if (format === 'application/pdf') {
                const mod = await import('jspdf');
                jsPDFObj = new mod.jsPDF({
                    orientation: width > height ? 'l' : 'p',
                    unit: 'px',
                    format: [width, height]
                });
            }

            // Loop through all images (pages)
            for (let i = 0; i < previewUrls.length; i++) {
                const src = previewUrls[i];
                const img = new Image();
                img.src = src;
                await new Promise(r => img.onload = r);

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) continue;

                // White background for non-transparent formats
                if (format === 'image/jpeg' || format === 'application/pdf') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, width, height);
                }

                // High quality scaling
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                // Output Generation
                if (format === 'application/pdf') {
                    if (i > 0) jsPDFObj.addPage([width, height]);
                    const imgData = canvas.toDataURL('image/jpeg', quality);
                    jsPDFObj.addImage(imgData, 'JPEG', 0, 0, width, height);
                } else {
                    // Download Individual Image
                    const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, format, quality));
                    if (blob) {
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = `converted_${i + 1}.${format.split('/')[1]}`;
                        link.click();
                    }
                }
            }

            // Save PDF at end
            if (format === 'application/pdf') {
                jsPDFObj.save("converted_compressed.pdf");
            }

        } catch (e) {
            console.error(e);
            alert("Error processing files.");
        } finally {
            setIsProcessing(false);
        }
    };

    const reset = () => {
        setFiles([]);
        setPreviewUrls([]);
        setWidth(0);
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in duration-500">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">

                {/* Upload & Preview */}
                <div className="space-y-4">
                    <div
                        onDragOver={e => e.preventDefault()}
                        onDrop={handleDrop}
                        className="bg-white dark:bg-slate-900 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl p-6 lg:p-10 flex flex-col items-center justify-center min-h-[350px] lg:min-h-[450px] relative hover:border-emerald-500/50 transition-all shadow-sm"
                    >
                        {loadingPdf ? (
                            <div className="text-center space-y-4">
                                <div className="animate-spin text-emerald-500"><Settings className="w-8 h-8" /></div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Rasterizing PDF Pages...</p>
                            </div>
                        ) : previewUrls.length === 0 ? (
                            <div className="text-center space-y-6">
                                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                                    <Upload className="w-10 h-10" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Upload Image or PDF</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">DRAG & DROP OR BROWSE</p>
                                </div>
                                <label className="inline-block px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest text-xs rounded-2xl cursor-pointer hover:scale-105 transition-all shadow-xl shadow-black/10 dark:shadow-white/10">
                                    Choose Files
                                    <input type="file" accept="image/*,application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFileProcess(e.target.files[0])} />
                                </label>
                            </div>
                        ) : (
                            <div className="absolute inset-0 p-4 lg:p-6 overflow-y-auto custom-scrollbar">
                                <button onClick={reset} className="absolute top-4 right-4 z-20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-900 dark:text-white p-3 rounded-2xl shadow-xl hover:bg-red-500 hover:text-white transition-all border border-slate-100 dark:border-slate-700">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 lg:gap-4">
                                    {previewUrls.map((url, i) => (
                                        <div key={i} className="relative aspect-[3/4] bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-300">
                                            <img src={url} className="w-full h-full object-cover" />
                                            <div className="absolute bottom-2 left-2 bg-slate-900/60 backdrop-blur-md text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">P{i + 1}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    {previewUrls.length > 0 && (
                        <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            {previewUrls.length} ITEMS READY FOR ACTION
                        </p>
                    )}
                </div>

                {/* Settings */}
                <div className="space-y-6 lg:py-4">
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 p-6 lg:p-10 space-y-8">

                        {/* Format */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Expression</label>
                            <div className="grid grid-cols-2 gap-2">
                                {(['image/webp', 'image/png', 'image/jpeg', 'application/pdf'] as const).map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFormat(f)}
                                        className={`py-3.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2 ${format === f ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-slate-50 dark:border-slate-800 text-slate-500 hover:border-emerald-200 dark:hover:border-emerald-500/30'}`}
                                    >
                                        {f === 'application/pdf' ? <FileText className="w-4 h-4" /> : <div className="w-2 h-2 bg-current rounded-full" />}
                                        {f.split('/')[1].toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dimensions */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resolution (PX)</label>
                                <button onClick={() => setLockRatio(!lockRatio)} className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${lockRatio ? 'text-emerald-500' : 'text-slate-300'}`}>
                                    {lockRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />} Locked
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative flex-1">
                                    <input type="number" value={width || ''} onChange={(e) => changeDimension('w', Number(e.target.value))} className="w-full p-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-50 dark:border-slate-800 rounded-2xl text-center font-mono font-black text-sm outline-none focus:border-emerald-500 transition-all" placeholder="W" />
                                </div>
                                <span className="text-slate-200 font-black">×</span>
                                <div className="relative flex-1">
                                    <input type="number" value={height || ''} onChange={(e) => changeDimension('h', Number(e.target.value))} className="w-full p-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-50 dark:border-slate-800 rounded-2xl text-center font-mono font-black text-sm outline-none focus:border-emerald-500 transition-all" placeholder="H" />
                                </div>
                            </div>
                        </div>

                        {/* Quality */}
                        {format !== 'image/png' && (
                            <div className="space-y-4 pt-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-slate-400">Compression Precision</span>
                                    <span className="text-emerald-500">{Math.round(quality * 100)}%</span>
                                </div>
                                <div className="relative h-6 flex items-center">
                                    <input
                                        type="range" min="0.1" max="1.0" step="0.05"
                                        value={quality} onChange={e => setQuality(Number(e.target.value))}
                                        className="w-full accent-emerald-500 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer appearance-none"
                                    />
                                </div>
                                <p className="text-[9px] text-slate-400 font-bold leading-normal uppercase tracking-widest">
                                    Lower % = Smaller size. Higher % = Better clarity.
                                </p>
                            </div>
                        )}

                        <button
                            onClick={processAndDownload}
                            disabled={previewUrls.length === 0 || isProcessing}
                            className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest text-sm rounded-2xl shadow-2xl shadow-black/10 dark:shadow-white/10 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-3 lg:mt-4"
                        >
                            {isProcessing ? (
                                <div className="flex items-center gap-3">
                                    <Settings className="w-5 h-5 animate-spin" />
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                <>
                                    <Download className="w-5 h-5" />
                                    <span>{format === 'application/pdf' ? 'Generate PDF' : 'Download Bundle'}</span>
                                </>
                            )}
                        </button>

                    </div>
                </div>

            </div>
        </div>
    );
}
