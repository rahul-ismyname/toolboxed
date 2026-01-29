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
}

export interface P5RendererAPI {
    p5Ref: React.MutableRefObject<any>;
    isLoaded: boolean;
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
    } = options;

    const p5Ref = useRef<any>(null);
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
                        Math.min(1920, containerRef.current!.clientWidth),
                        containerRef.current!.clientHeight
                    );
                    canvas.parent(containerRef.current!);
                    canvasElement = canvas.elt;

                    // Add MouseConstraint for physics dragging
                    const mouse = Matter.Mouse.create(canvas.elt);
                    mouse.pixelRatio = p.pixelDensity();
                    const mouseConstraint = Matter.MouseConstraint.create(matterEngine, {
                        mouse: mouse,
                        constraint: { stiffness: 0.2, render: { visible: false } }
                    });
                    Matter.Composite.add(matterEngine.world, mouseConstraint);

                    // Remove scroll listeners
                    if (mouse.element) {
                        (mouse as any).element.removeEventListener("mousewheel", (mouse as any).mousewheel);
                        (mouse as any).element.removeEventListener("DOMMouseScroll", (mouse as any).mousewheel);
                    }
                };

                p.mousePressed = function (event: any) {
                    // Check if we are clicking the canvas
                    console.log('Mouse Pressed on target:', event?.target?.tagName);
                    if (event && event.target && event.target !== canvasElement) {
                        console.log('Ignoring press - target is not canvas');
                        return;
                    }

                    const tool = activeToolRef.current;
                    console.log('Current Tool:', tool);

                    const bodies = Matter.Composite.allBodies(matterEngine.world);
                    const clicked = Matter.Query.point(bodies, { x: p.mouseX, y: p.mouseY })[0];

                    if (tool === 'pin') {
                        if (clicked && !clicked.isStatic) {
                            console.log('Adding pin to body:', clicked.id);
                            engine.addPin(clicked, p.mouseX, p.mouseY);
                        }
                        return;
                    }

                    if (tool === 'spring' || tool === 'rod') {
                        if (clicked) {
                            console.log('Starting constraint from body:', clicked.id);
                            constraintStartBody = clicked;
                            constraintStartPos = { x: p.mouseX, y: p.mouseY };
                        }
                        return;
                    }

                    if (tool && ['box', 'circle', 'triangle', 'polygon', 'wall'].indexOf(tool) !== -1) {
                        console.log('Spawning via tool click:', tool, 'at', p.mouseX, p.mouseY);
                        engine.spawnBody(tool as any, { x: p.mouseX, y: p.mouseY }, spawnSizeRef.current);
                        return;
                    }

                    if (clicked) {
                        console.log('Selected body:', clicked.id);
                        setTimeout(function () { onSelectBody(clicked.id); }, 0);
                        draggedBody = clicked;
                    } else {
                        console.log('Clearing selection');
                        setTimeout(function () { onSelectBody(null); }, 0);
                        draggedBody = null;
                    }
                };

                p.mouseDragged = function (event: any) {
                    if (event && event.target && event.target !== canvasElement && !draggedBody) return;

                    const tool = activeToolRef.current;
                    if (tool === 'spring' || tool === 'rod' || tool === 'pin') return;

                    if (draggedBody) {
                        Matter.Body.setPosition(draggedBody, { x: p.mouseX, y: p.mouseY });
                        Matter.Body.setVelocity(draggedBody, { x: 0, y: 0 });
                    }
                };

                p.mouseReleased = function () {
                    const tool = activeToolRef.current;

                    if ((tool === 'spring' || tool === 'rod') && constraintStartBody) {
                        const bodies = Matter.Composite.allBodies(matterEngine.world);
                        const released = Matter.Query.point(bodies, { x: p.mouseX, y: p.mouseY })[0];

                        if (released && released !== constraintStartBody) {
                            engine.addConstraint(constraintStartBody, released, tool as any);
                        }
                    }

                    draggedBody = null;
                    constraintStartBody = null;
                    constraintStartPos = null;
                };

                const trailHistory = new Map();
                const MAX_TRAIL_LENGTH = 20;

                p.draw = function () {
                    if (!pausedRef.current && matterEngine) {
                        const bodies = Matter.Composite.allBodies(matterEngine.world);
                        bodies.forEach(function (body: any) {
                            if (!body.isStatic) {
                                if (!trailHistory.has(body.id)) trailHistory.set(body.id, []);
                                const history = trailHistory.get(body.id);
                                if (history) {
                                    history.push({ x: body.position.x, y: body.position.y });
                                    if (history.length > MAX_TRAIL_LENGTH) history.shift();
                                }
                            }
                            if (body.plugin && body.plugin.acceleration) {
                                Matter.Body.applyForce(body, body.position, {
                                    x: body.plugin.acceleration.x * 0.001 * body.mass,
                                    y: body.plugin.acceleration.y * 0.001 * body.mass
                                });
                            }
                        });

                        // Cap delta time to prevent physics "explosion" or tunneling after tab switching
                        const cappedDelta = Math.min(p.deltaTime, 33);
                        Matter.Engine.update(matterEngine, cappedDelta);
                    }

                    p.background(bgColorRef.current);

                    const constraints = Matter.Composite.allConstraints(matterEngine.world);
                    constraints.forEach(function (c: any) {
                        if (c.label === "Mouse Constraint") return;
                        const bodyA = c.bodyA;
                        const bodyB = c.bodyB;

                        const startX = bodyA ? bodyA.position.x + (c.pointA ? c.pointA.x : 0) : (c.pointA ? c.pointA.x : 0);
                        const startY = bodyA ? bodyA.position.y + (c.pointA ? c.pointA.y : 0) : (c.pointA ? c.pointA.y : 0);
                        const endX = bodyB ? bodyB.position.x + (c.pointB ? c.pointB.x : 0) : (c.pointB ? c.pointB.y : 0);
                        const endY = bodyB ? bodyB.position.y + (c.pointB ? c.pointB.y : 0) : (c.pointB ? c.pointB.y : 0);

                        p.stroke((c.render && c.render.strokeStyle) || '#999');
                        p.strokeWeight((c.render && c.render.lineWidth) || 2);

                        if (c.render && c.render.type === 'spring') {
                            const steps = 10;
                            p.noFill();
                            p.beginShape();
                            p.vertex(startX, startY);
                            for (let i = 1; i < steps; i++) {
                                const t = i / steps;
                                const x = p.lerp(startX, endX, t);
                                const y = p.lerp(startY, endY, t);
                                const offset = (i % 2 === 0 ? 1 : -1) * 3;
                                p.vertex(x + offset, y + offset);
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

                    const bodies = Matter.Composite.allBodies(matterEngine.world);
                    p.noFill();
                    bodies.forEach(function (body: any) {
                        if (trailHistory.has(body.id)) {
                            const history = trailHistory.get(body.id);
                            if (history) {
                                p.beginShape();
                                for (let i = 0; i < history.length; i++) {
                                    const pos = history[i];
                                    p.stroke(p.color((body.render && body.render.fillStyle) || '#E8E8E8'));
                                    p.strokeWeight(i * 0.2);
                                    p.vertex(pos.x, pos.y);
                                }
                                p.endShape();
                            }
                        }
                    });

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
                    });
                };

                p.windowResized = function () {
                    if (containerRef.current) p.resizeCanvas(Math.min(1920, containerRef.current.clientWidth), containerRef.current.clientHeight);
                };
            };

            if (p5Ref.current) p5Ref.current.remove();
            p5Ref.current = new p5(sketch);
            setIsLoaded(true);
        };
        initP5();
        return () => { if (p5Ref.current) p5Ref.current.remove(); };
    }, [containerRef, engine, onSelectBody, engine.isReady]);

    return useMemo(() => ({ p5Ref, isLoaded }), [isLoaded]);
}
