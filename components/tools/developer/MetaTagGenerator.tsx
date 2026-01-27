'use client';

import { useState } from 'react';
import { Copy, Check, Globe, Layout, Search, Image as ImageIcon } from 'lucide-react';

export function MetaTagGenerator() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [url, setUrl] = useState('');
    const [author, setAuthor] = useState('');
    const [copied, setCopied] = useState(false);

    const generateCode = () => {
        return `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />
<meta name="keywords" content="${keywords}" />
<meta name="author" content="${author}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${imageUrl}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />
<meta property="twitter:image" content="${imageUrl}" />`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateCode());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const [activeTab, setActiveTab] = useState<'inputs' | 'previews'>('inputs');

    return (
        <div className="max-w-6xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-500">
            {/* Contextual Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-xl">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">SEO Protocol Engine</h2>
                        <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Meta Generator</p>
                    </div>
                </div>
                {/* Mobile Navigation Nexus */}
                <div className="lg:hidden flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
                    <button
                        onClick={() => setActiveTab('inputs')}
                        className={`flex-1 sm:px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'inputs' ? 'bg-white dark:bg-slate-900 text-emerald-500 shadow-lg' : 'text-slate-400'}`}
                    >
                        Configure
                    </button>
                    <button
                        onClick={() => setActiveTab('previews')}
                        className={`flex-1 sm:px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'previews' ? 'bg-white dark:bg-slate-900 text-emerald-500 shadow-lg' : 'text-slate-400'}`}
                    >
                        Previews
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Configuration Matrix */}
                <div className={`space-y-8 ${activeTab === 'inputs' ? 'block' : 'hidden lg:block'}`}>
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 p-8 sm:p-12 space-y-8">
                        <div className="flex items-center gap-3 px-2">
                            <Layout className="w-5 h-5 text-emerald-500" />
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Structural Schema</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 px-1">Page Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Site Title | High-Impact Suffix"
                                    className="w-full bg-slate-50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/30 rounded-2xl p-5 outline-none transition-all text-sm font-bold shadow-inner"
                                />
                                <div className="flex justify-end px-2">
                                    <span className={`text-[10px] font-black tracking-widest ${title.length > 60 ? 'text-red-500' : 'text-slate-300'}`}>{title.length} / 60</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 px-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Synthesize a concise description for the crawler..."
                                    className="w-full h-32 bg-slate-50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/30 rounded-2xl p-5 outline-none transition-all resize-none text-sm font-bold shadow-inner leading-relaxed"
                                />
                                <div className="flex justify-end px-2">
                                    <span className={`text-[10px] font-black tracking-widest ${description.length > 160 ? 'text-red-500' : 'text-slate-300'}`}>{description.length} / 160</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 px-1">Origin URL</label>
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://protocol.io"
                                        className="w-full bg-slate-50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/30 rounded-2xl p-4 outline-none transition-all text-xs font-bold shadow-inner"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 px-1">Social Manifest URL</label>
                                    <input
                                        type="text"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="https://assets.io/og.jpg"
                                        className="w-full bg-slate-50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/30 rounded-2xl p-4 outline-none transition-all text-xs font-bold shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 px-1">Keywords</label>
                                    <input
                                        type="text"
                                        value={keywords}
                                        onChange={(e) => setKeywords(e.target.value)}
                                        placeholder="vector, semantic, logic..."
                                        className="w-full bg-slate-50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/30 rounded-2xl p-4 outline-none transition-all text-sm font-bold shadow-inner"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 px-1">Author Entity</label>
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        placeholder="Lead Architect"
                                        className="w-full bg-slate-50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500/30 rounded-2xl p-4 outline-none transition-all text-sm font-bold shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Projection Manifests */}
                <div className={`space-y-8 ${activeTab === 'previews' ? 'block' : 'hidden lg:block'}`}>
                    {/* Google Projection */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 sm:p-12 space-y-8 group hover:shadow-indigo-500/5 transition-all">
                        <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                            <Search className="w-5 h-5 text-blue-500" />
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Search Projection</h3>
                        </div>
                        <div className="space-y-2 overflow-hidden">
                            <div className="flex items-center gap-3 text-[10px] text-slate-700 mb-2">
                                <div className="p-2 bg-slate-50 rounded-full">
                                    <Globe className="w-4 h-4 text-slate-400" />
                                </div>
                                <div className="leading-tight">
                                    <div className="font-bold text-slate-900">{title || 'Protocol'}</div>
                                    <div className="text-slate-500">{url || 'https://protocol.io'}</div>
                                </div>
                            </div>
                            <h4 className="text-xl lg:text-2xl text-[#1a0dab] hover:underline cursor-pointer truncate font-medium">
                                {title || 'Origin Header Synthesis'}
                            </h4>
                            <p className="text-sm text-[#4d5156] line-clamp-2 leading-relaxed opacity-80">
                                {description || 'Awaiting structural synthesis. This is how the description will materialize in the global index.'}
                            </p>
                        </div>
                    </div>

                    {/* Social/OG Projection */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden group hover:shadow-indigo-500/5 transition-all">
                        <div className="p-8 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Social Manifest</h3>
                            </div>
                        </div>
                        <div className="m-8 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
                            <div className="aspect-[1.91/1] bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center overflow-hidden">
                                {imageUrl ? (
                                    <img src={imageUrl} alt="Projection" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                ) : (
                                    <div className="text-slate-300 dark:text-slate-700 flex flex-col items-center">
                                        <ImageIcon className="w-8 h-8 opacity-20 mb-3" />
                                        <span className="text-[9px] uppercase font-black tracking-widest opacity-20">Manifest Pending</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 bg-white dark:bg-slate-900/50 border-t border-slate-50 dark:border-slate-800">
                                <div className="text-[9px] uppercase font-black text-slate-300 mb-1 tracking-widest truncate">{url ? new URL(url).hostname : 'PROTOCOL.IO'}</div>
                                <div className="font-black text-slate-900 dark:text-white mb-1 truncate text-base">{title || 'Synthetic Origin'}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-medium">{description || 'Materializing description manifest...'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Snippet Output */}
                    <div className="bg-slate-950 rounded-[2.5rem] shadow-2xl overflow-hidden text-slate-300 font-mono relative group border border-slate-800">
                        <div className="flex bg-slate-900/50 p-6 border-b border-slate-800/80 justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">HTML Fragment</span>
                            </div>
                            <button
                                onClick={handleCopy}
                                className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 transition-all border border-slate-700 shadow-xl active:scale-90"
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                        <div className="p-8 lg:p-12 text-[10px] sm:text-xs leading-relaxed overflow-x-auto whitespace-pre custom-scrollbar opacity-80 group-hover:opacity-100 transition-opacity">
                            {generateCode()}
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                    SEO Manifest Synthesizer // v2.0
                </p>
            </div>
        </div>
    );
}
