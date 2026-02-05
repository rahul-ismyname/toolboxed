'use client';

import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { useRouter } from 'next/navigation';
import { RefreshCcw } from 'lucide-react';

// Map categories to emojis
const CATEGORIES = [
    { name: 'Design', color: '#ec4899', route: '/category/design' },
    { name: 'Dev', color: '#3b82f6', route: '/category/developer' },
    { name: 'Biz', color: '#a855f7', route: '/category/business' },
    { name: 'Util', color: '#f97316', route: '/category/utility' },
    { name: 'Health', color: '#10b981', route: '/category/health' },
];

export function PhysicsBox() {
    const sceneRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const engineRef = useRef<Matter.Engine | null>(null);
    const renderRef = useRef<Matter.Render | null>(null);
    const runnerRef = useRef<Matter.Runner | null>(null);

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !sceneRef.current) return;

        // Module aliases
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint,
            Events = Matter.Events,
            Common = Matter.Common;

        // Create engine
        const engine = Engine.create();
        engineRef.current = engine;

        // Create renderer
        const width = window.innerWidth;
        const height = window.innerHeight * 0.8; // 80vh height

        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width,
                height,
                background: 'transparent',
                wireframes: false,
                // pixelRatio: window.devicePixelRatio, // Disabled to fix mouse constraint mapping
            }
        });
        renderRef.current = render;

        // Create boundaries
        const wallOptions = {
            isStatic: true,
            render: { fillStyle: 'transparent' } // Invisible walls
        };
        const ground = Bodies.rectangle(width / 2, height + 50, width, 100, wallOptions);
        const leftWall = Bodies.rectangle(-50, height / 2, 100, height, wallOptions);
        const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height, wallOptions);

        Composite.add(engine.world, [ground, leftWall, rightWall]);

        // Create tool bodies
        const bodies: Matter.Body[] = [];

        // Add random shapes for categories
        for (let i = 0; i < 25; i++) {
            const category = Common.choose(CATEGORIES);
            const x = Common.random(50, width - 50);
            const y = Common.random(-500, -50); // Start above screen

            const size = Common.random(60, 100);
            const sides = Math.floor(Common.random(3, 8)); // Random polygons from triangle to octagon

            // Randomized shapes: Circle, Rectangle, or Polygon
            let body;
            const shapeType = Math.random();

            if (shapeType < 0.33) {
                body = Bodies.circle(x, y, size / 2, {
                    render: { fillStyle: category.color },
                    label: JSON.stringify(category) // Store data in label
                });
            } else if (shapeType < 0.66) {
                body = Bodies.rectangle(x, y, size, size, {
                    chamfer: { radius: 10 },
                    render: { fillStyle: category.color },
                    label: JSON.stringify(category)
                });
            } else {
                body = Bodies.polygon(x, y, sides, size / 2, {
                    render: { fillStyle: category.color },
                    label: JSON.stringify(category)
                });
            }

            body.restitution = 0.6; // Bounciness
            body.friction = 0.5;
            bodies.push(body);
        }

        Composite.add(engine.world, bodies);

        // Add mouse control
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

        Composite.add(engine.world, mouseConstraint);

        // Keep the mouse in sync with rendering
        render.mouse = mouse;

        // Let's use standard DOM event for double click navigation to avoid physics complexity
        render.canvas.addEventListener('dblclick', (e) => {
            const rect = render.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const bodiesUnderCursor = Matter.Query.point(bodies, { x, y });
            if (bodiesUnderCursor.length > 0) {
                try {
                    const data = JSON.parse(bodiesUnderCursor[0].label);
                    if (data.route) {
                        router.push(data.route);
                    }
                } catch (err) {
                    // Not a navigable body
                }
            }
        });


        // Run the engine
        Render.run(render);

        // Create runner
        const runner = Runner.create();
        runnerRef.current = runner;
        Runner.run(runner, engine);

        // Window resize handler
        const handleResize = () => {
            render.canvas.width = window.innerWidth;
            render.canvas.height = window.innerHeight * 0.8;

            // Reposition walls
            Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: (window.innerHeight * 0.8) + 50 });
            Matter.Body.setPosition(rightWall, { x: window.innerWidth + 50, y: (window.innerHeight * 0.8) / 2 });

            // Make sure right wall is actually on the right edge
            // We need to update the body properties more thoroughly for walls but this is okay for a simple fix
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            Render.stop(render);
            Runner.stop(runner);
            if (render.canvas) {
                render.canvas.remove();
            }
            Composite.clear(engine.world, false);
            Engine.clear(engine);
        };
    }, [isMounted, router]);

    const resetGravity = () => {
        if (!engineRef.current) return;
        const bodies = Matter.Composite.allBodies(engineRef.current.world).filter((b: Matter.Body) => !b.isStatic);

        bodies.forEach((body: Matter.Body) => {
            Matter.Body.setPosition(body, {
                x: Math.random() * window.innerWidth,
                y: -Math.random() * 500 - 100
            });
            Matter.Body.setVelocity(body, { x: 0, y: 0 });
            Matter.Body.setAngularVelocity(body, 0);
        });
    };

    return (
        <div className="relative w-full h-[80vh] bg-slate-50 dark:bg-[#020617] overflow-hidden border-b border-slate-200 dark:border-slate-800">
            {/* Ambient Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
            {/* Physics Canvas Container */}
            <div ref={sceneRef} className="absolute inset-0 z-0" style={{ touchAction: 'none' }} />

            {/* Overlay UI */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
                <div className="bg-white/80 dark:bg-[#0B0F1A]/60 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/20 dark:border-white/10 shadow-2xl text-center pointer-events-auto transform hover:scale-105 transition-transform duration-500 hover:shadow-emerald-500/10">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">
                        TOOL<span className="text-emerald-500">BOXED</span>
                    </h1>
                    <p className="text-slate-500 font-mono uppercase tracking-widest text-sm mb-6">
                        Essential utilities for digital architects
                    </p>
                    <div className="flex gap-4 justify-center text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-500" /> Design</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Dev</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Biz</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Util</span>
                    </div>
                    <p className="mt-8 text-[10px] text-slate-400 uppercase tracking-widest animate-pulse">
                        Interactive Sandbox • Double-click to Open
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-8 right-8 z-20">
                <button
                    onClick={resetGravity}
                    className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:rotate-180 transition-transform duration-500 active:scale-90 border border-slate-200 dark:border-slate-700 group"
                >
                    <RefreshCcw className="w-6 h-6 text-slate-400 group-hover:text-emerald-500" />
                </button>
            </div>
        </div>
    );
}
