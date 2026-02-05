'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Trash2, X } from 'lucide-react';
import { ObjectInspector } from '../ObjectInspector';
import { MATERIALS } from '../../hooks/useMatterEngine';
import { LogicRule } from '../../logic/LogicSystem';

interface BodyData {
    id: number;
    color: string;
    isStatic: boolean;
    angle: number;
    velocity: { x: number; y: number };
    acceleration: { x: number; y: number };
    restitution: number;
    friction: number;
    density: number;
    material?: string;
    width: number;
    height: number;
}

interface PropertiesPanelProps {
    selectedBody: BodyData | null;
    onUpdateBody: (id: number, updates: Partial<BodyData>) => void;
    onDeleteBody: (id: number) => void;
    onClose: () => void;
    addRule: (rule: LogicRule) => void;
    removeRule: (id: string) => void;
    updateRule: (id: string, updates: Partial<LogicRule>) => void;
    clearBodyRules: (bodyId: number) => void;
    getAllRules: () => LogicRule[];
}

export function PropertiesPanel({
    selectedBody,
    onUpdateBody,
    onDeleteBody,
    onClose,
    addRule,
    removeRule,
    updateRule,
    clearBodyRules,
    getAllRules
}: PropertiesPanelProps) {
    const [position, setPosition] = useState({ x: 20, y: 80 }); // Initial adjusted for "top-4 right-4" equivalent if relative
    // Actually simplicity: Let's use fixed positioning based on window size or just initial right corner.
    // Better: Start with a safe default, maybe `right: 20, top: 20` creates issues with simple x/y transform.
    // Let's use `top: 0, left: 0` on container and transform translate.
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragOffset.current.x,
                    y: e.clientY - dragOffset.current.y
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    // Initial position effect - CENTER IT or put slightly right
    useEffect(() => {
        // Only set initial if at 0,0 default? or just hardcode slightly nicely
        if (position.x === 20 && position.y === 80) {
            setPosition({ x: window.innerWidth - 320, y: 80 });
        }
    }, [])

    if (!selectedBody) return null;

    return (
        <div
            style={{
                left: position.x,
                top: position.y,
                position: 'fixed'
            }}
            className="w-72 z-40 flex flex-col items-end transition-shadow duration-75"
        >
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden w-full max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div
                    onMouseDown={handleMouseDown}
                    className={`p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 cursor-grab active:cursor-grabbing select-none ${isDragging ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                >
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
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Material</label>
                        <select
                            value={selectedBody.material || 'DEFAULT'}
                            onChange={(e) => {
                                const matKey = e.target.value;
                                const mat = MATERIALS[matKey];
                                if (mat) {
                                    onUpdateBody(selectedBody.id, {
                                        material: matKey,
                                        restitution: mat.restitution,
                                        friction: mat.friction,
                                        density: mat.density
                                    });
                                }
                            }}
                            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-300"
                        >
                            {Object.entries(MATERIALS).map(([key, mat]) => (
                                <option key={key} value={key}>{mat.name}</option>
                            ))}
                        </select>
                    </div>

                    <ObjectInspector
                        body={selectedBody as any}
                        onUpdate={onUpdateBody}
                        onDelete={onDeleteBody}
                        addRule={addRule}
                        removeRule={removeRule}
                        updateRule={updateRule}
                        clearBodyRules={clearBodyRules}
                        getAllRules={getAllRules}
                    />
                </div>
            </div>
        </div>
    );
}
