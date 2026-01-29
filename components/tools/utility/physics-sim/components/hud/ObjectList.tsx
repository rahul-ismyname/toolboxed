'use client';

import React from 'react';
import { Box, Circle, Triangle, Hexagon, Minus, Trash2, Shield, MousePointer2 } from 'lucide-react';

interface BodyData {
    id: number;
    label: string;
    isStatic: boolean;
    render: { fillStyle: string };
}

interface ObjectListProps {
    bodies: any[];
    selectedBodyId: number | null;
    onSelectBody: (id: number) => void;
    onDeleteBody: (id: number) => void;
    onClose?: () => void;
}

export function ObjectList({
    bodies,
    selectedBodyId,
    onSelectBody,
    onDeleteBody
}: ObjectListProps) {
    const getIcon = (body: any) => {
        if (body.label === 'circle') return Circle;
        if (body.label === 'rectangle' && body.isStatic) return Minus;
        if (body.label === 'rectangle') return Box;
        if (body.vertices?.length === 3) return Triangle;
        if (body.vertices?.length === 5) return Hexagon;
        return Box;
    };

    // Filter out world bounds
    const filteredBodies = bodies.filter(b => b.label !== 'ground');

    return (
        <div className="absolute top-4 left-4 bottom-24 w-64 z-40 pointer-events-none flex flex-col">
            <div className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden w-full max-h-full flex flex-col animate-in slide-in-from-left-10 fade-in duration-300">
                {/* Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                        Scene Objects ({filteredBodies.length})
                    </span>
                </div>

                {/* List Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {filteredBodies.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-xs italic">
                            No objects in scene
                        </div>
                    ) : (
                        filteredBodies.map((body) => {
                            const Icon = getIcon(body);
                            const isSelected = selectedBodyId === body.id;

                            return (
                                <div
                                    key={body.id}
                                    className={`group flex items-center gap-3 p-2 rounded-xl border transition-all cursor-pointer ${isSelected
                                            ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/30 ring-1 ring-indigo-500/20'
                                            : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        }`}
                                    onClick={() => onSelectBody(body.id)}
                                >
                                    {/* Swatch & Icon */}
                                    <div className="relative">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm"
                                            style={{ backgroundColor: body.render?.fillStyle || '#6366f1' }}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        {body.isStatic && (
                                            <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-0.5 rounded-full shadow-sm ring-1 ring-white dark:ring-slate-900">
                                                <Shield className="w-2.5 h-2.5" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-xs font-bold truncate ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                            ID: {body.id}
                                        </div>
                                        <div className="text-[10px] text-slate-400 truncate uppercase tracking-tighter">
                                            {body.label || 'Body'} {body.isStatic ? '(Static)' : '(Dynamic)'}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteBody(body.id);
                                            }}
                                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
                                            title="Delete Object"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
