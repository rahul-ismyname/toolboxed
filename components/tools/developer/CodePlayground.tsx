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
    PanelTop
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
    const [logs, setLogs] = useState<Array<{ method: string, args: string[] }>>([]);
    const [showConsole, setShowConsole] = useState(false);

    const generateDoc = () => {
        return `
        <!DOCTYPE html>
        <html>
            <head>
                <style>${css}</style>
            </head>
            <body>
                ${html}
                <script>
                    const sendLog = (method, args) => {
                        try {
                            window.parent.postMessage({
                                type: 'console',
                                method,
                                args: args.map(a => {
                                    if (typeof a === 'object') {
                                        try { return JSON.stringify(a, null, 2); } catch(e) { return String(a); }
                                    }
                                    return String(a);
                                })
                            }, '*');
                        } catch (e) { console.error(e); }
                    };

                    const originalLog = console.log;
                    console.log = (...args) => { sendLog('log', args); originalLog.apply(console, args); };
                    const originalWarn = console.warn;
                    console.warn = (...args) => { sendLog('warn', args); originalWarn.apply(console, args); };
                    const originalError = console.error;
                    console.error = (...args) => { sendLog('error', args); originalError.apply(console, args); };

                    window.onerror = (msg, url, line) => {
                        sendLog('error', [msg, "Line: " + line]);
                    };

                    ${js}
                </script>
            </body>
        </html>
        `;
    };

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'console') {
                setLogs(prev => [...prev, { method: event.data.method, args: event.data.args }]);
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

    const EditorPanel = ({ title, code, onChange, icon: Icon, color }: any) => (
        <div className="flex flex-col h-full border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{title}</span>
                </div>
            </div>
            <textarea
                value={code}
                onChange={(e) => onChange(e.target.value)}
                className="flex-grow p-4 font-mono text-sm bg-white dark:bg-slate-900 resize-none focus:outline-none text-slate-700 dark:text-emerald-400"
                spellCheck={false}
            />
        </div>
    );

    return (
        <div className="flex flex-col gap-4 h-[800px]">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setLayout('split')}
                        className={`p-2 rounded-xl transition-colors ${layout === 'split' ? 'bg-emerald-50 text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
                        title="Split View"
                    >
                        <PanelLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setLayout('stacked')}
                        className={`p-2 rounded-xl transition-colors ${layout === 'stacked' ? 'bg-emerald-50 text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
                        title="Stacked View"
                    >
                        <PanelTop className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={autoRun}
                            onChange={(e) => setAutoRun(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500/20"
                        />
                        Auto-Run
                    </label>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRun}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 text-xs"
                    >
                        <Play className="w-3.5 h-3.5" />
                        Run
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"
                        title="Download HTML"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Workspace */}
            <div className={`flex-grow flex gap-4 overflow-hidden ${layout === 'stacked' ? 'flex-col' : 'flex-row'}`}>
                {/* Editors */}
                <div className={`${layout === 'split' ? 'w-1/2 flex-col' : 'w-full flex-row'} flex gap-4 overflow-hidden`}>
                    <div className="flex-1 flex flex-col gap-4 h-full">
                        <EditorPanel title="HTML" code={html} onChange={setHtml} icon={Code2} color="text-orange-500" />
                        <EditorPanel title="CSS" code={css} onChange={setCss} icon={FileType} color="text-blue-500" />
                        <EditorPanel title="JS" code={js} onChange={setJs} icon={Code2} color="text-yellow-500" />
                    </div>
                </div>

                {/* Preview */}
                <div className={`${layout === 'split' ? 'w-1/2' : 'h-1/2'} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col`}>
                    <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Preview</span>
                        <div className="flex gap-2 items-center">
                            <button
                                onClick={() => setShowConsole(!showConsole)}
                                className={`text-xs font-bold px-2 py-1 rounded transition-colors ${showConsole ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Console
                            </button>
                            <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/50" />
                            </div>
                        </div>
                    </div>
                    <div className={`flex-grow bg-white relative flex flex-col`}>
                        <iframe
                            srcDoc={iframeSrc}
                            className={`w-full transition-all duration-300 ${showConsole ? 'h-2/3' : 'h-full'} border-none`}
                            sandbox="allow-scripts"
                            title="Code Preview"
                        />
                        {showConsole && (
                            <div className="h-1/3 border-t border-slate-200 bg-slate-50 overflow-auto p-2 font-mono text-xs">
                                <div className="text-slate-400 mb-2 font-bold uppercase tracking-wider text-[10px]">Console Output</div>
                                {logs.length === 0 && <div className="text-slate-400 italic">No logs yet...</div>}
                                {logs.map((log, i) => (
                                    <div key={i} className={`mb-1 border-b border-slate-100 last:border-0 pb-1 ${log.method === 'error' ? 'text-red-600' : log.method === 'warn' ? 'text-yellow-600' : 'text-slate-600'}`}>
                                        <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                        {log.args.join(' ')}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
