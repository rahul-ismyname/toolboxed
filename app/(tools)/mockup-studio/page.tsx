import { Suspense } from 'react';
import { MockupStudio } from '@/components/tools/design/MockupStudio';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '3D Device Mockup Studio | Professional Design Tool',
    description: 'Transform your screenshots into stunning 3D device mockups. Custom rotatable models for iPhone and MacBook, entirely in your browser.',
    keywords: ['3d mockup generator', 'iphone mockup', 'macbook mockup', 'app screenshot renderer', 'browser-based mockup tool', '3d device preview'],
    alternates: {
        canonical: '/mockup-studio',
    },
};

export default function MockupPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="3D Device Mockup Studio"
                    description="High-end presentation for your apps and websites."
                />

                <Suspense fallback={<div className="min-h-[500px] animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl" />}>
                    <MockupStudio />
                </Suspense>
            </div>

            <ToolContent slug="mockup-studio" />
        </div>
    );
}
