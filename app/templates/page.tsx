'use client';

import { useEffect, useState } from 'react';
import { getPublicTemplates } from '@/lib/supabase';
import Link from 'next/link';
import { Sparkles, ArrowRight, Copy } from 'lucide-react';

export default function TemplatesGallery() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTemplates() {
            try {
                const data = await getPublicTemplates();
                setTemplates(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadTemplates();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                        Community Template Gallery
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Explore professional invoice designs created by our community.
                        Remix any template to make it your own instantly.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {templates.map((template) => (
                            <div key={template.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all group">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-lg">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                            {template.views || 0} Views
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                        {template.title || 'Untitled Invoice'}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2">
                                        {template.description || 'A professional invoice template ready to use.'}
                                    </p>

                                    <Link
                                        href={`/share/invoice/${template.id}`}
                                        className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform"
                                    >
                                        <Copy className="w-4 h-4" />
                                        Remix Template
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && templates.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No templates yet</h3>
                        <p className="text-slate-500 mb-6">Be the first to publish your design to the world!</p>
                        <Link
                            href="/invoice-builder"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                        >
                            Create & Publish <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
