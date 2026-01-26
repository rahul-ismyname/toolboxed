import { BmrCalculator } from '@/components/tools/health/BmrCalculator';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'BMR Calculator | Basal Metabolic Rate & Daily Calorie Needs',
    description: 'Calculate your Basal Metabolic Rate (BMR) and estimate your daily calorie requirements based on your activity level using our free online health tool.',
    keywords: ['bmr calculator', 'basal metabolic rate', 'how many calories do i burn', 'calorie needs calculator', 'tdee calculator'],
    alternates: {
        canonical: '/bmr-calculator',
    },
};

export default function BmrPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="BMR Calculator"
                    description="Map your metabolism for better health planning."
                />

                <BmrCalculator />
            </div>

            <ToolContent slug="bmr-calculator" />
        </div>
    );
}
