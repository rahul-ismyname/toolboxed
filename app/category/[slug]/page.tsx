import { tools, ToolCategory } from '@/config/tools';
import { ToolCard } from '@/components/registry/ToolCard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const categories = Array.from(new Set(tools.map(t => t.category.toLowerCase())));
    return categories.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params;
    const category = slug.charAt(0).toUpperCase() + slug.slice(1);

    return {
        title: `Professional ${category} Tools | Free Online Utilities`,
        description: `Explore our curated selection of free, high-performance ${category} tools. No registration required, 100% private, and browser-based utilities for modern professionals.`,
        keywords: [`${category} tools`, `online ${category} utilities`, `free ${category} software`, 'Toolboxed'],
        alternates: {
            canonical: `/category/${slug}`,
        },
        openGraph: {
            title: `${category} Tools - Professional Online Suite`,
            description: `Free, private, and high-performance ${category} tools for modern workflows.`,
            type: 'website',
            url: `/category/${slug}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: `${category} Tools | Toolboxed`,
            description: `The ultimate suite of professional ${category} utilities.`,
        },
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
    const categoryTools = tools.filter(
        t => t.category.toLowerCase() === slug.toLowerCase()
    );

    if (categoryTools.length === 0) {
        notFound();
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <Breadcrumb name={categoryName} />

                    <div className="mb-16">
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
                            {categoryName} <span className="text-slate-400 dark:text-slate-600">Utilities</span>
                        </h1>
                        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                            A professional suite of high-performance tools designed to simplify your {categoryName.toLowerCase()} workflow.
                            Built for privacy, speed, and precision.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categoryTools.map((tool) => {
                            const { icon: _icon, ...safeTool } = tool;
                            return (
                                <ToolCard
                                    key={tool.slug}
                                    tool={safeTool}
                                    icon={<tool.icon className="w-6 h-6" />}
                                />
                            );
                        })}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
