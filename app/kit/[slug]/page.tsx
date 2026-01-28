
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { personaData } from '@/config/personas';
import { ArrowRight, CheckCircle2, Layers } from 'lucide-react';
import { BackButton } from '@/components/shared/BackButton';
import Link from 'next/link';

interface Props {
    params: {
        slug: string;
    };
}

// Generate static params for all defined personas
export function generateStaticParams() {
    return personaData.map((page) => ({
        slug: page.slug,
    }));
}

export function generateMetadata({ params }: Props): Metadata {
    const page = personaData.find((p) => p.slug === params.slug);
    if (!page) return {};

    return {
        title: page.title,
        description: page.description,
        alternates: {
            canonical: `/kit/${page.slug}`,
        },
    };
}

export default function PersonaPage({ params }: Props) {
    const page = personaData.find((p) => p.slug === params.slug);

    if (!page) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero Section */}
            <div className="bg-slate-900 border-b border-slate-800 pt-16 pb-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute left-0 bottom-0 w-[600px] h-[600px] bg-blue-500 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <BackButton className="text-slate-400 hover:text-white mb-8" />
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                            <Layers className="w-4 h-4" />
                            Curated Workflow Kit
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                            {page.heroTitle}
                        </h1>
                        <p className="text-xl text-slate-400 leading-relaxed">
                            {page.heroSubtitle}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 relative z-20">

                {/* Tools Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                    {page.tools.map((tool) => (
                        <Link
                            key={tool.slug}
                            href={`/${tool.slug}`}
                            className="group bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
                                    {tool.icon ? <tool.icon className="w-6 h-6" /> : <div className="w-6 h-6" />}
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                {tool.name}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                {tool.description}
                            </p>
                        </Link>
                    ))}
                </div>

                {/* Workflow Section */}
                <div className="max-w-4xl mx-auto mb-24">
                    <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-16">
                        Master Your Workflow
                    </h2>

                    <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-0 space-y-16">
                        {page.workflow.map((flow, index) => (
                            <div key={index} className="relative pl-8 md:pl-0">
                                <div className="md:absolute md:left-0 md:-translate-x-1/2 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-950 text-slate-500 flex items-center justify-center font-bold text-sm z-10">
                                    {index + 1}
                                </div>

                                <div className="md:ml-12">
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                                        {flow.title}
                                    </h3>
                                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 md:p-8 space-y-4">
                                        {flow.steps.map((step, sC) => (
                                            <div key={sC} className="flex items-start gap-4">
                                                <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                                                <div
                                                    className="text-slate-600 dark:text-slate-300 prose dark:prose-invert"
                                                    dangerouslySetInnerHTML={{
                                                        // Simple markdown-to-html for bolding tool names
                                                        __html: step.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 dark:text-white font-bold">$1</strong>')
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
