import { DynamicStickmanAnimator } from '@/components/tools/DynamicTools';
import { BackButton } from '@/components/shared/BackButton';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Stickman Animator | Free Online Animation Tool',
    description: 'Create fluid stickman animations directly in your browser. Keyframe-based animation with professional controls.',
    keywords: ['stickman animation', 'online animator', 'pivot animation', '2d animation', 'browser animator'],
    alternates: {
        canonical: '/stickman-animator',
    },
    openGraph: {
        title: 'Stickman Animator | Professional Browser-Based Animation Tool',
        description: 'Create fluid stickman animations directly in your browser with keyframes and onion skinning. No install required.',
        images: ['/og-image.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Stickman Animator | Professional Online Animator',
        description: 'Visual keyframe animation studio in your browser.',
        images: ['/og-image.png'],
    },
};

export default function StickmanPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
                <Breadcrumb category="Design" name="Stickman Animator" />
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Stickman Animator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Bring your characters to life with professional keyframe animation.
                    </p>
                </div>

                <DynamicStickmanAnimator />
            </div>

            <ToolContent slug="stickman-animator" />
        </div>
    );
}
