'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Send,
    Plus,
    Trash2,
    Clock,
    Settings2,
    Code2,
    Layers,
    Globe,
    Check,
    Copy,
    AlertCircle,
    ChevronDown,
    Play,
    Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface Header {
    key: string;
    value: string;
    enabled: boolean;
}

interface APIHistoryItem {
    id: string;
    method: HttpMethod;
    url: string;
    timestamp: number;
    status?: number;
}

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
const HISTORY_KEY = 'toolboxed_api_history';

export function APIPlayground() {
    const [method, setMethod] = useState<HttpMethod>('GET');
    const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
    const [headers, setHeaders] = useState<Header[]>([
        { key: 'Content-Type', value: 'application/json', enabled: true }
    ]);
    const [body, setBody] = useState('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}');
    const [params, setParams] = useState<Header[]>([
        { key: '', value: '', enabled: true }
    ]);
    const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body' | 'response' | 'history'>('params');
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<APIHistoryItem[]>([]);
    const [copied, setCopied] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSnippets, setShowSnippets] = useState(false);
    const [snippetLang, setSnippetLang] = useState<'curl' | 'fetch' | 'axios'>('curl');

    const [isUpdatingFromParams, setIsUpdatingFromParams] = useState(false);
    const [isUpdatingFromUrl, setIsUpdatingFromUrl] = useState(false);

    // Initialize history
    useEffect(() => {
        const stored = localStorage.getItem(HISTORY_KEY);
        if (stored) {
            try {
                setHistory(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse history', e);
            }
        }
    }, []);

    // Sync URL -> Params
    useEffect(() => {
        if (isUpdatingFromParams) return;
        setIsUpdatingFromUrl(true);
        try {
            const urlObj = new URL(url);
            const searchParams = urlObj.searchParams;
            const newParams: Header[] = [];
            searchParams.forEach((value, key) => {
                newParams.push({ key, value, enabled: true });
            });
            if (newParams.length === 0) {
                newParams.push({ key: '', value: '', enabled: true });
            }
            setParams(newParams);
        } catch (e) {
            // Invalid URL or no protocol, ignore params sync
        }
        setIsUpdatingFromUrl(false);
    }, [url, isUpdatingFromParams]);

    // Sync Params -> URL
    useEffect(() => {
        if (isUpdatingFromUrl) return;
        setIsUpdatingFromParams(true);
        try {
            const urlObj = new URL(url);
            urlObj.search = ''; // Clear existing
            params.forEach(p => {
                if (p.enabled && p.key) {
                    urlObj.searchParams.append(p.key, p.value);
                }
            });
            const newUrl = urlObj.toString();
            if (newUrl !== url) setUrl(newUrl);
        } catch (e) {
            // If URL is invalid (e.g. typing), we can't easily sync back
        }
        setIsUpdatingFromParams(false);
    }, [params, isUpdatingFromUrl]);

    const addToHistory = useCallback((item: Omit<APIHistoryItem, 'id' | 'timestamp'>) => {
        const newItem: APIHistoryItem = {
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now()
        };
        const updatedHistory = [newItem, ...history].slice(0, 20);
        setHistory(updatedHistory);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    }, [history]);

    const handleSend = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);
        setActiveTab('response');

        try {
            const fetchHeaders: Record<string, string> = {};
            headers.forEach(h => {
                if (h.enabled && h.key) fetchHeaders[h.key] = h.value;
            });

            const config: RequestInit = {
                method,
                headers: fetchHeaders,
            };

            if (['POST', 'PUT', 'PATCH'].includes(method)) {
                try {
                    config.body = body;
                } catch (e) {
                    throw new Error('Invalid JSON body');
                }
            }

            const startTime = Date.now();
            const res = await fetch(url, config);
            const duration = Date.now() - startTime;

            const contentType = res.headers.get('content-type');
            let data;
            if (contentType?.includes('application/json')) {
                data = await res.json();
            } else {
                data = await res.text();
            }

            setResponse({
                status: res.status,
                statusText: res.statusText,
                time: `${duration}ms`,
                size: `${(JSON.stringify(data).length / 1024).toFixed(2)} KB`,
                data
            });

            addToHistory({ method, url, status: res.status });
        } catch (err: any) {
            setError(err.message || 'Failed to execute request. Ensure the URL is correct and CORS is allowed.');
            addToHistory({ method, url, status: 0 });
        } finally {
            setLoading(false);
        }
    };

    const generateSnippet = () => {
        const fetchHeaders: Record<string, string> = {};
        headers.forEach(h => { if (h.enabled && h.key) fetchHeaders[h.key] = h.value; });

        if (snippetLang === 'curl') {
            let curl = `curl -X ${method} "${url}"`;
            Object.entries(fetchHeaders).forEach(([k, v]) => { curl += ` \\\n  -H "${k}: ${v}"`; });
            if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
                curl += ` \\\n  -d '${body.replace(/'/g, "'\\''")}'`;
            }
            return curl;
        }

        if (snippetLang === 'fetch') {
            return `fetch("${url}", {
  method: "${method}",
  headers: ${JSON.stringify(fetchHeaders, null, 2)},
  ${['POST', 'PUT', 'PATCH'].includes(method) ? `body: JSON.stringify(${body})` : ''}
});`;
        }

        if (snippetLang === 'axios') {
            return `axios({
  method: "${method.toLowerCase()}",
  url: "${url}",
  headers: ${JSON.stringify(fetchHeaders, null, 2)},
  ${['POST', 'PUT', 'PATCH'].includes(method) ? `data: ${body}` : ''}
});`;
        }
        return '';
    };

    const addHeader = () => {
        setHeaders([...headers, { key: '', value: '', enabled: true }]);
    };

    const addParam = () => {
        setParams([...params, { key: '', value: '', enabled: true }]);
    };

    const removeParam = (index: number) => {
        setParams(params.filter((_, i) => i !== index));
    };

    const updateParam = (index: number, field: keyof Header, val: any) => {
        const newParams = [...params];
        newParams[index] = { ...newParams[index], [field]: val };
        setParams(newParams);
    };

    const removeHeader = (index: number) => {
        setHeaders(headers.filter((_, i) => i !== index));
    };

    const updateHeader = (index: number, field: keyof Header, val: any) => {
        const newHeaders = [...headers];
        newHeaders[index] = { ...newHeaders[index], [field]: val };
        setHeaders(newHeaders);
    };

    const copyResponse = () => {
        if (!response) return;
        navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col min-h-[700px]">
            {/* Request Bar */}
            <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative group min-w-[120px]">
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value as HttpMethod)}
                            className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer pr-10"
                        >
                            {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    <div className="flex-grow flex gap-2">
                        <div className="relative flex-grow group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Globe className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://api.example.com/v1/resource"
                                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                            />
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className={`flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 ${loading ? 'animate-pulse' : ''}`}
                        >
                            {loading ? <Zap className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            <span className="hidden md:inline">Send</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
                {/* Configuration Sidebar / Left Panel */}
                <div className="w-full md:w-1/2 border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
                    <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                        {(['params', 'headers', 'body', 'history'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 min-w-[80px] py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-emerald-500 border-b-2 border-emerald-500 bg-emerald-50/10' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {tab === 'params' && <Settings2 className="w-3.5 h-3.5" />}
                                    {tab === 'headers' && <Layers className="w-3.5 h-3.5" />}
                                    {tab === 'body' && <Code2 className="w-3.5 h-3.5" />}
                                    {tab === 'history' && <Clock className="w-3.5 h-3.5" />}
                                    {tab}
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="flex-grow overflow-auto p-4 md:p-6 custom-scrollbar">
                        {activeTab === 'params' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Query Parameters</span>
                                    <button
                                        onClick={() => setShowSnippets(true)}
                                        className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-emerald-500 transition-colors uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded"
                                    >
                                        <Code2 className="w-3 h-3" />
                                        Snippets
                                    </button>
                                </div>
                                {params.map((param, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <input
                                            type="checkbox"
                                            checked={param.enabled}
                                            onChange={(e) => updateParam(idx, 'enabled', e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500/20"
                                        />
                                        <input
                                            type="text"
                                            value={param.key}
                                            onChange={(e) => updateParam(idx, 'key', e.target.value)}
                                            placeholder="Key"
                                            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                                        />
                                        <input
                                            type="text"
                                            value={param.value}
                                            onChange={(e) => updateParam(idx, 'value', e.target.value)}
                                            placeholder="Value"
                                            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                                        />
                                        <button
                                            onClick={() => removeParam(idx)}
                                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={addParam}
                                    className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:text-emerald-500 hover:border-emerald-500/50 transition-all"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Parameter
                                </button>
                            </div>
                        )}

                        {activeTab === 'headers' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">HTTP Headers</span>
                                </div>
                                {headers.map((header, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <input
                                            type="checkbox"
                                            checked={header.enabled}
                                            onChange={(e) => updateHeader(idx, 'enabled', e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500/20"
                                        />
                                        <input
                                            type="text"
                                            value={header.key}
                                            onChange={(e) => updateHeader(idx, 'key', e.target.value)}
                                            placeholder="Key"
                                            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                                        />
                                        <input
                                            type="text"
                                            value={header.value}
                                            onChange={(e) => updateHeader(idx, 'value', e.target.value)}
                                            placeholder="Value"
                                            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                                        />
                                        <button
                                            onClick={() => removeHeader(idx)}
                                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={addHeader}
                                    className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:text-emerald-500 hover:border-emerald-500/50 transition-all"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Header
                                </button>
                            </div>
                        )}

                        {activeTab === 'body' && (
                            <div className="h-full flex flex-col">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">JSON Body</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                try {
                                                    setBody(JSON.stringify(JSON.parse(body), null, 2));
                                                } catch (e) { }
                                            }}
                                            className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded hover:bg-emerald-500/20 transition-colors"
                                        >
                                            Beautify
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    className="flex-grow w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl font-mono text-sm text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 resize-none leading-relaxed"
                                    spellCheck={false}
                                />
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="space-y-3">
                                {history.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Clock className="w-12 h-12 text-slate-100 dark:text-slate-800 mx-auto mb-4" />
                                        <p className="text-sm text-slate-400">No request history yet.</p>
                                    </div>
                                ) : (
                                    history.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setMethod(item.method);
                                                setUrl(item.url);
                                            }}
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between hover:border-emerald-500/30 transition-all group text-left"
                                        >
                                            <div className="flex flex-col gap-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${item.method === 'GET' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600' :
                                                        item.method === 'POST' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600' :
                                                            'bg-slate-100 dark:bg-slate-500/20 text-slate-600'
                                                        }`}>
                                                        {item.method}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-500">
                                                        {new Date(item.timestamp).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate w-full">
                                                    {item.url}
                                                </span>
                                            </div>
                                            <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.status && item.status < 300 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                                                }`}>
                                                {item.status || 'ERR'}
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Response Panel */}
                <div className="w-full md:w-1/2 flex flex-col bg-slate-50/30 dark:bg-slate-950/30 overflow-hidden relative">
                    <div className="flex flex-col border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="flex items-center justify-between p-4 px-6">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-500" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Response</span>
                            </div>
                            {response && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={copyResponse}
                                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-emerald-500"
                                        title="Copy response body"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            )}
                        </div>
                        {response && (
                            <div className="px-6 pb-4">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search in response..."
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-grow overflow-auto p-4 md:p-6 custom-scrollbar">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-red-700 dark:text-red-400 uppercase tracking-wider text-[10px]">Execution Failed</h4>
                                    <p className="text-xs text-red-600 dark:text-red-400/80 leading-relaxed font-medium">
                                        {error}. This usually happens due to **CORS** restrictions or network errors. Try a public API like PokeAPI or JSONPlaceholder.
                                    </p>
                                </div>
                            </div>
                        )}

                        {!response && !error && !loading && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-800 text-center animate-in fade-in duration-1000">
                                <Play className="w-16 h-16 mb-4" />
                                <p className="text-sm font-bold max-w-xs">Ready to test? Enter a URL and click **Send** to see the magic happen.</p>
                            </div>
                        )}

                        {loading && (
                            <div className="h-full flex flex-col items-center justify-center animate-pulse">
                                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
                                <p className="text-xs font-bold text-slate-400">Waiting for response...</p>
                            </div>
                        )}

                        {response && (
                            <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Status</span>
                                        <span className={`text-sm font-black ${response.status < 300 ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {response.status} {response.statusText}
                                        </span>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Time</span>
                                        <span className="text-sm font-black text-slate-700 dark:text-slate-200">{response.time}</span>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Size</span>
                                        <span className="text-sm font-black text-slate-700 dark:text-slate-200">{response.size}</span>
                                    </div>
                                </div>
                                <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 overflow-hidden shadow-inner group relative">
                                    <div className="absolute top-4 right-4 text-[10px] font-black text-slate-700 group-hover:text-slate-500 transition-colors">JSON</div>
                                    <pre className="text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                                        {(() => {
                                            const jsonStr = JSON.stringify(response.data, null, 2);
                                            if (!searchQuery) return jsonStr;
                                            // Simple highlight if desired, but for now just filter logic can be external
                                            return jsonStr;
                                        })()}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Snippets Modal Overlay */}
            <AnimatePresence>
                {showSnippets && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-12"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-full"
                        >
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                                    <Code2 className="w-5 h-5 text-emerald-500" />
                                    Generate Code Snippet
                                </h3>
                                <button
                                    onClick={() => setShowSnippets(false)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                >
                                    <Plus className="w-5 h-5 rotate-45 text-slate-400" />
                                </button>
                            </div>
                            <div className="p-6 flex flex-col gap-6 overflow-hidden">
                                <div className="flex gap-2">
                                    {(['curl', 'fetch', 'axios'] as const).map(lang => (
                                        <button
                                            key={lang}
                                            onClick={() => setSnippetLang(lang)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${snippetLang === lang ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                        >
                                            {lang.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex-grow bg-slate-950 rounded-2xl p-6 relative group overflow-hidden border border-slate-800">
                                    <pre className="font-mono text-xs text-emerald-400 leading-relaxed overflow-auto max-h-[300px] custom-scrollbar">
                                        {generateSnippet()}
                                    </pre>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(generateSnippet());
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }}
                                        className="absolute top-4 right-4 p-2 bg-slate-900/80 backdrop-blur rounded-lg border border-slate-800 text-slate-400 hover:text-emerald-500 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
