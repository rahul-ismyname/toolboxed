import React from 'react';
import { tools } from '@/config/tools';
import Link from 'next/link';
import { ToolCard } from '../registry/ToolCard';
import { Star, CheckCircle } from 'lucide-react';
import { toolContentData } from '@/config/tool-content';
import { JsonLd } from '../shared/JsonLd';
import { getToolSchema } from '@/lib/seo';
import { ShareButtons } from '../shared/ShareButtons';
import { FavoriteButton } from '../shared/FavoriteButton';
import { ToolTracker } from '../shared/ToolTracker';

interface ToolContentProps {
    slug: string;
}

export function ToolContent({ slug }: ToolContentProps) {
    const data = toolContentData[slug];
    const currentTool = tools.find(t => t.slug === slug);

    if (!data) return null;

    const relatedTools = tools
        .filter(t => t.category === currentTool?.category && t.slug !== slug)
        .slice(0, 4);

    const schemas = getToolSchema(slug);

    return (
        <article className="max-w-4xl mx-auto px-4 py-12 space-y-12 text-slate-700 dark:text-slate-300">

            {/* Structured Data */}
            {schemas && schemas.map((schema, i) => (
                <JsonLd key={i} data={schema} />
            ))}

            <ToolTracker slug={slug} />

            {/* Description Section */}
            <section className="text-center max-w-2xl mx-auto space-y-6">
                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700">
                    <div className="flex -space-x-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                    </div>
                    <span className="text-sm font-bold tracking-tight">4.9/5 User Rating</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    Free {data.title} Online
                </h1>
                <p className="text-xl leading-relaxed text-slate-600 dark:text-slate-400">{data.description}</p>

                <ShareButtons
                    title={`${data.title} - Toolboxed`}
                    description={data.description}
                />

                <div className="flex justify-center pt-4">
                    <FavoriteButton toolId={slug} showLabel className="px-6 py-2.5 shadow-sm" />
                </div>
            </section>

            {/* Table of Contents - Jump Links for SEO */}
            <section className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Quick Navigation</h2>
                    <p className="text-xs text-slate-500">Jump to specific sections of the {data.title} guide.</p>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                    <a href="#features" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/40">Key Features</a>
                    <a href="#how-to" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/40">How to Use</a>
                    <a href="#faqs" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/40">FAQs</a>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="scroll-mt-20">
                <div className="mb-8">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Key Features</h2>
                    <p className="text-slate-500">Powerful capabilities of our {data.title.toLowerCase()}.</p>
                </div>
                <ul className="grid md:grid-cols-2 gap-6 list-none p-0">
                    {data.features.map((feature, idx) => {
                        const [bold, rest] = feature.split(':');
                        return (
                            <li key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white leading-tight">
                                            {bold.replace(/\*\*/g, '')}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {rest}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </section>

            {/* How to Use Steps */}
            <section id="how-to" className="bg-slate-100 dark:bg-slate-900/50 p-8 rounded-2xl scroll-mt-20">
                <h2 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white text-center">How to use {data.title}</h2>
                <div className="space-y-8">
                    {data.howToUse.map((step, idx) => (
                        <div key={idx} className="flex gap-6 items-start">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                {idx + 1}
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">{step.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Related Tools Section - MOVED UP */}
            {relatedTools.length > 0 && (
                <section className="py-12 border-y border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Discover Related Tools</h2>
                        <Link href="/" className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline">View All Tools</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {relatedTools.map((tool) => {
                            const { icon: _icon, ...safeTool } = tool;
                            return (
                                <ToolCard
                                    key={tool.slug}
                                    tool={safeTool}
                                    icon={<tool.icon className="w-5 h-5" />}
                                />
                            );
                        })}
                    </div>
                </section>
            )}

            {/* FAQ Section */}
            <section id="faqs" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Frequently Asked Questions about {data.title}</h2>
                <div className="space-y-4">
                    {data.faqs.map((faq, idx) => (
                        <div key={idx} className="border-b border-slate-200 dark:border-slate-800 pb-4">
                            <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">{faq.question}</h3>
                            <p className="text-slate-600 dark:text-slate-400">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Toolboxed Section */}
            <section className="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                <div className="max-w-3xl">
                    <h2 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Why use Toolboxed.online?</h2>
                    <p className="text-blue-800/80 dark:text-blue-200/60 leading-relaxed mb-6">
                        Toolboxed is a curated suite of high-performance utility tools designed for modern professionals.
                        Unlike other tool sites, we prioritize <strong>privacy, speed, and zero distractions</strong>.
                        None of your data ever leaves your browser, and we never show annoying ads.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            100% Free & Open Source
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            No Registration Required
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Client-Side Processing
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Mobile Friendly Design
                        </div>
                    </div>
                </div>
            </section>

        </article>
    );
}
