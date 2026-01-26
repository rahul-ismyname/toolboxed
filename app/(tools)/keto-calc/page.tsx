import { KetoCalculator } from '@/components/tools/keto/KetoCalculator';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Keto Calculator | Scientific Ketogenic Macro & Calorie Counter',
    description: 'Calculate your exact macros for the ketogenic diet. Accurate Keto Calculator for weight loss, maintenance, or muscle gain. Free and easy to use.',
    keywords: ['keto calculator', 'ketogenic diet macros', 'carb calculator', 'keto weight loss', 'low carb calculator'],
};

export default function KetoCalcPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
                <TitleSection
                    title="Keto Macro Calculator"
                    description="Master your metabolism with our scientific ketogenic calculator."
                />

                <KetoCalculator />
            </div>

            <ToolContent slug="keto-calc" />
        </div>
    );
}
