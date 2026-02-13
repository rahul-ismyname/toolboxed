import type { MatterEngineAPI } from './useMatterEngine';

export const drawGrid = (p: any, width: number, height: number, viewportScale: number) => {
    const gridSize = 50;
    p.stroke(0, 0, 0, 10);
    p.strokeWeight(1);

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
        p.line(x, 0, x, height);
        if (x % 100 === 0) {
            p.noStroke();
            p.fill(0, 0, 0, 30);
            p.textSize(8);
            p.text(x, x + 2, 10);
            p.stroke(0, 0, 0, 10);
        }
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
        p.line(0, y, width, y);
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
    p.textAlign(p.LEFT, p.BASELINE);
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
    // 1. Draw Trails
    if (!lowPowerMode) {
        trailHistory.forEach((history, bodyId) => {
            const body = bodies.find(b => b.id === bodyId);
            if (!body) return;

            const colorStr = (body.render && body.render.fillStyle) || '#E8E8E8';
            const baseColor = p.color(colorStr);

            p.noFill();
            p.stroke(p.red(baseColor), p.green(baseColor), p.blue(baseColor), 100);
            p.strokeWeight(2);
            p.beginShape();
            history.forEach((pos: any) => p.vertex(pos.x, pos.y));
            p.endShape();
        });
    }

    // 2. Draw Bodies
    p.noStroke();
    bodies.forEach((body: any) => {
        // Update trails
        if (!lowPowerMode && !paused && !body.isStatic && body.speed > 0.1) {
            if (!trailHistory.has(body.id)) trailHistory.set(body.id, []);
            const history = trailHistory.get(body.id)!;
            history.push({ x: body.position.x, y: body.position.y });
            if (history.length > MAX_TRAIL_LENGTH) history.shift();
        }

        const fillColor = (body.render && body.render.fillStyle) || '#E8E8E8';

        // VISUAL POLISH: Gradient Fill
        if (!lowPowerMode && !body.isStatic) {
            const ctx = p.drawingContext;
            // Create local gradient relative to body center? Hard with vertices.
            // Easier: Radial gradient from center
            const gradient = ctx.createRadialGradient(
                body.position.x, body.position.y, 0,
                body.position.x, body.position.y, Math.max(50, body.bounds.max.x - body.bounds.min.x)
            );

            // Parse color to add lightness? 
            // Just use the fill color as base and go to darker
            gradient.addColorStop(0, fillColor);
            gradient.addColorStop(1, p.color(p.red(p.color(fillColor)) * 0.8, p.green(p.color(fillColor)) * 0.8, p.blue(p.color(fillColor)) * 0.8).toString());

            ctx.fillStyle = gradient;

            // Shadow
            ctx.shadowColor = 'rgba(0,0,0,0.2)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
        } else {
            p.fill(fillColor);
            p.drawingContext.shadowBlur = 0;
        }

        p.beginShape();
        body.vertices.forEach((v: any) => p.vertex(v.x, v.y));
        p.endShape(p.CLOSE);

        // Reset shadow
        p.drawingContext.shadowBlur = 0;

        // Selection highlight
        if (selectedBodyId === body.id) {
            if (lowPowerMode) {
                p.stroke('#6366f1');
                p.strokeWeight(2);
                p.noFill();
                p.beginShape();
                body.vertices.forEach((v: any) => p.vertex(v.x, v.y));
                p.endShape(p.CLOSE);
                p.noStroke();
            } else {
                const pulse = (Math.sin(p.frameCount * 0.1) * 0.5 + 0.5);
                p.stroke(99, 102, 241, 50 + pulse * 100);
                p.strokeWeight(4 + pulse * 6);
                p.noFill();
                p.beginShape();
                body.vertices.forEach((v: any) => p.vertex(v.x, v.y));
                p.endShape(p.CLOSE);

                p.stroke('#6366f1');
                p.strokeWeight(2);
                p.beginShape();
                body.vertices.forEach((v: any) => p.vertex(v.x, v.y));
                p.endShape(p.CLOSE);
                p.noStroke();
            }
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
};

export const drawConstraints = (p: any, constraints: any[], lowPowerMode: boolean) => {
    constraints.forEach((c: any) => {
        if (c.label === "Mouse Constraint") return;

        const posA = c.bodyA ? vectorAdd(c.bodyA.position, c.pointA) : c.pointA;
        const posB = c.bodyB ? vectorAdd(c.bodyB.position, c.pointB) : c.pointB;

        p.stroke((c.render && c.render.strokeStyle) || '#999');
        const weight = (c.render && c.render.lineWidth) || 2;
        p.strokeWeight(weight);

        if (!lowPowerMode && c.render && c.render.type === 'spring') {
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
            p.line(posA.x, posA.y, posB.x, posB.y);
        }

        // Attachment points
        if (c.render && c.render.strokeStyle === '#EF4444') {
            p.fill('#475569');
            p.circle(posA.x, posA.y, 8);
            p.fill('#94A3B8');
            p.circle(posA.x, posA.y, 4);
        }
    });
};

// Simple helper to avoid importing Matter everywhere if not needed, or pass Matter in
const vectorAdd = (v1: { x: number, y: number }, v2: { x: number, y: number }) => {
    return { x: v1.x + (v2.x || 0), y: v1.y + (v2.y || 0) };
};
