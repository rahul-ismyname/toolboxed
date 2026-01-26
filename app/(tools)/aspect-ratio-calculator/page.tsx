import { AspectRatioCalculator } from '@/components/tools/design/AspectRatioCalculator';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Aspect Ratio Calculator | Resize Images & Video Dimensions',
    description: 'Free online aspect ratio calculator. Calculate dimensions (width/height) while maintaining ratio. Find common ratios like 16:9, 4:3, 1:1, and 9:16.',
    keywords: ['aspect ratio calculator', 'screen resolution calculator', 'resize image calculator', '16:9 calculator', '4:3 calculator'],
    alternates: {
        canonical: '/aspect-ratio-calculator',
    },
};

export default function AspectRatioPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Aspect Ratio Calculator"
                    description="Calculate pixel dimensions and image ratios effortlessly."
                />

                <AspectRatioCalculator />
            </div>

            <ToolContent slug="aspect-ratio-calculator" />
        </div>
    );
}
