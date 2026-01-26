import { DynamicImageConverter } from '@/components/tools/DynamicTools';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Image Converter & Compressor | Compress PNG, JPG, WebP Online',
    description: 'Free online image compressor and converter. Reduce file size of PNG and JPG images by up to 80% without quality loss. 100% private & browser-based.',
    keywords: ['compress image', 'reduce image size', 'image converter', 'webp converter', 'png to jpg', 'jpg to webp'],
    alternates: {
        canonical: '/image-converter',
    },
};

export default function ConverterPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Image Converter & Compressor"
                    description="Securely compress and convert images directly in your browser."
                />

                <DynamicImageConverter />
            </div>

            <ToolContent slug="image-converter" />
        </div>
    );
}
