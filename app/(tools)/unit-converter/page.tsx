import { UnitConverter } from '@/components/tools/utility/UnitConverter';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Unit Converter | Length, Weight, Temperature',
    description: 'Fast and accurate online unit converter. Convert between Metric and Imperial units for length, weight, and temperature.',
    keywords: ['unit converter', 'metric converter', 'imperial converter', 'length converter', 'weight converter'],
    alternates: {
        canonical: '/unit-converter',
    },
};

export default function UnitConverterPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Unit Converter"
                    description="Convert between Metric and Imperial units instantly."
                />

                <UnitConverter />
            </div>

            <ToolContent slug="unit-converter" />
        </div>
    );
}
