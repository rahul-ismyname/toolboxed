import { ColorTool } from '@/components/tools/developer/ColorTool';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Color Converter | HEX, RGB, HSL Online Color Tool',
    description: 'Convert color codes between HEX, RGB, and HSL formats instantly. Use our visual color picker to find the perfect shade for your web design projects.',
    keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'hsl converter', 'color picker online', 'web design tools'],
    alternates: {
        canonical: '/color-converter',
    },
};

export default function ColorPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Color Converter"
                    description="Professional color tools for web designers."
                />

                <ColorTool />
            </div>

            <ToolContent slug="color-converter" />
        </div>
    );
}
