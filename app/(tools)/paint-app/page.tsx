import { PaintApp } from '@/components/tools/design/PaintApp';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Paint App | Free Online Drawing Tool',
    description: 'Sketch, draw, and create digital art directly in your browser. Features pencil, shapes, custom colors, and image export.',
    keywords: ['paint online', 'drawing tool', 'sketchpad', 'digital art', 'canvas app'],
    alternates: {
        canonical: '/paint-app',
    },
};

export default function PaintPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Paint App
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Create masterpiece directly in your browser.
                    </p>
                </div>

                <PaintApp />
            </div>
        </div>
    );
}
