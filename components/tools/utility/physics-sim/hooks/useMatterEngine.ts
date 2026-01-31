'use client';

import React, { useRef, useCallback } from 'react';

interface UseMatterEngineOptions {
    gravity?: { x: number, y: number } | number;
    enableSleeping?: boolean;
    substeps?: number;
    fixedDelta?: number;
    timeScale?: number;
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
    setGravity: (g: { x: number, y: number } | number) => void;
    setTimeScale: (scale: number) => void;
    setSubsteps: (s: number) => void;
    setSleeping: (enabled: boolean) => void;
    addWorldBounds: (width: number, height: number, thickness?: number, activeWalls?: ActiveWalls) => void;
    getAllBodies: () => any[];
    addConstraint: (bodyA: any, bodyB: any | null, type: 'spring' | 'rod', pointA?: { x: number, y: number }, pointB?: { x: number, y: number }) => void;
    addPin: (body: any, x: number, y: number) => void;
    addRevoluteJoint: (bodyA: any, bodyB: any, pointA: { x: number, y: number }, pointB: { x: number, y: number }) => void;
    getAllConstraints: () => any[];
    serializeWorld: () => string;
    loadWorld: (json: string) => void;
    isReady: boolean;
    applyExplosionForce: (center: { x: number, y: number }, force: number, radius: number) => void;
    setVacuumMode: (enabled: boolean) => void;
    clearAllConstraints: () => void;
    freezeAllBodies: () => void;
}

export interface ActiveWalls {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
}

export interface PhysicsMaterial {
    name: string;
    density: number;
    friction: number;
    restitution: number;
    color: string;
    label: string;
}

export const MATERIALS: Record<string, PhysicsMaterial> = {
    DEFAULT: { name: 'Default', density: 0.001, friction: 0.1, restitution: 0.6, color: '#6366F1', label: 'Default' },
    WOOD: { name: 'Wood', density: 0.001, friction: 0.4, restitution: 0.2, color: '#A97142', label: 'Wood' },
    METAL: { name: 'Metal', density: 0.005, friction: 0.2, restitution: 0.1, color: '#94A3B8', label: 'Metal' },
    RUBBER: { name: 'Rubber', density: 0.002, friction: 0.8, restitution: 0.9, color: '#EF4444', label: 'Rubber' },
    BOUNCY: { name: 'Bouncy', density: 0.001, friction: 0, restitution: 1.1, color: '#10B981', label: 'Super Bouncy' },
    HEAVY: { name: 'Heavy', density: 0.01, friction: 0.5, restitution: 0, color: '#334155', label: 'Heavy' },
    VACUUM: { name: 'Vacuum', density: 0.001, friction: 0, restitution: 1, color: '#38BDF8', label: 'Vacuum (Ideal)' },
};

