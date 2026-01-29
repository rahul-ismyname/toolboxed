'use client';

import React, { useRef, useCallback } from 'react';

interface UseMatterEngineOptions {
    gravity?: number;
    enableSleeping?: boolean;
    substeps?: number;
    fixedDelta?: number;
}

export interface MatterEngineAPI {
    engineRef: React.MutableRefObject<any>;
    MatterRef: React.MutableRefObject<any>;
    initEngine: () => Promise<void>;
    loadTemplate: (template: any) => void;
    update: (delta: number) => void;
    spawnBody: (type: 'box' | 'circle' | 'wall' | 'triangle' | 'polygon', options?: any, size?: number) => any;
    getBodyById: (id: number) => any;
    updateBody: (id: number, updates: any) => void;
    deleteBody: (id: number) => void;
    setGravity: (g: number) => void;
    setSubsteps: (s: number) => void;
    setSleeping: (enabled: boolean) => void;
    addWorldBounds: (width: number, height: number, thickness?: number) => void;
    getAllBodies: () => any[];
    addConstraint: (bodyA: any, bodyB: any | null, type: 'spring' | 'rod', pointA?: { x: number, y: number }, pointB?: { x: number, y: number }) => void;
    addPin: (body: any, x: number, y: number) => void;
    addRevoluteJoint: (bodyA: any, bodyB: any, pointA: { x: number, y: number }, pointB: { x: number, y: number }) => void;
    getAllConstraints: () => any[];
    isReady: boolean;
}

