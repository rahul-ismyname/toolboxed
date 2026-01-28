import { Suspense } from 'react';
import { SVGEditor } from '@/components/tools/design/SVGEditor';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

import { getCombinedTitle } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
    const slug = 'svg-editor';
    const combinedTitle = getCombinedTitle(slug);
    const description = 'Edit SVG code in real-time with a live preview. Professional visual workspace to tweak colors, stroke widths, and vector paths instantly. 100% private and client-side.';

    return {
        title: combinedTitle || 'Live SVG Editor - Preview & Edit SVGs Online',
        description,
        keywords: [
            'svg editor', 'edit svg online', 'svg previewer', 'vector editor', 'live svg editor',
            'svg path editor', 'svg optimizer', 'svg code editor', 'svg visual editor', 'online svg tool'
        ],
        alternates: {
            canonical: '/svg-editor',
        },
        openGraph: {
            title: combinedTitle || 'Live SVG Editor - Professional Design Tool',
            description,
            type: 'website',
            url: 'https://toolboxed.online/svg-editor',
            siteName: 'Toolboxed',
        },
        twitter: {
            card: 'summary_large_image',
            title: combinedTitle || 'Live SVG Editor',
            description,
        }
    };
}

export default function SVGEditorPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Live SVG Editor"
                    description="Professional visual workspace for SVG manipulation."
                />

                <Suspense fallback={<div className="min-h-[500px] animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl" />}>
                    <SVGEditor />
                </Suspense>
            </div>

            <ToolContent slug="svg-editor" />
        </div>
    );
}
