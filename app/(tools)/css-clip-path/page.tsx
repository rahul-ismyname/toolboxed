import { ClipPathGenerator } from '@/components/tools/design/ClipPathGenerator';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'CSS Clip Path Generator | Create Custom CSS Shapes Online',
    description: 'Interactive CSS clip-path maker. Drag and drop points to create polygons, circles, and custom shapes. Copy ready-to-use CSS code instantly.',
    keywords: ['css clip path generator', 'clip-path maker', 'css shapes generator', 'polygon generator', 'css masking tool'],
    alternates: {
        canonical: '/css-clip-path',
    },
};

export default function ClipPathPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="CSS Clip Path Generator"
                    description="Create complex shapes and masks with CSS."
                />

                <ClipPathGenerator />
            </div>

            <ToolContent slug="css-clip-path" />
        </div>
    );
}
