'use client';

import React, { useRef, useEffect, useMemo, useState } from 'react';
import type { MatterEngineAPI, ActiveWalls } from './useMatterEngine';

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
    activeMaterial: string;
    activeWalls: ActiveWalls;
    showGrid: boolean;
    isMobile: boolean;
    lowPowerMode: boolean;
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
        activeMaterial,
        activeWalls,
        showGrid,
        isMobile,
        lowPowerMode
    } = options;

    const p5Ref = useRef<any>(null);
    const clearTrailsRef = useRef<(() => void) | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Refs for draw loop access (avoids stale closures)
    const bgColorRef = useRef(bgColor);
    const trailHistoryRef = useRef<Map<number, { x: number, y: number }[]>>(new Map());
    const MAX_TRAIL_LENGTH = 20;
    const showVectorsRef = useRef(showVectors);
    const pausedRef = useRef(paused);
    const selectedBodyIdRef = useRef(selectedBodyId);
    const activeToolRef = useRef(activeTool);
    const spawnSizeRef = useRef(spawnSize);
    const activeMaterialRef = useRef(activeMaterial);
    const onToolUsedRef = useRef(onToolUsed);
    const activeWallsRef = useRef(activeWalls);
    const showGridRef = useRef(showGrid);
    const isMobileRef = useRef(isMobile);
    const lowPowerModeRef = useRef(lowPowerMode);

    useEffect(() => { bgColorRef.current = bgColor; }, [bgColor]);
    useEffect(() => { showVectorsRef.current = showVectors; }, [showVectors]);
    useEffect(() => { pausedRef.current = paused; }, [paused]);
    useEffect(() => { selectedBodyIdRef.current = selectedBodyId; }, [selectedBodyId]);
    useEffect(() => { activeToolRef.current = activeTool; }, [activeTool]);
    useEffect(() => { spawnSizeRef.current = spawnSize; }, [spawnSize]);
    useEffect(() => { activeMaterialRef.current = activeMaterial; }, [activeMaterial]);
    useEffect(() => { onToolUsedRef.current = onToolUsed; }, [onToolUsed]);
    useEffect(() => { activeWallsRef.current = activeWalls; }, [activeWalls]);
    useEffect(() => { showGridRef.current = showGrid; }, [showGrid]);
    useEffect(() => { isMobileRef.current = isMobile; }, [isMobile]);
    useEffect(() => { lowPowerModeRef.current = lowPowerMode; }, [lowPowerMode]);

    useEffect(() => {
        if (!containerRef.current || !engine.engineRef.current || !engine.MatterRef.current) return;

        const initP5 = async () => {
            const p5Module = await import('p5');
            const P5 = (p5Module as any).default || p5Module;

            // Disable Friendly Error System (FES) to prevent parser errors with modern JS
            try {
                (P5 as any).disableFriendlyErrors = true;
            } catch (e) { }

            const Matter = engine.MatterRef.current;
            const matterEngine = engine.engineRef.current;

            let draggedBody: any = null;
            let constraintStartBody: any = null;
            let constraintStartPos: { x: number, y: number } | null = null;
            let canvasElement: HTMLCanvasElement;

            // Viewport scaling for mobile: zoom out slightly so more fits
            const viewportScale = isMobileRef.current ? 0.75 : 1.0;

            // Touch handling for tap-to-select
            let touchStartTime = 0;
            let touchStartPos = { x: 0, y: 0 };
            let isTap = false;
            let lastTapTime = 0;

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
                    const density = p.pixelDensity();
                    p.pixelDensity(Math.min(density, 2.0)); // Cap for mobile performance

                    const mouse = Matter.Mouse.create(canvas.elt);
                    mouse.pixelRatio = p.pixelDensity();

                    // Scale mouse input to match canvas scaling
                    Matter.Mouse.setScale(mouse, { x: 1 / viewportScale, y: 1 / viewportScale });

                    const mouseConstraint = Matter.MouseConstraint.create(matterEngine, {
                        mouse: mouse,
                        constraint: { stiffness: 0.2, render: { visible: false } }
                    });
                    Matter.Composite.add(matterEngine.world, mouseConstraint);

                    // Add world bounds automatically (scaled to virtual size)
                    engine.addWorldBounds(p.width / viewportScale, p.height / viewportScale, 2000, activeWallsRef.current);
                };

                // Helper to check for snap
                const getSnapPos = (body: any, mx: number, my: number) => {
                    if (!body) return { x: mx, y: my };
                    const dist = Math.hypot(body.position.x - mx, body.position.y - my);
                    if (dist < 20) return { x: body.position.x, y: body.position.y };
                    return { x: mx, y: my };
                };

                p.touchStarted = function (event: any) {
                    touchStartTime = Date.now();
                    const mx = p.mouseX / viewportScale;
                    const my = p.mouseY / viewportScale;
                    touchStartPos = { x: mx, y: my };
                    isTap = true;
                    p.mousePressed(event);
                    return false;
                };

                p.mousePressed = function (event: any) {
                    if (event && event.target && event.target !== canvasElement) return;

                    const mx = p.mouseX / viewportScale;
                    const my = p.mouseY / viewportScale;

                    const tool = activeToolRef.current;
                    const bodies = Matter.Composite.allBodies(matterEngine.world);
                    const clicked = Matter.Query.point(bodies, { x: mx, y: my })[0];
                    const snap = getSnapPos(clicked, mx, my);

                    if (tool === 'pin') {
                        if (clicked && !clicked.isStatic) engine.addPin(clicked, snap.x, snap.y);
                        return;
                    }

                    if (tool === 'remove_pin') {
                        engine.removePinAt(mx, my, 20);
                        return;
                    }

                    if (tool === 'remove_constraint') {
                        engine.removeConstraintsAt(mx, my, 20);
                        return;
                    }

                    if (['spring', 'rod', 'axle', 'fuse'].includes(tool as string)) {
                        if (clicked) {
                            if (tool === 'fuse' && constraintStartBody && constraintStartBody !== clicked) {
                                engine.fuseBodies([constraintStartBody.id, clicked.id]);
                                constraintStartBody = null;
                            } else {
                                constraintStartBody = clicked;
                                constraintStartPos = snap;
                            }
                        }
                        return;
                    }

                    if (tool && ['box', 'circle', 'triangle', 'polygon', 'wall'].includes(tool)) {
                        engine.spawnBody(tool as any, { x: mx, y: my, material: activeMaterialRef.current }, spawnSizeRef.current);
                        if (onToolUsedRef.current) setTimeout(onToolUsedRef.current, 0);
                        return;
                    }

                    if (tool === 'explosion') {
                        const radius = 300;
                        engine.applyExplosionForce({ x: mx, y: my }, 0.5, radius);
                        if (!p.fx) p.fx = [];
                        p.fx.push({ x: mx, y: my, radius: 10, maxRadius: radius, life: 1.0, color: '#EF4444' });
                        if (onToolUsedRef.current) setTimeout(onToolUsedRef.current, 0);
                        return;
                    }

                    if (tool === 'draw') {
                        draggedBody = null;
                        return;
                    }

                    if (clicked) {
                        if (tool === 'connector') {
                            constraintStartBody = clicked;
                            constraintStartPos = { x: mx, y: my };
                        } else {
                            if (tool !== 'thruster' && !isMobileRef.current) {
                                setTimeout(() => onSelectBody(clicked.id), 0);
                            }
                            draggedBody = clicked;
                        }
                    } else if (!isMobileRef.current) {
                        setTimeout(() => onSelectBody(null), 0);
                        draggedBody = null;
                    }
                };

                p.mouseDragged = function (event: any) {
                    if (event && event.target && event.target !== canvasElement && !draggedBody) return;

                    const mx = p.mouseX / viewportScale;
                    const my = p.mouseY / viewportScale;
                    const pmx = p.pmouseX / viewportScale;
                    const pmy = p.pmouseY / viewportScale;

                    const tool = activeToolRef.current;
                    if (['spring', 'rod', 'axle', 'pin', 'explosion'].includes(tool as string)) return;

                    if (tool === 'thruster' && draggedBody) {
                        const forceMagnitude = 0.002 * draggedBody.mass;
                        const angle = Math.atan2(my - draggedBody.position.y, mx - draggedBody.position.x);
                        Matter.Body.applyForce(draggedBody, draggedBody.position, {
                            x: Math.cos(angle) * forceMagnitude,
                            y: Math.sin(angle) * forceMagnitude
                        });
                        return;
                    }

                    if (tool === 'draw') {
                        if (!p.drawPath) p.drawPath = [];
                        if (Math.hypot(mx - pmx, my - pmy) > 5) {
                            p.drawPath.push({ x: mx, y: my });
                        }
                        return;
                    }

                    if (draggedBody) {
                        Matter.Body.setPosition(draggedBody, { x: mx, y: my });
                        Matter.Body.setVelocity(draggedBody, { x: mx - pmx, y: my - pmy });
                    }
                };

                p.touchMoved = function (event: any) {
                    const mx = p.mouseX / viewportScale;
                    const my = p.mouseY / viewportScale;
                    const dist = Math.hypot(mx - touchStartPos.x, my - touchStartPos.y);
                    if (dist > (isMobileRef.current ? 15 : 10)) isTap = false;
                    p.mouseDragged(event);
                    return false;
                };

                p.mouseReleased = function () {
                    const mx = p.mouseX / viewportScale;
                    const my = p.mouseY / viewportScale;
                    const tool = activeToolRef.current;

                    if (tool === 'connector' && constraintStartBody) {
                        const bodies = Matter.Composite.allBodies(matterEngine.world);
                        const endBody = Matter.Query.point(bodies, { x: mx, y: my })[0];
                        if (endBody && endBody !== constraintStartBody) {
                            engine.addConstraint(constraintStartBody, endBody, 'spring', constraintStartPos!, { x: mx, y: my });
                        }
                        constraintStartBody = null; constraintStartPos = null;
                    } else if (['spring', 'rod', 'axle'].includes(tool as string) && constraintStartBody && constraintStartPos) {
                        const bodies = Matter.Composite.allBodies(matterEngine.world);
                        const released = Matter.Query.region(bodies, {
                            min: { x: mx - 15, y: my - 15 },
                            max: { x: mx + 15, y: my + 15 }
                        })[0];
                        const snap = getSnapPos(released, mx, my);
                        if (released && released !== constraintStartBody) {
                            if (tool === 'axle') engine.addRevoluteJoint(constraintStartBody, released, constraintStartPos, snap);
                            else engine.addConstraint(constraintStartBody, released, tool as any, constraintStartPos, snap);
                        } else if (!released) {
                            if (tool === 'axle') engine.addPin(constraintStartBody, mx, my);
                            else engine.addConstraint(constraintStartBody, null, tool as any, constraintStartPos, { x: mx, y: my });
                        }
                    } else if (tool === 'draw' && p.drawPath && p.drawPath.length > 1) {
                        const segments: any[] = [];
                        for (let i = 0; i < p.drawPath.length - 1; i++) {
                            const p1 = p.drawPath[i], p2 = p.drawPath[i + 1];
                            const vec = Matter.Vector.sub(p2, p1), dist = Matter.Vector.magnitude(vec);
                            if (dist < 2) continue;
                            const mid = Matter.Vector.add(p1, Matter.Vector.mult(vec, 0.5)), angle = Math.atan2(vec.y, vec.x);
                            segments.push(Matter.Bodies.rectangle(mid.x, mid.y, dist + 2, 10, { isStatic: true, angle, render: { fillStyle: '#444444' } }));
                        }
                        if (segments.length > 0) Matter.Composite.add(matterEngine.world, segments);
                        p.drawPath = [];
                    }

                    if (isMobileRef.current && isTap && (Date.now() - touchStartTime < 500)) {
                        const now = Date.now();
                        const timeSinceLastTap = now - lastTapTime;

                        // Use a small region query for better hit detection on touch
                        const bodies = Matter.Composite.allBodies(matterEngine.world);
                        const clicked = Matter.Query.region(bodies, {
                            min: { x: mx - 10, y: my - 10 },
                            max: { x: mx + 10, y: my + 10 }
                        })[0];

                        // Double tap detection (within 500ms)
                        if (timeSinceLastTap < 500) {
                            onSelectBody(clicked ? clicked.id : null);
                            lastTapTime = 0; // Reset
                        } else {
                            // Single tap on empty space still deselects
                            if (!clicked) onSelectBody(null);
                            lastTapTime = now;
                        }
                    }

                    draggedBody = null; constraintStartBody = null; constraintStartPos = null;
                };

                p.touchEnded = function (event: any) {
                    p.mouseReleased(event);
                    return false;
                };

                const trailHistory = new Map<number, { x: number, y: number }[]>();
                const MAX_TRAIL_LENGTH = isMobileRef.current ? 20 : 40;

                clearTrailsRef.current = () => {
                    trailHistory.clear();
                };

                // Helper function for drawing the grid
                const drawGrid = (p: any) => {
                    const gridSize = 50;
                    p.stroke(0, 0, 0, 10); // Very faint grid lines
                    p.strokeWeight(1);

                    // Vertical lines
                    for (let x = 0; x <= p.width; x += gridSize) {
                        p.line(x, 0, x, p.height);
                        if (x % 100 === 0) {
                            p.noStroke();
                            p.fill(0, 0, 0, 30);
                            p.textSize(8);
                            p.text(x, x + 2, 10);
                            p.stroke(0, 0, 0, 10);
                        }
                    }

                    // Horizontal lines
                    for (let y = 0; y <= p.height; y += gridSize) {
                        p.line(0, y, p.width, y);
                        if (y % 100 === 0) {
                            p.noStroke();
                            p.fill(0, 0, 0, 30);
                            p.textSize(8);
                            p.text(y, 2, y - 2);
                            p.stroke(0, 0, 0, 10);
                        }
                    }

                    // Draw Mouse Coordinates (scaled)
                    const smx = p.mouseX / viewportScale;
                    const smy = p.mouseY / viewportScale;
                    p.noStroke();
                    p.fill('#6366f1');
                    p.rect(smx + 10, smy + 10, 80, 20, 4);
                    p.fill('white');
                    p.textSize(10);
                    p.textAlign(p.LEFT, p.CENTER);
                    p.text(`x: ${Math.round(smx)}, y: ${Math.round(smy)}`, smx + 15, smy + 20);
                    p.textAlign(p.LEFT, p.BASELINE); // Reset alignment
                };

                p.draw = function () {
                    if (!pausedRef.current && matterEngine) {
                        // Dynamic performance: if currentFixedDelta is high (30Hz), we might want to do something, 
                        // but Matter Engine update is already handled in the loop.
                        // Render at whatever FPS we can, but simulation is fixed.

                        let rawDt = p.deltaTime;
                        if (typeof rawDt !== 'number' || isNaN(rawDt)) rawDt = 16.666;
                        const dt = Math.min(rawDt, 50);

                        engine.update(dt);
                    }

                    p.background(bgColorRef.current);

                    // Apply viewport scaling
                    p.push();
                    p.scale(viewportScale);

                    if (showGridRef.current) {
                        drawGrid(p);
                    }

                    // Optimization: Skip complex trails in low power mode
                    if (!lowPowerModeRef.current) {
                        trailHistory.forEach((history, bodyId) => {
                            const body = engine.getBodyById(bodyId);
                            if (!body) return;

                            const colorStr = (body.render && body.render.fillStyle) || '#E8E8E8';
                            const baseColor = p.color(colorStr);

                            p.noFill();
                            p.stroke(p.red(baseColor), p.green(baseColor), p.blue(baseColor), 100);
                            p.strokeWeight(2);
                            p.beginShape();
                            history.forEach(pos => p.vertex(pos.x, pos.y));
                            p.endShape();
                        });
                    }

                    // 1. Draw Bodies
                    const bodies = Matter.Composite.allBodies(matterEngine.world);
                    p.noStroke();
                    bodies.forEach(function (body: any) {
                        // Only update trails if not in low power mode
                        if (!lowPowerModeRef.current && !pausedRef.current && !body.isStatic && body.speed > 0.1) {
                            if (!trailHistory.has(body.id)) trailHistory.set(body.id, []);
                            const history = trailHistory.get(body.id)!;
                            history.push({ x: body.position.x, y: body.position.y });
                            if (history.length > MAX_TRAIL_LENGTH) history.shift();
                        }

                        // Drawing body
                        const fillColor = (body.render && body.render.fillStyle) || '#E8E8E8';
                        p.fill(fillColor);

                        p.beginShape();
                        body.vertices.forEach(function (v: any) { p.vertex(v.x, v.y); });
                        p.endShape(p.CLOSE);

                        // Selection highlight
                        if (selectedBodyIdRef.current === body.id) {
                            if (lowPowerModeRef.current) {
                                // Simple selection for low power
                                p.stroke('#6366f1');
                                p.strokeWeight(2);
                                p.noFill();
                                p.beginShape();
                                body.vertices.forEach(function (v: any) { p.vertex(v.x, v.y); });
                                p.endShape(p.CLOSE);
                                p.noStroke();
                            } else {
                                // Pulsing Glow
                                const pulse = (Math.sin(p.frameCount * 0.1) * 0.5 + 0.5);
                                p.stroke(99, 102, 241, 50 + pulse * 100);
                                p.strokeWeight(4 + pulse * 6);
                                p.noFill();
                                p.beginShape();
                                body.vertices.forEach(function (v: any) { p.vertex(v.x, v.y); });
                                p.endShape(p.CLOSE);

                                p.stroke('#6366f1');
                                p.strokeWeight(2);
                                p.beginShape();
                                body.vertices.forEach(function (v: any) { p.vertex(v.x, v.y); });
                                p.endShape(p.CLOSE);
                                p.noStroke();
                            }
                        }

                        // Velocity Vectors
                        if (showVectorsRef.current && !body.isStatic && body.speed > 0.1) {
                            p.stroke('#58C4DD');
                            p.strokeWeight(1.5);
                            p.line(body.position.x, body.position.y,
                                body.position.x + body.velocity.x * 5,
                                body.position.y + body.velocity.y * 5);
                            p.noStroke();
                        }

                        // Thruster Visual
                        if (activeToolRef.current === 'thruster' && draggedBody === body && p.mouseIsPressed) {
                            const smx = p.mouseX / viewportScale;
                            const smy = p.mouseY / viewportScale;
                            p.stroke('#F59E0B');
                            p.strokeWeight(3);
                            p.line(body.position.x, body.position.y, smx, smy);
                            p.noStroke();
                            p.fill('#F59E0B');
                            p.circle(smx, smy, 5);
                        }
                    });

                    // 2. Draw Constraints
                    const constraints = Matter.Composite.allConstraints(matterEngine.world);
                    constraints.forEach(function (c: any) {
                        if (c.label === "Mouse Constraint") return;

                        const posA = c.bodyA ? Matter.Vector.add(c.bodyA.position, c.pointA) : c.pointA;
                        const posB = c.bodyB ? Matter.Vector.add(c.bodyB.position, c.pointB) : c.pointB;

                        p.stroke((c.render && c.render.strokeStyle) || '#999');
                        const weight = (c.render && c.render.lineWidth) || 2;
                        p.strokeWeight(weight);

                        if (!lowPowerModeRef.current && c.render && c.render.type === 'spring') {
                            // Coiled spring look
                            const dx = posB.x - posA.x;
                            const dy = posB.y - posA.y;
                            const len = Math.hypot(dx, dy) || 1;
                            const steps = 12;
                            const nx = -dy / len;
                            const ny = dx / len;

                            p.noFill();
                            p.beginShape();
                            p.vertex(posA.x, posA.y);
                            for (let i = 1; i < steps; i++) {
                                const t = i / steps;
                                const px = posA.x + dx * t;
                                const py = posA.y + dy * t;
                                const offset = (i % 2 === 0 ? 1 : -1) * 5;
                                p.vertex(px + nx * offset, py + ny * offset);
                            }
                            p.vertex(posB.x, posB.y);
                            p.endShape();
                        } else {
                            // Simple line for low power or rigid
                            p.line(posA.x, posA.y, posB.x, posB.y);
                        }

                        // Attachment points (Pins)
                        if (c.render && c.render.strokeStyle === '#EF4444') {
                            p.fill('#475569');
                            p.circle(posA.x, posA.y, 8);
                            p.fill('#94A3B8');
                            p.circle(posA.x, posA.y, 4);
                        }
                    });

                    // 3. Draw Interaction Tools
                    if (constraintStartPos) {
                        const smx = p.mouseX / viewportScale;
                        const smy = p.mouseY / viewportScale;
                        p.stroke('#F59E0B');
                        p.strokeWeight(2);
                        p.line(constraintStartPos.x, constraintStartPos.y, smx, smy);
                        p.noStroke();
                        p.fill('#F59E0B');
                        p.circle(smx, smy, 5);
                    }

                    // 4. Draw FX
                    if ((p as any).fx && (p as any).fx.length > 0) {
                        const fxList = (p as any).fx;
                        for (let i = fxList.length - 1; i >= 0; i--) {
                            const fx = fxList[i];
                            fx.life -= 0.05;
                            if (fx.life <= 0) { fxList.splice(i, 1); continue; }

                            fx.radius += (fx.maxRadius - fx.radius) * 0.1;
                            const c = p.color(fx.color || '#EF4444');
                            c.setAlpha(fx.life * 150);
                            p.noFill();
                            p.stroke(c);
                            p.strokeWeight(1 + fx.life * 5);
                            p.circle(fx.x, fx.y, fx.radius);
                        }
                    }

                    p.pop(); // End viewport scale
                };
            };

            if (p5Ref.current) p5Ref.current.remove();
            p5Ref.current = new P5(sketch);
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

                const viewportScale = isMobileRef.current ? 0.75 : 1.0;
                // Use activeWalls directly from closure (dependancy updated) rather than ref to avoid race condition
                engine.addWorldBounds(w / viewportScale, h / viewportScale, 2000, activeWalls);
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
    }, [isFullscreen, containerRef, engine, activeWalls]); // Added activeWalls to dep array for resize triggering

    return useMemo(() => ({
        p5Ref,
        isLoaded,
        clearTrails: () => clearTrailsRef.current?.()
    }), [isLoaded]);
}
