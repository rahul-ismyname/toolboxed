'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useMatterEngine } from './hooks/useMatterEngine';
import { useP5Renderer } from './hooks/useP5Renderer';
import { TopBar } from './components/hud/TopBar';
import { BottomDock } from './components/hud/BottomDock';
import { PropertiesPanel } from './components/hud/PropertiesPanel';
import { PHYSICS_TEMPLATES } from '@/lib/sim-templates';

interface BodyData {
    id: number;
    color: string;
    isStatic: boolean;
    angle: number;
    velocity: { x: number; y: number };
    acceleration: { x: number; y: number };
    restitution: number;
    friction: number;
}

export default function PhysicsSim() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Global state
    const [paused, setPaused] = useState(true);
    const [gravity, setGravity] = useState(1);
    const [bgColor, setBgColor] = useState('#f8f8f8');
    const [showVectors, setShowVectors] = useState(true);
    const [activeTemplateId, setActiveTemplateId] = useState(PHYSICS_TEMPLATES[0].id);
    const [selectedBodyId, setSelectedBodyId] = useState<number | null>(null);
    const [selectedBodyData, setSelectedBodyData] = useState<BodyData | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [spawnSize, setSpawnSize] = useState(30);

    // Physics engine hook
    const engine = useMatterEngine({ gravity });

    // Initialize engine
    useEffect(() => {
        const init = async () => {
            await engine.initEngine();
            engine.loadTemplate(PHYSICS_TEMPLATES[0]);
            setIsLoaded(true);
        };
        init();
    }, []);

    // P5 Renderer hook
    const renderer = useP5Renderer({
        containerRef,
        engine,
        bgColor,
        showVectors,
        paused,
        selectedBodyId,
        onSelectBody: setSelectedBodyId,
        activeTool,
        spawnSize,
    });

    // Refresh selected body data periodically
    useEffect(() => {
        if (!isLoaded || selectedBodyId === null) {
            setSelectedBodyData(null);
            return;
        }

        const interval = setInterval(() => {
            const body = engine.getBodyById(selectedBodyId);
            if (body) {
                // Only update if we are not editing locally to avoid flicker
                // Note: ObjectInspector has its own local state, but we provide the source of truth
                setSelectedBodyData({
                    id: body.id,
                    color: body.render?.fillStyle || '#E8E8E8',
                    isStatic: body.isStatic,
                    angle: (body.angle * 180) / Math.PI,
                    velocity: { x: body.velocity.x, y: body.velocity.y },
                    acceleration: body.plugin?.acceleration || { x: 0, y: 0 },
                    restitution: body.restitution,
                    friction: body.friction,
                });
            } else {
                // Body likely deleted
                setSelectedBodyId(null);
                setSelectedBodyData(null);
            }
        }, 200); // 5Hz is enough for HUD refresh

        return () => clearInterval(interval);
    }, [isLoaded, selectedBodyId, engine]);

    // Handlers
    const handleGravityChange = useCallback((g: number) => {
        setGravity(g);
        engine.setGravity(g);
    }, [engine]);

    const handleLoadTemplate = useCallback((templateId: string) => {
        const template = PHYSICS_TEMPLATES.find(t => t.id === templateId);
        if (template) {
            engine.loadTemplate(template);
            setActiveTemplateId(templateId);
            setPaused(true);
            setSelectedBodyId(null);
        }
    }, [engine]);

    const handleReset = useCallback(() => {
        handleLoadTemplate(activeTemplateId);
    }, [handleLoadTemplate, activeTemplateId]);

    const handleToolSelect = useCallback((tool: string, size?: number) => {
        const isNewTool = activeTool !== tool;
        setActiveTool(current => current === tool ? null : tool);
        if (size) setSpawnSize(size);

        console.log('Tool Selected:', tool, 'Active Size:', size || spawnSize, 'Is New:', isNewTool);

        // Immediate spawn if a shape tool is selected
        if (isNewTool && ['box', 'circle', 'triangle', 'polygon'].includes(tool)) {
            const centerX = containerRef.current ? containerRef.current.clientWidth / 2 : 400;
            const centerY = containerRef.current ? containerRef.current.clientHeight / 2 : 300;
            console.log('Immediate summon at center:', centerX, centerY);
            engine.spawnBody(tool as any, { x: centerX, y: centerY }, size || spawnSize);
        }
    }, [activeTool, spawnSize, engine]);

    const handleUpdateBody = useCallback((id: number, updates: Partial<BodyData>) => {
        engine.updateBody(id, updates);
        // Update local state immediately for better responsiveness
        if (selectedBodyId === id && selectedBodyData) {
            setSelectedBodyData({ ...selectedBodyData, ...updates });
        }
    }, [engine, selectedBodyId, selectedBodyData]);

    const handleDeleteBody = useCallback((id: number) => {
        engine.deleteBody(id);
        setSelectedBodyId(null);
        setSelectedBodyData(null);
    }, [engine]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input
            if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

            switch (e.key.toLowerCase()) {
                case ' ':
                    e.preventDefault(); // Prevent scroll
                    setPaused(p => !p);
                    break;
                case 'r':
                    handleReset();
                    break;
                case 'backspace':
                case 'delete':
                    if (selectedBodyId !== null) handleDeleteBody(selectedBodyId);
                    break;
                case 'b': handleToolSelect('box'); break;
                case 'c': handleToolSelect('circle'); break;
                case 't': handleToolSelect('triangle'); break;
                case 'p': handleToolSelect('polygon'); break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleReset, handleToolSelect, handleDeleteBody, selectedBodyId]);

    return (
        <div
            className="relative w-full h-[85vh] rounded-3xl overflow-hidden border-8 border-white dark:border-slate-900 shadow-2xl"
            style={{ backgroundColor: bgColor }}
        >
            {/* Canvas Container */}
            <div ref={containerRef} className="absolute inset-0 cursor-crosshair">
                {!isLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <div className="text-indigo-500 font-black uppercase tracking-widest text-xs">
                            Initializing Physics...
                        </div>
                    </div>
                )}
            </div>

            {/* HUD Overlay */}
            {isLoaded && (
                <>
                    <TopBar
                        activeTemplateId={activeTemplateId}
                        onLoadTemplate={handleLoadTemplate}
                        gravity={gravity}
                        onGravityChange={handleGravityChange}
                        showVectors={showVectors}
                        onShowVectorsChange={setShowVectors}
                        bgColor={bgColor}
                        onBgColorChange={setBgColor}
                    />

                    <BottomDock
                        paused={paused}
                        onPausedChange={setPaused}
                        onReset={handleReset}
                        activeTool={activeTool}
                        onSelectTool={handleToolSelect}
                    />

                    <PropertiesPanel
                        selectedBody={selectedBodyData}
                        onUpdateBody={handleUpdateBody}
                        onDeleteBody={handleDeleteBody}
                        onClose={() => setSelectedBodyId(null)}
                    />
                </>
            )}
        </div>
    );
}
