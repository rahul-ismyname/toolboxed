"use client";

import { Smartphone, Monitor, Upload, Palette } from 'lucide-react';
import { DeviceType } from './index';

interface MockupControlsProps {
    device: DeviceType;
    setDevice: (d: DeviceType) => void;
    rotation: { x: number; y: number };
    setRotation: (r: { x: number; y: number }) => void;
    setImage: (img: string | null) => void;
    bgColor: string;
    setBgColor: (c: string) => void;
}

export function MockupControls({
    device,
    setDevice,
    rotation,
    setRotation,
    setImage,
    bgColor,
    setBgColor
}: MockupControlsProps) {

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
            {/* Device Selector */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Device Model</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setDevice('iphone')}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${device === 'iphone'
                                ? 'border-emerald-500 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
                                : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                    >
                        <Smartphone className="w-6 h-6" />
                        <span className="text-xs font-bold">iPhone 15</span>
                    </button>
                    <button
                        onClick={() => setDevice('macbook')}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${device === 'macbook'
                                ? 'border-emerald-500 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
                                : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                    >
                        <Monitor className="w-6 h-6" />
                        <span className="text-xs font-bold">MacBook Pro</span>
                    </button>
                </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Screen Content</h3>
                <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold">Upload Screenshot</p>
                        <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
            </div>

            {/* Rotation Controls */}
            <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">3D Rotation</h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                            <span>Pitch (X-axis)</span>
                            <span className="text-emerald-500">{rotation.x}°</span>
                        </div>
                        <input
                            type="range" min="-45" max="45" value={rotation.x}
                            onChange={(e) => setRotation({ ...rotation, x: parseInt(e.target.value) })}
                            className="w-full accent-emerald-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                            <span>Yaw (Y-axis)</span>
                            <span className="text-emerald-500">{rotation.y}°</span>
                        </div>
                        <input
                            type="range" min="-90" max="90" value={rotation.y}
                            onChange={(e) => setRotation({ ...rotation, y: parseInt(e.target.value) })}
                            className="w-full accent-emerald-500"
                        />
                    </div>
                </div>
            </div>

            {/* Background Color */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Environment</h3>
                <div className="flex flex-wrap gap-2">
                    {['#f8fafc', '#ffffff', '#0f172a', '#10b981', '#3b82f6', '#f43f5e'].map(color => (
                        <button
                            key={color}
                            onClick={() => setBgColor(color)}
                            className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${bgColor === color ? 'border-emerald-500 scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                    <label className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                        <Palette className="w-4 h-4 text-slate-400" />
                        <input type="color" className="sr-only" onChange={(e) => setBgColor(e.target.value)} />
                    </label>
                </div>
            </div>
        </div>
    );
}
