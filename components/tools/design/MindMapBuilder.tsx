'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Minus, Trash2, Move, Network, RefreshCcw, Download } from 'lucide-react';
import { toPng } from 'html-to-image';

// --- TYPES ---
interface Node {
    id: string;
    x: number;
    y: number;
    label: string;
    parentId: string | null;
    color: string;
}

const COLORS = [
    'bg-white border-slate-300', // Root
    'bg-blue-50 border-blue-200 text-blue-900',
    'bg-emerald-50 border-emerald-200 text-emerald-900',
    'bg-purple-50 border-purple-200 text-purple-900',
    'bg-rose-50 border-rose-200 text-rose-900',
    'bg-amber-50 border-amber-200 text-amber-900',
];

const INITIAL_NODES: Node[] = [
    { id: 'root', x: 0, y: 0, label: 'Central Idea', parentId: null, color: COLORS[0] }
];

export function MindMapBuilder() {
    const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    // VIEWPORT STATE (Custom, no library)
    const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
    const viewRef = useRef<HTMLDivElement>(null);
    const isPanning = useRef(false);
    const lastMouse = useRef({ x: 0, y: 0 });

    // Initial Load
    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            setView({ x: window.innerWidth / 2, y: window.innerHeight / 2, scale: 1 });
        }

        const saved = localStorage.getItem('mind-map-data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    const root = parsed.find(n => n.id === 'root');
                    // Fix huge offsets if coming from old version
                    if (root && (Math.abs(root.x) > 2000 || Math.abs(root.y) > 2000)) {
                        setNodes(INITIAL_NODES);
                    } else {
                        setNodes(parsed);
                    }
                } else {
                    setNodes(INITIAL_NODES);
                }
            } catch (e) {
                setNodes(INITIAL_NODES);
            }
        }
    }, []);

    // Auto Save
    useEffect(() => {
        if (isClient) {
            localStorage.setItem('mind-map-data', JSON.stringify(nodes));
        }
    }, [nodes, isClient]);

    // --- VIEWPORT CONTROLS ---

    const handleWheel = (e: React.WheelEvent) => {
        e.stopPropagation();
        const delta = -e.deltaY * 0.001;
        const newScale = Math.min(Math.max(view.scale + delta, 0.1), 4);
        setView(prev => ({ ...prev, scale: newScale }));
    };

    const handlePanStart = (e: React.MouseEvent) => {
        isPanning.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handlePanMove = (e: React.MouseEvent) => {
        if (!isPanning.current) return;
        const dx = e.clientX - lastMouse.current.x;
        const dy = e.clientY - lastMouse.current.y;
        setView(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
        lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handlePanEnd = () => {
        isPanning.current = false;
    };


    // --- NODE ACTIONS ---

    const addNode = (parentId: string) => {
        const parent = nodes.find(n => n.id === parentId);
        if (!parent) return;
        const siblingCount = nodes.filter(n => n.parentId === parentId).length;

        const newNode: Node = {
            id: crypto.randomUUID(),
            x: parent.x + (Math.random() > 0.5 ? 200 : -200),
            y: parent.y + (Math.random() * 100 - 50) + (siblingCount * 60),
            label: 'New Idea',
            parentId: parentId,
            color: COLORS[Math.min((GetDepth(parentId) + 1), COLORS.length - 1)]
        };
        setNodes([...nodes, newNode]);
        setSelectedId(newNode.id);
    };

    const deleteNode = (id: string) => {
        if (id === 'root') return;
        if (!confirm('Delete this node?')) return;

        const idsToDelete = new Set<string>();
        const findChildren = (pid: string) => {
            idsToDelete.add(pid);
            nodes.filter(n => n.parentId === pid).forEach(child => findChildren(child.id));
        };
        findChildren(id);
        setNodes(nodes.filter(n => !idsToDelete.has(n.id)));
        setSelectedId(null);
    };

    const updateNode = (id: string, updates: Partial<Node>) => {
        setNodes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
    };

    const GetDepth = (id: string): number => {
        let depth = 0;
        let current = nodes.find(n => n.id === id);
        while (current && current.parentId) {
            depth++;
            current = nodes.find(n => n.id === current?.parentId);
        }
        return depth;
    };

    // --- NODE DRAG LOGIC ---
    const [draggingId, setDraggingId] = useState<string | null>(null);

    const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setSelectedId(id);
        setDraggingId(id);
    };

    useEffect(() => {
        if (!draggingId) return;

        const handleMouseMove = (e: MouseEvent) => {
            updateNode(draggingId, {
                x: nodes.find(n => n.id === draggingId)!.x + (e.movementX / view.scale),
                y: nodes.find(n => n.id === draggingId)!.y + (e.movementY / view.scale)
            });
        };
        const handleMouseUp = () => setDraggingId(null);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingId, nodes, view.scale]);

    // --- KEYBOARD SHORTCUTS ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (document.activeElement?.tagName === 'INPUT') {
                if (e.key === 'Enter') (document.activeElement as HTMLInputElement).blur();
                return;
            }

            if (!selectedId) return;

            switch (e.key) {
                case 'Enter':
                    e.preventDefault();
                    addNode(selectedId);
                    break;
                case 'Delete':
                case 'Backspace':
                    deleteNode(selectedId);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    const current = nodes.find(n => n.id === selectedId);
                    if (current?.parentId) setSelectedId(current.parentId);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    const child = nodes.find(n => n.parentId === selectedId);
                    if (child) setSelectedId(child.id);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    navigateSibling(selectedId, -1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    navigateSibling(selectedId, 1);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, nodes]);

    const navigateSibling = (id: string, dir: number) => {
        const current = nodes.find(n => n.id === id);
        if (!current || !current.parentId) return;
        const siblings = nodes.filter(n => n.parentId === current.parentId);
        const currentIndex = siblings.findIndex(n => n.id === id);
        const nextIndex = (currentIndex + dir + siblings.length) % siblings.length;
        setSelectedId(siblings[nextIndex].id);
    };

    // --- EXPORT LOGIC ---
    const handleExport = async () => {
        const contentElement = document.getElementById('mind-map-content');
        if (!contentElement || nodes.length === 0) return;

        try {
            const xs = nodes.map(n => n.x);
            const ys = nodes.map(n => n.y);
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);

            const padding = 50;
            const width = maxX - minX + (padding * 2) + 200;
            const height = maxY - minY + (padding * 2) + 100;

            const dataUrl = await toPng(contentElement, {
                width: width,
                height: height,
                style: {
                    transform: `translate(${-minX + padding + 100}px, ${-minY + padding + 50}px)`,
                    transformOrigin: '0 0'
                },
                backgroundColor: '#ffffff',
                filter: (node) => {
                    return !node.classList?.contains('no-export');
                }
            });

            const link = document.createElement('a');
            link.download = 'mind-map.png';
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error(err);
            alert('Failed to export image');
        }
    };


    if (!isClient) return null;

    return (
        <div className="h-[calc(100vh-6rem)] w-full bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden relative group">

            {/* Toolbar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-full px-4 py-2 flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 mr-4 border-r border-slate-200 dark:border-slate-800 pr-4">
                    <Network className="w-4 h-4 text-emerald-500" />
                    MindMap
                </div>

                <button
                    onClick={() => addNode(selectedId || 'root')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors mr-2"
                    title="Add Node (Enter)"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add Node
                </button>

                <button
                    onClick={handleExport}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 hover:text-blue-500 transition-colors"
                    title="Export as PNG"
                >
                    <Download className="w-4 h-4" />
                </button>

                <button title="Clear Map" onClick={() => { if (confirm('Clear map?')) setNodes(INITIAL_NODES) }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Empty State Recovery */}
            {nodes.length === 0 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 text-center">
                    <button onClick={() => setNodes(INITIAL_NODES)} className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold shadow-xl flex items-center gap-2">
                        <Plus className="w-5 h-5" /> Start New Map
                    </button>
                </div>
            )}

            {/* Viewport Controls */}
            <div className="absolute bottom-6 left-6 z-50 flex flex-col gap-2">
                <button onClick={() => setView(v => ({ ...v, scale: v.scale + 0.2 }))} className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow border border-slate-200"><Plus className="w-5 h-5" /></button>
                <button onClick={() => setView(v => ({ ...v, scale: Math.max(0.1, v.scale - 0.2) }))} className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow border border-slate-200"><Minus className="w-5 h-5" /></button>
                <button
                    onClick={() => {
                        setNodes(INITIAL_NODES);
                        setView({ x: window.innerWidth / 2, y: window.innerHeight / 2, scale: 1 });
                    }}
                    className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow border border-slate-200 text-red-500"
                    title="Force Reset"
                >
                    <RefreshCcw className="w-5 h-5" />
                </button>
            </div>

            {/* CANVAS CONTAINER */}
            <div
                ref={viewRef}
                className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
                onMouseDown={handlePanStart}
                onMouseMove={handlePanMove}
                onMouseUp={handlePanEnd}
                onMouseLeave={handlePanEnd}
                onWheel={handleWheel}
                style={{
                    backgroundImage: `radial-gradient(circle, #94a3b8 1px, transparent 1px)`,
                    backgroundSize: `${40 * view.scale}px ${40 * view.scale}px`,
                    backgroundPosition: `${view.x}px ${view.y}px`
                }}
            >
                {/* TRANSFORM LAYER */}
                <div
                    id="mind-map-content"
                    style={{
                        transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
                        transformOrigin: '0 0',
                        width: '0px', height: '0px',
                        position: 'absolute', top: 0, left: 0
                    }}
                >
                    {/* CONNECTORS LAYER */}
                    <svg className="absolute top-[-50000px] left-[-50000px] w-[100000px] h-[100000px] pointer-events-none overflow-visible">
                        {nodes.map(node => {
                            if (!node.parentId) return null;
                            const parent = nodes.find(n => n.id === node.parentId);
                            if (!parent) return null;

                            const MAGIC_OFFSET = 50000;
                            const sx = parent.x + MAGIC_OFFSET;
                            const sy = parent.y + MAGIC_OFFSET;
                            const ex = node.x + MAGIC_OFFSET;
                            const ey = node.y + MAGIC_OFFSET;

                            const dist = Math.abs(ex - sx);
                            const cp1x = sx + (dist * 0.5);
                            const cp1y = sy;
                            const cp2x = ex - (dist * 0.5);
                            const cp2y = ey;

                            return (
                                <path
                                    key={`edge-${node.id}`}
                                    d={`M ${sx} ${sy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${ex} ${ey}`}
                                    fill="none"
                                    stroke="#cbd5e1"
                                    strokeWidth="2"
                                    className="dark:stroke-slate-700"
                                />
                            );
                        })}
                    </svg>

                    {/* NODES LAYER */}
                    {nodes.map(node => <div
                        key={node.id}
                        onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                        className={`absolute px-6 py-4 rounded-2xl shadow-lg border-2 cursor-pointer transition-shadow select-none hover:shadow-xl active:scale-100 flex items-center justify-center min-w-[150px] max-w-[400px] text-center group
                                ${node.color}
                                ${selectedId === node.id ? 'ring-4 ring-blue-500/20 ring-offset-2' : ''}
                            `}
                        style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
                    >
                        <textarea
                            value={node.label}
                            onChange={(e) => {
                                updateNode(node.id, { label: e.target.value });
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            ref={(ref) => {
                                if (ref) {
                                    ref.style.height = 'auto';
                                    ref.style.height = `${ref.scrollHeight}px`;
                                }
                            }}
                            className="bg-transparent border-none text-center outline-none w-full font-bold inherit-color pointer-events-auto resize-none overflow-hidden min-h-[1.5em]"
                            onMouseDown={e => e.stopPropagation()}
                            rows={1}
                        />

                        {/* Actions & Tools */}
                        <div className={`absolute -right-14 top-1/2 -translate-y-1/2 flex flex-col gap-2 transition-opacity duration-200 no-export ${selectedId === node.id ? 'opacity-100 z-50' : 'opacity-0 group-hover:opacity-100'}`}>
                            <button onMouseDown={(e) => { e.stopPropagation(); addNode(node.id); }} className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow hover:scale-110" title="Add Child (Enter)">
                                <Plus className="w-4 h-4" />
                            </button>
                            {node.parentId && (
                                <button onMouseDown={(e) => { e.stopPropagation(); deleteNode(node.id); }} className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:scale-110" title="Delete (Del)">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Color Picker (Only when selected) */}
                        {selectedId === node.id && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-1 bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 z-50 no-export">
                                {COLORS.map((c, i) => (
                                    <button
                                        key={i}
                                        onMouseDown={(e) => { e.stopPropagation(); updateNode(node.id, { color: c }); }}
                                        className={`w-4 h-4 rounded-full border border-slate-300 ${c.split(' ')[0]} hover:scale-125 transition-transform`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
}

