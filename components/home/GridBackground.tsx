'use client';

import { useEffect, useRef } from 'react';

export function GridBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let offset = 0;

        const gridSize = 40; // Size of grid squares
        const perspective = 300; // Fake perspective factor

        const draw = () => {
            // Clear with slight fade for trail effect if desired, or solid clear for perf
            ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#020617' : '#ffffff';
            ctx.fillRect(0, 0, width, height);

            const isDark = document.documentElement.classList.contains('dark');
            ctx.strokeStyle = isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)'; // Emerald tint
            ctx.lineWidth = 1;

            // Draw Vertical Lines
            for (let x = 0; x <= width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // Draw Moving Horizontal Lines
            for (let y = offset; y <= height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            offset = (offset + 0.5) % gridSize; // Speed of movement

            // Add a vignette/fade mask
            const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(1, isDark ? '#020617' : '#ffffff');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            requestAnimationFrame(draw);
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        const animationId = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ opacity: 0.8 }}
        />
    );
}
