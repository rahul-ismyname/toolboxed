'use client';

import { useState, useRef, useEffect } from 'react';
// Removed all top-level imports of @ffmpeg/ffmpeg and @ffmpeg/util to avoid Node.js build errors
import {
    Video,
    Upload,
    Download,
    Zap,
    Clock,
    ShieldCheck,
    Settings,
    Play,
    Loader2,
    CheckCircle2,
    FileVideo,
    X
} from 'lucide-react';

type CompressionQuality = 'low' | 'medium' | 'high';
type TargetFormat = 'mp4' | 'webm' | 'gif';
type Resolution = 'original' | '1080p' | '720p' | '480p';
type ProcessingSpeed = 'ultrafast' | 'medium' | 'veryslow';

export default function VideoCompressor() {
    const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [quality, setQuality] = useState<CompressionQuality>('medium');
    const [format, setFormat] = useState<TargetFormat>('mp4');
    const [resolution, setResolution] = useState<Resolution>('original');
    const [speed, setSpeed] = useState<ProcessingSpeed>('ultrafast');
    const [targetSizeMB, setTargetSizeMB] = useState<string>('');
    const [uiMode, setUiMode] = useState<'easy' | 'advanced'>('easy');
    const [duration, setDuration] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const ffmpegRef = useRef<any | null>(null); // Changed to any to avoid FFmpeg type import issue
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        loadFFmpeg();
    }, []);

    const loadFFmpeg = async () => {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

        // Dynamically import FFmpeg and util to avoid Node environment errors during build
        const { FFmpeg } = await import('@ffmpeg/ffmpeg');
        const { toBlobURL } = await import('@ffmpeg/util');

        if (!ffmpegRef.current) {
            ffmpegRef.current = new FFmpeg();
        }
        const ffmpeg = ffmpegRef.current;

        ffmpeg.on('log', ({ message }: { message: string }) => {
            console.log(message);
        });

        ffmpeg.on('progress', ({ progress }: { progress: number }) => {
            setProgress(Math.round(progress * 100));
        });

        try {
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });
            setFfmpegLoaded(true);
        } catch (err) {
            console.error('Failed to load FFmpeg:', err);
            setError('Failed to initialize video processing engine. Please ensure your browser supports SharedArrayBuffer.');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
            setCompressedUrl(null);
            setProgress(0);
            setError(null);
            setDuration(null);

            // Extract duration
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                setDuration(video.duration);
                URL.revokeObjectURL(video.src);
            };
            video.src = URL.createObjectURL(file);
        }
    };

    const compressVideo = async () => {
        if (!videoFile || !ffmpegLoaded || !ffmpegRef.current) return;

        setProcessing(true);
        setProgress(0);
        setError(null);

        try {
            const { fetchFile } = await import('@ffmpeg/util');
            const ffmpeg = ffmpegRef.current;
            const inputExt = videoFile.name.substring(videoFile.name.lastIndexOf('.'));
            const inputName = 'input' + inputExt;
            const outputExt = format === 'gif' ? '.gif' : format === 'webm' ? '.webm' : '.mp4';
            const outputName = 'output' + outputExt;

            await ffmpeg.writeFile(inputName, await fetchFile(videoFile));

            // Build FFmpeg arguments
            const args = ['-i', inputName];

            // 1. Resolution Scaling
            if (resolution !== 'original') {
                const scaleMap = {
                    '1080p': '1920:1080',
                    '720p': '1280:720',
                    '480p': '854:480'
                };
                // Use force_original_aspect_ratio=decrease to prevent stretching
                args.push('-vf', `scale=${scaleMap[resolution as keyof typeof scaleMap]}:force_original_aspect_ratio=decrease,pad=${scaleMap[resolution as keyof typeof scaleMap]}:(ow-iw)/2:(oh-ih)/2`);
            }

            // 2. Format & Codec Logic
            if (format === 'gif') {
                // High quality GIF generation usually requires two passes or a palette
                // We'll use a single pass with a simple palette for client-side speed
                args.push('-vf', (resolution !== 'original' ? `scale=${resolution === '480p' ? '480' : '720'}:-1,` : '') + 'split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse');
            } else {
                // Video Logic (MP4 or WebM)
                const targetMB = parseFloat(targetSizeMB);
                const isTargetSizeValid = !isNaN(targetMB) && targetMB > 0 && duration;

                if (isTargetSizeValid) {
                    // Calculate bitrate for target size
                    // Size in bits = MB * 8 * 1024 * 1024
                    // Bitrate = bits / duration
                    const totalBits = targetMB * 8 * 1024 * 1024;
                    const audioBitrate = 128 * 1024; // Assume 128kbps for audio
                    const videoBitrate = Math.max(100 * 1024, (totalBits / duration!) - audioBitrate);

                    if (format === 'webm') {
                        args.push('-vcodec', 'libvpx-vp9', '-b:v', `${Math.floor(videoBitrate)}`, '-minrate', `${Math.floor(videoBitrate / 2)}`, '-maxrate', `${Math.floor(videoBitrate)}`, '-crf', '30');
                    } else {
                        args.push('-vcodec', 'libx264', '-b:v', `${Math.floor(videoBitrate)}`, '-maxrate', `${Math.floor(videoBitrate)}`, '-bufsize', `${Math.floor(videoBitrate * 2)}`, '-preset', speed);
                    }
                } else {
                    // Default quality-based logic
                    if (format === 'webm') {
                        args.push('-vcodec', 'libvpx-vp9', '-crf', quality === 'low' ? '40' : quality === 'high' ? '20' : '30', '-b:v', '0');
                    } else {
                        // MP4 / H.264
                        let crf = '24';
                        if (quality === 'low') crf = '32';
                        if (quality === 'high') crf = '18';
                        args.push('-vcodec', 'libx264', '-crf', crf, '-preset', speed);
                    }
                }
            }

            // 3. Audio logic
            if (format !== 'gif') {
                if (format === 'webm') {
                    args.push('-acodec', 'libopus');
                } else {
                    // If target size is set, we might want to fix audio bitrate too, but 'copy' is safer/faster
                    args.push('-acodec', 'copy');
                }
            }

            args.push(outputName);

            await ffmpeg.exec(args);

            const data = await ffmpeg.readFile(outputName);
            const mimeType = format === 'gif' ? 'image/gif' : format === 'webm' ? 'video/webm' : 'video/mp4';
            const url = URL.createObjectURL(new Blob([(data as any).buffer], { type: mimeType }));
            setCompressedUrl(url);
        } catch (err) {
            console.error('Compression error:', err);
            setError('An error occurred during video processing. Check if the file/format combination is supported.');
        } finally {
            setProcessing(false);
        }
    };

    const qualityOptions: { label: string; value: CompressionQuality; desc: string }[] = [
        { label: 'Low', value: 'low', desc: 'Fastest, smallest file size' },
        { label: 'Medium', value: 'medium', desc: 'Balance of quality & size' },
        { label: 'High', value: 'high', desc: 'Best quality, larger size' },
    ];

    if (!ffmpegLoaded && !error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Initializing processing engine...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden relative group">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110" />

                <div className="relative z-10 space-y-8">
                    {/* Upload Section */}
                    {!videoFile ? (
                        <div className="border-3 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center transition-all hover:border-emerald-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 group/upload cursor-pointer relative">
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-6 group-hover/upload:scale-110 group-hover/upload:rotate-3 transition-all duration-300 shadow-inner">
                                    <Video className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Drop your video here</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-lg">
                                    Click or drag to select a video for local compression
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                                        <FileVideo className="w-6 h-6" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-slate-900 dark:text-white truncate max-w-[200px] md:max-w-md">
                                            {videoFile.name}
                                        </p>
                                        <p className="text-xs text-slate-500 uppercase tracking-widest font-black">
                                            {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setVideoFile(null)}
                                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                                    aria-label="Remove file"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Mode Toggle & Settings */}
                            {!compressedUrl && (
                                <div className="space-y-8">
                                    {/* Mode Toggle */}
                                    <div className="flex items-center justify-center">
                                        <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
                                            <button
                                                onClick={() => setUiMode('easy')}
                                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${uiMode === 'easy' ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                Easy Mode
                                            </button>
                                            <button
                                                onClick={() => setUiMode('advanced')}
                                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${uiMode === 'advanced' ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                Advanced
                                            </button>
                                        </div>
                                    </div>

                                    {uiMode === 'advanced' ? (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Format & Resolution Row */}
                                                <div className="space-y-3">
                                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Target Format</label>
                                                    <div className="flex p-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                                                        {(['mp4', 'webm', 'gif'] as const).map((f) => (
                                                            <button
                                                                key={f}
                                                                onClick={() => setFormat(f)}
                                                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${format === f ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                                            >
                                                                {f.toUpperCase()}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Resolution</label>
                                                    <div className="flex p-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                                                        {(['original', '720p', '480p'] as const).map((r) => (
                                                            <button
                                                                key={r}
                                                                onClick={() => setResolution(r as Resolution)}
                                                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${resolution === r ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                                            >
                                                                {r === 'original' ? 'Native' : r}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Target Size or Quality Options */}
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Compression Mode</label>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setTargetSizeMB('')}
                                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight transition-all ${targetSizeMB === '' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                                                        >
                                                            Preset
                                                        </button>
                                                        <button
                                                            onClick={() => setTargetSizeMB('25')}
                                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight transition-all ${targetSizeMB !== '' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                                                        >
                                                            Target Size
                                                        </button>
                                                    </div>
                                                </div>

                                                {targetSizeMB !== '' ? (
                                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                value={targetSizeMB}
                                                                onChange={(e) => setTargetSizeMB(e.target.value)}
                                                                placeholder="Target Size (e.g. 25)"
                                                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:border-emerald-500 outline-none transition-all text-lg font-bold pr-16"
                                                            />
                                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-black">
                                                                MB
                                                            </div>
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 mt-2 ml-1 font-bold">
                                                            Note: Resulting file size will be an approximation. Smallest possible size depends on duration.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        {qualityOptions.map((opt) => (
                                                            <button
                                                                key={opt.value}
                                                                onClick={() => setQuality(opt.value)}
                                                                disabled={processing}
                                                                className={`p-4 rounded-2xl border-2 text-left transition-all ${quality === opt.value
                                                                    ? 'border-emerald-500 bg-emerald-500/5'
                                                                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                                                                    }`}
                                                            >
                                                                <p className={`font-bold ${quality === opt.value ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                                                                    {opt.label}
                                                                </p>
                                                                <p className="text-[10px] text-slate-500 mt-1 leading-tight">{opt.desc}</p>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Speed Preset (Only for MP4) */}
                                            {format === 'mp4' && (
                                                <div className="space-y-3">
                                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Worker Effort</label>
                                                    <div className="flex p-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                                                        {[
                                                            { label: 'Instant', value: 'ultrafast' },
                                                            { label: 'Balanced', value: 'veryfast' },
                                                            { label: 'Smaller File', value: 'medium' }
                                                        ].map((s) => (
                                                            <button
                                                                key={s.value}
                                                                onClick={() => setSpeed(s.value as ProcessingSpeed)}
                                                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${speed === s.value ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                                            >
                                                                {s.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                                            <div className="grid grid-cols-1 gap-4">
                                                {qualityOptions.map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => setQuality(opt.value)}
                                                        disabled={processing}
                                                        className={`p-6 rounded-3xl border-2 flex items-center justify-between transition-all ${quality === opt.value
                                                            ? 'border-emerald-500 bg-emerald-500/5 ring-4 ring-emerald-500/10'
                                                            : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                                                            }`}
                                                    >
                                                        <div className="text-left">
                                                            <p className={`text-lg font-black ${quality === opt.value ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                                                                {opt.label} Compression
                                                            </p>
                                                            <p className="text-sm text-slate-500 mt-1">{opt.desc}</p>
                                                        </div>
                                                        <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all ${quality === opt.value ? 'border-emerald-500' : 'border-slate-200 dark:border-slate-800'}`}>
                                                            {quality === opt.value && <div className="w-3 h-3 bg-emerald-500 rounded-full" />}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                                                Defaulting to standard MP4 with native resolution for best compatibility.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Action Button */}
                            {!compressedUrl && (
                                <button
                                    onClick={compressVideo}
                                    disabled={processing}
                                    className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 shadow-xl"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            <span>Processing {progress}%</span>
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-6 h-6 fill-current" />
                                            <span>Begin Local Compression</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Progress Bar */}
                    {processing && (
                        <div className="space-y-3">
                            <div className="h-4 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden p-1 shadow-inner">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-center text-sm font-bold text-slate-500 uppercase tracking-widest">
                                Processing locally... your data is safe
                            </p>
                        </div>
                    )}

                    {/* Result */}
                    {compressedUrl && (
                        <div className="p-8 bg-emerald-500/5 rounded-3xl border-2 border-emerald-500/20 text-center space-y-6 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/40">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Ready for Download!</h3>
                                <p className="text-slate-500 dark:text-slate-400">Your video has been successfully compressed in your browser.</p>
                            </div>
                            <a
                                href={compressedUrl}
                                download={`compressed_${videoFile?.name || 'video.mp4'}`}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/30"
                            >
                                <Download className="w-6 h-6" />
                                Download Optimized Video
                            </a>
                            <button
                                onClick={() => {
                                    setVideoFile(null);
                                    setCompressedUrl(null);
                                }}
                                className="block w-full text-slate-400 font-bold hover:text-slate-600 dark:hover:text-slate-200 transition-colors text-sm"
                            >
                                Process Another Video
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-500/10 border-2 border-red-500/20 rounded-2xl text-red-600 text-sm font-bold text-center">
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Privacy Promise */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-start gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">Local Processing</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">FFmpeg.wasm runs logic inside your browser tab. We never see your videos.</p>
                    </div>
                </div>
                <div className="flex-1 bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-start gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">Wait Time</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Since it uses your local CPU, processing time depends on your device speed.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

