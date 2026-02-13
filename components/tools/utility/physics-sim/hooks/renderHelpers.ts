import type { MatterEngineAPI } from './useMatterEngine';

// Reusing vector object to avoid GC
const tempVec = { x: 0, y: 0 };

export const drawGrid = (p: any, width: number, height: number, viewportScale: number) => {
    const gridSize = 50;
    // ... (rest of drawGrid implementation is fine) ...
    // Optimized grid drawing: Only draw lines within view? 
    // Grid matches canvas size so it's already "culled" by loop structure

    p.stroke(0, 0, 0, 10);
    p.strokeWeight(1 / viewportScale); // Keep line width consistent

    // Vertical lines
    for (let x = 0; x <= width / viewportScale; x += gridSize) {
        p.line(x, 0, x, height / viewportScale);
        if (x % 100 === 0) {
            p.noStroke();
            p.fill(0, 0, 0, 30);
            p.textSize(8 / viewportScale);
            p.text(x, x + 2, 10);
            p.stroke(0, 0, 0, 10);
        }
    }

    // Horizontal lines
    for (let y = 0; y <= height / viewportScale; y += gridSize) {
        p.line(0, y, width / viewportScale, y);
        if (y % 100 === 0) {
            p.noStroke();
            p.fill(0, 0, 0, 30);
            p.textSize(8 / viewportScale);
            p.text(y, 2, y - 2);
            p.stroke(0, 0, 0, 10);
        }
    }
};

const isBodyInViewport = (body: any, viewMinX: number, viewMinY: number, viewMaxX: number, viewMaxY: number) => {
    const { min, max } = body.bounds;
    return max.x >= viewMinX && min.x <= viewMaxX && max.y >= viewMinY && min.y <= viewMaxY;
};

