"use client";

import { DeviceType } from './index';

interface DeviceModelProps {
    type: DeviceType;
    rotation: { x: number; y: number };
    image: string | null;
}

export function DeviceModel({ type, rotation, image }: DeviceModelProps) {
    const isIphone = type === 'iphone';

    return (
        <div
            className="relative transition-transform duration-300 ease-out preserve-3d"
            style={{
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                width: isIphone ? '280px' : '600px',
                height: isIphone ? '560px' : '400px'
            }}
        >
            {isIphone ? (
                <IphoneModel image={image} />
            ) : (
                <MacbookModel image={image} />
            )}
        </div>
    );
}

function IphoneModel({ image }: { image: string | null }) {
    return (
        <div className="relative w-full h-full preserve-3d">
            {/* Front Panel */}
            <div className="absolute inset-0 bg-slate-800 rounded-[50px] border-[10px] border-slate-900 shadow-2xl overflow-hidden preserve-3d" style={{ transform: 'translateZ(0px)' }}>
                {/* Screen Content */}
                <div className="w-full h-full bg-slate-900 flex items-center justify-center overflow-hidden relative">
                    {image ? (
                        <img src={image} alt="Mockup" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-slate-700 font-medium text-center px-8">
                            Upload your app screenshot
                        </div>
                    )}

                    {/* Screen Glare/Reflection */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/20 opacity-40 z-10" />
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-30 z-10" />

                    {/* Dynamic Notch */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-950 rounded-full z-20 flex items-center justify-end px-4 gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-800" />
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/20" />
                    </div>
                </div>
            </div>

            {/* Rear Panel (Creates the rounded back) */}
            <div
                className="absolute inset-0 bg-slate-900 rounded-[50px] shadow-sm border border-slate-800"
                style={{ transform: 'translateZ(-10px)' }}
            />

            {/* Depth (Connecting side panels) - Shortened to fit within curves */}
            <div className="absolute top-[48px] bottom-[48px] -left-[10px] w-[11px] bg-slate-800 origin-right rotateY-90" />
            <div className="absolute top-[48px] bottom-[48px] -right-[10px] w-[11px] bg-slate-800 origin-left -rotateY-90" />
            <div className="absolute left-[48px] right-[48px] -top-[10px] h-[11px] bg-slate-800 origin-bottom rotateX-90" />
            <div className="absolute left-[48px] right-[48px] -bottom-[10px] h-[11px] bg-slate-800 origin-top -rotateX-90" />
        </div>
    );
}

function MacbookModel({ image }: { image: string | null }) {
    return (
        <div className="relative w-full h-full preserve-3d">
            {/* Screen Lid */}
            <div className="absolute top-0 inset-x-4 h-[85%] bg-slate-800 rounded-t-2xl border-[10px] border-slate-900 shadow-2xl overflow-hidden translateZ-10">
                <div className="w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden relative">
                    {image ? (
                        <img src={image} alt="Mockup" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-slate-800 font-bold text-center px-12 text-2xl tracking-tighter opacity-20">
                            MACBOOK PRO
                        </div>
                    )}
                    {/* Screen reflection */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-30 z-10" />
                </div>
            </div>

            {/* Base (Bottom Case) */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[110%] h-[15%] preserve-3d">
                {/* Top Surface of Base */}
                <div className="absolute inset-0 bg-slate-700 rounded-lg border-t border-slate-600 shadow-2xl origin-top rotateX-85 flex flex-col items-center justify-start py-2">
                    {/* Trackpad Hint */}
                    <div className="w-32 h-20 border border-slate-600/50 rounded-lg mt-2 opacity-30" />
                </div>
                {/* Front edge of base */}
                <div className="absolute -bottom-[10px] inset-x-2 h-[10px] bg-slate-800 rounded-b-lg origin-top -rotateX-90" />
            </div>

            {/* Hinge detail */}
            <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[60%] h-4 bg-slate-900 rounded-full translateZ-5" />
        </div>
    );
}

// Global styles for 3D
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        .preserve-3d {
            transform-style: preserve-3d;
        }
        .rotateY-90 { transform: rotateY(-90deg); }
        .-rotateY-90 { transform: rotateY(90deg); }
        .rotateX-90 { transform: rotateX(90deg); }
        .-rotateX-90 { transform: rotateX(-90deg); }
        .rotateX-85 { transform: rotateX(85deg); }
        .translateZ-10 { transform: translateZ(10px); }
        .translateZ-5 { transform: translateZ(5px); }
    `;
    document.head.appendChild(style);
}
