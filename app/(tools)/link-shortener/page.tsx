import { Metadata } from 'next';
import LinkShortener from '@/components/tools/utility/LinkShortener';
import { ToolContent } from '@/components/tools/ToolContent';

import { toolContentData } from '@/config/tool-content';
import { getCombinedTitle } from '@/lib/i18n';

export async function generateMetadata({ searchParams }: { searchParams: { lang?: string } }): Promise<Metadata> {
    const lang = searchParams.lang || 'en';
    const slug = 'link-shortener';
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

export default function LinkShortenerPage() {
    return (
        <>
            <LinkShortener />
            <ToolContent slug="link-shortener" />
        </>
    );
}
