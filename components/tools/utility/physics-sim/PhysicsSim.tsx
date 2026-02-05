'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMatterEngine } from './hooks/useMatterEngine';
import { useP5Renderer } from './hooks/useP5Renderer';
import { TopBar } from './components/hud/TopBar';
import { BottomDock } from './components/hud/BottomDock';
import { PropertiesPanel } from './components/hud/PropertiesPanel';
import { ObjectList } from './components/hud/ObjectList';
import { StatsMonitor } from './components/hud/StatsMonitor';
import { PREFABS } from '@/lib/prefabs';
import { savePhysicsScene, getPhysicsScene } from '@/lib/actions';
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
    density: number;
    material?: string;
    width: number;
    height: number;
    bodyType?: string;
    circleRadius?: number;
    vars?: Record<string, number>;
}

export default function PhysicsSim() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    // Global state
    const [paused, setPaused] = useState(true);
    const [gravity, setGravity] = useState({ x: 0, y: 1 });
    const [bgColor, setBgColor] = useState('#f8f8f8');
    const [showVectors, setShowVectors] = useState(true);
    const [selectedBodyId, setSelectedBodyId] = useState<number | null>(null);
    const [selectedBodyData, setSelectedBodyData] = useState<BodyData | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [spawnSize, setSpawnSize] = useState(30);
    const [showHUD, setShowHUD] = useState(true);
    const [showObjectList, setShowObjectList] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [timeScale, setTimeScale] = useState(1);
    const [activeMaterial, setActiveMaterial] = useState('DEFAULT');
    const [multiSpawnMode, setMultiSpawnMode] = useState(false);
    const [activeWalls, setActiveWalls] = useState({ top: true, bottom: true, left: true, right: true });
    const [vacuumMode, setVacuumMode] = useState(false);
    const [showGrid, setShowGrid] = useState(false);

    // Physics engine hook
    const engine = useMatterEngine({ gravity, timeScale });

    // Initialize engine
    useEffect(() => {
        const init = async () => {
            await engine.initEngine();
            setIsLoaded(true);
        };
        init();
    }, []);

    const handleToolUsed = useCallback(() => {
        if (!multiSpawnMode) {
            setActiveTool(null);
        }
    }, [multiSpawnMode]);

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
        activeMaterial,
        activeWalls,
        showGrid
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
                    density: body.density,
                    material: body.plugin?.materialKey,
                    width: body.bounds.max.x - body.bounds.min.x,
                    height: body.bounds.max.y - body.bounds.min.y,
                    bodyType: (body as any).bodyType,
                    circleRadius: (body as any).circleRadius,
                    vars: (body as any).vars || {}
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

    const handleVacuumModeChange = useCallback((enabled: boolean) => {
        setVacuumMode(enabled);
        engine.setVacuumMode(enabled);
        if (enabled) {
            toast.info('Vacuum Mode: Air friction disabled');
        }
    }, [engine]);

    const handleSaveScene = useCallback(() => {
        const json = engine.serializeWorld();
        if (json) {
            localStorage.setItem('physics-sim-save', json);
            toast.success('Scene saved locally');
        }
    }, [engine]);

    const handleShareScene = useCallback(async () => {
        const json = engine.serializeWorld();
        if (!json) return;

        const toastId = toast.loading('Creating share link...');
        try {
            const id = await savePhysicsScene(json);
            const url = `${window.location.origin}${window.location.pathname}?scene=${id}`;
            await navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard!', { id: toastId });
            router.push(`?scene=${id}`, { scroll: false });
        } catch (error) {
            console.error(error);
            toast.error('Failed to create share link', { id: toastId });
        }
    }, [engine, router]);

    const handleLoadScene = useCallback(() => {
        const json = localStorage.getItem('physics-sim-save');
        if (json) {
            engine.loadWorld(json);
            renderer.clearTrails();
            setPaused(true); // Pause on load to give user control
            toast.success('Loaded local save');
        } else {
            toast.info('No local save found');
        }
    }, [engine, renderer]);

    // Load from URL
    useEffect(() => {
        const sceneId = searchParams.get('scene');
        if (sceneId && isLoaded) {
            const load = async () => {
                const toastId = toast.loading('Loading shared scene...');
                try {
                    const data = await getPhysicsScene(sceneId);
                    if (data) {
                        engine.loadWorld(data);
                        renderer.clearTrails();
                        setPaused(true);
                        toast.success('Scene loaded', { id: toastId });
                    } else {
                        toast.error('Scene not found', { id: toastId });
                    }
                } catch (e) {
                    toast.error('Failed to load scene', { id: toastId });
                }
            };
            load();
        }
    }, [searchParams, isLoaded, engine, renderer]);

    const handleSpawnPrefab = useCallback((prefabId: string) => {
        const prefab = PREFABS.find(p => p.id === prefabId);
        if (!prefab) return;

        const { bodies, constraints, rules } = prefab.spawn(400, 300); // Default spawn location
        const idMap = new Map();

        // 1. Spawn Bodies
        bodies.forEach(b => {
            const body = engine.spawnBody(b.type, { ...b.options, x: b.x, y: b.y }, b.size);
            if (body && b.options?.id) {
                idMap.set(b.options.id, body);
            }
        });

        // 2. Add Constraints
        constraints?.forEach(c => {
            const bodyA = c.bodyAId ? idMap.get(c.bodyAId) : null;
            const bodyB = c.bodyBId ? idMap.get(c.bodyBId) : null;

            // Matter.js expects bodies directly for constraints
            engine.addRawConstraint({
                bodyA,
                bodyB,
                pointA: c.pointA,
                pointB: c.pointB,
                stiffness: c.stiffness ?? 1,
                length: c.length ?? 0,
                render: { strokeStyle: '#333', lineWidth: 2 }
            });
        });

        // 3. Add Rules
        rules?.forEach(r => {
            // Remap targetBodyId if necessary
            const actualTargetId = r.targetBodyId ? idMap.get(r.targetBodyId)?.id : undefined;
            engine.addRule({
                ...r,
                targetBodyId: actualTargetId
            });
        });

        toast.success(`Spawned ${prefab.name}`);
    }, [engine]);

    const handleReset = useCallback(() => {
        engine.loadWorld(JSON.stringify({ bodies: [], constraints: [], gravity: { x: 0, y: 1 } }));
        renderer.clearTrails();
        toast.info('Scene Reset');
    }, [engine, renderer]);

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
            <div ref={canvasContainerRef} className={`absolute inset-0 ${activeTool ? 'cursor-crosshair' : ''}`}>
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
                            onSpawnPrefab={handleSpawnPrefab}
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
                            onShare={handleShareScene}
                            activeWalls={activeWalls}
                            onActiveWallsChange={setActiveWalls}
                            vacuumMode={vacuumMode}
                            onVacuumModeChange={handleVacuumModeChange}
                            onClearConstraints={() => {
                                engine.clearAllConstraints();
                                toast.success('Cleared all constraints');
                            }}
                            onFreezeAll={() => {
                                engine.freezeAllBodies();
                                toast.info('Froze all objects');
                            }}
                            showGrid={showGrid}
                            onShowGridChange={setShowGrid}
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
                            activeMaterial={activeMaterial}
                            onSelectMaterial={setActiveMaterial}
                            multiSpawnMode={multiSpawnMode}
                            onMultiSpawnModeChange={setMultiSpawnMode}
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
                            addRule={engine.addRule}
                            removeRule={engine.removeRule}
                            updateRule={engine.updateRule}
                            clearBodyRules={engine.clearBodyRules}
                            getAllRules={engine.getAllRules}
                        />
                    )}
                </>
            )}
        </div>
    );
}
