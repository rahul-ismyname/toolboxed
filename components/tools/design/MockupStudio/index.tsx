"use client";

import { useState, useRef, useEffect } from 'react';
import { DeviceModel } from './DeviceModel';
import { MockupControls } from './MockupControls';
import { toPng } from 'html-to-image';
import { Smartphone, Monitor, Download, Upload, RotateCw } from 'lucide-react';

export type DeviceType = 'iphone' | 'macbook';

export function MockupStudio() {
    const [device, setDevice] = useState<DeviceType>('iphone');
    const [rotation, setRotation] = useState({ x: -10, y: 20 });
    const [image, setImage] = useState<string | null>(null);
    const [bgColor, setBgColor] = useState('#f8fafc');
    const [isDragging, setIsDragging] = useState(false);
    const [containerWidth, setContainerWidth] = useState(1000);
    const mockupRef = useRef<HTMLDivElement>(null);

    // Responsive scaling logic
    useEffect(() => {
        if (!mockupRef.current) return;

        const updateWidth = () => {
            if (mockupRef.current) {
                setContainerWidth(mockupRef.current.offsetWidth);
            }
        };

        // Initial measurement
        updateWidth();

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerWidth(entry.contentRect.width);
            }
        });

        resizeObserver.observe(mockupRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    const baseWidth = device === 'macbook' ? 700 : 350;
    const scale = Math.min(1, containerWidth / baseWidth);

    const handleDownload = async () => {
        if (!mockupRef.current) return;
        try {
            const dataUrl = await toPng(mockupRef.current, {
                quality: 0.95,
                pixelRatio: 2 // Ensure high quality export even on small screens
            });
            const link = document.createElement('a');
            link.download = `mockup-${device}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('oops, something went wrong!', err);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.movementX;
        const deltaY = e.movementY;
        setRotation(prev => ({
            x: Math.max(-45, Math.min(45, prev.x - deltaY * 0.5)),
            y: Math.max(-90, Math.min(90, prev.y + deltaX * 0.5))
        }));
    };

    return (
        <div className="grid lg:grid-cols-[1fr,350px] gap-8 items-start">
            <div className="space-y-6">
                <div
                    ref={mockupRef}
                    className={`aspect-video rounded-3xl relative overflow-hidden flex items-center justify-center transition-colors duration-500 cursor-grab active:cursor-grabbing ${isDragging ? 'select-none' : ''}`}
                    style={{ backgroundColor: bgColor }}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                    onMouseMove={handleMouseMove}
                >
                    {/* Grid Background Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                    />

                    <div
                        className="relative z-10 flex items-center justify-center perspective-1000 transition-transform duration-200 ease-out"
                        style={{ transform: `scale(${scale})` }}
                    >
                        <DeviceModel
                            type={device}
                            rotation={rotation}
                            image={image}
                        />
                    </div>

                    {/* Branding Watermark */}
                    <div className="absolute bottom-6 right-8 text-slate-400 dark:text-slate-600 font-bold text-xl tracking-tighter opacity-50">
                        TOOLBOXED
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200 dark:shadow-none order-2 sm:order-1"
                    >
                        <Download className="w-5 h-5" />
                        Download
                    </button>
                    <div className="flex-1 flex gap-2 order-1 sm:order-2">
                        <div className="flex-1 flex gap-2 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                            {[
                                { name: 'Front', x: 0, y: 0 },
                                { name: 'Tilt', x: -10, y: 20 },
                                { name: 'Iso', x: -20, y: 45 }
                            ].map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => setRotation({ x: preset.x, y: preset.y })}
                                    className="flex-1 px-3 py-2 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                                >
                                    {preset.name}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setRotation({ x: -10, y: 20 })}
                            className="px-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-400 hover:text-emerald-500"
                            title="Reset Rotation"
                        >
                            <RotateCw className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <MockupControls
                device={device}
                setDevice={setDevice}
                rotation={rotation}
                setRotation={setRotation}
                setImage={setImage}
                bgColor={bgColor}
                setBgColor={setBgColor}
            />
        </div>
    );
}

// Helper CSS class for perspective
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        .perspective-1000 {
            perspective: 1000px;
        }
    `;
    document.head.appendChild(style);
}
