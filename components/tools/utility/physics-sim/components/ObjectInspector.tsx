'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Zap, ArrowRight, Activity, X } from 'lucide-react';
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
        trigger: 'continuous' | 'collision_start' | 'collision_horizontal' | 'collision_vertical' | 'key_hold',
        collisionTargetId: string,
        property: LogicProperty,
        operator: ComparisonOperator,
        value: string,
        conditionVariableName: string,
        mode: 'continuous' | 'pulse',
        actions: { type: LogicActionType, value: any, variableName: string, useVariableValue?: boolean }[],
        elseActions: { type: LogicActionType, value: any, variableName: string, useVariableValue?: boolean }[],
        hasElse: boolean,
        key: string
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
    }, [body, getAllRules, isAddingRule]); // Refresh when adding too

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
            <div className="text-center py-6 text-slate-400 text-xs">
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
        // Sync local back to numeric if it was an invalid string
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

        // When blurring, we only want to update the edited axis
        // and keep the other axis as it is IN THE ENGINE currently
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
        // For non-numeric or simple toggles/colors
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

        const parseVector = (val: string) => {
            const parts = val.split(',');
            return parts.length === 2 ? { x: parseFloat(parts[0]), y: parseFloat(parts[1]) } : { x: 0, y: 0 };
        };

        const getActValue = (type: LogicActionType, val: string) => {
            if (type === 'set_color') return val;
            if (['apply_force', 'set_velocity'].includes(type)) {
                const parts = val.split(',').map(p => parseFloat(p.trim()));
                return { x: parts[0] || 0, y: parts[1] || 0 };
            }
            if (type === 'set_gravity') return parseFloat(val) || 0;
            if (['set_variable', 'add_variable'].includes(type)) return parseFloat(val) || 0;
            return val;
        };

        const rule: LogicRule = {
            id: Date.now().toString(),
            targetBodyId: body.id,
            enabled: true,
            trigger: newRule.trigger,
            key: newRule.trigger === 'key_hold' ? newRule.key : undefined,
            collisionTargetId: newRule.trigger === 'collision_start' && newRule.collisionTargetId ? parseInt(newRule.collisionTargetId) : undefined,
            condition: {
                property: newRule.property,
                operator: newRule.operator,
                value: parseFloat(newRule.value) || 0,
                variableName: newRule.property === 'variable' ? newRule.conditionVariableName : undefined,
                mode: newRule.mode
            },
            actions: newRule.actions.map(a => ({
                type: a.type,
                value: getActValue(a.type, a.value),
                variableName: ['set_variable', 'add_variable'].includes(a.type) ? a.variableName : undefined
            })),
            elseActions: newRule.hasElse ? newRule.elseActions.map(a => ({
                type: a.type,
                value: getActValue(a.type, a.value),
                variableName: ['set_variable', 'add_variable'].includes(a.type) ? a.variableName : undefined
            })) : undefined
        };

        addRule(rule);
        setIsAddingRule(false);
    };


    return (
        <div className="space-y-4">
            {/* ... (Keep header and tabs) ... */}
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

            {/* Tabs */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {(['properties', 'physics', 'logic'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === tab
                            ? 'bg-white dark:bg-slate-700 text-indigo-500 shadow-sm'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>


            {activeTab === 'properties' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
                            <span>Rotation (deg)</span>
                        </div>
                        <div className="flex items-center gap-2">
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
                                className="w-16 text-xs p-1 bg-slate-100 dark:bg-slate-800 rounded-md border-0 focus:ring-2 focus:ring-indigo-500 text-center"
                                step="1"
                            />
                        </div>
                    </div>

                    {/* Dimensions */}
                    <div>
                        {localData.circleRadius ? (
                            <div>
                                <div className="text-[10px] text-slate-500 mb-2">Dimensions</div>
                                <div>
                                    <label className="text-[9px] text-slate-400 block mb-1">Radius</label>
                                    <input
                                        type="text"
                                        value={localData.circleRadius}
                                        onFocus={handleFocus}
                                        onChange={(e) => handleLocalInput('circleRadius', e.target.value)}
                                        onBlur={(e) => handleBlur('circleRadius', e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="w-full text-xs p-2 bg-slate-100 dark:bg-slate-800 rounded-lg border-0 focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="text-[10px] text-slate-500 mb-2">Dimensions</div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[9px] text-slate-400 block mb-1">Width</label>
                                        <input
                                            type="text"
                                            value={localData.width}
                                            onFocus={handleFocus}
                                            onChange={(e) => handleLocalInput('width', e.target.value)}
                                            onBlur={(e) => handleBlur('width', e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className="w-full text-xs p-2 bg-slate-100 dark:bg-slate-800 rounded-lg border-0 focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] text-slate-400 block mb-1">Height</label>
                                        <input
                                            type="text"
                                            value={localData.height}
                                            onFocus={handleFocus}
                                            onChange={(e) => handleLocalInput('height', e.target.value)}
                                            onBlur={(e) => handleBlur('height', e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className="w-full text-xs p-2 bg-slate-100 dark:bg-slate-800 rounded-lg border-0 focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Variable Manager Section */}
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <Activity className="w-3 h-3" /> Variable Manager
                            </h4>
                        </div>

                        <div className="space-y-2">
                            {/* List existing variables */}
                            {body.vars && Object.entries(body.vars).map(([name, value]) => (
                                <div key={name} className="flex items-center gap-2 group/var">
                                    <span className="text-[10px] font-mono text-slate-500 w-20 truncate" title={name}>{name}</span>
                                    <input
                                        type="number"
                                        value={value}
                                        onChange={(e) => handleVariableUpdate(name, e.target.value)}
                                        className="flex-1 text-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-1 outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                    <button
                                        onClick={() => handleVariableDelete(name)}
                                        className="p-1 hover:bg-red-50 hover:text-red-500 rounded opacity-0 group-hover/var:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-3 h-3 text-slate-400" />
                                    </button>
                                </div>
                            ))}

                            {/* Add new variable */}
                            <div className="flex items-center gap-1 mt-3 bg-indigo-50/50 dark:bg-indigo-900/20 p-1.5 rounded-lg border border-indigo-100/50 dark:border-indigo-800/30">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={newVarName}
                                    onChange={(e) => setNewVarName(e.target.value)}
                                    className="w-20 text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-1 outline-none"
                                />
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={newVarValue}
                                    onChange={(e) => setNewVarValue(e.target.value)}
                                    className="flex-1 text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-1 outline-none"
                                />
                                <button
                                    onClick={handleAddVariable}
                                    disabled={!newVarName}
                                    className="p-1.5 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50 transition-colors"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: PHYSICS */}
            {activeTab === 'physics' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
                        {/* Material Preset Selector */}
                        <div className="mb-3">
                            <select
                                className="w-full text-xs p-2 bg-slate-100 dark:bg-slate-800 rounded-lg border-0 focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-300"
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

                        {/* Bounciness */}
                        <div className="mb-3">
                            <div className="flex justify-between text-[9px] text-slate-400 mb-1">
                                <span>Bounciness</span>
                                <span className="font-mono">{parseFloat(localData.restitution).toFixed(2)}</span>
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
            )}

            {/* TAB: LOGIC */}
            {activeTab === 'logic' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            <span>Rules Management</span>
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => setIsAdvancedMode(false)}
                                className={`px-2 py-0.5 text-[9px] rounded-md transition-all ${!isAdvancedMode ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-white font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Basic
                            </button>
                            <button
                                onClick={() => setIsAdvancedMode(true)}
                                className={`px-2 py-0.5 text-[9px] rounded-md transition-all ${isAdvancedMode ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-white font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Advanced
                            </button>
                        </div>
                    </div>

                    {/* Add Rule Form */}
                    <div className="mb-4">
                        {!isAddingRule ? (
                            <button
                                onClick={() => setIsAddingRule(true)}
                                className="w-full py-2 flex items-center justify-center gap-2 bg-indigo-500 text-white rounded-lg text-xs font-bold hover:bg-indigo-600 transition-all shadow-md active:scale-[0.98]"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Create New Behavior
                            </button>
                        ) : (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">IF (Trigger)</span>
                                    <button
                                        onClick={() => setIsAddingRule(false)}
                                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Trigger Type */}
                                <div className="mb-4">
                                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Trigger</label>
                                    <select
                                        className="w-full text-sm p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                        value={newRule.trigger}
                                        onChange={e => setNewRule({ ...newRule, trigger: e.target.value as any })}
                                    >
                                        <option value="continuous">Condition Check</option>
                                        <option value="collision_start">Any Collision</option>
                                        <option value="collision_horizontal">Horizontal Collision</option>
                                        <option value="collision_vertical">Vertical Collision</option>
                                        <option value="key_hold">Key Press</option>
                                    </select>
                                </div>

                                {/* Condition */}
                                {newRule.trigger === 'continuous' ? (
                                    <div className="mb-4">
                                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Condition</label>
                                        <div className="flex gap-2">
                                            <select
                                                className="flex-1 text-sm p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                                value={newRule.property}
                                                onChange={e => setNewRule({ ...newRule, property: e.target.value as any })}
                                            >
                                                <option value="position.x">X Position</option>
                                                <option value="position.y">Y Position</option>
                                                <option value="velocity.x">X Velocity</option>
                                                <option value="velocity.y">Y Velocity</option>
                                                <option value="variable">Variable</option>
                                            </select>
                                            <select
                                                className="w-16 text-sm p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-center"
                                                value={newRule.operator}
                                                onChange={e => setNewRule({ ...newRule, operator: e.target.value as any })}
                                            >
                                                <option value=">">&gt;</option>
                                                <option value="<">&lt;</option>
                                                <option value=">=">&ge;</option>
                                                <option value="<=">&le;</option>
                                                <option value="==">=</option>
                                            </select>
                                            <input
                                                type="number"
                                                className="w-20 text-sm p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-center"
                                                value={newRule.value}
                                                onChange={e => setNewRule({ ...newRule, value: e.target.value })}
                                                placeholder="0"
                                            />
                                        </div>
                                        {newRule.property === 'variable' && (
                                            <input
                                                type="text"
                                                className="w-full text-sm p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 mt-2"
                                                value={newRule.conditionVariableName}
                                                onChange={e => setNewRule({ ...newRule, conditionVariableName: e.target.value })}
                                                placeholder="Variable name"
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <div className="mb-4">
                                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                                            {newRule.trigger === 'key_hold' ? 'Key' : 'Target Body ID'}
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full text-sm p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                            value={newRule.trigger === 'key_hold' ? newRule.key : newRule.collisionTargetId}
                                            onChange={e => {
                                                if (newRule.trigger === 'key_hold') setNewRule({ ...newRule, key: e.target.value });
                                                else setNewRule({ ...newRule, collisionTargetId: e.target.value });
                                            }}
                                            placeholder={newRule.trigger === 'key_hold' ? "space, w, ArrowUp" : "Leave empty for any"}
                                        />
                                    </div>
                                )}


                                <div className="mb-4">
                                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Action</label>
                                    <div className="space-y-2">
                                        {(isAdvancedMode ? newRule.actions : [newRule.actions[0]]).map((action, index) => (
                                            <div key={index} className="flex gap-2">
                                                <select
                                                    className="flex-1 text-sm p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                                    value={action.type}
                                                    onChange={e => {
                                                        const type = e.target.value as LogicActionType;
                                                        const newActions = [...newRule.actions];
                                                        let defaultValue: any = '';

                                                        if (type === 'set_color') defaultValue = '#EF4444';
                                                        else if (type === 'random_color') defaultValue = '';
                                                        else if (type === 'cycle_colors') defaultValue = '#EF4444, #3B82F6, #10B981';
                                                        else if (type === 'set_velocity') defaultValue = '5';
                                                        else if (type === 'set_velocity_x' || type === 'set_velocity_y') defaultValue = '5';
                                                        else if (type === 'add_velocity') defaultValue = '1';
                                                        else if (type === 'add_velocity_x' || type === 'add_velocity_y') defaultValue = '1';
                                                        else if (type === 'multiply_velocity') defaultValue = '-1';
                                                        else if (type === 'set_acceleration') defaultValue = '0.5,0';
                                                        else if (type === 'set_acceleration_x' || type === 'set_acceleration_y') defaultValue = '0.5';
                                                        else if (type === 'set_gravity') defaultValue = '0,1';
                                                        else if (type === 'apply_force') defaultValue = '50,0';
                                                        else if (type === 'set_variable' || type === 'add_variable') defaultValue = '1';
                                                        else if (type === 'spawn_object') defaultValue = { type: 'box', x: 0, y: -50, width: 40, height: 40, color: '#10B981' };

                                                        newActions[index] = { ...newActions[index], type, value: defaultValue };
                                                        setNewRule({ ...newRule, actions: newActions });
                                                    }}
                                                >
                                                    <option value="set_color">🎨 Set Color</option>
                                                    <option value="random_color">🎲 Random Color</option>
                                                    <option value="set_velocity_x">➡️ Set Speed X</option>
                                                    <option value="set_velocity_y">⬇️ Set Speed Y</option>
                                                    <option value="flip_velocity_x">↔️ Flip X</option>
                                                    <option value="flip_velocity_y">↕️ Flip Y</option>
                                                    <option value="maintain_speed_x">⏩ Keep Speed X</option>
                                                    <option value="maintain_speed_y">⏬ Keep Speed Y</option>
                                                    <option value="set_variable">📊 Set Variable</option>
                                                    <option value="destroy_object">💥 Destroy</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    className="w-20 text-xs p-2 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                                                    value={action.value}
                                                    onChange={e => {
                                                        const newActions = [...newRule.actions];
                                                        newActions[index] = { ...newActions[index], value: e.target.value };
                                                        setNewRule({ ...newRule, actions: newActions });
                                                    }}
                                                    placeholder="value"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {isAdvancedMode && (
                                    <button
                                        onClick={() => setNewRule({ ...newRule, actions: [...newRule.actions, { type: 'set_color', value: '#EF4444', variableName: 'myVar' }] })}
                                        className="w-full py-1.5 text-[9px] border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-500 rounded-lg transition-all flex items-center justify-center gap-1"
                                    >
                                        <Plus className="w-2.5 h-2.5" /> Add Sequence
                                    </button>
                                )}

                                {isAdvancedMode && (
                                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                                        <label className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ELSE Clause (Optional)</span>
                                            <input
                                                type="checkbox"
                                                checked={newRule.hasElse}
                                                onChange={e => setNewRule({ ...newRule, hasElse: e.target.checked })}
                                                className="w-3 h-3 rounded"
                                            />
                                        </label>

                                        {newRule.hasElse && (
                                            <div className="space-y-1.5">
                                                {newRule.elseActions.map((action, index) => (
                                                    <div key={index} className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700 relative group/else">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <select
                                                                className="text-[10px] p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                                                                value={action.type}
                                                                onChange={e => {
                                                                    const type = e.target.value as LogicActionType;
                                                                    const newActions = [...newRule.elseActions];
                                                                    let defaultValue: any = '';

                                                                    if (type === 'set_color') defaultValue = '#EF4444';
                                                                    else if (type === 'random_color') defaultValue = '';
                                                                    else if (type === 'cycle_colors') defaultValue = '#EF4444, #3B82F6, #10B981';
                                                                    else if (type === 'set_velocity' || type === 'set_velocity_x' || type === 'set_velocity_y') defaultValue = '5';
                                                                    else if (type === 'add_velocity' || type === 'add_velocity_x' || type === 'add_velocity_y') defaultValue = '1';
                                                                    else if (type === 'multiply_velocity' || type === 'multiply_velocity_x' || type === 'multiply_velocity_y') defaultValue = '-1';
                                                                    else if (type === 'set_acceleration' || type === 'set_acceleration_x' || type === 'set_acceleration_y') defaultValue = '0.5';
                                                                    else if (type === 'set_gravity') defaultValue = '0,1';
                                                                    else if (type === 'apply_force') defaultValue = '50,0';
                                                                    else if (type === 'set_variable' || type === 'add_variable' || type === 'multiply_variable') defaultValue = '1';
                                                                    else if (type === 'spawn_object') defaultValue = { type: 'box', x: 0, y: -50, width: 40, height: 40, color: '#10B981' };

                                                                    newActions[index] = { ...newActions[index], type, value: defaultValue };
                                                                    setNewRule({ ...newRule, elseActions: newActions });
                                                                }}
                                                            >
                                                                <optgroup label="Appearance">
                                                                    <option value="set_color">Set Color</option>
                                                                    <option value="random_color">Random Color</option>
                                                                    <option value="cycle_colors">Cycle Colors</option>
                                                                </optgroup>
                                                                <optgroup label="Movement">
                                                                    <option value="apply_force">Apply Force</option>
                                                                    <option value="set_acceleration_x">Set Acceleration X</option>
                                                                    <option value="set_acceleration_y">Set Acceleration Y</option>
                                                                    <option value="multiply_velocity_x">Multiply Velocity X</option>
                                                                    <option value="multiply_velocity_y">Multiply Velocity Y</option>
                                                                    <option value="set_gravity">Set Gravity</option>
                                                                    <option value="set_velocity_x">Set Velocity X</option>
                                                                    <option value="set_velocity_y">Set Velocity Y</option>
                                                                </optgroup>
                                                                <optgroup label="State">
                                                                    <option value="set_variable">Set Var</option>
                                                                    <option value="add_variable">Add Var</option>
                                                                    <option value="multiply_variable">Multiply Var</option>
                                                                </optgroup>
                                                                <optgroup label="Object">
                                                                    <option value="destroy_object">Destroy</option>
                                                                    <option value="spawn_object">Spawn</option>
                                                                </optgroup>
                                                            </select>
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={() => {
                                                                        const newActions = [...newRule.elseActions];
                                                                        newActions[index] = { ...newActions[index], useVariableValue: !newActions[index].useVariableValue };
                                                                        setNewRule({ ...newRule, elseActions: newActions });
                                                                    }}
                                                                    className={`p-1.5 rounded-md border transition-all ${action.useVariableValue ? 'bg-indigo-500 text-white border-indigo-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400'}`}
                                                                    title="Use Variable Value"
                                                                >
                                                                    <Activity className="w-3 h-3" />
                                                                </button>
                                                                <input
                                                                    type="text"
                                                                    className="flex-1 text-[10px] p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
                                                                    value={action.useVariableValue ? action.variableName : action.value}
                                                                    onChange={e => {
                                                                        const newActions = [...newRule.elseActions];
                                                                        if (action.useVariableValue) {
                                                                            newActions[index] = { ...newActions[index], variableName: e.target.value };
                                                                        } else {
                                                                            newActions[index] = { ...newActions[index], value: e.target.value };
                                                                        }
                                                                        setNewRule({ ...newRule, elseActions: newActions });
                                                                    }}
                                                                    placeholder={action.useVariableValue ? "Var Name" : "Value"}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={handleAddRule}
                                    className="w-full py-2.5 bg-indigo-500 text-white rounded-lg text-xs font-bold hover:bg-indigo-600 transition-all shadow-lg active:scale-[0.98] mt-4"
                                >
                                    Finish & Save Behavior
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Rules List */}
                    <div className="space-y-2">
                        {
                            bodyRules.map(rule => (
                                <div key={rule.id} className={`flex items-start justify-between p-2 rounded bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm transition-opacity ${!rule.enabled ? 'opacity-50' : ''}`}>
                                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                                        <div className="text-[10px] font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={rule.enabled}
                                                onChange={(e) => updateRule(rule.id, { enabled: e.target.checked })}
                                                className="w-3 h-3 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
                                            />
                                            <Activity className={`w-3 h-3 ${rule.enabled ? 'text-indigo-400' : 'text-slate-400'}`} />
                                            <div className="truncate">
                                                {rule.trigger === 'continuous' ? (
                                                    <span>
                                                        If <span className="font-bold text-indigo-500">
                                                            {rule.condition.property === 'variable' ? `'${rule.condition.variableName}'` : rule.condition.property}
                                                        </span> <span className="text-slate-400 mx-0.5">{rule.condition.operator}</span> <span className="font-bold">{rule.condition.value}</span>
                                                        {rule.condition.mode === 'pulse' && <span className="ml-1 px-1 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-[2px] text-[8px] uppercase tracking-tighter font-bold">Pulse</span>}
                                                    </span>
                                                ) : rule.trigger === 'key_hold' ? (
                                                    <span>On Key Hold <span className="font-bold text-indigo-500">'{rule.key}'</span></span>
                                                ) : (
                                                    <span>On Collision {rule.collisionTargetId ? `with ID ${rule.collisionTargetId}` : ''}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-[10px] text-slate-500 pl-5 space-y-1">
                                            {(rule.actions || []).map((action, i) => (
                                                <div key={i} className="flex items-center gap-1">
                                                    <span className="text-indigo-400 font-bold uppercase text-[8px]">Then</span>
                                                    <span className="text-slate-700 dark:text-slate-300">
                                                        {action.type === 'set_color' && <span className="flex items-center gap-1">Set Color to <span className="w-2 h-2 rounded-full border border-black/10" style={{ backgroundColor: action.value }} /> {action.value}</span>}
                                                        {action.type === 'random_color' && <span className="flex items-center gap-1 italic text-indigo-500 font-medium">Set Random Color</span>}
                                                        {action.type === 'cycle_colors' && <span className="flex items-center gap-1">Cycle colors: <span className="font-mono text-[8px] bg-slate-100 dark:bg-slate-700 px-1 rounded">{action.value}</span></span>}
                                                        {action.type === 'multiply_velocity' && <span className="flex items-center gap-1">Multiply Velocity by <span className="font-bold text-indigo-500">{action.value}x</span></span>}
                                                        {action.type === 'add_velocity' && <span className="flex items-center gap-1">Add Velocity <span className="font-bold text-indigo-500">({action.value})</span></span>}
                                                        {action.type === 'add_velocity_x' && <span className="flex items-center gap-1">Add Velocity X <span className="font-bold text-indigo-500">({action.value})</span></span>}
                                                        {action.type === 'add_velocity_y' && <span className="flex items-center gap-1">Add Velocity Y <span className="font-bold text-indigo-500">({action.value})</span></span>}
                                                        {action.type === 'set_acceleration' && <span className="flex items-center gap-1">Set Acceleration <span className="font-bold text-indigo-500">({action.value})</span></span>}
                                                        {action.type === 'set_acceleration_x' && <span className="flex items-center gap-1">Set Acceleration X <span className="font-bold text-indigo-500">({action.value})</span></span>}
                                                        {action.type === 'set_acceleration_y' && <span className="flex items-center gap-1">Set Acceleration Y <span className="font-bold text-indigo-500">({action.value})</span></span>}
                                                        {action.type === 'spawn_object' && `Spawn ${action.value.type} (+${action.value.x}, +${action.value.y})`}
                                                        {['set_variable', 'add_variable', 'multiply_variable'].includes(action.type) && `${action.type === 'set_variable' ? 'Set' : action.type === 'add_variable' ? 'Add to' : 'Multiply'} '${action.variableName}' ${action.value}`}
                                                        {action.type === 'apply_force' && `Apply Force ${typeof action.value === 'string' ? action.value : `(${action.value.x}, ${action.value.y})`}`}
                                                        {action.type === 'set_velocity' && `Set Velocity (${typeof action.value === 'object' ? `${action.value.x}, ${action.value.y}` : action.value})`}
                                                        {action.type === 'set_velocity_x' && `Set Velocity X (${action.value})`}
                                                        {action.type === 'set_velocity_y' && `Set Velocity Y (${action.value})`}
                                                        {action.type === 'set_gravity' && `Set Gravity (${typeof action.value === 'object' ? `${action.value.x}, ${action.value.y}` : action.value})`}
                                                        {action.type === 'destroy_object' && 'Destroy Object'}
                                                        {!['set_color', 'random_color', 'cycle_colors', 'multiply_velocity', 'add_velocity', 'add_velocity_x', 'add_velocity_y', 'set_acceleration', 'set_acceleration_x', 'set_acceleration_y', 'spawn_object', 'set_variable', 'add_variable', 'multiply_variable', 'apply_force', 'set_velocity', 'set_velocity_x', 'set_velocity_y', 'set_gravity', 'destroy_object'].includes(action.type) && `${action.type} ${typeof action.value === 'object' ? JSON.stringify(action.value) : action.value}`}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {rule.elseActions && rule.elseActions.length > 0 && (
                                            <div className="text-[10px] text-slate-500 pl-5 border-l border-slate-100 dark:border-slate-700 ml-1.5 mt-0.5 space-y-1">
                                                {(rule.elseActions || []).map((action, i) => (
                                                    <div key={i} className="flex items-center gap-1">
                                                        <span className="text-slate-400 font-bold uppercase text-[8px]">Else</span>
                                                        <span className="text-slate-600 dark:text-slate-400">
                                                            {action.type === 'set_color' && <span className="flex items-center gap-1">Set Color to <span className="w-2 h-2 rounded-full border border-black/10" style={{ backgroundColor: action.value }} /> {action.value}</span>}
                                                            {action.type === 'random_color' && <span className="italic text-slate-400 font-medium">Set Random Color</span>}
                                                            {['set_variable', 'add_variable'].includes(action.type) && `${action.type === 'set_variable' ? 'Set' : 'Add to'} '${action.variableName}' ${action.value}`}
                                                            {action.type === 'apply_force' && `Apply Force ${action.value}`}
                                                            {action.type === 'destroy_object' && 'Destroy Object'}
                                                            {!['set_color', 'random_color', 'set_variable', 'add_variable', 'apply_force', 'destroy_object'].includes(action.type) && `${action.type} ${JSON.stringify(action.value)}`}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeRule(rule.id)}
                                        className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-all shrink-0 ml-2"
                                        title="Delete Rule"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))
                        }

                        {
                            bodyRules.length > 0 && (
                                <button
                                    onClick={() => {
                                        if (confirm('Clear all rules for this object?')) {
                                            clearBodyRules(body!.id);
                                        }
                                    }}
                                    className="w-full py-1 text-[9px] text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border border-dashed border-slate-200 dark:border-slate-800 rounded transition-all flex items-center justify-center gap-1"
                                >
                                    <Trash2 className="w-2.5 h-2.5" />
                                    Clear All Rules
                                </button>
                            )
                        }

                        {
                            bodyRules.length === 0 && !isAddingRule && (
                                <div className="text-center py-4 px-2 rounded-lg border-2 border-dashed border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 italic">
                                    No active rules. Click "Add Logic" above to define behaviors.
                                </div>
                            )
                        }
                    </div>
                </div>
            )}
        </div>
    );
}
