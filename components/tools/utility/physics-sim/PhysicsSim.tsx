'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useMatterEngine } from './hooks/useMatterEngine';
import { useP5Renderer } from './hooks/useP5Renderer';
import { TopBar } from './components/hud/TopBar';
import { BottomDock } from './components/hud/BottomDock';
import { PropertiesPanel } from './components/hud/PropertiesPanel';
import { ObjectList } from './components/hud/ObjectList';
import { StatsMonitor } from './components/hud/StatsMonitor';
import { PHYSICS_TEMPLATES } from '@/lib/sim-templates';
import { Settings2 } from 'lucide-react';

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
    const canvasContainerRef = useRef<HTMLDivElement>(null);

    // Global state
    const [paused, setPaused] = useState(true);
    const [gravity, setGravity] = useState({ x: 0, y: 1 });
    const [bgColor, setBgColor] = useState('#f8f8f8');
    const [showVectors, setShowVectors] = useState(true);
    const [activeTemplateId, setActiveTemplateId] = useState(PHYSICS_TEMPLATES[0].id);
    const [selectedBodyId, setSelectedBodyId] = useState<number | null>(null);
    const [selectedBodyData, setSelectedBodyData] = useState<BodyData | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [spawnSize, setSpawnSize] = useState(30);
    const [showHUD, setShowHUD] = useState(true);
    const [showObjectList, setShowObjectList] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [timeScale, setTimeScale] = useState(1);

    // Physics engine hook
    const engine = useMatterEngine({ gravity, timeScale });

    // Initialize engine
    useEffect(() => {
        const init = async () => {
            await engine.initEngine();
            engine.loadTemplate(PHYSICS_TEMPLATES[0]);
            setIsLoaded(true);
        };
        init();
    }, []);

    const handleToolUsed = useCallback(() => setActiveTool(null), []);

    // P5 Renderer hook
    const renderer = useP5Renderer({
        containerRef: canvasContainerRef,
        engine,
        bgColor,
        showVectors,
        paused,
        selectedBodyId,
        onSelectBody: setSelectedBodyId,
        activeTool,
        spawnSize,
        isFullscreen,
        onToolUsed: handleToolUsed,
    });

    // Handle FullScreen change
    useEffect(() => {
        const handleFSChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFSChange);
        return () => document.removeEventListener('fullscreenchange', handleFSChange);
    }, []);

    // Refresh selected body data periodically
    useEffect(() => {
        if (!isLoaded || selectedBodyId === null) {
            setSelectedBodyData(null);
            return;
        }

        const interval = setInterval(() => {
            const body = engine.getBodyById(selectedBodyId);
            if (body) {
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
                setSelectedBodyId(null);
                setSelectedBodyData(null);
            }
        }, 200);

        return () => clearInterval(interval);
    }, [isLoaded, selectedBodyId, engine]);

    // Handlers
    const handleGravityChange = useCallback((g: { x: number, y: number }) => {
        setGravity(g);
        engine.setGravity(g);
    }, [engine]);

    const handleTimeScaleChange = useCallback((scale: number) => {
        setTimeScale(scale);
        engine.setTimeScale(scale);
    }, [engine]);

    const handleSaveScene = useCallback(() => {
        const json = engine.serializeWorld();
        if (json) {
            localStorage.setItem('physics-sim-save', json);
            // Could add toast notification here
            console.log('Scene saved');
        }
    }, [engine]);

    const handleLoadScene = useCallback(() => {
        const json = localStorage.getItem('physics-sim-save');
        if (json) {
            engine.loadWorld(json);
            renderer.clearTrails();
            setPaused(true); // Pause on load to give user control
            setActiveTemplateId(''); // Clear active template selection as we loaded custom scene
        } else {
            console.log('No saved scene found');
        }
    }, [engine, renderer]);

    const handleLoadTemplate = useCallback((templateId: string) => {
        const template = PHYSICS_TEMPLATES.find(t => t.id === templateId);
        if (template) {
            engine.loadTemplate(template);
            renderer.clearTrails();
            setActiveTemplateId(templateId);
            setPaused(true);
            setSelectedBodyId(null);
        }
    }, [engine, renderer]);

    const handleReset = useCallback(() => {
        handleLoadTemplate(activeTemplateId);
        renderer.clearTrails();
    }, [handleLoadTemplate, activeTemplateId, renderer]);

    const handleToolSelect = useCallback((tool: string, size?: number) => {
        setActiveTool(current => current === tool ? null : tool);
        if (size) setSpawnSize(size);
    }, []);

    const handleUpdateBody = useCallback((id: number, updates: Partial<BodyData>) => {
        engine.updateBody(id, updates);
        if (selectedBodyId === id && selectedBodyData) {
            setSelectedBodyData({ ...selectedBodyData, ...updates });
        }
    }, [engine, selectedBodyId, selectedBodyData]);

    const handleDeleteBody = useCallback((id: number) => {
        engine.deleteBody(id);
        setSelectedBodyId(null);
        setSelectedBodyData(null);
    }, [engine]);

    const toggleFullScreen = useCallback(() => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }, []);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

            switch (e.key.toLowerCase()) {
                case ' ':
                    e.preventDefault();
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
                case 'h':
                    e.preventDefault();
                    setShowHUD(prev => !prev);
                    break;
                case 'l':
                    e.preventDefault();
                    setShowObjectList(prev => !prev);
                    break;
                case 'f':
                    e.preventDefault();
                    toggleFullScreen();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleReset, handleToolSelect, handleDeleteBody, selectedBodyId, toggleFullScreen]);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${isFullscreen
                ? 'fixed inset-0 w-screen h-screen z-[100] rounded-none border-0 bg-slate-50 dark:bg-slate-900'
                : 'w-full h-[85vh] rounded-3xl border-8 border-white dark:border-slate-900 shadow-2xl'
                }`}
            style={{ backgroundColor: bgColor }}
        >
            {/* Canvas Container */}
            <div ref={canvasContainerRef} className="absolute inset-0 cursor-crosshair">
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
                    {showHUD && (
                        <TopBar
                            activeTemplateId={activeTemplateId}
                            onLoadTemplate={handleLoadTemplate}
                            gravity={gravity}
                            onGravityChange={handleGravityChange}
                            showVectors={showVectors}
                            onShowVectorsChange={setShowVectors}
                            bgColor={bgColor}
                            onBgColorChange={setBgColor}
                            onToggleHUD={() => setShowHUD(false)}
                            onToggleFullScreen={toggleFullScreen}
                            isFullscreen={isFullscreen}
                            showObjectList={showObjectList}
                            onToggleObjectList={() => setShowObjectList(!showObjectList)}
                            timeScale={timeScale}
                            onTimeScaleChange={handleTimeScaleChange}
                            onSaveScene={handleSaveScene}
                            onLoadScene={handleLoadScene}
                        />
                    )}

                    {!showHUD && (
                        <button
                            onClick={() => setShowHUD(true)}
                            className="absolute top-4 left-4 z-50 p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 text-slate-500 hover:text-indigo-500 transition-all pointer-events-auto"
                            title="Show UI (H)"
                        >
                            <Settings2 className="w-6 h-6" />
                        </button>
                    )}

                    {showHUD && (
                        <StatsMonitor engine={engine} bodyCount={engine.getAllBodies().length} />
                    )}

                    {showHUD && (
                        <BottomDock
                            paused={paused}
                            onPausedChange={setPaused}
                            onReset={handleReset}
                            activeTool={activeTool}
                            onSelectTool={handleToolSelect}
                            onClearTrails={renderer.clearTrails}
                        />
                    )}

                    {showObjectList && showHUD && (
                        <ObjectList
                            bodies={engine.getAllBodies()}
                            selectedBodyId={selectedBodyId}
                            onSelectBody={setSelectedBodyId}
                            onDeleteBody={engine.deleteBody}
                        />
                    )}

                    {selectedBodyId && showHUD && (
                        <PropertiesPanel
                            selectedBody={selectedBodyData}
                            onUpdateBody={handleUpdateBody}
                            onDeleteBody={handleDeleteBody}
                            onClose={() => setSelectedBodyId(null)}
                        />
                    )}
                </>
            )}
        </div>
    );
}