export function useMatterEngine(options: UseMatterEngineOptions = {}): MatterEngineAPI {
    const engineRef = useRef<any>(null);
    const MatterRef = useRef<any>(null);
    const worldBoundsRef = useRef<any[]>([]);

    const [isReady, setIsReady] = React.useState(false);
    const substepsRef = useRef(options.substeps ?? 8); // Default to 8 for extreme stability
    const accumulatorRef = useRef(0);
    const fixedDelta = options.fixedDelta ?? (1000 / 60);

    const initEngine = useCallback(async () => {
        const MatterModule = await import('matter-js');
        const Matter = (MatterModule as any).default || MatterModule;
        MatterRef.current = Matter;

        const engine = Matter.Engine.create({
            enableSleeping: options.enableSleeping ?? false,
            positionIterations: 30, // Default 6, increased for extreme precision
            velocityIterations: 30  // Default 6, increased for extreme precision
        });
        engine.gravity.y = options.gravity ?? 1;
        engineRef.current = engine;

        // Custom force application before each engine update
        Matter.Events.on(engine, 'beforeUpdate', () => {
            const bodies = Matter.Composite.allBodies(engine.world);
            bodies.forEach((body: any) => {
                if (body.plugin && body.plugin.acceleration) {
                    const force = {
                        x: body.plugin.acceleration.x * 0.001 * body.mass,
                        y: body.plugin.acceleration.y * 0.001 * body.mass
                    };
                    Matter.Body.applyForce(body, body.position, force);
                }
            });
        });

        setIsReady(true);
    }, [options.enableSleeping, options.gravity]); // Stable initEngine

    const loadTemplate = useCallback((template: any) => {
        if (!MatterRef.current || !engineRef.current) return;
        // Clear world before loading template
        MatterRef.current.Composite.clear(engineRef.current.world, false);
        template.setup(MatterRef.current, engineRef.current);
    }, []);

    const update = useCallback((delta: number) => {
        if (!engineRef.current || !MatterRef.current) return;
        const Matter = MatterRef.current;
        const engine = engineRef.current;

        // Implementation of fixed timestep with accumulator
        accumulatorRef.current += Math.min(delta, 100); // Cap delta to avoid "spiral of death"

        while (accumulatorRef.current >= fixedDelta) {
            const subDelta = fixedDelta / substepsRef.current;
            for (let i = 0; i < substepsRef.current; i++) {
                Matter.Engine.update(engine, subDelta);
            }
            accumulatorRef.current -= fixedDelta;
        }
    }, [fixedDelta]);

    const spawnBody = useCallback((type: 'box' | 'circle' | 'wall' | 'triangle' | 'polygon', spawnOptions?: any, size?: number) => {
        if (!MatterRef.current || !engineRef.current) return null;
        const Matter = MatterRef.current;
        const { Bodies, Composite } = Matter;

        const colors = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'];
        const color = spawnOptions?.color || colors[Math.floor(Math.random() * colors.length)];

        let body;
        const x = spawnOptions?.x ?? 400;
        const y = spawnOptions?.y ?? 300;
        const s = size ?? 30; // Default size

        console.log(`Spawning ${type} at (${x}, ${y}) with size ${s}`);

        if (type === 'box') {
            body = Bodies.rectangle(x, y, s * 1.6, s * 1.6, {
                restitution: 0.6,
                render: { fillStyle: color, strokeStyle: 'none' }
            });
        } else if (type === 'circle') {
            body = Bodies.circle(x, y, s * 0.8, {
                restitution: 0.6,
                render: { fillStyle: color, strokeStyle: 'none' }
            });
        } else if (type === 'triangle') {
            body = Bodies.polygon(x, y, 3, s, {
                restitution: 0.6,
                render: { fillStyle: color, strokeStyle: 'none' }
            });
        } else if (type === 'polygon') {
            body = Bodies.polygon(x, y, 5, s, {
                restitution: 0.6,
                render: { fillStyle: color, strokeStyle: 'none' }
            });
        } else if (type === 'wall') {
            body = Bodies.rectangle(x, y, 200, 20, {
                isStatic: true,
                render: { fillStyle: '#3D3D3D' }
            });
        }

        if (body) {
            body.plugin = body.plugin || {};
            body.plugin.acceleration = { x: 0, y: 0 };
            Composite.add(engineRef.current.world, body);
            console.log('Body added to world:', body.id);
        } else {
            console.error('Failed to create body for type:', type);
        }

        return body;
    }, []);

    const getBodyById = useCallback((id: number) => {
        if (!MatterRef.current || !engineRef.current) return null;
        const bodies = MatterRef.current.Composite.allBodies(engineRef.current.world);
        return bodies.find((b: any) => b.id === id) || null;
    }, []);

    const updateBody = useCallback((id: number, updates: any) => {
        const body = getBodyById(id);
        if (!body || !MatterRef.current) return;

        const Matter = MatterRef.current;

        if (updates.color) body.render.fillStyle = updates.color;
        if (updates.isStatic !== undefined) Matter.Body.setStatic(body, updates.isStatic);
        if (updates.angle !== undefined) Matter.Body.setAngle(body, updates.angle * (Math.PI / 180));
        if (updates.velocity) Matter.Body.setVelocity(body, updates.velocity);
        if (updates.position) Matter.Body.setPosition(body, updates.position);
        if (updates.restitution !== undefined) body.restitution = updates.restitution;
        if (updates.friction !== undefined) body.friction = updates.friction;
        if (updates.acceleration) {
            body.plugin = body.plugin || {};
            body.plugin.acceleration = { ...body.plugin.acceleration, ...updates.acceleration };
        }
    }, [getBodyById]);

    const deleteBody = useCallback((id: number) => {
        const body = getBodyById(id);
        if (body && MatterRef.current && engineRef.current) {
            MatterRef.current.Composite.remove(engineRef.current.world, body);
        }
    }, [getBodyById]);

    const setGravity = useCallback((g: number) => {
        if (engineRef.current) {
            engineRef.current.gravity.y = g;
        }
    }, []);

    const getAllBodies = useCallback(() => {
        if (!MatterRef.current || !engineRef.current) return [];
        return MatterRef.current.Composite.allBodies(engineRef.current.world);
    }, []);

    const setSubsteps = useCallback((s: number) => {
        substepsRef.current = Math.max(1, s);
    }, []);

    const setSleeping = useCallback((enabled: boolean) => {
        if (engineRef.current) {
            engineRef.current.enableSleeping = enabled;
        }
    }, []);

    const addWorldBounds = useCallback((width: number, height: number, thickness: number = 2000) => {
        if (!MatterRef.current || !engineRef.current) return;
        const { Bodies, Composite } = MatterRef.current;
        const world = engineRef.current.world;

        // Remove old bounds if they exist
        if (worldBoundsRef.current.length > 0) {
            Composite.remove(world, worldBoundsRef.current);
        }

        const bounds = [
            // Top
            Bodies.rectangle(width / 2, -thickness / 2, width, thickness, {
                isStatic: true, label: 'ground', render: { fillStyle: 'transparent' }
            }),
            // Bottom
            Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, {
                isStatic: true, label: 'ground', render: { fillStyle: 'transparent' }
            }),
            // Left
            Bodies.rectangle(-thickness / 2, height / 2, thickness, height, {
                isStatic: true, label: 'ground', render: { fillStyle: 'transparent' }
            }),
            // Right
            Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, {
                isStatic: true, label: 'ground', render: { fillStyle: 'transparent' }
            }),
        ];

        worldBoundsRef.current = bounds;
        Composite.add(world, bounds);
    }, []);

    const addConstraint = useCallback((bodyA: any, bodyB: any | null, type: 'spring' | 'rod', pointA?: { x: number, y: number }, pointB?: { x: number, y: number }) => {
        if (!engineRef.current || !MatterRef.current) return;
        const { Constraint, Composite } = MatterRef.current;

        const options: any = {
            bodyA,
            bodyB,
            stiffness: type === 'spring' ? 0.01 : 1,
            damping: type === 'spring' ? 0.05 : 0.1,
            render: {
                strokeStyle: type === 'spring' ? '#F59E0B' : '#6366F1',
                lineWidth: 4,
                type: type === 'spring' ? 'spring' : 'line'
            }
        };

        // If specific points were provided, convert them to relative coordinates for Matter.js
        if (pointA) {
            options.pointA = { x: pointA.x - bodyA.position.x, y: pointA.y - bodyA.position.y };
        }

        if (pointB) {
            if (bodyB) {
                options.pointB = { x: pointB.x - bodyB.position.x, y: pointB.y - bodyB.position.y };
            } else {
                options.pointB = pointB; // World point
            }
        }

        const constraint = Constraint.create(options);
        Composite.add(engineRef.current.world, constraint);
    }, []);

    const addPin = useCallback((body: any, x: number, y: number) => {
        if (!engineRef.current || !MatterRef.current) return;
        const { Constraint, Composite } = MatterRef.current;

        const constraint = Constraint.create({
            bodyA: body,
            pointA: { x: x - body.position.x, y: y - body.position.y },
            pointB: { x, y }, // World point
            stiffness: 1,
            length: 0,
            render: {
                strokeStyle: '#EF4444', // Red for pin
                lineWidth: 4
            }
        });
        Composite.add(engineRef.current.world, constraint);
    }, []);

    const addRevoluteJoint = useCallback((bodyA: any, bodyB: any, pointA: { x: number, y: number }, pointB: { x: number, y: number }) => {
        if (!engineRef.current || !MatterRef.current) return;
        const { Constraint, Composite } = MatterRef.current;

        const constraint = Constraint.create({
            bodyA,
            bodyB,
            pointA,
            pointB,
            stiffness: 1,
            length: 0,
            render: {
                strokeStyle: '#10B981', // Emerald for revolute joint
                lineWidth: 4
            }
        });
        Composite.add(engineRef.current.world, constraint);
    }, []);

    const getAllConstraints = useCallback(() => {
        if (!engineRef.current || !MatterRef.current) return [];
        return MatterRef.current.Composite.allConstraints(engineRef.current.world);
    }, []);

    // Sync gravity when it changes without re-initializing the engine
    React.useEffect(() => {
        if (engineRef.current && options.gravity !== undefined) {
            engineRef.current.gravity.y = options.gravity;
        }
    }, [options.gravity]);

    return React.useMemo(() => ({
        engineRef,
        MatterRef,
        initEngine,
        loadTemplate,
        update,
        spawnBody,
        getBodyById,
        updateBody,
        deleteBody,
        setGravity,
        setSubsteps,
        setSleeping,
        addWorldBounds,
        getAllBodies,
        addConstraint,
        addPin,
        addRevoluteJoint,
        getAllConstraints,
        isReady,
    }), [initEngine, loadTemplate, update, spawnBody, getBodyById, updateBody, deleteBody, setGravity, setSubsteps, setSleeping, addWorldBounds, getAllBodies, addConstraint, addPin, addRevoluteJoint, getAllConstraints, isReady]);
}
