'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';

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

interface ObjectInspectorProps {
    body: BodyData | null;
    onUpdate: (id: number, updates: Partial<BodyData>) => void;
    onDelete: (id: number) => void;
}

export function ObjectInspector({ body, onUpdate, onDelete }: ObjectInspectorProps) {
    const [localData, setLocalData] = useState<any>(null);
    const isEditingRef = useRef(false);

    // Sync from external body when not editing
    useEffect(() => {
        if (!isEditingRef.current && body) {
            setLocalData({
                ...body,
                angle: body.angle.toString(),
                velocity: {
                    x: body.velocity.x.toString(),
                    y: body.velocity.y.toString()
                },
                acceleration: {
                    x: body.acceleration.x.toString(),
                    y: body.acceleration.y.toString()
                },
                restitution: body.restitution.toString(),
                friction: body.friction.toString()
            });
        }
    }, [body]);

    if (!body || !localData) {
        return (
            <div className="text-center py-6 text-slate-400 text-xs">
                Click an object to select it
            </div>
        );
    }

    const handleFocus = () => {
        isEditingRef.current = true;
    };

    const handleUpdateField = (field: string, value: string) => {
        setLocalData({ ...localData, [field]: value });
        const parsed = parseFloat(value);
        if (!isNaN(parsed) && value !== '-' && !value.endsWith('.')) {
            onUpdate(body.id, { [field]: parsed });
        }
    };

    const handleBlur = (field: string, value: string) => {
        isEditingRef.current = false;
        const parsed = parseFloat(value) || 0;
        onUpdate(body.id, { [field]: parsed });
        // Sync local back to numeric if it was an invalid string
        setLocalData({ ...localData, [field]: parsed.toString() });
    };

    const handleVelocityUpdate = (axis: 'x' | 'y', value: string) => {
        const newVelocity = { ...localData.velocity, [axis]: value };
        setLocalData({ ...localData, velocity: newVelocity });

        const parsed = parseFloat(value);
        if (!isNaN(parsed) && value !== '-' && !value.endsWith('.')) {
            onUpdate(body.id, {
                velocity: {
                    x: axis === 'x' ? parsed : parseFloat(localData.velocity.x),
                    y: axis === 'y' ? parsed : parseFloat(localData.velocity.y)
                }
            });
        }
    };

    const handleVelocityBlur = (axis: 'x' | 'y', value: string) => {
        isEditingRef.current = false;
        const parsed = parseFloat(value) || 0;
        const finalVelocity = {
            x: axis === 'x' ? parsed : parseFloat(localData.velocity.x),
            y: axis === 'y' ? parsed : parseFloat(localData.velocity.y)
        };
        onUpdate(body.id, { velocity: finalVelocity });
        setLocalData({
            ...localData,
            velocity: {
                x: finalVelocity.x.toString(),
                y: finalVelocity.y.toString()
            }
        });
    };

    const handleAccelerationUpdate = (axis: 'x' | 'y', value: string) => {
        const newAccel = { ...localData.acceleration, [axis]: value };
        setLocalData({ ...localData, acceleration: newAccel });

        const parsed = parseFloat(value);
        if (!isNaN(parsed) && value !== '-' && !value.endsWith('.')) {
            onUpdate(body.id, {
                acceleration: {
                    x: axis === 'x' ? parsed : parseFloat(localData.acceleration.x),
                    y: axis === 'y' ? parsed : parseFloat(localData.acceleration.y)
                }
            });
        }
    };

    const handleAccelerationBlur = (axis: 'x' | 'y', value: string) => {
        isEditingRef.current = false;
        const parsed = parseFloat(value) || 0;
        const finalAccel = {
            x: axis === 'x' ? parsed : parseFloat(localData.acceleration.x),
            y: axis === 'y' ? parsed : parseFloat(localData.acceleration.y)
        };
        onUpdate(body.id, { acceleration: finalAccel });
        setLocalData({
            ...localData,
            acceleration: {
                x: finalAccel.x.toString(),
                y: finalAccel.y.toString()
            }
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            (e.currentTarget as HTMLInputElement).blur();
        }
    };

    const handleImmediateUpdate = (updates: Partial<BodyData>) => {
        // For non-numeric or simple toggles/colors
        setLocalData({ ...localData, ...updates });
        onUpdate(body.id, updates);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Object Properties
                </div>
                <button
                    onClick={() => onDelete(body.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Color */}
            <div className="flex items-center gap-3">
                <input
                    type="color"
                    value={localData.color}
                    onChange={(e) => handleImmediateUpdate({ color: e.target.value })}
                    className="h-8 w-8 rounded-lg cursor-pointer border-0 p-0 shadow-sm"
                />
                <span className="text-xs text-slate-500">Color</span>
            </div>

            {/* Static Toggle */}
            <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                    <input
                        type="checkbox"
                        checked={localData.isStatic}
                        onChange={(e) => handleImmediateUpdate({ isStatic: e.target.checked })}
                        className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-checked:bg-amber-500 rounded-full transition-colors" />
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                </div>
                <span className="text-xs text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                    Static (Fixed Position)
                </span>
            </label>

            {/* Angle */}
            <div>
                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>Rotation</span>
                    <span className="font-mono">{parseFloat(localData.angle).toFixed(0)}°</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="360"
                    value={parseFloat(localData.angle) || 0}
                    onChange={(e) => handleUpdateField('angle', e.target.value)}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
            </div>

            {/* Velocity */}
            <div>
                <div className="text-[10px] text-slate-500 mb-2">Velocity</div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-[9px] text-slate-400 block mb-1">X (+ Right)</label>
                        <input
                            type="text"
                            value={localData.velocity.x}
                            onFocus={handleFocus}
                            onChange={(e) => handleVelocityUpdate('x', e.target.value)}
                            onBlur={(e) => handleVelocityBlur('x', e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full text-xs p-2 bg-slate-100 dark:bg-slate-800 rounded-lg border-0 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="text-[9px] text-slate-400 block mb-1">Y (+ Down)</label>
                        <input
                            type="text"
                            value={localData.velocity.y}
                            onFocus={handleFocus}
                            onChange={(e) => handleVelocityUpdate('y', e.target.value)}
                            onBlur={(e) => handleVelocityBlur('y', e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full text-xs p-2 bg-slate-100 dark:bg-slate-800 rounded-lg border-0 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* Acceleration */}
            <div>
                <div className="text-[10px] text-slate-500 mb-2">Constant Acceleration</div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-[9px] text-slate-400 block mb-1">X (+ Right)</label>
                        <input
                            type="text"
                            value={localData.acceleration.x}
                            onFocus={handleFocus}
                            onChange={(e) => handleAccelerationUpdate('x', e.target.value)}
                            onBlur={(e) => handleAccelerationBlur('x', e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full text-xs p-2 bg-slate-100 dark:bg-slate-800 rounded-lg border-0 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="text-[9px] text-slate-400 block mb-1">Y (+ Down)</label>
                        <input
                            type="text"
                            value={localData.acceleration.y}
                            onFocus={handleFocus}
                            onChange={(e) => handleAccelerationUpdate('y', e.target.value)}
                            onBlur={(e) => handleAccelerationBlur('y', e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full text-xs p-2 bg-slate-100 dark:bg-slate-800 rounded-lg border-0 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* Material Properties */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-500 mb-3">Material</div>

                {/* Bounciness */}
                <div className="mb-3">
                    <div className="flex justify-between text-[9px] text-slate-400 mb-1">
                        <span>Bounciness</span>
                        <span className="font-mono">{parseFloat(localData.restitution).toFixed(1)}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1.2"
                        step="0.1"
                        value={parseFloat(localData.restitution) || 0}
                        onChange={(e) => handleUpdateField('restitution', e.target.value)}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                </div>

                {/* Friction */}
                <div>
                    <div className="flex justify-between text-[9px] text-slate-400 mb-1">
                        <span>Friction</span>
                        <span className="font-mono">{parseFloat(localData.friction).toFixed(2)}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={parseFloat(localData.friction) || 0}
                        onChange={(e) => handleUpdateField('friction', e.target.value)}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                </div>
            </div>
        </div>
    );
}
