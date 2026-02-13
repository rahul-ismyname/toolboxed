import { Metadata } from 'next';
import { PhysicsSimWrapper } from '@/components/tools/utility/PhysicsSimWrapper';
import { ToolContent } from '@/components/tools/ToolContent';
import { toolContentData } from '@/config/tool-content';
import { getCombinedTitle } from '@/lib/i18n';
import { ToolShell } from '@/components/layout/ToolShell';

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
        <ToolShell toolId="physics-sim" fullWidth noPadding>
            <div className="h-[calc(100vh-64px)]">
                <PhysicsSimWrapper />
            </div>
            <div className="p-8">
                <ToolContent slug="physics-sim" />
            </div>
        </ToolShell>
    );
}
