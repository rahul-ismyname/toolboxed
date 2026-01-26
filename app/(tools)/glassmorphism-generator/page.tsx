import { GlassGenerator } from '@/components/tools/developer/GlassGenerator';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'CSS Glassmorphism Generator | Modern Design Tool',
    description: 'Create beautiful glass-styled UI elements with our visual Glassmorphism generator. Adjust blur, transparency, and borders, then copy the CSS code.',
    keywords: ['glassmorphism generator', 'css glass effect', 'modern ui tools', 'backdrop filter tool', 'css design generator'],
    alternates: {
        canonical: '/glassmorphism-generator',
    },
};

export default function GlassPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Glassmorphism Generator"
                    description="Design premium UI components in seconds."
                />

                <GlassGenerator />
            </div>

            <ToolContent slug="glassmorphism-generator" />
        </div>
    );
}
