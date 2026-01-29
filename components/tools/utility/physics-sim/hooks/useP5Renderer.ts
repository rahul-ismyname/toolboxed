'use client';

import React, { useRef, useEffect, useMemo, useState } from 'react';
import type { MatterEngineAPI } from './useMatterEngine';

interface UseP5RendererOptions {
    containerRef: React.RefObject<HTMLDivElement | null>;
    engine: MatterEngineAPI;
    bgColor: string;
    showVectors: boolean;
    paused: boolean;
    selectedBodyId: number | null;
    onSelectBody: (id: number | null) => void;
    activeTool: string | null;
    spawnSize: number;
    isFullscreen?: boolean;
    onToolUsed?: () => void;
}

export interface P5RendererAPI {
    p5Ref: React.MutableRefObject<any>;
    isLoaded: boolean;
    clearTrails: () => void;
}

export function useP5Renderer(options: UseP5RendererOptions): P5RendererAPI {
    const {
        containerRef,
        engine,
        bgColor,
        showVectors,
        paused,
        selectedBodyId,
        onSelectBody,
        activeTool,
        spawnSize,
        isFullscreen = false,
        onToolUsed,
    } = options;

    const p5Ref = useRef<any>(null);
    const clearTrailsRef = useRef<(() => void) | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Refs for draw loop access (avoids stale closures)
    const bgColorRef = useRef(bgColor);
    const showVectorsRef = useRef(showVectors);
    const pausedRef = useRef(paused);
    const selectedBodyIdRef = useRef(selectedBodyId);
    const activeToolRef = useRef(activeTool);
    const spawnSizeRef = useRef(spawnSize);

    useEffect(() => { bgColorRef.current = bgColor; }, [bgColor]);
    useEffect(() => { showVectorsRef.current = showVectors; }, [showVectors]);
    useEffect(() => { pausedRef.current = paused; }, [paused]);
    useEffect(() => { selectedBodyIdRef.current = selectedBodyId; }, [selectedBodyId]);
    useEffect(() => { activeToolRef.current = activeTool; }, [activeTool]);
    useEffect(() => { spawnSizeRef.current = spawnSize; }, [spawnSize]);

    useEffect(() => {
        if (!containerRef.current || !engine.engineRef.current || !engine.MatterRef.current) return;

        const initP5 = async () => {
            const p5Module = await import('p5');
            const p5 = (p5Module as any).default || p5Module;

            // Disable Friendly Error System (FES) to prevent parser errors with modern JS
            try {
                (p5 as any).disableFriendlyErrors = true;
            } catch (e) { }

            const Matter = engine.MatterRef.current;
            const matterEngine = engine.engineRef.current;

            let draggedBody: any = null;
            let constraintStartBody: any = null;
            let constraintStartPos: { x: number, y: number } | null = null;
            let canvasElement: HTMLCanvasElement;

            const sketch = function (p: any) {
                // Also disable FES on the instance
                p.disableFriendlyErrors = true;

                p.setup = function () {
                    const canvas = p.createCanvas(
                        containerRef.current!.clientWidth,
                        containerRef.current!.clientHeight
                    );
                    canvas.parent(containerRef.current!);
                    canvasElement = canvas.elt;
                    canvasElement.style.width = '100%';
                    canvasElement.style.height = '100%';
                    canvasElement.style.display = 'block';

                    // Add MouseConstraint for physics dragging
                    const mouse = Matter.Mouse.create(canvas.elt);
                    mouse.pixelRatio = p.pixelDensity();
                    const mouseConstraint = Matter.MouseConstraint.create(matterEngine, {
                        mouse: mouse,
                        constraint: { stiffness: 0.2, render: { visible: false } }
                    });
                    Matter.Composite.add(matterEngine.world, mouseConstraint);

                    // Add world bounds automatically
                    engine.addWorldBounds(p.width, p.height);
                };

                // Helper to check for snap
                const getSnapPos = (body: any, mx: number, my: number) => {
                    if (!body) return { x: mx, y: my };
                    const dist = Math.hypot(body.position.x - mx, body.position.y - my);
                    if (dist < 20) return { x: body.position.x, y: body.position.y };
                    return { x: mx, y: my };
                };

                p.mousePressed = function (event: any) {
                    // Check if we are clicking the canvas
                    if (event && event.target && event.target !== canvasElement) {
                        return;
                    }

                    const tool = activeToolRef.current;
                    const bodies = Matter.Composite.allBodies(matterEngine.world);
                    // Use Query.point to find body under mouse, but prefer center-snap visual
                    const clicked = Matter.Query.point(bodies, { x: p.mouseX, y: p.mouseY })[0];

                    const snap = getSnapPos(clicked, p.mouseX, p.mouseY);

                    if (tool === 'pin') {
                        if (clicked && !clicked.isStatic) {
                            engine.addPin(clicked, snap.x, snap.y);
                        }
                        return;
                    }

                    if (tool === 'spring' || tool === 'rod') {
                        if (clicked) {
                            constraintStartBody = clicked;
                            constraintStartPos = snap;
                        }
                        return;
                    }

                    if (tool && ['box', 'circle', 'triangle', 'polygon', 'wall'].indexOf(tool) !== -1) {
                        engine.spawnBody(tool as any, { x: p.mouseX, y: p.mouseY }, spawnSizeRef.current);
                        if (onToolUsed) setTimeout(onToolUsed, 0);
                        return;
                    }

                    if (tool === 'draw') {
                        // Start drawing path
                        draggedBody = null; // Don't drag bodies while drawing
                        return;
                    }

                    if (clicked) {
                        if (tool !== 'thruster') {
                            setTimeout(function () { onSelectBody(clicked.id); }, 0);
                        }
                        draggedBody = clicked;
                    } else {
                        setTimeout(function () { onSelectBody(null); }, 0);
                        draggedBody = null;
                    }
                };

                p.mouseDragged = function (event: any) {
                    if (event && event.target && event.target !== canvasElement && !draggedBody) return;

                    const tool = activeToolRef.current;
                    if (tool === 'spring' || tool === 'rod' || tool === 'pin') return;

                    if (tool === 'thruster' && draggedBody) {
                        const forceMagnitude = 0.002 * draggedBody.mass;
                        const angle = Math.atan2(p.mouseY - draggedBody.position.y, p.mouseX - draggedBody.position.x);
                        const force = {
                            x: Math.cos(angle) * forceMagnitude,
                            y: Math.sin(angle) * forceMagnitude
                        };
                        Matter.Body.applyForce(draggedBody, draggedBody.position, force);
                        return;
                    }

                    if (tool === 'draw') {
                        const dist = Math.hypot(p.mouseX - p.pmouseX, p.mouseY - p.pmouseY);
                        if (dist > 5) {
                            if (!p.drawPath) p.drawPath = [];
                            p.drawPath.push({ x: p.mouseX, y: p.mouseY });
                        }
                        return;
                    }

                    if (draggedBody) {
                        Matter.Body.setPosition(draggedBody, { x: p.mouseX, y: p.mouseY });
                        Matter.Body.setVelocity(draggedBody, { x: 0, y: 0 });
                    }
                };

                p.mouseReleased = function () {
                    const tool = activeToolRef.current;

                    if ((tool === 'spring' || tool === 'rod') && constraintStartBody && constraintStartPos) {
                        const bodies = Matter.Composite.allBodies(matterEngine.world);
                        // Search in a small area (15px) for better hit detection
                        const hitRadius = 15;
                        const released = Matter.Query.region(bodies, {
                            min: { x: p.mouseX - hitRadius, y: p.mouseY - hitRadius },
                            max: { x: p.mouseX + hitRadius, y: p.mouseY + hitRadius }
                        })[0];

                        const snap = getSnapPos(released, p.mouseX, p.mouseY);

                        if (released && released !== constraintStartBody) {
                            // Body to Body
                            engine.addConstraint(constraintStartBody, released, tool as any, constraintStartPos, snap);
                        } else if (!released) {
                            // Body to World (Pin)
                            engine.addConstraint(constraintStartBody, null, tool as any, constraintStartPos, { x: p.mouseX, y: p.mouseY });
                        }
                        if (onToolUsed) setTimeout(onToolUsed, 0);
                    }

                    if (tool === 'draw' && p.drawPath && p.drawPath.length > 1) {
                        // Create static body from path using connected rectangles for smoothness
                        const segments = [];
                        const thickness = 10;

                        for (let i = 0; i < p.drawPath.length - 1; i++) {
                            const p1 = p.drawPath[i];
                            const p2 = p.drawPath[i + 1];

                            const vec = Matter.Vector.sub(p2, p1);
                            const dist = Matter.Vector.magnitude(vec);

                            // Skip very small segments
                            if (dist < 2) continue;

                            const mid = Matter.Vector.add(p1, Matter.Vector.mult(vec, 0.5));
                            const angle = Math.atan2(vec.y, vec.x);

                            // Rectangle connecting the two points
                            const segment = Matter.Bodies.rectangle(mid.x, mid.y, dist + 2, thickness, { // +2 overlap to prevent cracks
                                isStatic: true,
                                angle: angle,
                                render: { fillStyle: '#444444' },
                                chamfer: { radius: 2 } // Round corners slightly for even smoother collisions
                            });
                            segments.push(segment);
                        }

                        if (segments.length > 0) Matter.Composite.add(matterEngine.world, segments);

                        p.drawPath = []; // Clear path
                        if (onToolUsed) setTimeout(onToolUsed, 0);
                    }

                    draggedBody = null;
                    constraintStartBody = null;
                    constraintStartPos = null;
                };

                const trailHistory = new Map<number, { x: number, y: number }[]>();
                const MAX_TRAIL_LENGTH = 200;

                clearTrailsRef.current = () => {
                    trailHistory.clear();
                };

                p.draw = function () {
                    if (!pausedRef.current && matterEngine) {
                        // Resiliency: Handle potential NaN or huge delta on resume
                        let rawDt = p.deltaTime;
                        if (typeof rawDt !== 'number' || isNaN(rawDt)) rawDt = 16.666;

                        // Clamp to maximum 50ms (approx 3 frames) to prevent instability
                        const dt = Math.min(rawDt, 50);

                        engine.update(dt);

                        // Update trail history
                        const bodies = Matter.Composite.allBodies(matterEngine.world);
                        bodies.forEach(function (body: any) {
                            const shouldTrail = !body.isStatic &&
                                body.label !== 'ground' &&
                                (body.plugin?.showTrail !== false);

                            if (shouldTrail) {
                                if (!trailHistory.has(body.id)) trailHistory.set(body.id, []);
                                const history = trailHistory.get(body.id);
                                if (history) {
                                    history.push({ x: body.position.x, y: body.position.y });
                                    if (history.length > MAX_TRAIL_LENGTH) history.shift();
                                }
                            }
                        });
                    }

                    p.background(bgColorRef.current);

                    // Draw Trails
                    p.noFill();
                    trailHistory.forEach((history, bodyId) => {
                        const body = engine.getBodyById(bodyId);
                        if (!body) return;

                        const color = p.color((body.render && body.render.fillStyle) || '#E8E8E8');

                        p.beginShape();
                        for (let i = 0; i < history.length; i++) {
                            const pos = history[i];
                            const alpha = p.map(i, 0, history.length, 0, 150);
                            color.setAlpha(alpha);
                            p.stroke(color);
                            p.strokeWeight(p.map(i, 0, history.length, 0.5, 2));
                            p.vertex(pos.x, pos.y);
                        }
                        p.endShape();
                    });

                    // 1. Draw Bodies
                    const bodies = Matter.Composite.allBodies(matterEngine.world);
                    p.noStroke();
                    bodies.forEach(function (body: any) {
                        p.fill((body.render && body.render.fillStyle) || '#E8E8E8');
                        p.beginShape();
                        body.vertices.forEach(function (v: any) { p.vertex(v.x, v.y); });
                        p.endShape(p.CLOSE);

                        if (selectedBodyIdRef.current === body.id) {
                            p.stroke('#6366f1');
                            p.strokeWeight(3);
                            p.noFill();
                            p.beginShape();
                            body.vertices.forEach(function (v: any) { p.vertex(v.x, v.y); });
                            p.endShape(p.CLOSE);
                            p.noStroke();
                        }

                        if (showVectorsRef.current && !body.isStatic) {
                            const position = body.position;
                            const velocity = body.velocity;
                            if (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1) {
                                p.stroke('#58C4DD');
                                p.strokeWeight(2);
                                p.line(position.x, position.y, position.x + velocity.x * 5, position.y + velocity.y * 5);
                                p.noStroke();
                            }
                        }

                        // Visualize Thruster
                        if (activeToolRef.current === 'thruster' && draggedBody === body && p.mouseIsPressed) {
                            p.stroke('#F59E0B');
                            p.strokeWeight(4);
                            p.line(body.position.x, body.position.y, p.mouseX, p.mouseY);
                            p.noStroke();
                            p.fill('#F59E0B');
                            p.circle(p.mouseX, p.mouseY, 6);
                        }
                    });

                    // 2. Draw Constraints (Visible on top of bodies)
                    const constraints = Matter.Composite.allConstraints(matterEngine.world);
                    constraints.forEach(function (c: any) {
                        if (c.label === "Mouse Constraint") return;
                        const bodyA = c.bodyA;
                        const bodyB = c.bodyB;

                        const Vector = Matter.Vector;

                        let startX, startY, endX, endY;

                        if (bodyA) {
                            const worldPointA = Vector.rotate(c.pointA, bodyA.angle);
                            startX = bodyA.position.x + worldPointA.x;
                            startY = bodyA.position.y + worldPointA.y;
                        } else {
                            startX = c.pointA.x;
                            startY = c.pointA.y;
                        }

                        if (bodyB) {
                            const worldPointB = Vector.rotate(c.pointB, bodyB.angle);
                            endX = bodyB.position.x + worldPointB.x;
                            endY = bodyB.position.y + worldPointB.y;
                        } else {
                            endX = c.pointB.x;
                            endY = c.pointB.y;
                        }

                        p.stroke((c.render && c.render.strokeStyle) || '#999');
                        p.strokeWeight((c.render && c.render.lineWidth) || 2);

                        if (c.render && c.render.type === 'spring') {
                            const steps = 14;
                            p.noFill();
                            p.beginShape();
                            p.vertex(startX, startY);

                            const dx = endX - startX;
                            const dy = endY - startY;
                            const len = Math.sqrt(dx * dx + dy * dy) || 1;
                            const nx = -dy / len;
                            const ny = dx / len;

                            for (let i = 1; i < steps; i++) {
                                const t = i / steps;
                                const px = p.lerp(startX, endX, t);
                                const py = p.lerp(startY, endY, t);
                                const amplitude = 6;
                                const offset = (i % 2 === 0 ? 1 : -1) * amplitude;
                                p.vertex(px + nx * offset, py + ny * offset);
                            }
                            p.vertex(endX, endY);
                            p.endShape();
                        } else {
                            p.line(startX, startY, endX, endY);
                        }

                        p.noStroke();
                        p.fill((c.render && c.render.strokeStyle) || '#999');
                        p.circle(startX, startY, 4);
                        p.circle(endX, endY, 4);
                    });

                    // 3. Draw Drag Line
                    if (constraintStartPos) {
                        const tool = activeToolRef.current;
                        p.stroke(tool === 'spring' ? '#F59E0B' : (tool === 'rod' ? '#6366F1' : '#EF4444'));
                        p.strokeWeight(2);
                        p.drawingContext.setLineDash([5, 5]);
                        p.line(constraintStartPos.x, constraintStartPos ? constraintStartPos.y : p.mouseY, p.mouseX, p.mouseY);
                        p.drawingContext.setLineDash([]);

                        p.noStroke();
                        p.fill(tool === 'spring' ? '#F59E0B' : (tool === 'rod' ? '#6366F1' : '#EF4444'));
                        p.circle(p.mouseX, p.mouseY, 6);
                    }

                    // Draw current pencil path
                    if (activeToolRef.current === 'draw' && (p as any).drawPath && (p as any).drawPath.length > 0) {
                        p.noFill();
                        p.stroke('#444444');
                        p.strokeWeight(10);
                        if (p.strokeCap) p.strokeCap('round');
                        if (p.strokeJoin) p.strokeJoin('round');
                        p.beginShape();
                        (p as any).drawPath.forEach((pt: any) => p.vertex(pt.x, pt.y));
                        p.endShape();

                        // Add current mouse pos
                        const path = (p as any).drawPath;
                        p.line(path[path.length - 1].x, path[path.length - 1].y, p.mouseX, p.mouseY);
                    }

                    // Visualize Snap Centers for Constraint Tools
                    const tool = activeToolRef.current;
                    if (tool === 'spring' || tool === 'rod' || tool === 'pin') {
                        const bodies = Matter.Composite.allBodies(matterEngine.world);
                        const snapDist = 20;
                        bodies.forEach((body: any) => {
                            if (body.label === 'ground' || body.label === 'World Boundary') return;

                            const px = body.position.x;
                            const py = body.position.y;

                            // Check distance to mouse
                            const d = Math.hypot(p.mouseX - px, p.mouseY - py);
                            const isHover = d < snapDist;

                            p.stroke(isHover ? '#EF4444' : 'rgba(100, 100, 100, 0.5)'); // Red if hover, faint grey otherwise
                            p.strokeWeight(isHover ? 3 : 1);

                            // Draw Crosshair
                            const size = isHover ? 8 : 5;
                            p.line(px - size, py, px + size, py);
                            p.line(px, py - size, px, py + size);

                            if (isHover) {
                                p.noFill();
                                p.stroke('#EF4444');
                                p.circle(px, py, snapDist * 2);
                            }
                        });
                    }
                };

                p.windowResized = function () {
                    if (containerRef.current) {
                        const w = containerRef.current.clientWidth;
                        const h = containerRef.current.clientHeight;
                        p.resizeCanvas(w, h);
                        engine.addWorldBounds(w, h);
                    }
                };
            };

            if (p5Ref.current) p5Ref.current.remove();
            p5Ref.current = new p5(sketch);
            setIsLoaded(true);
        };
        initP5();
        return () => { if (p5Ref.current) p5Ref.current.remove(); };
    }, [containerRef, engine, onSelectBody, engine.isReady]);

    useEffect(() => {
        if (p5Ref.current && containerRef.current) {
            const p = p5Ref.current;

            const performResize = () => {
                const w = containerRef.current!.clientWidth;
                const h = containerRef.current!.clientHeight;
                p.resizeCanvas(w, h);
                engine.addWorldBounds(w, h);
            };

            // Immediate resize
            performResize();

            // Also resize after a short delay for CSS settling
            const timer = setTimeout(performResize, 100);
            const timer2 = setTimeout(performResize, 500); // Second pass for safety

            return () => {
                clearTimeout(timer);
                clearTimeout(timer2);
            };
        }
    }, [isFullscreen, containerRef, engine]);

    return useMemo(() => ({
        p5Ref,
        isLoaded,
        clearTrails: () => clearTrailsRef.current?.()
    }), [isLoaded]);
}
