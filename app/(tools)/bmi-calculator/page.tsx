import { BmiCalculator } from '@/components/tools/health/BmiCalculator';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'BMI Calculator | Body Mass Index Check',
    description: 'Calculate your Body Mass Index (BMI) online instantly. Check if you are in a healthy weight range based on your height and weight.',
    keywords: ['bmi calculator', 'body mass index', 'healthy weight', 'obesity calculator', 'health tools'],
    alternates: {
        canonical: '/bmi-calculator',
    },
};

export default function BmiPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="BMI Calculator"
                    description="Check your health status in seconds."
                />

                <BmiCalculator />
            </div>

            <ToolContent slug="bmi-calculator" />
        </div>
    );
}
