import { CompoundInterest } from '@/components/tools/business/CompoundInterest';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

import { getCombinedTitle } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
    const slug = 'compound-interest';
    const combinedTitle = getCombinedTitle(slug);

    return {
        title: combinedTitle,
        description: 'Calculate how your money grows over time with compound interest. Plan your savings, retirement, or investment strategies with our free online tool.',
        keywords: ['compound interest calculator', 'interés compuesto', 'चक्रवृद्धि ब्याज', 'investment calculator', 'savings planner', 'future value calculator', 'retirement planning tool'],
        alternates: {
            canonical: '/compound-interest',
        },
    };
}

export default function CompoundPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Compound Interest Calculator"
                    description="Visualise the power of exponential growth."
                />

                <CompoundInterest />
            </div>

            <ToolContent slug="compound-interest" />
        </div>
    );
}
