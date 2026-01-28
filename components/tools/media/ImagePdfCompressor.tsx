'use client';

import { useState, useCallback, useEffect } from 'react';
import { Upload, Download, Settings, X, AlertCircle, Lock, Unlock, FileText, Trash2, ArrowRight } from 'lucide-react';

type Format = 'image/png' | 'image/jpeg' | 'image/webp' | 'application/pdf';

export function ImagePdfCompressor() {
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [format, setFormat] = useState<Format>('image/webp');
    const [quality, setQuality] = useState(0.8);

    // Target Size State
    const [useTargetSize, setUseTargetSize] = useState(true);
    const [targetSizeKB, setTargetSizeKB] = useState<number | string>(100);



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
            setFormat('application/pdf'); // Auto-select PDF format
            setLoadingPdf(true);
            try {
                // Dynamic import for client-side only to fix DOMMatrix error
                // Force load the browser build to ensure DOMMatrix and Canvas are available
                // @ts-ignore
                const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
                pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

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

    // Helper to get blob size
    const getBlob = (canvas: HTMLCanvasElement, quality: number, type: string): Promise<Blob | null> => {
        return new Promise(r => canvas.toBlob(r, type, quality));
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
                    format: [width, height] // Initial page size
                });
            }

            // Loop through all images (pages)
            for (let i = 0; i < previewUrls.length; i++) {
                const src = previewUrls[i];
                const img = new Image();
                img.src = src;
                await new Promise(r => img.onload = r);

                // Start with requested dimensions
                let currentWidth = width;
                let currentHeight = height;

                // Working canvas
                const canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');

                // Draw function for iterative resizing
                const draw = (w: number, h: number) => {
                    canvas.width = w;
                    canvas.height = h;
                    ctx = canvas.getContext('2d');
                    if (!ctx) return;
                    if (format === 'image/jpeg' || format === 'application/pdf') {
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, w, h);
                    }
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.drawImage(img, 0, 0, w, h);
                };

                // Initial draw
                draw(currentWidth, currentHeight);

                let finalQuality = quality;
                let finalBlob: Blob | null = null;
                const fmt = format === 'application/pdf' ? 'image/jpeg' : format;

                // --- COMPRESSION LOGIC ---
                if (useTargetSize && format !== 'image/png') {
                    // If capturing to PDF, the target size applies to the WHOLE document.
                    // We distribute the budget roughly equally across pages.
                    // We also reserve ~5-10% or a fixed amount for PDF structure overhead if possible, 
                    // but for now simple division is a standard approximation.
                    const totalTargetBytes = (Number(targetSizeKB) || 100) * 1024;
                    const isPdfOutput = format === 'application/pdf';

                    // IF PDF: Divide by page count. IF Image: Target is per file.
                    const targetBytes = isPdfOutput ? Math.floor(totalTargetBytes / previewUrls.length) : totalTargetBytes;

                    let bestBlob: Blob | null = null;
                    let minQ = 0.1;
                    let maxQ = 1.0;

                    // Iterative Resize Loop (max 5 resize steps)
                    for (let step = 0; step < 5; step++) {
                        // Check lowest quality at this resolution first
                        const lowBlob = await getBlob(canvas, 0.1, fmt);

                        if (lowBlob && lowBlob.size > targetBytes) {
                            // Even lowest quality is too big -> FORCE RESIZE
                            currentWidth = Math.floor(currentWidth * 0.75);
                            currentHeight = Math.floor(currentHeight * 0.75);
                            draw(currentWidth, currentHeight);
                            continue; // Restart search at new resolution
                        }

                        // Quality Binary Search
                        let l = minQ, r = maxQ;
                        let validBlobForThisRes: Blob | null = null;

                        for (let j = 0; j < 6; j++) {
                            const mid = (l + r) / 2;
                            const blob = await getBlob(canvas, mid, fmt);
                            if (!blob) break;

                            if (blob.size <= targetBytes) {
                                validBlobForThisRes = blob;
                                finalQuality = mid;
                                l = mid; // Try better quality
                            } else {
                                r = mid; // Too big
                            }
                        }

                        if (validBlobForThisRes) {
                            bestBlob = validBlobForThisRes;
                            break; // Found a fit!
                        } else {
                            // If binary search failed (shouldn't happen if lowBlob check passed), force resize anyway as fallback
                            currentWidth = Math.floor(currentWidth * 0.8);
                            currentHeight = Math.floor(currentHeight * 0.8);
                            draw(currentWidth, currentHeight);
                        }
                    }

                    finalBlob = bestBlob || await getBlob(canvas, 0.5, fmt); // Fallback

                } else {
                    // Manual Quality
                    finalBlob = await getBlob(canvas, quality, fmt);
                }

                // --- OUTPUT GENERATION ---
                if (format === 'application/pdf') {
                    // Update Page Size to match the final resized image
                    if (i > 0) jsPDFObj.addPage([currentWidth, currentHeight]);
                    else {
                        // Fix first page size
                        jsPDFObj.deletePage(1);
                        jsPDFObj.addPage([currentWidth, currentHeight]);
                    }

                    const r = new FileReader();
                    r.readAsDataURL(finalBlob!);
                    await new Promise(res => r.onloadend = res);
                    jsPDFObj.addImage(r.result as string, 'JPEG', 0, 0, currentWidth, currentHeight);
                } else {
                    if (finalBlob) {
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(finalBlob);

                        // Determine Filename
                        let name = `compressed_${i + 1}`;

                        // If 1:1 mapping (Images uploaded directly)
                        if (files.length === previewUrls.length) {
                            const originalName = files[i].name;
                            const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
                            name = `${nameWithoutExt}_compressed`;
                        }
                        // If PDF Pages (1 PDF -> Multiple Images)
                        else if (files.length === 1 && files[0].type === 'application/pdf') {
                            const originalName = files[0].name;
                            const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
                            name = `${nameWithoutExt}_page_${i + 1}_compressed`;
                        }

                        link.download = `${name}.${format.split('/')[1]}`;
                        link.click();
                    }
                }
            }

            if (format === 'application/pdf') {
                let pdfName = "compressed_document.pdf";
                if (files.length > 0) {
                    const firstFile = files[0].name;
                    const nameWithoutExt = firstFile.substring(0, firstFile.lastIndexOf('.')) || firstFile;
                    pdfName = `${nameWithoutExt}_compressed.pdf`;
                }
                jsPDFObj.save(pdfName);
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
                                <button onClick={() => {
                                    if (previewUrls.length > 0) {
                                        const img = new Image();
                                        img.onload = () => {
                                            setWidth(img.naturalWidth);
                                            setHeight(img.naturalHeight);
                                            setOriginalAspectRatio(img.naturalWidth / img.naturalHeight);
                                        };
                                        img.src = previewUrls[0];
                                    }
                                }} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors">
                                    Reset
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

                        {/* Compression Mode Selector */}
                        {format !== 'image/png' && (
                            <div className="space-y-4 pt-2">
                                <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                    <button
                                        onClick={() => setUseTargetSize(true)}
                                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${useTargetSize ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Target Size
                                    </button>
                                    <button
                                        onClick={() => setUseTargetSize(false)}
                                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${!useTargetSize ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Manual Quality
                                    </button>
                                </div>

                                {useTargetSize ? (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                            <span className="text-slate-400">Max File Size (KB)</span>
                                            <span className="text-emerald-500">{targetSizeKB} KB</span>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="1"
                                                max="10000"
                                                value={targetSizeKB}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    if (val === '') setTargetSizeKB('');
                                                    else setTargetSizeKB(Number(val));
                                                }}
                                                className="w-full p-4 bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-500/20 rounded-2xl text-center font-mono font-black text-lg outline-none focus:border-emerald-500 text-emerald-600 dark:text-emerald-400 transition-all"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-emerald-500/50 pointer-events-none">KB</div>
                                        </div>
                                        <p className="text-[9px] text-slate-400 font-bold leading-normal uppercase tracking-widest mt-2">
                                            System will adjust quality to fit under {targetSizeKB}KB.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
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
                                    </div>
                                )}
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
                                    <span>{format === 'application/pdf' ? 'Compress & Generate PDF' : 'Compress & Download'}</span>
                                </>
                            )}
                        </button>

                    </div>
                </div>

            </div>
        </div>
    );
}