export function useMatterEngine(options: UseMatterEngineOptions = {}): MatterEngineAPI {
    const engineRef = useRef<any>(null);
    const MatterRef = useRef<any>(null);
    const worldBoundsRef = useRef<any[]>([]);

    const [isReady, setIsReady] = React.useState(false);
    const substepsRef = useRef(options.substeps ?? 8); // Default to 8 for extreme stability
    const accumulatorRef = useRef(0);
    const fixedDelta = options.fixedDelta ?? (1000 / 60);
    const timeScaleRef = useRef(options.timeScale ?? 1);
    const vacuumModeRef = useRef(false);

    const initEngine = useCallback(async () => {
        const MatterModule = await import('matter-js');
        const Matter = (MatterModule as any).default || MatterModule;
        MatterRef.current = Matter;

        const engine = Matter.Engine.create({
            enableSleeping: options.enableSleeping ?? false,
            positionIterations: 30, // Default 6, increased for extreme precision
            velocityIterations: 30  // Default 6, increased for extreme precision
        });
        if (typeof options.gravity === 'object' && options.gravity !== null) {
            engine.gravity.x = options.gravity.x;
            engine.gravity.y = options.gravity.y;
        } else {
            engine.gravity.y = options.gravity ?? 1;
        }
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

        // Apply time scaling
        const scaledDelta = delta * timeScaleRef.current;

        // Implementation of fixed timestep with accumulator
        if (!Number.isFinite(accumulatorRef.current)) accumulatorRef.current = 0;
        accumulatorRef.current += Math.min(scaledDelta, 100); // Cap delta to avoid "spiral of death"

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

        const materialKey = spawnOptions?.material || 'DEFAULT';
        const material = MATERIALS[materialKey] || MATERIALS.DEFAULT;

        const x = spawnOptions?.x ?? 400;
        const y = spawnOptions?.y ?? 300;
        const s = size ?? 30; // Default size

        const color = spawnOptions?.color || material.color;

        console.log(`Spawning ${type} at (${x}, ${y}) with size ${s} and material ${material.name}`);

        const renderOpts = { fillStyle: color, strokeStyle: 'none' };

        // Common body options
        const bodyOpts: any = {
            restitution: vacuumModeRef.current ? 1 : material.restitution,
            friction: material.friction,
            frictionAir: vacuumModeRef.current ? 0 : 0.01,
            density: material.density,
            render: renderOpts,
            label: `${material.name} ${type}`
        };

        let body;

        if (type === 'box') {
            body = Bodies.rectangle(x, y, s * 1.6, s * 1.6, bodyOpts);
        } else if (type === 'circle') {
            body = Bodies.circle(x, y, s * 0.8, bodyOpts);
        } else if (type === 'triangle') {
            body = Bodies.polygon(x, y, 3, s, bodyOpts);
        } else if (type === 'polygon') {
            body = Bodies.polygon(x, y, 5, s, bodyOpts);
        } else if (type === 'wall') {
            body = Bodies.rectangle(x, y, 200, 20, {
                isStatic: true,
                render: { fillStyle: '#3D3D3D' }
            });
        }

        if (body) {
            body.plugin = body.plugin || {};
            body.plugin.acceleration = { x: 0, y: 0 };
            body.plugin.materialKey = materialKey; // Store material key for reference
            Composite.add(engineRef.current.world, body);
            console.log('Body added to world:', body.id);
        } else {
            console.error('Failed to create body for type:', type);
        }

        return body;
    }, []);

    const applyExplosionForce = useCallback((center: { x: number, y: number }, force: number, radius: number) => {
        if (!MatterRef.current || !engineRef.current) return;
        const bodies = MatterRef.current.Composite.allBodies(engineRef.current.world);

        bodies.forEach((body: any) => {
            if (body.isStatic) return;

            const Vector = MatterRef.current.Vector;
            const distanceVector = Vector.sub(body.position, center);
            const distance = Vector.magnitude(distanceVector);

            if (distance < radius && distance > 0.1) { // Avoid division by zero
                const forceMagnitude = force * (1 - distance / radius);
                const forceVector = Vector.mult(Vector.normalise(distanceVector), forceMagnitude * body.mass); // Scale by mass so everything flies

                MatterRef.current.Body.applyForce(body, body.position, forceVector);
            }
        });
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
        if (updates.density !== undefined) Matter.Body.setDensity(body, updates.density);
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

    const setGravity = useCallback((g: { x: number, y: number } | number) => {
        if (engineRef.current) {
            if (typeof g === 'number') {
                engineRef.current.gravity.y = g;
            } else {
                engineRef.current.gravity.x = g.x;
                engineRef.current.gravity.y = g.y;
            }
        }
    }, []);

    const setTimeScale = useCallback((scale: number) => {
        timeScaleRef.current = Math.max(0, scale);
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

    const addWorldBounds = useCallback((width: number, height: number, thickness: number = 2000, activeWalls: ActiveWalls = { top: true, bottom: true, left: true, right: true }) => {
        if (!MatterRef.current || !engineRef.current) return;
        const { Bodies, Composite } = MatterRef.current;
        const world = engineRef.current.world;

        // Remove old bounds if they exist
        if (worldBoundsRef.current.length > 0) {
            Composite.remove(world, worldBoundsRef.current);
        }

        const bounds = [];

        if (activeWalls.top) {
            bounds.push(Bodies.rectangle(width / 2, -thickness / 2, width, thickness, {
                isStatic: true, label: 'ground', render: { fillStyle: 'transparent' }
            }));
        }
        if (activeWalls.bottom) {
            bounds.push(Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, {
                isStatic: true, label: 'ground', render: { fillStyle: 'transparent' }
            }));
        }
        if (activeWalls.left) {
            bounds.push(Bodies.rectangle(-thickness / 2, height / 2, thickness, height, {
                isStatic: true, label: 'ground', render: { fillStyle: 'transparent' }
            }));
        }
        if (activeWalls.right) {
            bounds.push(Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, {
                isStatic: true, label: 'ground', render: { fillStyle: 'transparent' }
            }));
        }

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
            if (typeof options.gravity === 'number') {
                engineRef.current.gravity.y = options.gravity;
            } else {
                engineRef.current.gravity.x = options.gravity.x;
                engineRef.current.gravity.y = options.gravity.y;
            }
        }
    }, [options.gravity]);

    const serializeWorld = useCallback(() => {
        if (!engineRef.current || !MatterRef.current) return '';
        const { Composite } = MatterRef.current;
        const bodies = Composite.allBodies(engineRef.current.world);
        const constraints = Composite.allConstraints(engineRef.current.world);

        const data = {
            bodies: bodies.filter((b: any) => b.label !== 'ground' && b.label !== 'World Boundary').map((b: any) => ({
                id: b.id,
                type: b.label?.includes('Circle') ? 'circle' : 'rectangle', // Basic type inference
                position: b.position,
                angle: b.angle,
                velocity: b.velocity,
                angularVelocity: b.angularVelocity,
                isStatic: b.isStatic,
                render: b.render,
                restitution: b.restitution,
                friction: b.friction,
                density: b.density,
                vertices: b.vertices.map((v: any) => ({ x: v.x, y: v.y })),
                plugin: b.plugin // Save plugin data like materialKey
            })),
            constraints: constraints.filter((c: any) => c.label !== 'Mouse Constraint').map((c: any) => ({
                type: c.render.type,
                bodyAId: c.bodyA?.id,
                bodyBId: c.bodyB?.id,
                pointA: c.pointA,
                pointB: c.pointB,
                stiffness: c.stiffness,
                damping: c.damping,
                length: c.length,
                render: c.render
            })),
            gravity: { x: engineRef.current.gravity.x, y: engineRef.current.gravity.y }
        };
        return JSON.stringify(data);
    }, []);

    const loadWorld = useCallback((json: string) => {
        if (!engineRef.current || !MatterRef.current) return;

        try {
            const data = JSON.parse(json);
            const { World, Bodies, Composite, Constraint } = MatterRef.current;

            // Clear existing world (except bounds)
            World.clear(engineRef.current.world, false);

            if (worldBoundsRef.current.length > 0) {
                Composite.add(engineRef.current.world, worldBoundsRef.current);
            }

            // Restore Bodies
            const idMap = new Map();

            data.bodies.forEach((bData: any) => {
                let body;
                body = Bodies.fromVertices(bData.position.x, bData.position.y, [bData.vertices], {
                    id: bData.id,
                    isStatic: bData.isStatic,
                    angle: bData.angle,
                    restitution: bData.restitution,
                    friction: bData.friction,
                    density: bData.density,
                    render: bData.render,
                    plugin: bData.plugin
                }, true);

                if (body) {
                    MatterRef.current.Body.setVelocity(body, bData.velocity);
                    MatterRef.current.Body.setAngularVelocity(body, bData.angularVelocity);
                    idMap.set(bData.id, body);
                    Composite.add(engineRef.current.world, body);
                }
            });

            // Restore Constraints
            data.constraints.forEach((cData: any) => {
                const bodyA = cData.bodyAId ? idMap.get(cData.bodyAId) : null;
                const bodyB = cData.bodyBId ? idMap.get(cData.bodyBId) : null;

                if ((cData.bodyAId && !bodyA) || (cData.bodyBId && !bodyB)) return;

                const constraint = Constraint.create({
                    bodyA,
                    bodyB,
                    pointA: cData.pointA,
                    pointB: cData.pointB,
                    stiffness: cData.stiffness,
                    damping: cData.damping,
                    length: cData.length,
                    render: cData.render
                });
                Composite.add(engineRef.current.world, constraint);
            });

            if (data.gravity !== undefined) {
                if (typeof data.gravity === 'number') {
                    engineRef.current.gravity.y = data.gravity;
                } else {
                    engineRef.current.gravity.x = data.gravity.x;
                    engineRef.current.gravity.y = data.gravity.y;
                }
            }

        } catch (e) {
            console.error("Failed to load world:", e);
        }
    }, []);

    const setVacuumMode = useCallback((enabled: boolean) => {
        vacuumModeRef.current = enabled;
        if (!MatterRef.current || !engineRef.current) return;

        const bodies = MatterRef.current.Composite.allBodies(engineRef.current.world);
        bodies.forEach((body: any) => {
            if (enabled) {
                body.frictionAir = 0;
                body.friction = 0;
                body.restitution = 1; // Elastic collisions so energy isn't lost
            } else {
                body.frictionAir = 0.01;
            }
        });
    }, []);

    const clearAllConstraints = useCallback(() => {
        if (!MatterRef.current || !engineRef.current) return;
        const Matter = MatterRef.current;
        const world = engineRef.current.world;
        const constraints = Matter.Composite.allConstraints(world);
        constraints.forEach((c: any) => {
            if (c.label !== "Mouse Constraint") {
                Matter.Composite.remove(world, c);
            }
        });
    }, []);

    const freezeAllBodies = useCallback(() => {
        if (!MatterRef.current || !engineRef.current) return;
        const Matter = MatterRef.current;
        const bodies = Matter.Composite.allBodies(engineRef.current.world);
        bodies.forEach((body: any) => {
            if (!body.isStatic) {
                Matter.Body.setVelocity(body, { x: 0, y: 0 });
                Matter.Body.setAngularVelocity(body, 0);
            }
        });
    }, []);

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
        setTimeScale,
        setSubsteps,
        setSleeping,
        addWorldBounds,
        getAllBodies,
        addConstraint,
        addPin,
        addRevoluteJoint,
        getAllConstraints,
        serializeWorld,
        loadWorld,
        isReady,
        applyExplosionForce,
        setVacuumMode,
        clearAllConstraints,
        freezeAllBodies
    }), [initEngine, loadTemplate, update, spawnBody, getBodyById, updateBody, deleteBody, setGravity, setTimeScale, setSubsteps, setSleeping, addWorldBounds, getAllBodies, addConstraint, addPin, addRevoluteJoint, getAllConstraints, serializeWorld, loadWorld, isReady, applyExplosionForce, setVacuumMode, clearAllConstraints, freezeAllBodies]);
}
