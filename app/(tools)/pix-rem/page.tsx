import { PixelConverter } from '@/components/tools/developer/PixelConverter';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pixel to REM Converter | CSS Unit Calculator',
    description: 'Convert PX pixels to REM units instantly. Essential tool for responsive web design and creating accessible layouts.',
    keywords: ['px to rem', 'rem converter', 'css units', 'web design calculator', 'responsive design'],
};

export default function PixelConverterPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
                <TitleSection
                    title="PX to REM Converter"
                    description="Modern CSS units made simple."
                />

                <PixelConverter />
            </div>

            <ToolContent slug="pix-rem" />
        </div>
    );
}
