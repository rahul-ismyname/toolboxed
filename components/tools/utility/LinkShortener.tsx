'use client';

import { useState } from 'react';
import { createShortLink } from '@/lib/supabase';
import { Link2, Copy, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LinkShortener() {
    const [url, setUrl] = useState('');
    const [shortLink, setShortLink] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!shortLink) return;
        navigator.clipboard.writeText(shortLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShorten = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setShortLink(null);

        try {
            if (!url) return;

            // Basic URL validation
            let finalUrl = url;
            if (!url.startsWith('http')) {
                finalUrl = 'https://' + url;
            }

            const result = await createShortLink(finalUrl);
            // using the live domain as requested
            const domain = 'https://toolboxed.online';
            setShortLink(`${domain}/s/${result.short_code}`);
        } catch (err: any) {
            console.error(err);
            if (err.code === '23505') { // Unique violation
                setError('Custom code already exists. Try another.');
            } else {
                // Show the actual error message for debugging
                setError(`Error: ${err.message || 'Unknown error'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
                <form onSubmit={handleShorten} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Paste a long URL
                        </label>
                        <div className="relative">
                            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com/paste-your-long-link-here..."
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-blue-500 outline-none transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 disabled:opacity-70"
                    >
                        {loading ? 'Shortening...' : 'Shorten Link'}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>

                {error && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                {shortLink && (
                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 text-green-600 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Link Ready!</h3>

                            <div className="w-full flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                <input
                                    readOnly
                                    value={shortLink}
                                    className="flex-1 bg-transparent border-none outline-none px-4 font-mono text-slate-600 dark:text-slate-300 text-sm"
                                />
                                <button
                                    onClick={handleCopy}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:scale-105 transition-all
                                        ${copied
                                            ? 'bg-green-600 text-white'
                                            : 'bg-white dark:bg-slate-700'
                                        }`}
                                >
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <p className="text-center text-slate-400 text-sm">
                Links are permanently stored and track clicks automatically.
            </p>

            {/* SEO Content & FAQ */}
            <div className="grid md:grid-cols-2 gap-6 mt-12 w-full">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center">🚀</span>
                        Why use this Shortener?
                    </h2>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <li>• <strong>Instant & Free:</strong> No sign-up required for basic use.</li>
                        <li>• <strong>Permanent Links:</strong> We never delete your created links.</li>
                        <li>• <strong>Ad-Free Redirects:</strong> Visitors go straight to your destination.</li>
                    </ul>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/10 text-purple-600 flex items-center justify-center">💡</span>
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                        <details className="cursor-pointer group">
                            <summary className="font-semibold group-open:text-purple-600 transition-colors list-none flex items-center justify-between">
                                Is it really free?
                                <span className="group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-2 pl-2 border-l-2 border-purple-100 dark:border-slate-700">Yes, Toolboxed Link Shortener is 100% free to use for personal and business links.</p>
                        </details>
                        <details className="cursor-pointer group">
                            <summary className="font-semibold group-open:text-purple-600 transition-colors list-none flex items-center justify-between">
                                Do links expire?
                                <span className="group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-2 pl-2 border-l-2 border-purple-100 dark:border-slate-700">No, unlike other services, our links do not have an expiration date.</p>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
}
