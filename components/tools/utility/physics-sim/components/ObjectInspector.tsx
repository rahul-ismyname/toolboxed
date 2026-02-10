'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Zap, ArrowRight, Activity, X, Sparkles, Settings2, Move, Ruler, Weight, Wind, Lock, Unlock, Hash, BoxSelect } from 'lucide-react';
import { LogicRule, ComparisonOperator, LogicProperty, LogicActionType } from '../logic/LogicSystem';

interface BodyData {
    id: number;
    color: string;
    isStatic: boolean;
    angle: number;
    velocity: { x: number; y: number };
    acceleration: { x: number; y: number };
    restitution: number;
    friction: number;
    width: number;
    height: number;
    circleRadius?: number;
    vars?: Record<string, number>;
}

interface ObjectInspectorProps {
    body: BodyData | null;
    onUpdate: (id: number, updates: Partial<BodyData>) => void;
    onDelete: (id: number) => void;
    addRule: (rule: LogicRule) => void;
    removeRule: (id: string) => void;
    updateRule: (id: string, updates: Partial<LogicRule>) => void;
    clearBodyRules: (bodyId: number) => void;
    getAllRules: () => LogicRule[];
}

const MATERIALS = {
    custom: { name: 'Custom', restitution: 0.5, friction: 0.5, density: 0.001 },
    rubber: { name: 'Rubber', restitution: 0.9, friction: 0.8, density: 0.002 },
    metal: { name: 'Metal', restitution: 0.2, friction: 0.1, density: 0.008 },
    wood: { name: 'Wood', restitution: 0.3, friction: 0.5, density: 0.001 },
    ice: { name: 'Ice', restitution: 0.1, friction: 0.01, density: 0.0009 },
    superball: { name: 'Super Ball', restitution: 1.1, friction: 0.5, density: 0.001 }
};

