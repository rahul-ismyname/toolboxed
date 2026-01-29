import { Metadata } from 'next';
import { TitleSection } from '@/components/shared/TitleSection';
import { ToolContent } from '@/components/tools/ToolContent';
import { toolContentData } from '@/config/tool-content';
import { getCombinedTitle } from '@/lib/i18n';
import { BackButton } from '@/components/shared/BackButton';
import VideoCompressor from '@/components/tools/utility/VideoCompressor';

export async function generateMetadata(props: { searchParams: Promise<{ lang?: string }> }): Promise<Metadata> {
    const searchParams = await props.searchParams;
    const lang = searchParams.lang || 'en';
    const slug = 'video-compressor';
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

export default function VideoCompressorPage() {
    const slug = 'video-compressor';
    const data = toolContentData[slug];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title={data.title}
                    description={data.description}
                />
                <VideoCompressor />
            </div>

            <ToolContent slug={slug} />
        </div>
    );
}
