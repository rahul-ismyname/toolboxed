import { DynamicAnimatedPatternMaster } from '@/components/tools/DynamicTools';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Animated Pattern Master | SVG Background Generator',
    description: 'Generate and animate infinite SVG patterns for modern backgrounds. Customize scale, color, speed, and export high-quality CSS or SVG code.',
    keywords: ['svg pattern generator', 'animated backgrounds', 'css patterns', 'svg backgrounds', 'design tools'],
    alternates: {
        canonical: '/animated-patterns',
    },
};

export default function PatternPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
                <Breadcrumb category="Design" name="Animated Pattern Master" />
                <TitleSection
                    title="Animated Pattern Master"
                    description="Infinite, animatable SVG patterns for modern web design."
                />

                <div className="rounded-3xl shadow-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
                    <DynamicAnimatedPatternMaster />
                </div>
            </div>

            <ToolContent slug="animated-patterns" />
        </div>
    );
}
