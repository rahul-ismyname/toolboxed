'use client';

import { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import {
    Network, Download, Image as ImageIcon, RotateCcw, HelpCircle,
    ZoomIn, ZoomOut, Move, LayoutTemplate, Share2, Maximize2, Minimize2, Check
} from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useSearchParams, useRouter } from 'next/navigation';

const TEMPLATES = [
    {
        name: 'Flowchart',
        code: `graph TD
  A[Start] --> B{Is it working?}
  B -- Yes --> C[Great!]
  B -- No --> D[Debug]
  D --> B`
    },
    {
        name: 'Sequence',
        code: `sequenceDiagram
  participant Alice
  participant Bob
  Alice->>John: Hello John, how are you?
  loop Healthcheck
      John->>John: Fight against hypochondria
  end
  Note right of John: Rational thoughts <br/>prevail!
  John-->>Alice: Great!
  John->>Bob: How about you?
  Bob-->>John: Jolly good!`
    },
    {
        name: 'Gantt',
        code: `gantt
  title A Gantt Diagram
  dateFormat  YYYY-MM-DD
  section Section
  A task           :a1, 2014-01-01, 30d
  Another task     :after a1  , 20d
  section Another
  Task in sec      :2014-01-12  , 12d`
    },
    {
        name: 'Class',
        code: `classDiagram
  Class01 <|-- AveryLongClass : Cool
  Class03 *-- Class04
  Class05 o-- Class06
  Class07 .. Class08
  Class09 --> C2 : Where am i?
  Class09 --* C3
  Class09 --|> Class07
  Class07 : equals()
  Class07 : Object[] elementData
  Class01 : size()
  Class01 : int chimp
  Class01 : int gorilla`
    },
    {
        name: 'State',
        code: `stateDiagram-v2
  [*] --> Still
  Still --> [*]
  Still --> Moving
  Moving --> Still
  Moving --> Crash
  Crash --> [*]`
    },
    {
        name: 'ER Diagram',
        code: `erDiagram
  CUSTOMER ||--o{ ORDER : places
  ORDER ||--|{ LINE-ITEM : contains
  CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`
    }
];

const THEMES = [
    { value: 'default', label: 'Default' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'dark', label: 'Dark' },
    { value: 'forest', label: 'Forest' },
    { value: 'base', label: 'Base' },
];

// Helper for Base64 URL safe encoding
const encode = (str: string) => {
    try {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode(parseInt(p1, 16));
            }));
    } catch (e) { return ''; }
};

const decode = (str: string) => {
    try {
        return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    } catch (e) { return ''; }
};

