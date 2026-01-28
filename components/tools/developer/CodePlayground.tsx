'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Play,
    Download,
    Layout,
    Code2,
    FileType,
    Maximize2,
    RefreshCw,
    Eraser,
    Check,
    Copy,
    PanelLeft,
    PanelTop,
    Smartphone,
    Tablet,
    Monitor,
    Sparkles,
    Settings,
    History,
    Box,
    Globe,
    RotateCcw
} from 'lucide-react';

const DEFAULT_Html = `<div class="container">
  <h1>Hello World!</h1>
  <p>Start editing to see some magic happen.</p>
  <button id="btn">Click Me</button>
</div>`;

const DEFAULT_CSS = `body {
  font-family: system-ui, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background: #f8fafc;
  color: #334155;
}

.container {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

button {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
  transition: all 0.2s;
}

button:hover {
  background: #059669;
  transform: translateY(-2px);
}`;

const DEFAULT_JS = `const btn = document.getElementById('btn');

btn.addEventListener('click', () => {
  btn.textContent = 'Thanks for clicking!';
  confetti();
});

// Simple confetti function
function confetti() {
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
  for(let i=0; i<50; i++) {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.left = btn.getBoundingClientRect().left + 'px';
    el.style.top = btn.getBoundingClientRect().top + 'px';
    el.style.width = '10px';
    el.style.height = '10px';
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.transform = \`translate(\${Math.random()*200 - 100}px, \${Math.random()*200 - 100}px)\`;
    el.style.transition = 'all 1s ease-out';
    el.style.borderRadius = '50%';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
    setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform += \` translateY(100px)\`;
    }, 100);
  }
}`;

type LayoutMode = 'split' | 'stacked' | 'tabs';

export function CodePlayground() {
    const [html, setHtml] = useState(DEFAULT_Html);
    const [css, setCss] = useState(DEFAULT_CSS);
    const [js, setJs] = useState(DEFAULT_JS);
    const [layout, setLayout] = useState<LayoutMode>('split');
    const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
    const [iframeSrc, setIframeSrc] = useState('');
    const [autoRun, setAutoRun] = useState(true);
    const [logs, setLogs] = useState<Array<{ method: string, args: string[], timestamp: string }>>([]);
    const [showConsole, setShowConsole] = useState(false);
    const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
    const [activeLibraries, setActiveLibraries] = useState<string[]>([]);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const LIBRARIES = {
        tailwind: { name: 'Tailwind CSS', url: 'https://cdn.tailwindcss.com' },
        react: { name: 'React', url: ['https://unpkg.com/react@18/umd/react.development.js', 'https://unpkg.com/react-dom@18/umd/react-dom.development.js', 'https://unpkg.com/@babel/standalone/babel.min.js'] },
        framer: { name: 'Framer Motion', url: 'https://unpkg.com/framer-motion@10.16.4/dist/framer-motion.js' },
        three: { name: 'Three.js', url: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.158.0/three.min.js' },
        lucide: { name: 'Lucide Icons', url: 'https://unpkg.com/lucide@latest' }
    };

    // Persistence
    useEffect(() => {
        const saved = localStorage.getItem('cp_code');
        if (saved) {
            try {
                const { html: h, css: c, js: j, libs } = JSON.parse(saved);
                setHtml(h); setCss(c); setJs(j);
                if (libs) setActiveLibraries(libs);
            } catch (e) { console.error('Failed to load saved code', e); }
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem('cp_code', JSON.stringify({ html, css, js, libs: activeLibraries }));
        }, 1000);
        return () => clearTimeout(timer);
    }, [html, css, js, activeLibraries]);

    const generateDoc = () => {
        const libScripts = activeLibraries.map(lib => {
            const config = LIBRARIES[lib as keyof typeof LIBRARIES];
            if (Array.isArray(config.url)) {
                return config.url.map(u => `<script src="${u}"></script>`).join('\n');
            }
            return `<script src="${config.url}"></script>`;
        }).join('\n');

        const isReactMode = activeLibraries.includes('react');
        const scriptType = isReactMode ? 'text/babel' : 'text/javascript';

        return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                ${libScripts}
                <style>
                    body { margin: 0; padding: 0; }
                    ${css}
                </style>
            </head>
            <body>
                ${html}
                <script type="${scriptType}">
                    const sendLog = (method, args) => {
                        window.parent.postMessage({
                            type: 'console',
                            method,
                            timestamp: new Date().toLocaleTimeString(),
                            args: args.map(a => {
                                if (typeof a === 'object') {
                                    try { return JSON.stringify(a, null, 2); } catch(e) { return String(a); }
                                }
                                return String(a);
                            })
                        }, '*');
                    };

                    console.log = (...args) => sendLog('log', args);
                    console.warn = (...args) => sendLog('warn', args);
                    console.error = (...args) => sendLog('error', args);

                    window.onerror = (msg, url, line) => {
                        sendLog('error', [msg, "Line: " + line]);
                    };

                    ${js}
                    
                    if ("${activeLibraries.includes('lucide')}" === "true") {
                        lucide.createIcons();
                    }
                </script>
            </body>
        </html>
        `;
    };

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'console') {
                setLogs(prev => [...prev, { method: event.data.method, args: event.data.args, timestamp: event.data.timestamp }]);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    useEffect(() => {
        if (autoRun) {
            const timeout = setTimeout(() => {
                setLogs([]); // Clear logs on new run
                setIframeSrc(generateDoc());
            }, 600); // Debounce
            return () => clearTimeout(timeout);
        }
    }, [html, css, js, autoRun]);

    const handleRun = () => {
        setLogs([]); // Clear logs
        setIframeSrc(generateDoc());
    };

    const handleDownload = () => {
        const fullContent = generateDoc();
        const blob = new Blob([fullContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'index.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const toggleLibrary = (lib: string) => {
        setActiveLibraries(prev =>
            prev.includes(lib) ? prev.filter(l => l !== lib) : [...prev, lib]
        );
    };

    const loadTemplate = (type: string) => {
        if (type === 'react') {
            setHtml('<div id="root"></div>');
            setCss('body { margin: 0; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: sans-serif; }');
            setJs(`const { useState } = React;\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  return (\n    <div style={{ textAlign: 'center' }}>\n      <h1>React in Playground!</h1>\n      <p>Count: {count}</p>\n      <button \n        onClick={() => setCount(c => c + 1)}\n        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}\n      >\n        Increment\n      </button>\n    </div>\n  );\n}\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(<App />);`);
            setActiveLibraries(['react']);
        } else if (type === 'tailwind') {
            setHtml(`<div class="min-h-screen bg-slate-950 flex items-center justify-center p-8">
  <div class="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center">
    <div class="w-16 h-16 bg-sky-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-sky-500/20">
      <svg class="text-white w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
    </div>
    <h1 class="text-3xl font-black text-white mb-2 italic">Tailwind Power</h1>
    <p class="text-slate-400 mb-8">Rapidly build modern websites without ever leaving your HTML.</p>
    <button class="w-full py-4 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-2xl transition-all shadow-xl shadow-sky-500/20 active:scale-95">
      Get Started
    </button>
  </div>
