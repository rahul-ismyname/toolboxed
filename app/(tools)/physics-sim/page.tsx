import { Metadata } from 'next';
import { PhysicsSimWrapper } from '@/components/tools/utility/PhysicsSimWrapper';
import { ToolContent } from '@/components/tools/ToolContent';
import { BackButton } from '@/components/shared/BackButton';
import { toolContentData } from '@/config/tool-content';
import { getCombinedTitle } from '@/lib/i18n';

export async function generateMetadata({ searchParams }: { searchParams: { lang?: string } }): Promise<Metadata> {
    const lang = searchParams.lang || 'en';
    const slug = 'physics-sim';
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

export default function PhysicsSimPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 mb-12">
                <PhysicsSimWrapper />
            </div>

            <ToolContent slug="physics-sim" />
        </div>
    );
}
