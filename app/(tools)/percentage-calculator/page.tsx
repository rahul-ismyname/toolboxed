import { PercentageCalculator } from '@/components/tools/utility/PercentageCalculator';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Percentage Calculator | Free Online Percentage Tool',
    description: 'Calculate percentages, percentage change, and relative values instantly. A versatile tool for business, finance, and everyday math.',
    keywords: ['percentage calculator', 'percent change calculator', 'calculate percentage of', 'free math tools', 'percentage increase calculator'],
    alternates: {
        canonical: '/percentage-calculator',
    },
};

export default function PercentagePage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Percentage Calculator"
                    description="Solve any percentage problem in seconds."
                />

                <PercentageCalculator />
            </div>

            <ToolContent slug="percentage-calculator" />
        </div>
    );
}