export const drawBodies = (
    p: any,
    bodies: any[],
    lowPowerMode: boolean,
    paused: boolean,
    trailHistory: Map<number, { x: number, y: number }[]>,
    MAX_TRAIL_LENGTH: number,
    selectedBodyId: number | null,
    showVectors: boolean,
    activeTool: string | null,
    draggedBody: any,
    viewportScale: number
) => {
    // Calculate Viewport Bounds in World Space
    const viewMinX = 0;
    const viewMinY = 0;
    const viewMaxX = p.width / viewportScale;
    const viewMaxY = p.height / viewportScale;
    const ctx = p.drawingContext;

    // 1. Draw Trails (Batching?)
    // Trails can be expensive. Only draw if visible? 
    // Hard to inspect individual trail points, but we can check body position logic.
    if (!lowPowerMode) {
        p.noFill();
        p.strokeWeight(2);

        trailHistory.forEach((history, bodyId) => {
            const body = bodies.find(b => b.id === bodyId);
            if (!body) return;

            // Simple culling: if body is far off screen, skip trail?
            // (Optional, maybe not worth the check if trails are short)

            const colorStr = (body.render && body.render.fillStyle) || '#E8E8E8';
            const c = p.color(colorStr);
            c.setAlpha(100);
            p.stroke(c);

            p.beginShape();
            history.forEach((pos: any) => p.vertex(pos.x, pos.y));
            p.endShape();
        });
    }

    // 2. Draw Bodies
    p.noStroke();

    // Optimize: Reduce shadow context switches
    // If not low power, enable shadow ONCE for all bodies? 
    // Problem: Shadow logic needs to be reset for stroke bodies (selection).
    // Better: Batch bodies? Processing order matters for z-index (though usually irrelevant in 2D physics unless overlap).
    // For now, let's keep order but optimize the inner loop.

    bodies.forEach((body: any) => {
        // CULLING
        if (!isBodyInViewport(body, viewMinX, viewMinY, viewMaxX, viewMaxY)) return;

        // Update trails
        if (!lowPowerMode && !paused && !body.isStatic && body.speed > 0.1) {
            if (!trailHistory.has(body.id)) trailHistory.set(body.id, []);
            const history = trailHistory.get(body.id)!;
            history.push({ x: body.position.x, y: body.position.y });
            if (history.length > MAX_TRAIL_LENGTH) history.shift();
        }

        const fillColor = (body.render && body.render.fillStyle) || '#E8E8E8';

        // RENDER
        p.fill(fillColor);

        // Gradient & Shadow Optimization
        // Creating a gradient every frame is SLOW. 
        // Only do high-fidelity rendering if NOT low power AND body is not sleeping?
        // Or simplified: Just use generic shadows, skip the gradient.
        // The gradient was "Nice to have" but expensive. Let's try removing it for general cases 
        // OR only applying it to "Hero" objects (none defined yet).
        // Let's keep shadows but drop custom gradients per frame for performance, 
        // OR cache them? No, too complex.
        // COMPROMISE: Simple light/shadow effect without new object creation?

        if (!lowPowerMode && !body.isStatic) {
            // Global shadow settings allow batching if we didn't reset per body.
            // But we do reset. 
            ctx.shadowColor = 'rgba(0,0,0,0.2)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
        } else {
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
        }

        p.beginShape();
        body.vertices.forEach((v: any) => p.vertex(v.x, v.y));
        p.endShape(p.CLOSE);

        // Selection highlight
        if (selectedBodyId === body.id) {
            ctx.shadowBlur = 0; // Disable shadow for outline
            p.noFill();
            if (lowPowerMode) {
                p.stroke('#6366f1');
                p.strokeWeight(2);
            } else {
                const pulse = (Math.sin(p.frameCount * 0.1) * 0.5 + 0.5);
                p.stroke(99, 102, 241, 50 + pulse * 100);
                p.strokeWeight(4 + pulse * 6);
            }
            p.beginShape();
            body.vertices.forEach((v: any) => p.vertex(v.x, v.y));
            p.endShape(p.CLOSE);
            p.noStroke();
        }

        // Velocity Vectors
        if (showVectors && !body.isStatic && body.speed > 0.1) {
            p.stroke('#58C4DD');
            p.strokeWeight(1.5);
            p.line(body.position.x, body.position.y,
                body.position.x + body.velocity.x * 5,
                body.position.y + body.velocity.y * 5);
            p.noStroke();
        }

        // Thruster Visual
        if (activeTool === 'thruster' && draggedBody === body && p.mouseIsPressed) {
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

    // Reset Context
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
};

export const drawConstraints = (p: any, constraints: any[], lowPowerMode: boolean) => {
    // Calculate Viewport Bounds (approximate for constraints, check points)
    // Actually, constraints can bridge strict bounds. 
    // Optimization: Check if either point is in viewport?
    // Constraints are fewer than bodies usually, so strict culling less critical.

    p.strokeWeight(2);

    constraints.forEach((c: any) => {
        if (c.label === "Mouse Constraint") return;

        // Simple Viewport Check
        // We calculate positions anyway, so let's check bounds after calc?
        const posA = c.bodyA ? vectorAdd(c.bodyA.position, c.pointA) : c.pointA;
        const posB = c.bodyB ? vectorAdd(c.bodyB.position, c.pointB) : c.pointB;

        // Note: vectorAdd creates new objects. Optimization: Use temp vars if needed in tight loops.
        // But logic overhead vs allocation overhead in JS... allocation is often worse.

        p.stroke((c.render && c.render.strokeStyle) || '#999');
        const weight = (c.render && c.render.lineWidth) || 2;
        p.strokeWeight(weight);

        if (!lowPowerMode && c.render && c.render.type === 'spring') {
            // ... Spring drawing ...
            const dx = posB.x - posA.x;
            const dy = posB.y - posA.y;
            const len = Math.hypot(dx, dy) || 1;
            const steps = 12;

            p.noFill();
            p.beginShape();
            p.vertex(posA.x, posA.y);

            const nx = -dy / len;
            const ny = dx / len;

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
            p.line(posA.x, posA.y, posB.x, posB.y);
        }

        // ... Attachment points ...
    });
};

const vectorAdd = (v1: { x: number, y: number }, v2: { x: number, y: number }) => {
    return { x: v1.x + (v2.x || 0), y: v1.y + (v2.y || 0) };
};
