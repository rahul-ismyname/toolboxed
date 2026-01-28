import { Suspense } from 'react';
import { CaseConverter } from '@/components/tools/utility/CaseConverter';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

import { getCombinedTitle } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
    const slug = 'case-converter';
    const combinedTitle = getCombinedTitle(slug);

    return {
        title: combinedTitle,
        description: 'Easily change the case of your text online. Convert to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, and snake_case instantly.',
        keywords: ['case converter', 'convertidor de mayúsculas', 'टेक्स्ट केस कनवर्टर', 'uppercase to lowercase', 'title case tool', 'text transformation', 'camelcase converter', 'sentence case online'],
        alternates: {
            canonical: '/case-converter',
        },
    };
}

export default function CasePage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Case Converter"
                    description="Transform your text into any format instantly."
                />

                <Suspense fallback={<div className="min-h-[500px] animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl" />}>
                    <CaseConverter />
                </Suspense>
            </div>

            <ToolContent slug="case-converter" />
        </div>
    );
}
