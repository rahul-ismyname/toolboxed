import { DynamicPaintApp } from '@/components/tools/DynamicTools';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
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
                <TitleSection
                    title="Paint App"
                    description="Create masterpiece directly in your browser."
                />

                <DynamicPaintApp />
            </div>

            <ToolContent slug="paint-app" />
        </div>
    );
}
