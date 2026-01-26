import { DynamicAnimatedPatternMaster } from '@/components/tools/DynamicTools';
import { BackButton } from '@/components/shared/BackButton';
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
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">
                        Animated Pattern Master
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">
                        Infinite, animatable SVG patterns for modern web design.
                    </p>
                </div>

                <div className="rounded-3xl shadow-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
                    <DynamicAnimatedPatternMaster />
                </div>
            </div>
        </div>
    );
}
