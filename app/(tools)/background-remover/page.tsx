import { Metadata } from 'next';
import BackgroundRemover from '@/components/tools/utility/BackgroundRemover';
import { ToolContent } from '@/components/tools/ToolContent';
import { toolContentData } from '@/config/tool-content';
import { getCombinedTitle } from '@/lib/i18n';
import { BackButton } from '@/components/shared/BackButton';

export async function generateMetadata({ searchParams }: { searchParams: { lang?: string } }): Promise<Metadata> {
    const lang = searchParams.lang || 'en';
    const slug = 'background-remover';
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

export default function BackgroundRemoverPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <BackgroundRemover />
            </div>
            <ToolContent slug="background-remover" />
        </div>
    );
}
