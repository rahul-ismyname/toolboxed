'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Combine,
    Scissors,
    Lock,
    PenTool,
    Upload,
    FileText,
    Trash2,
    Download,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Loader2,
    Shield
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import SignaturePad from 'signature_pad';
import * as pdfjsLib from 'pdfjs-dist';
import initQpdf from 'qpdf-wasm';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdfjs/pdf.worker.min.mjs`;
}

// --- TYPES ---
type PDFMode = 'merge' | 'split' | 'protect' | 'sign';
type SignatureSize = 'small' | 'medium' | 'large';
type SplitMode = 'range' | 'every' | 'chunks' | 'selection';

interface SignaturePlacement {
    id: string;
    pageIndex: number;
    x: number;
    y: number;
    size: SignatureSize;
}

interface PDFFile {
    id: string;
    file: File;
    name: string;
    size: string;
    preview?: string;
}

export function PDFMaster() {
    const [mode, setMode] = useState<PDFMode | null>(null);
    const [files, setFiles] = useState<PDFFile[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Split State
    const [pageRange, setPageRange] = useState('');
    const [splitMode, setSplitMode] = useState<SplitMode>('range');
    const [chunkSize, setChunkSize] = useState(2);
    const [selectedPages, setSelectedPages] = useState<number[]>([]);

    // Protection State
    const [password, setPassword] = useState('');

    // Sign State
    const signaturePadRef = useRef<SignaturePad | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const previewContainerRef = useRef<HTMLDivElement | null>(null);
    const [signatureImage, setSignatureImage] = useState<string | null>(null);

    // Multi-signature state
    const [placements, setPlacements] = useState<SignaturePlacement[]>([]);
    const [activePlacementId, setActivePlacementId] = useState<string | null>(null);
    const [pdfPreviews, setPdfPreviews] = useState<string[]>([]);
    const [pdfPageSizes, setPdfPageSizes] = useState<Array<{ width: number, height: number }>>([]);
    const [signSize, setSignSize] = useState<SignatureSize>('medium');

    const downloadBlob = (data: Uint8Array, fileName: string) => {
        const blob = new Blob([data.slice()], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                file,
                name: file.name,
                size: formatSize(file.size)
            }));

            if (mode === 'merge') {
                setFiles(prev => [...prev, ...newFiles]);
            } else {
                setFiles(newFiles.slice(0, 1)); // Other modes usually take one file
            }
        }
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    // --- LOGIC: SPLIT ---
    const splitPDF = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);
        setError(null);
        try {
            const pdfBytes = await files[0].file.arrayBuffer();
            const sourcePdf = await PDFDocument.load(pdfBytes);
            const totalPages = sourcePdf.getPageCount();

            const createAndDownload = async (pageIndices: number[], suffix: string) => {
                const newPdf = await PDFDocument.create();
                const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
                copiedPages.forEach(page => newPdf.addPage(page));
                const bytes = await newPdf.save();
                downloadBlob(bytes, `${suffix}_${files[0].name}`);
            };

            if (splitMode === 'range') {
                if (!pageRange) {
                    setError('Please enter a page range.');
                    return;
                }
                const pagesToExtract: number[] = [];
                const parts = pageRange.split(',').map(p => p.trim());
                parts.forEach(part => {
                    if (part.includes('-')) {
                        const [start, end] = part.split('-').map(Number);
                        for (let i = start; i <= end; i++) pagesToExtract.push(i - 1);
                    } else {
                        pagesToExtract.push(Number(part) - 1);
                    }
                });
                const validPages = pagesToExtract.filter(p => p >= 0 && p < totalPages);
                if (validPages.length === 0) throw new Error('No valid pages found in range.');
                await createAndDownload(validPages, 'split');
            } else if (splitMode === 'every') {
                for (let i = 0; i < totalPages; i++) {
                    await createAndDownload([i], `page_${i + 1}`);
                }
            } else if (splitMode === 'chunks') {
                for (let i = 0; i < totalPages; i += chunkSize) {
                    const chunk = [];
                    for (let j = i; j < i + chunkSize && j < totalPages; j++) {
                        chunk.push(j);
                    }
                    await createAndDownload(chunk, `part_${Math.floor(i / chunkSize) + 1}`);
                }
            } else if (splitMode === 'selection') {
                if (selectedPages.length === 0) {
                    setError('Please select at least one page.');
                    return;
                }
                const sortedPages = [...selectedPages].sort((a, b) => a - b);
                await createAndDownload(sortedPages, 'selection');
            }

            setSuccess('PDF split successfully!');
        } catch (err) {
            console.error(err);
            setError('Failed to split PDF. Check your settings.');
        } finally {
            setIsProcessing(false);
        }
    };

    // --- LOGIC: SIGN ---

    useEffect(() => {
        const resizeCanvas = () => {
            if (canvasRef.current) {
                const ratio = Math.max(window.devicePixelRatio || 1, 1);
                canvasRef.current.width = canvasRef.current.offsetWidth * ratio;
                canvasRef.current.height = canvasRef.current.offsetHeight * ratio;
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
                signaturePadRef.current?.clear();
            }
        };

        if (mode === 'sign' && canvasRef.current && !signaturePadRef.current) {
            signaturePadRef.current = new SignaturePad(canvasRef.current);
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
        }
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (signaturePadRef.current) {
                signaturePadRef.current.off();
                signaturePadRef.current = null;
            }
        };
    }, [mode, files.length]);

    useEffect(() => {
        const loadPdfPreviews = async () => {
            if ((mode === 'sign' || mode === 'split') && files.length > 0) {
                try {
                    const file = files[0].file;
                    const arrayBuffer = await file.arrayBuffer();
                    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                    const pdf = await loadingTask.promise;

                    const previews: string[] = [];
                    const sizes: Array<{ width: number, height: number }> = [];

                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const viewport = page.getViewport({ scale: 1.0 }); // Lower scale for thumbnails/grid
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d', { willReadFrequently: true });
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        if (context) {
                            // @ts-ignore
                            await page.render({ canvasContext: context, viewport }).promise;
                            previews.push(canvas.toDataURL());
                            sizes.push({ width: viewport.width, height: viewport.height });
                        }
                    }

                    setPdfPreviews(previews);
                    setPdfPageSizes(sizes);

                    // Default placement if none exists
                    if (placements.length === 0) {
                        const newId = Math.random().toString(36).substr(2, 9);
                        setPlacements([{
                            id: newId,
                            pageIndex: pdf.numPages - 1,
                            x: 80,
                            y: 10,
                            size: 'medium'
                        }]);
                        setActivePlacementId(newId);
                    }
                } catch (err) {
                    console.error('Error loading PDF previews:', err);
                }
            }
        };

        loadPdfPreviews();
    }, [mode, files]);

    const handlePreviewClick = (pageIndex: number, e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const borderSize = 4; // Matching the border-4 class

        // Calculate click relative to the inner content (inside borders)
        const innerX = e.clientX - rect.left - borderSize;
        const innerY = e.clientY - rect.top - borderSize;
        const innerWidth = rect.width - (borderSize * 2);
        const innerHeight = rect.height - (borderSize * 2);

        const x = Math.max(0, Math.min((innerX / innerWidth) * 100, 100));
        const y = Math.max(0, Math.min((innerY / innerHeight) * 100, 100));

        if (activePlacementId) {
            setPlacements(prev => prev.map(p =>
                p.id === activePlacementId ? { ...p, pageIndex, x, y } : p
            ));
        } else {
            const newId = Math.random().toString(36).substr(2, 9);
            setPlacements(prev => [...prev, {
                id: newId,
                pageIndex,
                x,
                y,
                size: signSize
            }]);
            setActivePlacementId(newId);
        }
    };

    const clearSignature = () => {
        signaturePadRef.current?.clear();
        setSignatureImage(null);
    };

    const saveSignature = () => {
        if (signaturePadRef.current?.isEmpty()) return;
        const dataUrl = signaturePadRef.current?.toDataURL();
        if (dataUrl) setSignatureImage(dataUrl);
    };

    const signPDF = async () => {
        if (files.length === 0 || !signatureImage || placements.length === 0) return;
        setIsProcessing(true);
        setError(null);
        try {
            const pdfBytes = await files[0].file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const signatureImg = await pdfDoc.embedPng(signatureImage);
            const pages = pdfDoc.getPages();

            const signSizeMap = {
                small: 0.15,  // 15% of page width
                medium: 0.25, // 25% of page width
                large: 0.35   // 35% of page width
            };

            for (const placement of placements) {
                const page = pages[placement.pageIndex];
                if (!page) continue;

                const widthPercentage = signSizeMap[placement.size] || 0.25;
                const scaledWidth = page.getWidth() * widthPercentage;
                const aspectRatio = signatureImg.height / signatureImg.width;
                const scaledHeight = scaledWidth * aspectRatio;

                // Coordinate mapping (placement.x/y are in percentages of preview)
                // PDF-lib uses points (72 DPI) where 0,0 is bottom-left
                let xPos = (placement.x / 100) * page.getWidth() - (scaledWidth / 2);
                let yPos = page.getHeight() - ((placement.y / 100) * page.getHeight()) - (scaledHeight / 2);

                // Clamp to page bounds
                xPos = Math.max(0, Math.min(xPos, page.getWidth() - scaledWidth));
                yPos = Math.max(0, Math.min(yPos, page.getHeight() - scaledHeight));

                page.drawImage(signatureImg, {
                    x: xPos,
                    y: yPos,
                    width: scaledWidth,
                    height: scaledHeight,
                });
            }

            const signedPdfBytes = await pdfDoc.save();
            downloadBlob(signedPdfBytes, `signed_${files[0].name}`);
            setSuccess('PDF signed successfully!');
        } catch (err) {
            console.error(err);
            setError('Failed to sign PDF.');
        } finally {
            setIsProcessing(false);
        }
    };
    const mergePDFs = async () => {
        if (files.length < 2) return;
        setIsProcessing(true);
        setError(null);
        try {
            const mergedPdf = await PDFDocument.create();
            for (const pdfFile of files) {
                const pdfBytes = await pdfFile.file.arrayBuffer();
                const pdf = await PDFDocument.load(pdfBytes);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }
            const mergedPdfBytes = await mergedPdf.save();
            downloadBlob(mergedPdfBytes, 'merged_document.pdf');
            setSuccess('PDFs merged successfully!');
        } catch (err) {
            setError('Failed to merge PDFs. Ensure they are not password protected.');
        } finally {
            setIsProcessing(false);
        }
    };
    // --- LOGIC: PROTECT ---
    const protectPDF = async () => {
        if (files.length === 0 || !password) return;
        setIsProcessing(true);
        setError(null);
        try {
            const pdfBytes = await files[0].file.arrayBuffer();
            const qpdf = await initQpdf({
                locateFile: (path: string) => `/qpdf/${path}`
            });

            qpdf.FS.writeFile('input.pdf', new Uint8Array(pdfBytes));

            // Execute encryption: user-password, owner-password, key-length, restrictions
            // We use the same for user/owner and 256-bit AES
            qpdf.callMain(['--encrypt', password, password, '256', '--', 'input.pdf', 'output.pdf']);

            const protectedBytes = qpdf.FS.readFile('output.pdf');
            downloadBlob(protectedBytes, `protected_${files[0].name}`);
            setSuccess('PDF protected successfully!');
        } catch (err) {
            console.error('QPDF encryption error:', err);
            setError('Failed to protect PDF. Encryption error.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-[800px] bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 transition-all">

            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-600 rounded-2xl shadow-lg shadow-red-500/20 text-white">
                        <Shield className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white">PDF Master</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Lock className="w-3 h-3" /> 100% Client-Side Protection
                        </p>
                    </div>
                </div>

                {mode && (
                    <button
                        onClick={() => { setMode(null); setFiles([]); setError(null); setSuccess(null); }}
                        className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-all"
                    >
                        Back to Tools
                    </button>
                )}
            </div>

            {/* Selection Grid */}
            {!mode && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { id: 'merge', title: 'Merge PDFs', desc: 'Combine multiple files into one', icon: Combine, color: 'blue' },
                        { id: 'split', title: 'Split PDF', desc: 'Extract pages into a new file', icon: Scissors, color: 'emerald' },
                        { id: 'protect', title: 'Protect', desc: 'Add password encryption', icon: Lock, color: 'purple' },
                        { id: 'sign', title: 'Sign Document', desc: 'Draw and place signatures', icon: PenTool, color: 'amber' },
                    ].map(tool => {
                        const Icon = tool.icon;
                        return (
                            <button
                                key={tool.id}
                                onClick={() => setMode(tool.id as PDFMode)}
                                className="group p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-slate-900 dark:hover:border-white transition-all text-left shadow-sm hover:shadow-xl hover:-translate-y-1"
                            >
                                <div className={`w-12 h-12 mb-6 rounded-2xl flex items-center justify-center transition-all bg-${tool.color}-50 dark:bg-${tool.color}-500/10 text-${tool.color}-600`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{tool.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{tool.desc}</p>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Tool Interface */}
            {mode && (
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">

                        {/* File Upload Area */}
                        {(mode === 'merge' || files.length === 0) && (
                            <div className="relative border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center hover:border-slate-200 dark:hover:border-slate-700 transition-all mb-8">
                                <input
                                    type="file"
                                    multiple={mode === 'merge'}
                                    accept=".pdf"
                                    onChange={handleFileSelect}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Drop your PDF here</h3>
                                <p className="text-sm text-slate-400">or click to browse your files</p>
                            </div>
                        )}

                        {/* File List */}
                        {files.length > 0 && (
                            <div className="space-y-3 mb-8">
                                {files.map(file => (
                                    <div key={file.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center text-red-500">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{file.name}</h4>
                                                <p className="text-xs text-slate-400">{file.size}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFile(file.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Mode Specific Options */}
                        {mode === 'split' && files.length > 0 && (
                            <div className="space-y-8">
                                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
                                    {(['range', 'every', 'chunks', 'selection'] as const).map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setSplitMode(m)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${splitMode === m ? 'bg-white dark:bg-slate-700 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            {m === 'range' ? 'Custom Range' : m === 'every' ? 'All Pages' : m === 'chunks' ? 'Fixed Chunks' : 'Visual Select'}
                                        </button>
                                    ))}
                                </div>

                                {splitMode === 'range' && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Pages to Extract</label>
                                        <input
                                            type="text"
                                            value={pageRange}
                                            onChange={(e) => setPageRange(e.target.value)}
                                            placeholder="e.g. 1, 3-5, 8"
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-emerald-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                )}

                                {splitMode === 'chunks' && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Pages per File</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={chunkSize}
                                            onChange={(e) => setChunkSize(parseInt(e.target.value) || 1)}
                                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-emerald-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                )}

                                {(splitMode === 'selection' || splitMode === 'every') && pdfPreviews.length > 0 && (
                                    <div className="animate-in fade-in duration-500">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-6">
                                            {splitMode === 'selection' ? 'Select Pages to Include' : 'Preview all pages'}
                                        </label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-2">
                                            {pdfPreviews.map((preview, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => {
                                                        if (splitMode === 'selection') {
                                                            setSelectedPages(prev =>
                                                                prev.includes(idx) ? prev.filter(p => p !== idx) : [...prev, idx]
                                                            );
                                                        }
                                                    }}
                                                    className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer transition-all border-4 ${splitMode === 'selection'
                                                        ? selectedPages.includes(idx)
                                                            ? 'border-emerald-500 ring-4 ring-emerald-500/20'
                                                            : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'
                                                        : 'border-slate-50 dark:border-slate-900 shadow-sm'
                                                        }`}
                                                >
                                                    <img src={preview} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                                                    <div className="absolute top-2 right-2 bg-slate-900/50 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-bold">
                                                        {idx + 1}
                                                    </div>
                                                    {splitMode === 'selection' && selectedPages.includes(idx) && (
                                                        <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                                                            <CheckCircle2 className="w-8 h-8 text-emerald-500 fill-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {mode === 'protect' && files.length > 0 && (
                            <div className="mb-8">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Set Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter secure password"
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-purple-500 outline-none transition-all font-medium"
                                />
                            </div>
                        )}

                        {mode === 'sign' && files.length > 0 && (
                            <div className="mb-8 space-y-4">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Draw Your Signature</label>
                                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 p-4">
                                    <canvas
                                        ref={canvasRef}
                                        width={600}
                                        height={200}
                                        className="w-full h-[200px] bg-white rounded-lg cursor-crosshair"
                                    />
                                    <div className="flex gap-2 mt-4">
                                        <button onClick={clearSignature} className="px-4 py-2 bg-white dark:bg-slate-700 text-slate-600 rounded-xl text-xs font-bold border">Clear</button>
                                        <button onClick={saveSignature} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">Adopt Signature</button>
                                    </div>
                                </div>

                                {/* Signature Position & Preview */}
                                {signatureImage && (
                                    <div className="space-y-4 animate-in fade-in duration-300">
                                        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded p-1 border border-slate-100">
                                                <img src={signatureImage} alt="Sig" className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-emerald-600">Signature Captured!</p>
                                                <p className="text-xs text-slate-500">Ready to be placed on the document.</p>
                                            </div>
                                        </div>

                                        {/* Visual Placement Preview */}
                                        {pdfPreviews.length > 0 && (
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400">Place Signatures on Pages</label>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setActivePlacementId(null)}
                                                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${!activePlacementId ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}
                                                        >
                                                            Add New
                                                        </button>
                                                        {activePlacementId && (
                                                            <button
                                                                onClick={() => {
                                                                    setPlacements(prev => prev.filter(p => p.id !== activePlacementId));
                                                                    setActivePlacementId(null);
                                                                }}
                                                                className="px-4 py-2 bg-red-50 text-red-600 border-red-100 rounded-xl text-xs font-bold border hover:bg-red-100 transition-all"
                                                            >
                                                                Remove Selected
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-8 max-h-[600px] overflow-y-auto p-4 rounded-3xl bg-slate-50 dark:bg-slate-950/50 border-2 border-slate-100 dark:border-slate-800/50">
                                                    {pdfPreviews.map((preview, pageIndex) => (
                                                        <div key={pageIndex} className="relative group">
                                                            <div className="absolute -left-12 top-0 text-[10px] font-black text-slate-300 uppercase vertical-text tracking-widest h-full flex items-center">
                                                                Page {pageIndex + 1}
                                                            </div>
                                                            <div
                                                                onClick={(e) => handlePreviewClick(pageIndex, e)}
                                                                className="relative mx-auto border-4 border-white dark:border-slate-800 rounded-2xl overflow-hidden cursor-crosshair shadow-xl bg-white dark:bg-slate-900 transition-all hover:ring-4 hover:ring-slate-200 dark:hover:ring-slate-800"
                                                                style={{ width: 'fit-content', maxWidth: '100%' }}
                                                            >
                                                                <img src={preview} alt={`Page ${pageIndex + 1}`} className="max-w-full h-auto" />

                                                                {/* Render Placements for this page */}
                                                                {placements.filter(p => p.pageIndex === pageIndex).map(placement => (
                                                                    <div
                                                                        key={placement.id}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setActivePlacementId(placement.id);
                                                                        }}
                                                                        className={`absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${activePlacementId === placement.id ? 'z-20 scale-110' : 'z-10 opacity-80 hover:opacity-100'}`}
                                                                        style={{
                                                                            left: `${placement.x}%`,
                                                                            top: `${placement.y}%`,
                                                                            width: placement.size === 'small' ? '15%' : placement.size === 'medium' ? '25%' : '35%'
                                                                        }}
                                                                    >
                                                                        <div className="relative">
                                                                            <img
                                                                                src={signatureImage}
                                                                                alt="Signature"
                                                                                className={`w-full h-auto object-contain rounded-lg shadow-lg ${activePlacementId === placement.id ? 'bg-emerald-500/30 border-2 border-emerald-500 ring-4 ring-emerald-500/20' : 'bg-slate-500/20 border-2 border-slate-400'}`}
                                                                            />
                                                                            {activePlacementId === placement.id && (
                                                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-full font-black shadow-xl whitespace-nowrap uppercase tracking-wider animate-bounce">
                                                                                    Active Placement
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-center text-xs text-slate-400 font-medium">Tip: Click on any page to add or move a signature. Use "Add New" to place multiple spots.</p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-3 gap-2 mt-4">
                                            {(['small', 'medium', 'large'] as const).map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => {
                                                        if (activePlacementId) {
                                                            setPlacements(prev => prev.map(p => p.id === activePlacementId ? { ...p, size } : p));
                                                        } else {
                                                            setSignSize(size);
                                                        }
                                                    }}
                                                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${(activePlacementId ? placements.find(p => p.id === activePlacementId)?.size === size : signSize === size)
                                                        ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                                                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                                        }`}
                                                >
                                                    {size.charAt(0).toUpperCase() + size.slice(1)} Size
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            {isProcessing && <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />}
                            {error && <p className="text-sm font-bold text-red-500 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</p>}
                            {success && <p className="text-sm font-bold text-emerald-500 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {success}</p>}
                        </div>

                        <button
                            onClick={() => {
                                if (mode === 'merge') mergePDFs();
                                else if (mode === 'protect') protectPDF();
                                else if (mode === 'split') splitPDF();
                                else if (mode === 'sign') signPDF();
                            }}
                            disabled={
                                isProcessing ||
                                files.length === 0 ||
                                (mode === 'merge' && files.length < 2) ||
                                (mode === 'protect' && !password) ||
                                (mode === 'sign' && !signatureImage) ||
                                (mode === 'split' && splitMode === 'range' && !pageRange) ||
                                (mode === 'split' && splitMode === 'selection' && selectedPages.length === 0)
                            }
                            className={`px-8 py-4 rounded-2xl font-black text-white shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 bg-slate-900 dark:bg-white dark:text-slate-900`}
                        >
                            {isProcessing ? 'Processing...' : `Execute ${mode.charAt(0).toUpperCase() + mode.slice(1)}`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}




export default PDFMaster;
