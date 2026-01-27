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
        <div className="w-full max-w-6xl mx-auto space-y-4 lg:space-y-8 animate-in fade-in duration-500">

            {/* Mobile Tabs */}
            <div className="lg:hidden flex p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                <button
                    onClick={() => setActiveTab('inputs')}
                    className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'inputs' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400'}`}
                >
                    Configure
                </button>
                <button
                    onClick={() => setActiveTab('previews')}
                    className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'previews' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400'}`}
                >
                    Previews
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Inputs Column */}
                <div className={`space-y-6 ${activeTab === 'inputs' ? 'block' : 'hidden lg:block'}`}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 lg:p-8 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Layout className="w-5 h-5 text-emerald-500" />
                            <h3 className="font-bold text-slate-700 dark:text-slate-200">Page Information</h3>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Page Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. My Awesome Website | Home"
                                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors text-sm"
                            />
                            <div className={`text-[10px] text-right font-bold ${title.length > 60 ? 'text-red-400' : 'text-slate-400'}`}>{title.length} / 60</div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="A brief description of your page content..."
                                className="w-full h-24 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors resize-none text-sm"
                            />
                            <div className={`text-[10px] text-right font-bold ${description.length > 160 ? 'text-red-400' : 'text-slate-400'}`}>{description.length} / 160</div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Website URL</label>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://example.com"
                                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Social Image URL</label>
                                <input
                                    type="text"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://example.com/og-image.jpg"
                                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Keywords</label>
                                <input
                                    type="text"
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    placeholder="design, tools, seo..."
                                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Author</label>
                                <input
                                    type="text"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    placeholder="Your Name"
                                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:border-emerald-500 transition-colors text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Previews Column */}
                <div className={`space-y-6 ${activeTab === 'previews' ? 'block' : 'hidden lg:block'}`}>

                    {/* Google Preview */}
                    <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl border border-slate-200 p-5 lg:p-6 overflow-hidden">
                        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
                            <Search className="w-5 h-5 text-blue-500" />
                            <h3 className="font-bold text-slate-700 text-sm lg:text-base">Google Result</h3>
                        </div>
                        <div className="space-y-1 w-full overflow-hidden">
                            <div className="flex items-center gap-2 text-[10px] text-slate-700 mb-1">
                                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                                    <Globe className="w-3 h-3 text-slate-400" />
                                </div>
                                <div className="flex flex-col leading-none truncate overflow-hidden">
                                    <span className="font-normal truncate">{title || 'Site Name'}</span>
                                    <span className="text-slate-500 truncate">{url || 'https://example.com'}</span>
                                </div>
                            </div>
                            <h4 className="text-lg lg:text-xl text-[#1a0dab] hover:underline cursor-pointer truncate font-normal">
                                {title || 'Your Page Title Shows Here'}
                            </h4>
                            <p className="text-xs lg:text-sm text-[#4d5156] line-clamp-2 leading-snug">
                                {description || 'This is how your page description will appear in Google search results. Keep it between 150-160 characters for best visibility.'}
                            </p>
                        </div>
                    </div>

                    {/* Facebook/OG Preview */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <h3 className="font-black text-slate-600 dark:text-slate-300 text-[10px] lg:text-xs uppercase tracking-widest">Social Share Preview</h3>
                            </div>
                        </div>
                        <div className="border border-slate-200 dark:border-slate-700 m-4 lg:m-6 rounded-lg lg:rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950">
                            <div className="aspect-[1.91/1] bg-slate-200 dark:bg-slate-800 relative flex items-center justify-center overflow-hidden">
                                {imageUrl ? (
                                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-slate-400 flex flex-col items-center">
                                        <ImageIcon className="w-6 h-6 lg:w-8 lg:h-8 opacity-50 mb-2" />
                                        <span className="text-[8px] lg:text-[10px] uppercase font-black tracking-widest">No Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                                <div className="text-[9px] uppercase font-bold text-slate-500 mb-0.5 truncate">{url ? new URL(url).hostname : 'EXAMPLE.COM'}</div>
                                <div className="font-bold text-slate-900 dark:text-slate-100 mb-0.5 truncate text-xs lg:text-sm">{title || 'Your Object Title'}</div>
                                <div className="text-[10px] lg:text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{description || 'Your object description...'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Output Code */}
                    <div className="bg-slate-900 rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden text-slate-300 font-mono relative group">
                        <div className="flex bg-slate-950/50 p-4 border-b border-slate-800 justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">HTML Snippet</span>
                            <button
                                onClick={handleCopy}
                                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 transition-colors border border-slate-700 shadow-lg active:scale-95"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                        <div className="p-5 lg:p-6 text-[10px] lg:text-xs leading-relaxed overflow-x-auto whitespace-pre custom-scrollbar">
                            {generateCode()}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
