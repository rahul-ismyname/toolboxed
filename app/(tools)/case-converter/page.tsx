import { CaseConverter } from '@/components/tools/utility/CaseConverter';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Case Converter | UPPERCASE, lowercase, Title Case & More',
    description: 'Easily change the case of your text online. Convert to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, and snake_case instantly.',
    keywords: ['case converter', 'uppercase to lowercase', 'title case tool', 'text transformation', 'camelcase converter', 'sentence case online'],
    alternates: {
        canonical: '/case-converter',
    },
};

export default function CasePage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Case Converter"
                    description="Transform your text into any format instantly."
                />

                <CaseConverter />
            </div>

            <ToolContent slug="case-converter" />
        </div>
    );
}
