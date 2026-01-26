import { BoxShadowGenerator } from '@/components/tools/design/BoxShadowGenerator';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Box Shadow Generator | CSS Layered Shadow Maker',
    description: 'Create beautiful, layered CSS box-shadows visually. Add multiple shadows, control blur and spread, and copy the CSS code instantly.',
    keywords: ['box shadow generator', 'css shadow maker', 'layered shadows', 'css generator', 'neumorphism generator'],
    alternates: {
        canonical: '/box-shadow-generator',
    },
};

export default function BoxShadowPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Box Shadow Generator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Design smooth, layered shadows for modern UI.
                    </p>
                </div>

                <BoxShadowGenerator />
            </div>

            <ToolContent slug="box-shadow-generator" />
        </div>
    );
}
