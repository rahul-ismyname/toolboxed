'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Trash2, X, GripVertical, BoxSelect, Package } from 'lucide-react';
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
    onSaveBlueprint?: (id: number) => void;
    isMobile?: boolean;
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
    getAllRules,
    onSaveBlueprint,
    isMobile = false
}: PropertiesPanelProps) {
    const [position, setPosition] = useState({ x: 0, y: 0 }); // Relative transform
    const [isMinimized, setIsMinimized] = useState(isMobile); // Start minimized on mobile
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isMobile) return; // Disable dragging on mobile
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

    // Initial positioning
    useEffect(() => {
        if (!isMobile && position.x === 0 && position.y === 0) {
            setPosition({ x: window.innerWidth - 320, y: 80 });
        }
    }, [isMobile]);

    if (!selectedBody) return null;

    if (isMobile) {
        return (
            <div className={`fixed bottom-0 left-0 right-0 z-50 flex flex-col transition-transform duration-300 ${isMinimized ? 'translate-y-[calc(100%-3.5rem)]' : ''}`}>
                {/* Mobile Header / Handle */}
                <div
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-3 flex items-center justify-between cursor-pointer active:bg-slate-50 dark:active:bg-slate-800"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500 mt-2">
                            {isMinimized ? 'Show Properties' : 'Properties'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        {onSaveBlueprint && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onSaveBlueprint(selectedBody.id); }}
                                className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500"
                            >
                                <Package className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Mobile Content */}
                <div className="bg-white dark:bg-slate-900 p-4 h-[50vh] overflow-y-auto pb-safe">
                    <PropertiesContent
                        selectedBody={selectedBody}
                        onUpdateBody={onUpdateBody}
                        onDeleteBody={onDeleteBody}
                        addRule={addRule}
                        removeRule={removeRule}
                        updateRule={updateRule}
                        clearBodyRules={clearBodyRules}
                        getAllRules={getAllRules}
                    />
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                position: 'fixed',
                top: 0,
                left: 0
            }}
            className="w-72 z-40 flex flex-col items-end transition-shadow duration-75"
        >
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden w-full max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div
                    onMouseDown={handleMouseDown}
                    className={`p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 cursor-grab active:cursor-grabbing select-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group ${isDragging ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                >
                    <div className="flex items-center gap-2">
                        <GripVertical className="w-3 h-3 text-slate-300 group-hover:text-slate-400 transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            Properties
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        {onSaveBlueprint && (
                            <button
                                onClick={() => onSaveBlueprint(selectedBody.id)}
                                className="p-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-500 transition-colors"
                                title="Save as Blueprint"
                            >
                                <Package className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto custom-scrollbar max-h-[70vh]">
                    <PropertiesContent
                        selectedBody={selectedBody}
                        onUpdateBody={onUpdateBody}
                        onDeleteBody={onDeleteBody}
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

// Extracted content for reuse
function PropertiesContent({
    selectedBody,
    onUpdateBody,
    onDeleteBody,
    addRule,
    removeRule,
    updateRule,
    clearBodyRules,
    getAllRules
}: any) {
    return (
        <>
            <div className="mb-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1.5 px-1">
                    <BoxSelect className="w-3 h-3" /> Material
                </label>
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
        </>
    );
}
