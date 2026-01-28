import { Suspense } from 'react';
import { DynamicAnimatedPatternMaster } from '@/components/tools/DynamicTools';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

import { toolContentData } from '@/config/tool-content';
import { getCombinedTitle } from '@/lib/i18n';

export async function generateMetadata({ searchParams }: { searchParams: { lang?: string } }): Promise<Metadata> {
    const lang = searchParams.lang || 'en';
    const slug = 'animated-patterns';
    const title = getCombinedTitle(slug);
    const description = toolContentData[slug]?.localizedMetadata?.[lang]?.description || toolContentData[slug]?.description;

    return {
        title,
        description,
        alternates: {
            canonical: `/${slug}`,
            languages: {
                'es': `/${slug}?lang=es`,
                'pt': `/${slug}?lang=pt`,
                'hi': `/${slug}?lang=hi`,
            },
        },
    };
}

export default function PatternPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
                <Breadcrumb category="Design" name="Animated Pattern Master" />
                <TitleSection
                    title="Animated Pattern Master"
                    description="Infinite, animatable SVG patterns for modern web design."
                />

                <div className="rounded-3xl shadow-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
                    <Suspense fallback={<div className="min-h-[600px] animate-pulse bg-slate-100 dark:bg-slate-800" />}>
                        <DynamicAnimatedPatternMaster />
                    </Suspense>
                </div>
            </div>

            <ToolContent slug="animated-patterns" />
        </div>
    );
}
