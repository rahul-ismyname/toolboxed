'use client';

import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { ObjectInspector } from '../ObjectInspector';

interface BodyData {
    id: number;
    color: string;
    isStatic: boolean;
    angle: number;
    velocity: { x: number; y: number };
    acceleration: { x: number; y: number };
    restitution: number;
    friction: number;
}

interface PropertiesPanelProps {
    selectedBody: BodyData | null;
    onUpdateBody: (id: number, updates: Partial<BodyData>) => void;
    onDeleteBody: (id: number) => void;
    onClose: () => void;
}

export function PropertiesPanel({
    selectedBody,
    onUpdateBody,
    onDeleteBody,
    onClose
}: PropertiesPanelProps) {
    if (!selectedBody) return null;

    return (
        <div className="absolute top-4 right-4 bottom-24 w-72 z-40 pointer-events-none flex flex-col items-end">
            <div className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden w-full max-h-full flex flex-col animate-in slide-in-from-right-10 fade-in duration-300">
                {/* Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                        Properties
                    </span>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto custom-scrollbar">
                    <ObjectInspector
                        body={selectedBody}
                        onUpdate={onUpdateBody}
                        onDelete={onDeleteBody}
                    />
                </div>
            </div>
        </div>
    );
}
