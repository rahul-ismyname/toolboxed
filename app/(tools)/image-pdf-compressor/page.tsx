import { DynamicImagePdfCompressor } from '@/components/tools/DynamicTools';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

import { getCombinedTitle } from '@/lib/i18n';

import { toolContentData } from '@/config/tool-content';

export async function generateMetadata({ searchParams }: { searchParams: { lang?: string } }): Promise<Metadata> {
    const lang = searchParams.lang || 'en';
    const slug = 'image-pdf-compressor';
    const title = getCombinedTitle(slug);
    const description = toolContentData[slug]?.localizedMetadata?.[lang]?.description || toolContentData[slug]?.description;

    return {
        title,
        description,
        alternates: {
            canonical: `/${slug}`,
            languages: {
                'es': `/${slug}?lang=es`,
                'pt': `/${slug}?lang=pt`,
                'hi': `/${slug}?lang=hi`,
            },
        },
    };
}

export default function ConverterPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <Breadcrumb category="Utility" name="Image & PDF Compressor" />
                <TitleSection
                    title="Image & PDF Compressor"
                    description="Securely compress and convert images and PDFs directly in your browser."
                />

                <DynamicImagePdfCompressor />
            </div>

            <ToolContent slug="image-pdf-compressor" />
        </div>
    );
}
