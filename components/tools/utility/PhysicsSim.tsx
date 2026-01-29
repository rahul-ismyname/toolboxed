
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PHYSICS_TEMPLATES } from '@/lib/sim-templates';
import {
    Play,
    Pause,
    RotateCcw,
    Settings2,
    Zap,
    Plus,
    Box,
    Circle,
    Trash2
} from 'lucide-react';

const COLORS = {
    bg: '#1c1c1c',
    blue: '#58C4DD',
    green: '#83C167',
    yellow: '#FFFF00',
    red: '#FC6255',
    white: '#E8E8E8',
    gray: '#3D3D3D'
};

const MathFormula = ({ formula }: { formula: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (ref.current && typeof window !== 'undefined') {
            import('katex').then(katex => {
                katex.default.render(formula, ref.current!, {
                    throwOnError: false
                });
            });
        }
    }, [formula]);
    return <div ref={ref} />;
};

export default function PhysicsSim() {
    const containerRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<any>(null);
    const p5Instance = useRef<any>(null);
    const MatterRef = useRef<any>(null);

    // State
    const [activeTemplate, setActiveTemplate] = useState(PHYSICS_TEMPLATES[0]);
    const [paused, setPaused] = useState(false);
    const [showVectors, setShowVectors] = useState(true);
    const [gravity, setGravity] = useState(1);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showTools, setShowTools] = useState(false);

    // Customization State
    const [bgColor, setBgColor] = useState('#ffffff');
    const [selectedBodyId, setSelectedBodyId] = useState<number | null>(null);
    const [selectedBodyData, setSelectedBodyData] = useState<{
        color: string;
        isStatic: boolean;
        angle: number;
        velocity: { x: number; y: number };
        acceleration: { x: number; y: number };
        restitution: number;
        friction: number;
    } | null>(null);

    // Refs for loop access
    const bgColorRef = useRef(bgColor);
    const showVectorsRef = useRef(showVectors);
    const pausedRef = useRef(paused);
    const selectedBodyIdRef = useRef(selectedBodyId);
    const isEditingRef = useRef(false);

    useEffect(() => { bgColorRef.current = bgColor; }, [bgColor]);
    useEffect(() => { showVectorsRef.current = showVectors; }, [showVectors]);
    useEffect(() => { pausedRef.current = paused; }, [paused]);
    useEffect(() => { selectedBodyIdRef.current = selectedBodyId; }, [selectedBodyId]);

    // Helper to get body by ID from engine
    const getBodyById = (id: number) => {
        if (!engineRef.current) return null;
        return MatterRef.current.Composite.allBodies(engineRef.current.world).find((b: any) => b.id === id);
    };

    // Update selected body data when selection changes or on loop
    const refreshSelectedBodyData = () => {
        if (isEditingRef.current) return;
        // Use ref or argument? Use State ID for React updates.
        if (selectedBodyId === null) return;
        const body = getBodyById(selectedBodyId);
        if (body) {
            setSelectedBodyData({
                color: body.render.fillStyle,
                isStatic: body.isStatic,
                angle: Math.round(body.angle * (180 / Math.PI)),
                velocity: { x: Math.round(body.velocity.x * 100) / 100, y: Math.round(body.velocity.y * 100) / 100 },
                acceleration: body.plugin.acceleration || { x: 0, y: 0 },
                restitution: Math.round(body.restitution * 100) / 100,
                friction: Math.round(body.friction * 1000) / 1000
            });
        } else {
            // Use setter directly to avoid loop
            if (selectedBodyIdRef.current !== null) {
                // Only clear if we thought we had one
                setSelectedBodyId(null);
                setSelectedBodyData(null);
            }
        }
    };

    // Sync selected body data periodically
    useEffect(() => {
        let interval: any;
        if (selectedBodyId && !paused) {
            interval = setInterval(refreshSelectedBodyData, 100);
        } else if (selectedBodyId) {
            refreshSelectedBodyData();
        }
        return () => clearInterval(interval);
    }, [selectedBodyId, paused]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const init = async () => {
            try {
                const MatterModule = await import('matter-js');
                const p5Module = await import('p5');

                const Matter = MatterModule.default || MatterModule;
                const p5 = p5Module.default || p5Module;

                MatterRef.current = Matter;
                const engine = Matter.Engine.create();
                engineRef.current = engine;
                engine.gravity.y = gravity;

                const sketch = (p: any) => {
                    let draggedStaticBody: any = null;

                    p.setup = () => {
                        const canvas = p.createCanvas(p.min(1920, p.windowWidth), p.windowHeight);
                        canvas.parent(containerRef.current!);

                        activeTemplate.setup(Matter, engine);

                        // MANUAL MOUSE INTERACTION (Works when Paused)
                        p.mousePressed = () => {
                            const mousePosition = { x: p.mouseX, y: p.mouseY };
                            // Check bounds to ensure we clicked on canvas
                            if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;

                            const bodies = Matter.Composite.allBodies(engine.world);
                            const clickedBody = Matter.Query.point(bodies, mousePosition)[0];

                            if (clickedBody) {
                                setTimeout(() => setSelectedBodyId(clickedBody.id), 0);
                                draggedStaticBody = clickedBody;
                            } else {
                                setTimeout(() => setSelectedBodyId(null), 0);
                                draggedStaticBody = null;
                            }
                        };

                        p.mouseDragged = () => {
                            if (draggedStaticBody) {
                                // If running, let MouseConstraint handle dynamic bodies (better physics)
                                // If paused OR static, manual override
                                if (pausedRef.current || draggedStaticBody.isStatic) {
                                    Matter.Body.setPosition(draggedStaticBody, { x: p.mouseX, y: p.mouseY });
                                    if (pausedRef.current && !draggedStaticBody.isStatic) {
                                        Matter.Body.setVelocity(draggedStaticBody, { x: 0, y: 0 });
                                    }
                                }
                            }
                        };

                        p.mouseReleased = () => {
                            draggedStaticBody = null;
                        };



                        // Add Mouse Constraint for Physics (Running Only)
                        const mouse = Matter.Mouse.create(canvas.elt);
                        mouse.pixelRatio = p.pixelDensity();
                        const mouseConstraint = Matter.MouseConstraint.create(engine, {
                            mouse: mouse,
                            constraint: { stiffness: 0.2, render: { visible: false } }
                        });
                        Matter.World.add(engine.world, mouseConstraint);

                        // Prevent p5 from intercepting scroll events
                        (mouse as any).element.removeEventListener("mousewheel", (mouse as any).mousewheel);
                        (mouse as any).element.removeEventListener("DOMMouseScroll", (mouse as any).mousewheel);
                    };

                    p.draw = () => {
                        if (!pausedRef.current && engineRef.current) {
                            // Apply Acceleration (Forces)
                            const bodies = Matter.Composite.allBodies(engineRef.current.world);
                            bodies.forEach((body: any) => {
                                if (body.plugin && body.plugin.acceleration) {
                                    // F = ma. We apply force.
                                    // To get noticeable effect vs gravity (1G), we need decent values.
                                    // body.mass is typically ~5-50 depending on size.
                                    // Let's assume input is in "Newtons" relative to simulation.
                                    // Scaling factor might be needed. Let's try raw first.
                                    Matter.Body.applyForce(body, body.position, {
                                        x: body.plugin.acceleration.x * 0.001 * body.mass,
                                        y: body.plugin.acceleration.y * 0.001 * body.mass
                                    });
                                }
                            });

                            Matter.Engine.update(engineRef.current, p.deltaTime);
                        }

                        p.background(bgColorRef.current);

                        if (!engineRef.current) return;
                        const bodies = Matter.Composite.allBodies(engineRef.current.world);

                        p.noStroke();
                        bodies.forEach((body: any) => {
                            p.fill((body.render as any).fillStyle || '#E8E8E8');
                            p.beginShape();
                            body.vertices.forEach((v: any) => p.vertex(v.x, v.y));
                            p.endShape(p.CLOSE);

                            // Highlight selected
                            const isSelected = selectedBodyIdRef.current === body.id; // Use Ref for Drawing Logic
                            if (isSelected) {
                                p.stroke('#6366f1');
                                p.strokeWeight(3);
                                p.noFill();
                                p.beginShape();
                                body.vertices.forEach((v: any) => p.vertex(v.x, v.y));
                                p.endShape(p.CLOSE);
                                p.noStroke();
                            }

                            if (showVectorsRef.current && !body.isStatic) {
                                const { position, velocity } = body;
                                // Draw Velocity Vector
                                if (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1) {
                                    p.stroke('#58C4DD');
                                    p.strokeWeight(2);
                                    p.line(position.x, position.y, position.x + velocity.x * 5, position.y + velocity.y * 5);
                                    p.noStroke();
                                }

                                // Draw Acceleration Vector (Red)
                                if (body.plugin && body.plugin.acceleration && (Math.abs(body.plugin.acceleration.x) > 0 || Math.abs(body.plugin.acceleration.y) > 0)) {
                                    p.stroke('#FC6255');
                                    p.strokeWeight(2);
                                    // Scale up for visibility
                                    p.line(position.x, position.y, position.x + body.plugin.acceleration.x * 20, position.y + body.plugin.acceleration.y * 20);
                                    p.noStroke();
                                }
                            }
                        });

                        // Draw Mouse Constraint
                        const mc = engineRef.current.world.constraints.find((c: any) => c.label === "Mouse Constraint");
                        if (mc?.bodyB) {
                            p.stroke('#E8E8E8');
                            p.strokeWeight(1);
                            p.line(mc.pointA.x, mc.pointA.y, mc.bodyB.position.x, mc.bodyB.position.y);
                        }
                    };

                    p.windowResized = () => {
                        p.resizeCanvas(p.windowWidth, p.windowHeight);
                    };
                };

                if (p5Instance.current) p5Instance.current.remove();
                p5Instance.current = new p5(sketch);
                setIsLoaded(true);
            } catch (err) {
                console.error("Failed to load physics engine:", err);
            }
        };

        init();

        return () => {
            if (p5Instance.current) p5Instance.current.remove();
            if (engineRef.current && MatterRef.current) MatterRef.current.Engine.clear(engineRef.current);
        };
    }, []);

    const loadTemplate = (template: any) => {
        if (MatterRef.current && engineRef.current) {
            template.setup(MatterRef.current, engineRef.current);
            setActiveTemplate(template);

            // Auto-pause if we want "Setup Mode" feel? 
            // The user asked "make a mode". Maybe we just expose Pause.
            setPaused(true); // START PAUSED for safety/setup

            // Re-bind mouse constraint
            const canvasElt = containerRef.current?.querySelector('canvas');
            if (canvasElt && MatterRef.current && engineRef.current) {
                const Matter = MatterRef.current;
                const engine = engineRef.current;

                const mouse = Matter.Mouse.create(canvasElt);
                const pixelDensity = p5Instance.current ? p5Instance.current.pixelDensity() : 1;
                mouse.pixelRatio = pixelDensity;

                const mouseConstraint = Matter.MouseConstraint.create(engine, {
                    mouse: mouse,
                    constraint: { stiffness: 0.2, render: { visible: false } }
                });
                Matter.World.add(engine.world, mouseConstraint);

                let draggedBody: any = null;
                Matter.Events.on(mouseConstraint, 'mousedown', (event: any) => {
                    const mousePosition = event.mouse.position;
                    const bodies = Matter.Composite.allBodies(engine.world);
                    const clickedBody = Matter.Query.point(bodies, mousePosition)[0];

                    if (clickedBody) {
                        setTimeout(() => setSelectedBodyId(clickedBody.id), 0);
                    } else {
                        setTimeout(() => setSelectedBodyId(null), 0);
                    }

                    // Handle dragging manually if Paused OR if Static
                    // (MouseConstraint handles dynamic bodies automatically when Engine runs, but not when paused)
                    if (clickedBody && (pausedRef.current || clickedBody.isStatic)) {
                        draggedBody = clickedBody;
                        // Disable MouseConstraint temporary for this body if we are handling it manually?
                        // Actually, if we set Position manually, it overrides physics.
                    }
                });
                Matter.Events.on(mouseConstraint, 'mousemove', (event: any) => {
                    if (draggedBody) {
                        Matter.Body.setPosition(draggedBody, event.mouse.position);
                        // Also reset velocity if we are "placing" it
                        if (pausedRef.current && !draggedBody.isStatic) {
                            Matter.Body.setVelocity(draggedBody, { x: 0, y: 0 });
                        }
                    }
                });
                Matter.Events.on(mouseConstraint, 'mouseup', (event: any) => {
                    draggedBody = null;
                });

                (mouse as any).element.removeEventListener("mousewheel", (mouse as any).mousewheel);
                (mouse as any).element.removeEventListener("DOMMouseScroll", (mouse as any).mousewheel);
            }
        }
    };

    const spawnObject = (type: 'box' | 'circle' | 'wall') => {
        if (!MatterRef.current || !engineRef.current || !p5Instance.current) return;
        const Matter = MatterRef.current;
        const { Bodies, World } = Matter;
        const width = p5Instance.current.width;
        const height = p5Instance.current.height;

        let body;
        const color = Object.values(COLORS)[Math.floor(Math.random() * Object.values(COLORS).length)];

        if (type === 'box') {
            body = Bodies.rectangle(width / 2, height / 2, 50, 50, {
                restitution: 0.6,
                render: { fillStyle: color }
            });
        } else if (type === 'circle') {
            body = Bodies.circle(width / 2, height / 2, 25, {
                restitution: 0.6,
                render: { fillStyle: color }
            });
        } else if (type === 'wall') {
            body = Bodies.rectangle(width / 2, height / 2, 200, 20, {
                isStatic: true,
                render: { fillStyle: '#3D3D3D' }
            });
        }

        // Initialize plugin data
        body.plugin = body.plugin || {};
        body.plugin.acceleration = { x: 0, y: 0 };

        World.add(engineRef.current.world, body);
    };

    const updateLocalState = (updates: any) => {
        if (!selectedBodyData) return;
        const newData = { ...selectedBodyData, ...updates };
        if (updates.velocity) newData.velocity = { ...selectedBodyData.velocity, ...updates.velocity };
        if (updates.acceleration) newData.acceleration = { ...selectedBodyData.acceleration, ...updates.acceleration };
        setSelectedBodyData(newData);
    };

    const applyBodyUpdate = (updates: any) => {
        const body = getBodyById(selectedBodyId!);
        if (!body) return;

        if (updates.color) body.render.fillStyle = updates.color;
        if (updates.isStatic !== undefined) MatterRef.current.Body.setStatic(body, updates.isStatic);
        if (updates.angle !== undefined) MatterRef.current.Body.setAngle(body, updates.angle * (Math.PI / 180));
        if (updates.velocity) MatterRef.current.Body.setVelocity(body, updates.velocity);
        if (updates.restitution !== undefined) body.restitution = updates.restitution;
        if (updates.friction !== undefined) body.friction = updates.friction;

        if (updates.acceleration) {
            body.plugin.acceleration = { ...body.plugin.acceleration, ...updates.acceleration };
        }

        refreshSelectedBodyData();
    };

    // Helper for inputs
    const handleInputFocus = () => { isEditingRef.current = true; };
    const handleInputBlur = (updates: any) => {
        isEditingRef.current = false; // logic flip: clear edit flag BEFORE apply to allow refresh
        applyBodyUpdate(updates);
    };
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            (e.currentTarget as HTMLInputElement).blur();
        }
    };

    // Legacy support for non-text inputs (checkbox/range) that want immediate effect
    const updateSelectedBody = (updates: any) => {
        updateLocalState(updates);
        applyBodyUpdate(updates);
    };

    const deleteSelectedBody = () => {
        const body = getBodyById(selectedBodyId!);
        if (body) {
            MatterRef.current.World.remove(engineRef.current.world, body);
            setSelectedBodyId(null);
            setSelectedBodyData(null);
        }
    };

    return (
        <div className="relative w-full h-[85vh] rounded-3xl overflow-hidden border-8 border-white dark:border-slate-900 shadow-2xl" style={{ backgroundColor: bgColor }}>
            {/* Canvas Container */}
            <div ref={containerRef} className="absolute inset-0 cursor-crosshair">
                {!isLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <div className="text-indigo-500 font-black uppercase tracking-widest text-xs">Initializing Laws of Physics...</div>
                    </div>
                )}
            </div>

            {/* Floating Controls */}
            <div className={`absolute top-4 left-4 z-10 transition-all duration-300 ${showTools ? 'w-80' : 'w-14'}`}>
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    <button
                        onClick={() => setShowTools(!showTools)}
                        className="w-full mb-4 flex items-center gap-3 text-slate-900 dark:text-white font-bold"
                    >
                        <div className="p-1.5 bg-indigo-500 rounded-lg text-white">
                            <Settings2 className="w-5 h-5" />
                        </div>
                        {showTools && <span>Control Panel</span>}
                    </button>

                    {showTools && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-200">
                            {/* Play/Pause & Reset */}
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setPaused(!paused)}
                                    className={`p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-all active:scale-95 ${paused
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-amber-500 text-white'
                                        }`}
                                >
                                    {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                                    {paused ? 'RESUME' : 'PAUSE'}
                                </button>
                                <button
                                    onClick={() => loadTemplate(activeTemplate)}
                                    className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl flex items-center justify-center gap-2 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    RESET
                                </button>
                            </div>

                            {/* Canvas Settings */}
                            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">World Settings</div>

                                {/* Background Color */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="h-8 w-8 rounded cursor-pointer border-0 p-0"
                                    />
                                    <span className="text-xs text-slate-500">Background</span>
                                </div>

                                {/* Gravity Slider */}
                                <div>
                                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                        <span>Gravity (G)</span>
                                        <span>{gravity.toFixed(1)}</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="3" step="0.1"
                                        value={gravity}
                                        onChange={(e) => {
                                            const g = parseFloat(e.target.value);
                                            setGravity(g);
                                            if (engineRef.current) engineRef.current.gravity.y = g;
                                        }}
                                        className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Selected Object Editor */}
                            {selectedBodyData && (
                                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-indigo-500">
                                        <span>Selected Object</span>
                                        <button onClick={deleteSelectedBody} className="text-red-500 hover:text-red-700">DELETE</button>
                                    </div>

                                    {/* Color */}
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={selectedBodyData.color as string}
                                            onChange={(e) => updateSelectedBody({ color: e.target.value })}
                                            className="h-8 w-8 rounded cursor-pointer border-0 p-0"
                                        />
                                        <span className="text-xs text-slate-500">Object Color</span>
                                    </div>

                                    {/* Static Toggle */}
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedBodyData.isStatic}
                                            onChange={(e) => updateSelectedBody({ isStatic: e.target.checked })}
                                        />
                                        <span className="text-xs text-slate-500">Static (Wall/Floor)</span>
                                    </label>

                                    {/* Rotation */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                                            <span>Rotation</span>
                                            <span>{selectedBodyData.angle}°</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="range" min="0" max="360" step="1"
                                                value={selectedBodyData.angle}
                                                onChange={(e) => updateSelectedBody({ angle: parseFloat(e.target.value) })}
                                                className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                            />
                                            <input
                                                type="number"
                                                value={selectedBodyData.angle}
                                                onChange={(e) => updateLocalState({ angle: parseFloat(e.target.value) || 0 })}
                                                onFocus={handleInputFocus}
                                                onBlur={(e) => handleInputBlur({ angle: parseFloat(e.target.value) || 0 })}
                                                onKeyDown={handleKeyDown}
                                                className="w-12 text-xs p-1 bg-slate-100 dark:bg-slate-800 rounded text-center"
                                            />
                                        </div>
                                    </div>

                                    {/* Velocity */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] text-slate-400 font-bold block mb-1">Vel X</label>
                                            <input
                                                type="number" step="1"
                                                value={selectedBodyData.velocity.x || 0}
                                                onChange={(e) => updateLocalState({ velocity: { x: parseFloat(e.target.value), y: selectedBodyData.velocity.y } })}
                                                onFocus={handleInputFocus}
                                                onBlur={(e) => handleInputBlur({ velocity: { x: parseFloat(e.target.value) || 0, y: selectedBodyData.velocity.y } })}
                                                onKeyDown={handleKeyDown}
                                                className="w-full text-xs p-1 bg-slate-100 dark:bg-slate-800 rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-400 font-bold block mb-1">Vel Y</label>
                                            <input
                                                type="number" step="1"
                                                value={selectedBodyData.velocity.y || 0}
                                                onChange={(e) => updateLocalState({ velocity: { x: selectedBodyData.velocity.x, y: parseFloat(e.target.value) } })}
                                                onFocus={handleInputFocus}
                                                onBlur={(e) => handleInputBlur({ velocity: { x: selectedBodyData.velocity.x, y: parseFloat(e.target.value) || 0 } })}
                                                onKeyDown={handleKeyDown}
                                                className="w-full text-xs p-1 bg-slate-100 dark:bg-slate-800 rounded"
                                            />
                                        </div>
                                    </div>

                                    {/* CONSTANT ACCELERATION (SETUP MODE) */}
                                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 mt-2">
                                        <div className="text-[10px] text-slate-400 font-bold mb-1">Constant Accel (Rocket)</div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[9px] text-slate-500 block">Acc X</label>
                                                <input
                                                    type="number" step="0.1"
                                                    value={selectedBodyData.acceleration.x || 0}
                                                    onChange={(e) => updateLocalState({ acceleration: { x: parseFloat(e.target.value), y: selectedBodyData.acceleration.y } })}
                                                    onFocus={handleInputFocus}
                                                    onBlur={(e) => handleInputBlur({ acceleration: { x: parseFloat(e.target.value) || 0, y: selectedBodyData.acceleration.y } })}
                                                    onKeyDown={handleKeyDown}
                                                    className="w-full text-xs p-1 bg-slate-100 dark:bg-slate-800 rounded"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] text-slate-500 block">Acc Y</label>
                                                <input
                                                    type="number" step="0.1"
                                                    value={selectedBodyData.acceleration.y || 0}
                                                    onChange={(e) => updateLocalState({ acceleration: { x: selectedBodyData.acceleration.x, y: parseFloat(e.target.value) } })}
                                                    onFocus={handleInputFocus}
                                                    onBlur={(e) => handleInputBlur({ acceleration: { x: selectedBodyData.acceleration.x, y: parseFloat(e.target.value) || 0 } })}
                                                    onKeyDown={handleKeyDown}
                                                    className="w-full text-xs p-1 bg-slate-100 dark:bg-slate-800 rounded"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Material Properties */}
                                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 mt-2 space-y-2">
                                        <div className="text-[10px] text-slate-400 font-bold">Material</div>

                                        <div>
                                            <div className="flex justify-between text-[9px] text-slate-500 mb-0.5">
                                                <span>Bounciness</span>
                                                <span>{selectedBodyData.restitution}</span>
                                            </div>
                                            <input
                                                type="range" min="0" max="1.2" step="0.1"
                                                value={selectedBodyData.restitution}
                                                onChange={(e) => updateSelectedBody({ restitution: parseFloat(e.target.value) })}
                                                className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-[9px] text-slate-500 mb-0.5">
                                                <span>Friction</span>
                                                <span>{selectedBodyData.friction}</span>
                                            </div>
                                            <input
                                                type="range" min="0" max="1" step="0.05"
                                                value={selectedBodyData.friction}
                                                onChange={(e) => updateSelectedBody({ friction: parseFloat(e.target.value) })}
                                                className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Spawning */}
                            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Spawn</div>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => spawnObject('box')}
                                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-all active:scale-95"
                                    >
                                        <Box className="w-4 h-4 mb-1" />
                                        <span className="text-[9px] font-bold">BOX</span>
                                    </button>
                                    <button
                                        onClick={() => spawnObject('circle')}
                                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-all active:scale-95"
                                    >
                                        <Circle className="w-4 h-4 mb-1" />
                                        <span className="text-[9px] font-bold">BALL</span>
                                    </button>
                                    <button
                                        onClick={() => spawnObject('wall')}
                                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-all active:scale-95"
                                    >
                                        <div className="w-4 h-1 bg-current mb-2.5 rounded-full mt-1.5" />
                                        <span className="text-[9px] font-bold">WALL</span>
                                    </button>
                                </div>
                            </div>

                            {/* Gravity */}
                            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Gravity</span>
                                    <span className="text-indigo-500">{gravity}G</span>
                                </div>
                                <input
                                    type="range" min="0" max="2" step="0.1" value={gravity}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        setGravity(val);
                                        if (engineRef.current) engineRef.current.gravity.y = val;
                                    }}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                            </div>

                            {/* Vectors Toggle */}
                            <label className="flex items-center justify-between cursor-pointer group pt-1">
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-indigo-500 transition-colors">Vectors</span>
                                <div
                                    onClick={() => setShowVectors(!showVectors)}
                                    className={`w-8 h-4 rounded-full p-0.5 transition-colors ${showVectors ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                                >
                                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${showVectors ? 'translate-x-4' : 'translate-x-0'}`} />
                                </div>
                            </label>

                            {/* Templates */}
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Scenarios</div>
                                <div className="space-y-1 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                                    {PHYSICS_TEMPLATES.map(template => (
                                        <button
                                            key={template.id}
                                            onClick={() => loadTemplate(template)}
                                            className={`w-full p-2 rounded-lg text-left border text-xs transition-all ${activeTemplate.id === template.id
                                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
                                                : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                }`}
                                        >
                                            {template.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reality Monitor Overlay */}
            {isLoaded && (
                <div className="absolute top-4 right-4 p-4 bg-black/40 backdrop-blur-md rounded-2xl pointer-events-none border border-white/10 text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Reality Monitor</div>
                    <div className="font-mono text-white text-xs opacity-80">
                        {engineRef.current ? MatterRef.current.Composite.allBodies(engineRef.current.world).length : 0} Bodies<br />
                        {(performance.now() / 1000).toFixed(1)}s Runtime
                    </div>
                </div>
            )}

            {/* Formulas Overlay (Bottom Right) */}
            <div className="absolute bottom-4 right-4 max-w-xs space-y-2 pointer-events-none">
                <div className="p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Physics Engine</div>
                    <MathFormula formula="\vec{F} = m\vec{a}" />
                </div>
            </div>
        </div>
    );
}
