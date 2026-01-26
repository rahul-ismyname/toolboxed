import { AgeCalculator } from '@/components/tools/utility/AgeCalculator';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Age Calculator | Calculate Your Chronological Age Online',
    description: 'Quickly calculate your age in years, months, and days. Find out how many days you have lived and see the countdown to your next birthday.',
    keywords: ['age calculator', 'chronological age', 'how old am i', 'birthday calculator', 'age in days'],
    alternates: {
        canonical: '/age-calculator',
    },
};

export default function AgeCalcPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Age Calculator"
                    description="Detailed chronological age and fun facts."
                />

                <AgeCalculator />
            </div>

            <ToolContent slug="age-calculator" />
        </div>
    );
}
