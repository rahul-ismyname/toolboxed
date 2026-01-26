import { PlaceholderGenerator } from '@/components/tools/utility/PlaceholderGenerator';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Image Placeholder Generator | Custom Dummy Images for Developers',
    description: 'Generate custom placeholder image URLs for your web projects. Customize width, height, colors, and text instantly with our free online dummy image tool.',
    keywords: ['image placeholder generator', 'dummy image tool', 'placeholder url creator', 'developer utility', 'mockup image generator'],
    alternates: {
        canonical: '/placeholder-generator',
    },
};

export default function PlaceholderPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Image Placeholder Generator"
                    description="Create custom mock images for your web prototypes."
                />

                <PlaceholderGenerator />
            </div>

            <ToolContent slug="placeholder-generator" />
        </div>
    );
}