export function MermaidEditor() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [input, setInput] = useState('');
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState('default');
    const [isInitialized, setIsInitialized] = useState(false);
    const [copiedShare, setCopiedShare] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Load Logic
    useEffect(() => {
        const codeParam = searchParams.get('code');
        const savedCode = localStorage.getItem('mermaid-code');

        let initialCode = TEMPLATES[0].code;

        if (codeParam) {
            const decoded = decode(codeParam);
            if (decoded) initialCode = decoded;
        } else if (savedCode) {
            initialCode = savedCode;
        }

        setInput(initialCode);
        setIsLoaded(true);

        mermaid.initialize({
            startOnLoad: false,
            theme: theme as any,
            securityLevel: 'loose',
            fontFamily: 'inherit',
        });
        setIsInitialized(true);
    }, []);

    // Theme Update
    useEffect(() => {
        if (!isLoaded) return;
        mermaid.initialize({
            startOnLoad: false,
            theme: theme as any,
            securityLevel: 'loose',
            fontFamily: 'inherit',
        });
        // Force re-render by toggling internal state slightly if needed, 
        // or just rely on the next render pass which the dependency array handles indirectly 
        // if we re-trigger renderDiagram.
    }, [theme, isLoaded]);

    // Auto-Save & Render
    useEffect(() => {
        if (!isInitialized || !isLoaded) return;

        // Auto-save
        localStorage.setItem('mermaid-code', input);

        const renderDiagram = async () => {
            try {
                const id = `mermaid-${Date.now()}`;
                const { svg } = await mermaid.render(id, input);
                setSvg(svg);
                setError(null);
            } catch (e: any) {
                setError(e.message);
            }
        };

        const timeout = setTimeout(() => {
            if (input.trim()) renderDiagram();
        }, 600);

        return () => clearTimeout(timeout);
    }, [input, isInitialized, theme, isLoaded]);

    const handleShare = () => {
        const code = encode(input);
        const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}?code=${code}`;
        navigator.clipboard.writeText(url);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);

        // Update URL without reload
        router.push(`?code=${code}`, { scroll: false });
    };

    const handleDownload = (format: 'svg' | 'png') => {
        if (!svg) return;

        if (format === 'svg') {
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `diagram-${Date.now()}.svg`;
            a.click();
            URL.revokeObjectURL(url);
        } else {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            const parser = new DOMParser();
            const doc = parser.parseFromString(svg, 'image/svg+xml');
            const svgElement = doc.documentElement;
            const width = parseInt(svgElement.getAttribute('width') || '1200');
            const height = parseInt(svgElement.getAttribute('height') || '800');

            canvas.width = width * 2;
            canvas.height = height * 2;

            if (ctx) {
                ctx.fillStyle = theme === 'dark' ? '#1e293b' : 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.scale(2, 2);
            }

            const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    const pngUrl = canvas.toDataURL('image/png');
                    const a = document.createElement('a');
                    a.href = pngUrl;
                    a.download = `diagram-${Date.now()}.png`;
                    a.click();
                    URL.revokeObjectURL(url);
                }
            };
            img.src = url;
        }
    };

    if (!isLoaded) return null; // Prevent hydration mismatch

    return (
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-900 p-6' : 'h-[calc(100vh-12rem)] min-h-[600px]'}`}>

            {/* Templates Sidebar (Hidden in Fullscreen) */}
            {!isFullscreen && (
                <div className="hidden lg:flex lg:col-span-2 flex-col gap-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 overflow-y-auto">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <LayoutTemplate className="w-3 h-3" />
                        Templates
                    </div>
                    {TEMPLATES.map(t => (
                        <button
                            key={t.name}
                            onClick={() => setInput(t.code)}
                            className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-500 transition-colors"
                        >
                            {t.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Editor Panel (Hidden in Fullscreen) */}
            {!isFullscreen && (
                <div className="lg:col-span-4 flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50">
                        <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
                            <Network className="w-4 h-4 text-emerald-500" />
                            <span>Code</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-1 px-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                            >
                                {THEMES.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>

                            <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>

                            <button
                                onClick={handleShare}
                                className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors relative"
                                title="Share Link"
                            >
                                {copiedShare ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                            </button>

                            <button
                                onClick={() => setInput(TEMPLATES[0].code)}
                                className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors"
                                title="Reset"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="graph TD..."
                        className="flex-1 w-full p-6 bg-slate-50 dark:bg-slate-950 font-mono text-sm leading-relaxed outline-none resize-none"
                        spellCheck={false}
                    />
                    <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex justify-end">
                        Auto-saved
                    </div>
                </div>
            )}

            {/* Preview Panel (Expands in Fullscreen) */}
            <div className={`${isFullscreen ? 'col-span-12' : 'lg:col-span-6'} flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative transition-all duration-300`}>
                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10 relative">
                    <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
                        <ImageIcon className="w-4 h-4 text-emerald-500" />
                        <span>Preview</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors mr-2"
                            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                        >
                            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={() => handleDownload('svg')}
                            className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors"
                            title="Download SVG"
                        >
                            <span className="font-bold text-[10px] border border-current rounded px-1">SVG</span>
                        </button>
                        <button
                            onClick={() => handleDownload('png')}
                            className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors"
                            title="Download PNG"
                        >
                            <span className="font-bold text-[10px] border border-current rounded px-1">PNG</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
                    {error && (
                        <div className="absolute top-4 left-4 right-4 z-20 flex justify-center pointer-events-none">
                            <div className="bg-red-50 dark:bg-red-950/90 backdrop-blur border border-red-200 dark:border-red-900 p-3 rounded-xl text-red-600 dark:text-red-400 shadow-lg max-w-lg text-center animate-in slide-in-from-top-4">
                                <p className="font-bold text-xs uppercase mb-1 flex items-center justify-center gap-2">
                                    <HelpCircle className="w-3 h-3" /> Syntax Error
                                </p>
                                <p className="font-mono text-[10px] leading-tight opacity-90 break-all">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Zoom Pan Pinch Wrapper */}
                    <TransformWrapper
                        initialScale={1}
                        minScale={0.5}
                        maxScale={4}
                        centerOnInit
                    >
                        {({ zoomIn, zoomOut, resetTransform }) => (
                            <>
                                {/* Floating Controls */}
                                <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg p-1">
                                    <button onClick={() => zoomIn()} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"><ZoomIn className="w-4 h-4" /></button>
                                    <button onClick={() => zoomOut()} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"><ZoomOut className="w-4 h-4" /></button>
                                    <button onClick={() => resetTransform()} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"><Move className="w-4 h-4" /></button>
                                </div>

                                <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                                    <div
                                        className="min-w-full min-h-full flex items-center justify-center p-8 transition-opacity duration-300"
                                        style={{ opacity: svg ? 1 : 0.5 }}
                                        dangerouslySetInnerHTML={{ __html: svg }}
                                    />
                                </TransformComponent>
                            </>
                        )}
                    </TransformWrapper>
                </div>
            </div>
        </div>
    );
}
