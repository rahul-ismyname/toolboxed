
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { comparisonData, ComparisonPageData } from '@/config/comparisons';
import { JsonFormatter } from '@/components/tools/developer/JsonFormatter';
import { Check, X, ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';
import { BackButton } from '@/components/shared/BackButton';
import Link from 'next/link';

interface Props {
    params: {
        slug: string;
    };
}

// Generate static params for all defined comparisons
export function generateStaticParams() {
    return comparisonData.map((page) => ({
        slug: page.slug,
    }));
}

export function generateMetadata({ params }: Props): Metadata {
    const page = comparisonData.find((p) => p.slug === params.slug);
    if (!page) return {};

    return {
        title: page.title,
        description: page.description,
        alternates: {
            canonical: `/compare/${page.slug}`,
        },
    };
}

export default function ComparisonPage({ params }: Props) {
    const page = comparisonData.find((p) => p.slug === params.slug);

    if (!page) {
        notFound();
    }

    // Helper to render the correct tool
    const renderTool = (slug: string) => {
        switch (slug) {
            case 'json-formatter':
                return <JsonFormatter />;
            // Add more tools here as we create more comparisons
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Hero Section */}
            <div className="bg-slate-900 border-b border-slate-800 pt-16 pb-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <BackButton className="text-slate-400 hover:text-white mb-8" />
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                            <ShieldCheck className="w-4 h-4" />
                            Privacy First Comparison
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
                {/* Comparison Table */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-24">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                        {/* Feature Labels */}
                        <div className="hidden md:block bg-slate-50 dark:bg-slate-950/50 border-r border-slate-200 dark:border-slate-800 p-8">
                            <div className="h-12 mb-8" /> {/* Spacer for header */}
                            <div className="space-y-8">
                                {page.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-medium h-8">
                                        {feature.icon && <feature.icon className="w-5 h-5 opacity-70" />}
                                        {feature.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Toolboxed Column */}
                        <div className="p-8 bg-emerald-50/50 dark:bg-emerald-900/10 relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                            <div className="h-12 mb-8 flex items-center gap-3">
                                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-slate-900 dark:text-white">Toolboxed</span>
                            </div>
                            <div className="space-y-8">
                                {page.features.map((feature, i) => (
                                    <div key={i} className="flex md:hidden flex-col gap-1 mb-4">
                                        <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">{feature.name}</span>
                                        <div className="h-8 flex items-center text-slate-900 dark:text-white font-bold">
                                            {typeof feature.toolboxed === 'boolean' ?
                                                (feature.toolboxed ? <Check className="w-6 h-6 text-emerald-500" /> : <X className="w-6 h-6 text-red-500" />) :
                                                feature.toolboxed
                                            }
                                        </div>
                                    </div>
                                ))}
                                {page.features.map((feature, i) => (
                                    <div key={i} className="hidden md:flex items-center h-8 text-slate-900 dark:text-white font-bold">
                                        {typeof feature.toolboxed === 'boolean' ?
                                            (feature.toolboxed ? <Check className="w-6 h-6 text-emerald-500" /> : <X className="w-6 h-6 text-red-500" />) :
                                            feature.toolboxed
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Competitors Column */}
                        <div className="p-8 bg-white dark:bg-slate-900 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="h-12 mb-8 flex items-center gap-3">
                                <span className="text-xl font-bold text-slate-500">Other Tools</span>
                            </div>
                            <div className="space-y-8">
                                {page.features.map((feature, i) => (
                                    <div key={i} className="flex md:hidden flex-col gap-1 mb-4">
                                        <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">{feature.name}</span>
                                        <div className="h-8 flex items-center text-slate-500">
                                            {typeof feature.competitors === 'boolean' ?
                                                (feature.competitors ? <Check className="w-6 h-6 text-emerald-500" /> : <X className="w-6 h-6 text-red-500" />) :
                                                feature.competitors
                                            }
                                        </div>
                                    </div>
                                ))}
                                {page.features.map((feature, i) => (
                                    <div key={i} className="hidden md:flex items-center h-8 text-slate-500">
                                        {typeof feature.competitors === 'boolean' ?
                                            (feature.competitors ? <Check className="w-6 h-6 text-emerald-500" /> : <X className="w-6 h-6 text-red-500" />) :
                                            feature.competitors
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* The Tool Embed */}
                <div className="mb-24">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Try various modes independently
                        </h2>
                        <div className="hidden md:flex items-center gap-2 text-emerald-500 font-medium">
                            <Lock className="w-4 h-4" />
                            Secure client-side processing
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[2.5rem] opacity-20 group-hover:opacity-40 blur transition duration-500" />
                        <div className="relative bg-white dark:bg-slate-950 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-2 md:p-8">
                            {renderTool(page.relatedToolSlug)}
                        </div>
                    </div>
                </div>

                {/* Pros/Cons & FAQ */}
                <div className="grid md:grid-cols-2 gap-12 mb-24">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Why switch?</h3>
                        <ul className="space-y-4">
                            {page.pros.map((pro, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <span className="text-slate-600 dark:text-slate-400">{pro}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Common Issues with Online Tools</h3>
                        <ul className="space-y-4">
                            {page.cons.map((con, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                                        <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                                    </div>
                                    <span className="text-slate-600 dark:text-slate-400">{con}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto mb-24">
                    <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-8">
                        {page.faq.map((item, i) => (
                            <div key={i} className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{item.question}</h4>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
