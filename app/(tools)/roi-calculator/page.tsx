import { RoiCalculator } from '@/components/tools/business/RoiCalculator';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'ROI Calculator | Calculate Return on Investment',
    description: 'Calculate the Return on Investment (ROI) for your marketing campaigns or business projects. Simple, fast, and free.',
    keywords: ['roi calculator', 'return on investment', 'marketing roi', 'profit calculator', 'business tools'],
};

export default function RoiCalcPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
                <TitleSection
                    title="ROI Calculator"
                    description="Measure the profitability of your investments."
                />

                <RoiCalculator />
            </div>

            <ToolContent slug="roi-calculator" />
        </div>
    );
}