export function ObjectInspector({ body, onUpdate, onDelete, addRule, removeRule, updateRule, clearBodyRules, getAllRules }: ObjectInspectorProps) {
    const [localData, setLocalData] = useState<any>(null);
    const isEditingRef = useRef(false);
    const [activeTab, setActiveTab] = useState<'properties' | 'physics' | 'logic'>('properties');

    // Variable Manager State
    const [newVarName, setNewVarName] = useState('');
    const [newVarValue, setNewVarValue] = useState('0');

    // Logic Rules State
    const [bodyRules, setBodyRules] = useState<LogicRule[]>([]);
    const [isAddingRule, setIsAddingRule] = useState(false);
    const [isAdvancedMode, setIsAdvancedMode] = useState(false);
    const [newRule, setNewRule] = useState<{
        trigger: 'continuous' | 'collision_start' | 'collision_horizontal' | 'collision_vertical' | 'key_hold' | 'timer',
        collisionTargetId: string,
        property: LogicProperty,
        operator: ComparisonOperator,
        value: string,
        conditionVariableName: string,
        mode: 'continuous' | 'pulse',
        actions: { type: LogicActionType, value: any, variableName: string, useVariableValue?: boolean }[],
        elseActions: { type: LogicActionType, value: any, variableName: string, useVariableValue?: boolean }[],
        hasElse: boolean,
        key: string,
        interval?: number
    }>({
        trigger: 'continuous',
        key: ' ',
        collisionTargetId: '',
        property: 'position.x',
        operator: '>',
        value: '500',
        conditionVariableName: 'myVar',
        mode: 'continuous',
        actions: [{ type: 'set_color', value: '#EF4444', variableName: 'myVar' }],
        elseActions: [{ type: 'set_color', value: '#3B82F6', variableName: 'myVar' }],
        hasElse: false,
    });

    // Refresh rules
    useEffect(() => {
        if (body) {
            const all = getAllRules();
            setBodyRules(all.filter(r => r.targetBodyId === body.id));
        }
    }, [body, getAllRules, isAddingRule]);

    // Sync from external body when not editing
    useEffect(() => {
        if (!isEditingRef.current && body) {
            setLocalData({
                ...body,
                angle: body.angle.toFixed(2),
                velocity: {
                    x: body.velocity.x.toFixed(2),
                    y: body.velocity.y.toFixed(2)
                },
                acceleration: {
                    x: body.acceleration.x.toFixed(2),
                    y: body.acceleration.y.toFixed(2)
                },
                restitution: body.restitution.toFixed(2),
                friction: body.friction.toFixed(2),
                width: body.width.toFixed(2),
                height: body.height.toFixed(2),
                circleRadius: body.circleRadius ? body.circleRadius.toFixed(2) : undefined
            });
        }
    }, [body]);

    if (!body || !localData) {
        return (
            <div className="text-center py-6 text-slate-400 text-xs font-medium">
                Click an object to select it
            </div>
        );
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        isEditingRef.current = true;
        e.currentTarget.select();
    };

    const handleUpdateField = (field: string, value: string) => {
        setLocalData({ ...localData, [field]: value });
        const parsed = parseFloat(value);
        if (!isNaN(parsed) && value !== '-' && !value.endsWith('.')) {
            onUpdate(body.id, { [field]: parsed });
        }
    };

    const handleLocalInput = (field: string, value: string) => {
        setLocalData({ ...localData, [field]: value });
    };

    const handleBlur = (field: string, value: string) => {
        isEditingRef.current = false;
        const parsed = parseFloat(value) || 0;
        onUpdate(body.id, { [field]: parsed });
        setLocalData({ ...localData, [field]: parsed.toString() });
    };

    const handleVelocityUpdate = (axis: 'x' | 'y', value: string) => {
        setLocalData((prev: any) => ({
            ...prev,
            velocity: { ...prev.velocity, [axis]: value }
        }));
    };

    const handleVelocityBlur = (axis: 'x' | 'y', value: string) => {
        isEditingRef.current = false;
        const parsed = parseFloat(value);
        if (isNaN(parsed)) return;
        onUpdate(body.id, {
            velocity: {
                x: axis === 'x' ? parsed : body.velocity.x,
                y: axis === 'y' ? parsed : body.velocity.y
            }
        });
    };

    const handleAccelerationUpdate = (axis: 'x' | 'y', value: string) => {
        setLocalData((prev: any) => ({
            ...prev,
            acceleration: { ...prev.acceleration, [axis]: value }
        }));
    };

    const handleAccelerationBlur = (axis: 'x' | 'y', value: string) => {
        isEditingRef.current = false;
        const parsed = parseFloat(value);
        if (isNaN(parsed)) return;
        onUpdate(body.id, {
            acceleration: {
                x: axis === 'x' ? parsed : body.acceleration.x,
                y: axis === 'y' ? parsed : body.acceleration.y
            }
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            (e.currentTarget as HTMLInputElement).blur();
        }
    };

    const handleImmediateUpdate = (updates: Partial<BodyData>) => {
        setLocalData({ ...localData, ...updates });
        onUpdate(body.id, updates);
    };

    const handleVariableUpdate = (varName: string, value: string) => {
        const parsed = parseFloat(value);
        if (isNaN(parsed)) return;
        const currentVars = body.vars || {};
        onUpdate(body.id, {
            vars: { ...currentVars, [varName]: parsed }
        });
    };

    const handleVariableDelete = (varName: string) => {
        const currentVars = { ...body.vars };
        delete currentVars[varName];
        onUpdate(body.id, { vars: currentVars });
    };

    const handleAddVariable = () => {
        if (!newVarName) return;
        const parsed = parseFloat(newVarValue);
        const currentVars = body.vars || {};
        onUpdate(body.id, {
            vars: { ...currentVars, [newVarName]: isNaN(parsed) ? 0 : parsed }
        });
        setNewVarName('');
        setNewVarValue('0');
    };

    const handleAddRule = () => {
        if (!body) return;

        const getActValue = (type: LogicActionType, val: string) => {
            if (type === 'set_color') return val;
            if (['set_velocity_x', 'set_velocity_y', 'maintain_speed_x', 'maintain_speed_y'].includes(type) || type === 'set_variable') {
                return parseFloat(val) || 0;
            }
            return val;
        };

        const rule: LogicRule = {
            id: Date.now().toString(),
            targetBodyId: body.id,
            enabled: true,
            trigger: newRule.trigger,
            key: newRule.trigger === 'key_hold' ? newRule.key : undefined,
            interval: newRule.trigger === 'timer' ? ((newRule as any).interval || 1000) : undefined,
            collisionTargetId: (newRule.trigger === 'collision_start' || newRule.trigger === 'collision_horizontal' || newRule.trigger === 'collision_vertical') && newRule.collisionTargetId ? parseInt(newRule.collisionTargetId) : undefined,
            condition: {
                property: newRule.property,
                operator: newRule.operator,
                value: parseFloat(newRule.value) || 0,
                variableName: newRule.property === 'variable' ? newRule.conditionVariableName : undefined,
                mode: newRule.mode
            },
            actions: (isAdvancedMode ? newRule.actions : [newRule.actions[0]]).map(a => ({
                type: a.type,
                value: (['explode'].includes(a.type) && typeof a.value === 'object') ? a.value : getActValue(a.type, a.value),
                variableName: a.type === 'set_variable' ? a.variableName : undefined
            })),
            elseActions: (isAdvancedMode && newRule.hasElse) ? newRule.elseActions.map(a => ({
                type: a.type,
                value: getActValue(a.type, a.value),
                variableName: a.type === 'set_variable' ? a.variableName : undefined
            })) : undefined
        };

        addRule(rule);
        setIsAddingRule(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Object Inspector
                </div>
                <button
                    onClick={() => onDelete(body.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {[
                    { id: 'properties', label: 'Basic', icon: Settings2 },
                    { id: 'physics', label: 'Physics', icon: Activity },
                    { id: 'logic', label: 'Logic', icon: Zap }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-2 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === tab.id
                            ? 'bg-white dark:bg-slate-700 text-indigo-500 shadow-sm'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                    >
                        <tab.icon className="w-3 h-3" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {activeTab === 'properties' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={localData.color}
                            onChange={(e) => handleImmediateUpdate({ color: e.target.value })}
                            className="h-8 w-8 rounded-lg cursor-pointer border-0 p-0 shadow-sm"
                        />
                        <span className="text-xs text-slate-500 font-medium">Object Style Color</span>
                    </div>

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
                        <span className="text-xs text-slate-500 font-medium group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                            Static (Fixed Position)
                        </span>
                    </label>

                    <div>
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">
                            <span className="flex items-center gap-1.5">
                                <Move className="w-3 h-3" /> Rotation (deg)
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min="0"
                                max="360"
                                value={parseFloat(localData.angle) || 0}
                                onChange={(e) => handleUpdateField('angle', e.target.value)}
                                className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <input
                                type="number"
                                value={localData.angle}
                                onChange={(e) => handleUpdateField('angle', e.target.value)}
                                onBlur={(e) => handleBlur('angle', e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-16 text-xs p-2 bg-slate-100 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-indigo-400 outline-none text-center font-mono"
                                step="1"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-1.5">
                            <Ruler className="w-3 h-3" /> Dimensions
                        </div>
                        {localData.circleRadius ? (
                            <div>
                                <label className="text-[9px] text-slate-400 font-bold block mb-1 ml-1 uppercase">Radius</label>
                                <input
                                    type="text"
                                    value={localData.circleRadius}
                                    onFocus={handleFocus}
                                    onChange={(e) => handleLocalInput('circleRadius', e.target.value)}
                                    onBlur={(e) => handleBlur('circleRadius', e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full text-xs p-2.5 bg-slate-100 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-indigo-400 outline-none font-mono"
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[9px] text-slate-400 font-bold block mb-1 ml-1 uppercase">Width</label>
                                    <input
                                        type="text"
                                        value={localData.width}
                                        onFocus={handleFocus}
                                        onChange={(e) => handleLocalInput('width', e.target.value)}
                                        onBlur={(e) => handleBlur('width', e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="w-full text-xs p-2.5 bg-slate-100 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-indigo-400 outline-none font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] text-slate-400 font-bold block mb-1 ml-1 uppercase">Height</label>
                                    <input
                                        type="text"
                                        value={localData.height}
                                        onFocus={handleFocus}
                                        onChange={(e) => handleLocalInput('height', e.target.value)}
                                        onBlur={(e) => handleBlur('height', e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="w-full text-xs p-2.5 bg-slate-100 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-indigo-400 outline-none font-mono"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Hash className="w-3.5 h-3.5 text-indigo-500" /> Variables
                            </h4>
                        </div>

                        <div className="space-y-1.5">
                            {body.vars && Object.entries(body.vars).map(([name, value]) => (
                                <div key={name} className="flex items-center gap-1.5 group/var bg-slate-50 dark:bg-slate-900/50 p-1 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <span className="text-[9px] font-mono font-bold text-slate-400 w-20 truncate px-1.5" title={name}>{name}</span>
                                    <input
                                        type="number"
                                        value={value}
                                        onChange={(e) => handleVariableUpdate(name, e.target.value)}
                                        className="flex-1 text-[10px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded md py-0.5 outline-none focus:border-indigo-400 font-mono text-center"
                                    />
                                    <button
                                        onClick={() => handleVariableDelete(name)}
                                        className="p-1 hover:text-red-500 text-slate-300 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}

                            <div className="flex items-center gap-1.5 mt-2 bg-indigo-50/20 dark:bg-indigo-900/10 p-1.5 rounded-lg border border-dashed border-indigo-200/50 dark:border-indigo-800/30">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={newVarName}
                                    onChange={(e) => setNewVarName(e.target.value)}
                                    className="w-16 text-[10px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded px-1.5 py-1 outline-none focus:border-indigo-400 font-bold"
                                />
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={newVarValue}
                                    onChange={(e) => setNewVarValue(e.target.value)}
                                    className="flex-1 text-[10px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded px-1.5 py-1 outline-none focus:border-indigo-400 font-mono text-center"
                                />
                                <button
                                    onClick={handleAddVariable}
                                    disabled={!newVarName}
                                    className="bg-indigo-500 text-white rounded p-1 hover:bg-indigo-600 disabled:opacity-50 transition-all shadow-sm"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'physics' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1 flex items-center gap-1.5">
                            <Wind className="w-3 h-3" /> Current Velocity
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[9px] text-slate-400 font-bold block mb-1 ml-1 uppercase">X-Axis</label>
                                <input
                                    type="text"
                                    value={localData.velocity.x}
                                    onFocus={handleFocus}
                                    onChange={(e) => handleVelocityUpdate('x', e.target.value)}
                                    onBlur={(e) => handleVelocityBlur('x', e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full text-xs p-2.5 bg-slate-100 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-indigo-400 outline-none font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-[9px] text-slate-400 font-bold block mb-1 ml-1 uppercase">Y-Axis</label>
                                <input
                                    type="text"
                                    value={localData.velocity.y}
                                    onFocus={handleFocus}
                                    onChange={(e) => handleVelocityUpdate('y', e.target.value)}
                                    onBlur={(e) => handleVelocityBlur('y', e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full text-xs p-2.5 bg-slate-100 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-indigo-400 outline-none font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1 flex items-center gap-1.5">
                            <Zap className="w-3 h-3 text-amber-500" /> Constant Forces
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[9px] text-slate-400 font-bold block mb-1 ml-1 uppercase">Acceleration X</label>
                                <input
                                    type="text"
                                    value={localData.acceleration.x}
                                    onFocus={handleFocus}
                                    onChange={(e) => handleAccelerationUpdate('x', e.target.value)}
                                    onBlur={(e) => handleAccelerationBlur('x', e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full text-xs p-2.5 bg-slate-100 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-indigo-400 outline-none font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-[9px] text-slate-400 font-bold block mb-1 ml-1 uppercase">Acceleration Y</label>
                                <input
                                    type="text"
                                    value={localData.acceleration.y}
                                    onFocus={handleFocus}
                                    onChange={(e) => handleAccelerationUpdate('y', e.target.value)}
                                    onBlur={(e) => handleAccelerationBlur('y', e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full text-xs p-2.5 bg-slate-100 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-indigo-400 outline-none font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-3 ml-1 flex items-center gap-1.5">
                            <BoxSelect className="w-3 h-3" /> Material presets
                        </div>
                        <div className="mb-4">
                            <select
                                className="w-full text-sm py-2.5 px-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:border-indigo-400 transition-all font-medium cursor-pointer"
                                value={Object.entries(MATERIALS).find(([key, mat]) =>
                                    Math.abs(mat.restitution - parseFloat(localData.restitution)) < 0.05 &&
                                    Math.abs(mat.friction - parseFloat(localData.friction)) < 0.05
                                )?.[0] || 'custom'}
                                onChange={(e) => {
                                    const mat = MATERIALS[e.target.value as keyof typeof MATERIALS];
                                    if (mat) {
                                        handleImmediateUpdate({
                                            restitution: mat.restitution,
                                            friction: mat.friction,
                                        });
                                        setLocalData((prev: any) => ({
                                            ...prev,
                                            restitution: mat.restitution.toString(),
                                            friction: mat.friction.toString()
                                        }));
                                    }
                                }}
                            >
                                {Object.entries(MATERIALS).map(([key, mat]) => (
                                    <option key={key} value={key}>{mat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-2 px-1">
                                    <span className="flex items-center gap-1.5">
                                        <ArrowRight className="w-3 h-3 -rotate-45" /> Bounciness
                                    </span>
                                    <span className="font-mono text-indigo-500">{parseFloat(localData.restitution).toFixed(2)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1.2"
                                    step="0.05"
                                    value={parseFloat(localData.restitution) || 0}
                                    onChange={(e) => handleUpdateField('restitution', e.target.value)}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-2 px-1">
                                    <span className="flex items-center gap-1.5">
                                        <Sparkles className="w-3 h-3" /> Friction
                                    </span>
                                    <span className="font-mono text-amber-500">{parseFloat(localData.friction).toFixed(2)}</span>
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
                </div>
            )}

            {activeTab === 'logic' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between px-1">
                        <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Zap className="w-4 h-4 fill-indigo-500/10" />
                            Behavior Logic
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setIsAdvancedMode(false)}
                                className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${!isAdvancedMode ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Simple
                            </button>
                            <button
                                onClick={() => setIsAdvancedMode(true)}
                                className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${isAdvancedMode ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Sequence
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => setIsAddingRule(true)}
                            className={`w-full py-4 group flex flex-col items-center justify-center gap-1 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl hover:border-indigo-400 dark:hover:border-indigo-500 transition-all active:scale-[0.98] ${isAddingRule ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            <Plus className="w-6 h-6 text-slate-300 group-hover:text-indigo-500 transition-colors mb-1" />
                            <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-500 uppercase tracking-widest">New Logic Rule</span>
                        </button>

                        {isAddingRule && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                                <div className="bg-white dark:bg-slate-900 w-full max-w-lg border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ring-4 ring-indigo-500/10 relative overflow-hidden">
                                    {/* Decorative Background */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                                    <div className="flex items-center justify-between mb-6 relative z-10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500">
                                                <Sparkles className="w-4 h-4 fill-current" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] leading-tight">New Behavior</div>
                                                <div className="text-[10px] text-slate-400 font-medium">Configure logic rule</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsAddingRule(false)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-6 relative z-10">
                                        {/* Step 1: Trigger */}
                                        <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-1 border border-slate-100 dark:border-slate-800">
                                            <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[8px] text-slate-500">1</div>
                                                Event Trigger
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 p-2">
                                                <div className="space-y-1">
                                                    <select
                                                        className="w-full text-sm py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer font-bold"
                                                        value={newRule.trigger}
                                                        onChange={e => setNewRule({ ...newRule, trigger: e.target.value as any })}
                                                    >
                                                        <option value="continuous">Continuous</option>
                                                        <option value="collision_start">On Collision</option>
                                                        <option value="timer">Timer</option>
                                                        <option value="key_hold">Key Press</option>
                                                    </select>
                                                    <div className="text-[9px] text-slate-400 px-1">Trigger Event</div>
                                                </div>

                                                <div className="space-y-1">
                                                    {newRule.trigger === 'continuous' ? (
                                                        <select
                                                            className="w-full text-sm py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer font-bold"
                                                            value={newRule.property}
                                                            onChange={e => setNewRule({ ...newRule, property: e.target.value as any })}
                                                        >
                                                            <option value="position.x">X Position</option>
                                                            <option value="position.y">Y Position</option>
                                                            <option value="velocity.x">Speed X</option>
                                                            <option value="velocity.y">Speed Y</option>
                                                        </select>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            className="w-full text-sm py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all font-mono font-bold"
                                                            value={newRule.trigger === 'key_hold' ? newRule.key : newRule.trigger === 'timer' ? (newRule as any).interval || '1000' : newRule.collisionTargetId}
                                                            onChange={e => {
                                                                if (newRule.trigger === 'key_hold') setNewRule({ ...newRule, key: e.target.value });
                                                                else if (newRule.trigger === 'timer') setNewRule({ ...newRule, interval: parseInt(e.target.value) || 1000 } as any);
                                                                else setNewRule({ ...newRule, collisionTargetId: e.target.value });
                                                            }}
                                                            placeholder={newRule.trigger === 'key_hold' ? "Key (e.g. Space)" : newRule.trigger === 'timer' ? "ms (e.g. 1000)" : "Filter"}
                                                        />
                                                    )}
                                                    <div className="text-[9px] text-slate-400 px-1">
                                                        {newRule.trigger === 'continuous' ? 'Monitored Property' :
                                                            newRule.trigger === 'key_hold' ? 'Key Name' :
                                                                newRule.trigger === 'timer' ? 'Interval (ms)' : 'Target Label'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Step 2: Action */}
                                        <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl p-1 border border-indigo-100 dark:border-indigo-500/20">
                                            <div className="px-3 py-2 text-[10px] font-black text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-[8px] text-indigo-500">2</div>
                                                Execute Action
                                            </div>
                                            <div className="p-2 space-y-2">
                                                {(isAdvancedMode ? newRule.actions : [newRule.actions[0]]).map((action, index) => (
                                                    <div key={index} className="flex gap-2 items-start">
                                                        <div className="flex-1 space-y-1">
                                                            <select
                                                                className="w-full text-sm py-2.5 px-3 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-white dark:bg-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer font-bold appearance-none text-indigo-900 dark:text-indigo-100"
                                                                value={action.type}
                                                                onChange={e => {
                                                                    const type = e.target.value as LogicActionType;
                                                                    const newActions = [...newRule.actions];
                                                                    let defaultValue: any = '10';
                                                                    // ... (keep existing default value logic logic)
                                                                    if (type === 'set_color') defaultValue = '#EF4444';
                                                                    else if (type === 'random_color' || type.includes('flip') || type === 'destroy_object') defaultValue = '';
                                                                    else if (type.includes('velocity') || type.includes('speed') || type.includes('angular_velocity')) defaultValue = '5';
                                                                    else if (type === 'set_variable') defaultValue = '1';
                                                                    else if (type === 'teleport') defaultValue = '400,300';
                                                                    else if (type === 'explode') defaultValue = { force: 2, radius: 200 };
                                                                    else if (type === 'apply_torque') defaultValue = '0.05';
                                                                    else if (type === 'apply_local_force') defaultValue = '0.5';

                                                                    newActions[index] = { ...newActions[index], type, value: defaultValue };
                                                                    setNewRule({ ...newRule, actions: newActions });
                                                                }}
                                                            >
                                                                <optgroup label="Movement">
                                                                    <option value="set_velocity_x">Set Speed X</option>
                                                                    <option value="set_velocity_y">Set Speed Y</option>
                                                                    <option value="maintain_speed_x">Maintain Speed X</option>
                                                                    <option value="maintain_speed_y">Maintain Speed Y</option>
                                                                    <option value="apply_local_force">Apply Thrust (Local)</option>
                                                                    <option value="flip_velocity_x">Bounce X</option>
                                                                    <option value="flip_velocity_y">Bounce Y</option>
                                                                </optgroup>
                                                                <optgroup label="Rotation">
                                                                    <option value="apply_torque">Push Spin (Torque)</option>
                                                                    <option value="set_angular_velocity">Set Spin Speed</option>
                                                                    <option value="maintain_angular_velocity">Maintain Spin (Motor)</option>
                                                                </optgroup>
                                                                <optgroup label="Special">
                                                                    <option value="teleport">Teleport</option>
                                                                    <option value="explode">Explode</option>
                                                                    <option value="spawn_object">Spawn Object</option>
                                                                    <option value="destroy_object">Destroy</option>
                                                                </optgroup>
                                                                <optgroup label="Visuals & Variables">
                                                                    <option value="set_color">Set Color</option>
                                                                    <option value="cycle_colors">Cycle Colors</option>
                                                                    <option value="set_variable">Set Variable</option>
                                                                    <option value="add_variable">Add Variable</option>
                                                                </optgroup>
                                                            </select>
                                                        </div>

                                                        {/* Dynamic Input based on Action */}
                                                        <div className="w-24">
                                                            {action.type === 'teleport' && (
                                                                <input
                                                                    type="text"
                                                                    className="w-full text-sm p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-white dark:bg-slate-900 outline-none focus:border-indigo-400 font-mono font-bold text-center"
                                                                    value={action.value}
                                                                    onChange={e => {
                                                                        const newActions = [...newRule.actions];
                                                                        newActions[index] = { ...newActions[index], value: e.target.value };
                                                                        setNewRule({ ...newRule, actions: newActions });
                                                                    }}
                                                                    placeholder="x,y"
                                                                />
                                                            )}
                                                            {/* Re-use existing explode/default input logic but styled better */}
                                                            {action.type === 'explode' && (
                                                                <div className="flex gap-1">
                                                                    <input
                                                                        type="number"
                                                                        className="w-1/2 text-sm p-1 rounded-lg border border-indigo-200 dark:border-indigo-500/30 text-center font-bold"
                                                                        value={(typeof action.value === 'object' ? action.value.force : 2)}
                                                                        onChange={e => {
                                                                            const newActions = [...newRule.actions];
                                                                            const currentVal = typeof action.value === 'object' ? action.value : { force: 2, radius: 200 };
                                                                            newActions[index] = { ...newActions[index], value: { ...currentVal, force: parseFloat(e.target.value) } };
                                                                            setNewRule({ ...newRule, actions: newActions });
                                                                        }}
                                                                        placeholder="F"
                                                                        title="Force"
                                                                    />
                                                                    <input
                                                                        type="number"
                                                                        className="w-1/2 text-sm p-1 rounded-lg border border-indigo-200 dark:border-indigo-500/30 text-center font-bold"
                                                                        value={(typeof action.value === 'object' ? action.value.radius : 200)}
                                                                        onChange={e => {
                                                                            const newActions = [...newRule.actions];
                                                                            const currentVal = typeof action.value === 'object' ? action.value : { force: 2, radius: 200 };
                                                                            newActions[index] = { ...newActions[index], value: { ...currentVal, radius: parseFloat(e.target.value) } };
                                                                            setNewRule({ ...newRule, actions: newActions });
                                                                        }}
                                                                        placeholder="R"
                                                                        title="Radius"
                                                                    />
                                                                </div>
                                                            )}

                                                            {!['random_color', 'flip_velocity_x', 'flip_velocity_y', 'destroy_object', 'teleport', 'explode'].includes(action.type) && (
                                                                <input
                                                                    type="text"
                                                                    className="w-full text-sm p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-white dark:bg-slate-900 outline-none focus:border-indigo-400 font-mono font-bold text-center"
                                                                    value={action.value}
                                                                    onChange={e => {
                                                                        const newActions = [...newRule.actions];
                                                                        newActions[index] = { ...newActions[index], value: e.target.value };
                                                                        setNewRule({ ...newRule, actions: newActions });
                                                                    }}
                                                                    placeholder="Value"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}

                                                {isAdvancedMode && (
                                                    <button
                                                        onClick={() => setNewRule({ ...newRule, actions: [...newRule.actions, { type: 'set_color', value: '#EF4444', variableName: 'myVar' }] })}
                                                        className="w-full py-2 text-[10px] font-bold text-indigo-400 hover:text-indigo-600 border border-dashed border-indigo-200 dark:border-indigo-500/30 rounded-xl transition-all flex items-center justify-center gap-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                                    >
                                                        <Plus className="w-3 h-3" /> Add Step
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleAddRule}
                                            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                        >
                                            <Zap className="w-4 h-4 fill-white/20" />
                                            Deploy Behavior
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4 pt-4">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Active Behaviors
                            </div>

                            {(bodyRules || []).length > 0 ? (
                                <div className="space-y-3 pb-12">
                                    {bodyRules.map(rule => (
                                        <div key={rule.id} className={`group flex flex-col p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md ${!rule.enabled ? 'opacity-50' : ''}`}>
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={rule.enabled}
                                                            onChange={(e) => updateRule(rule.id, { enabled: e.target.checked })}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500 rounded-full" />
                                                    </label>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">
                                                            {rule.trigger === 'continuous' ? 'IF Condition' : rule.trigger === 'key_hold' ? 'ON Key Press' : 'ON Collision'}
                                                        </span>
                                                        <span className="text-xs font-black text-slate-700 dark:text-slate-200">
                                                            {rule.trigger === 'continuous' ? `${rule.condition.property} ${rule.condition.operator} ${rule.condition.value}` : rule.trigger === 'key_hold' ? `'${rule.key}'` : 'Contact Detected'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeRule(rule.id)}
                                                    className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="space-y-2 pt-3 border-t border-slate-50 dark:border-slate-800">
                                                {(rule.actions || []).map((action, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-[10px]">
                                                        <Zap className="w-4 h-4 text-amber-500 fill-amber-500/10" />
                                                        <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight">
                                                            {action.type.replace(/_/g, ' ')}: <span className="text-indigo-500 dark:text-indigo-400 font-mono font-black">{typeof action.value === 'object' ? 'Config' : action.value}</span>
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => confirm('Clear all rules?') && clearBodyRules(body!.id)}
                                        className="w-full py-4 text-[10px] font-black text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl transition-all uppercase tracking-widest"
                                    >
                                        Clear All Logic
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-16 px-8 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800/50 text-slate-400">
                                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                    <p className="text-xs font-black uppercase tracking-widest mb-1">Interactive Void</p>
                                    <p className="text-[10px] opacity-60 italic">Define behaviors to bring this object to life.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ObjectInspector;