</div>`);
            setCss('');
            setJs('');
            setActiveLibraries(['tailwind']);
        }
    };

    const EditorPanel = ({ title, code, onChange, icon: Icon, color, isActive, onClick }: any) => (
        <div className={`flex flex-col h-full border transition-all duration-300 ${isActive ? 'ring-2 ring-emerald-500/20 border-emerald-500/50' : 'border-slate-200 dark:border-slate-800'} rounded-2xl overflow-hidden bg-white dark:bg-slate-900/50 backdrop-blur-md shadow-sm`} onClick={onClick}>
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{title}</span>
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
            </div>
            <textarea
                value={code}
                onChange={(e) => onChange(e.target.value)}
                className="flex-grow p-5 font-mono text-[13px] leading-relaxed bg-transparent resize-none focus:outline-none text-slate-700 dark:text-emerald-400/90 selection:bg-emerald-500/20"
                spellCheck={false}
                placeholder={`Write your ${title} here...`}
            />
        </div>
    );

    return (
        <div className="flex flex-col gap-6 h-[850px] animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Elite Toolbar */}
            <div className="flex items-center justify-between p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl shadow-emerald-500/5">
                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl">
                        <button
                            onClick={() => setLayout('split')}
                            className={`p-2 rounded-xl transition-all ${layout === 'split' ? 'bg-white dark:bg-emerald-500 text-emerald-600 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                            title="Split Editor"
                        >
                            <PanelLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setLayout('stacked')}
                            className={`p-2 rounded-xl transition-all ${layout === 'stacked' ? 'bg-white dark:bg-emerald-500 text-emerald-600 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                            title="Preview Focus"
                        >
                            <PanelTop className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="w-px h-8 bg-slate-200 dark:bg-white/10 mx-1" />

                    {/* Library Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide max-w-[300px]">
                        {Object.entries(LIBRARIES).map(([id, lib]) => (
                            <button
                                key={id}
                                onClick={() => toggleLibrary(id)}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border whitespace-nowrap ${activeLibraries.includes(id) ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-400 hover:border-slate-300 dark:hover:border-white/20'}`}
                            >
                                {lib.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-4 mr-4">
                        <button onClick={() => loadTemplate('react')} className="text-[10px] font-black uppercase text-slate-400 hover:text-emerald-500 transition-colors">React</button>
                        <button onClick={() => loadTemplate('tailwind')} className="text-[10px] font-black uppercase text-slate-400 hover:text-emerald-500 transition-colors">Tailwind</button>
                    </div>

                    <button
                        onClick={handleRun}
                        className="group flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95 text-xs uppercase tracking-widest"
                    >
                        <Play className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" />
                        Run Code
                    </button>
                </div>
            </div>

            {/* Workplace Content */}
            <div className={`flex-grow flex gap-6 overflow-hidden ${layout === 'stacked' ? 'flex-col' : 'flex-row'}`}>
                {/* Editor Stack */}
                <div className={`${layout === 'split' ? 'w-[45%]' : 'w-full'} flex flex-col gap-4 overflow-hidden`}>
                    <div className="flex gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl w-fit self-center mb-2">
                        {(['html', 'css', 'js'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex-grow relative group">
                        <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <EditorPanel
                            title={activeTab}
                            code={activeTab === 'html' ? html : activeTab === 'css' ? css : js}
                            onChange={activeTab === 'html' ? setHtml : activeTab === 'css' ? setCss : setJs}
                            icon={activeTab === 'css' ? FileType : Code2}
                            color={activeTab === 'html' ? 'text-orange-500' : activeTab === 'css' ? 'text-sky-500' : 'text-yellow-500'}
                            isActive={true}
                        />
                    </div>
                </div>

                {/* Preview & Device Controls */}
                <div className={`${layout === 'split' ? 'w-[55%]' : 'h-1/2'} flex flex-col gap-4 min-h-[400px]`}>
                    <div className="flex items-center justify-between px-6 py-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl relative shadow-lg overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Live Preview</span>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                                <button
                                    onClick={() => setDeviceMode('mobile')}
                                    className={`p-1.5 rounded-lg transition-all ${deviceMode === 'mobile' ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    title="Mobile View"
                                >
                                    <Smartphone className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setDeviceMode('tablet')}
                                    className={`p-1.5 rounded-lg transition-all ${deviceMode === 'tablet' ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    title="Tablet View"
                                >
                                    <Tablet className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setDeviceMode('desktop')}
                                    className={`p-1.5 rounded-lg transition-all ${deviceMode === 'desktop' ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    title="Desktop View"
                                >
                                    <Monitor className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />

                            <button
                                onClick={() => setShowConsole(!showConsole)}
                                className={`text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl transition-all ${showConsole ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Console
                            </button>
                        </div>
                    </div>

                    <div className="flex-grow flex items-center justify-center bg-slate-100/50 dark:bg-slate-950/50 rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden relative group">
                        <div className={`transition-all duration-500 ease-out shadow-2xl bg-white border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col ${deviceMode === 'mobile' ? 'w-[375px] h-[667px]' :
                            deviceMode === 'tablet' ? 'w-[768px] h-[1024px]' :
                                'w-full h-full'
                            } ${deviceMode !== 'desktop' ? 'max-h-[90%]' : ''}`}>
                            <iframe
                                srcDoc={iframeSrc}
                                className="w-full flex-grow border-none bg-white"
                                sandbox="allow-scripts"
                                title="Code Preview"
                            />
                            {showConsole && (
                                <div className="h-40 border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md overflow-auto p-4 font-mono text-xs">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Terminal Output</div>
                                        <button onClick={() => setLogs([])} className="text-[10px] font-black uppercase text-red-500 hover:text-red-400 transition-colors">Clear</button>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {logs.length === 0 && <div className="text-slate-300 dark:text-slate-700 italic">Listening for logs...</div>}
                                        {logs.map((log, i) => (
                                            <div key={i} className={`flex gap-3 py-1 border-b border-black/5 dark:border-white/5 last:border-0 ${log.method === 'error' ? 'text-red-500' : log.method === 'warn' ? 'text-yellow-500' : 'text-slate-600 dark:text-slate-300'}`}>
                                                <span className="opacity-30 flex-shrink-0">[{log.timestamp}]</span>
                                                <span className="flex-grow whitespace-pre-wrap">{log.args.join(' ')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
