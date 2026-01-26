import { DynamicLandingPageBuilder } from '@/components/tools/DynamicTools';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Visual Landing Page Builder | Drag-and-Drop SaaS Design Tool',
    description: 'Design professional SaaS landing pages visually and export the code instantly. Featuring one-click templates and advanced customization. 100% free and private.',
    keywords: ['landing page builder', 'saas builder', 'drag and drop designer', 'export react tailwind', 'visual web designer'],
    alternates: {
        canonical: '/landing-page-builder',
    },
};

export default function LandingPageBuilderPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <BackButton />
            <Breadcrumb category="Business" name="Landing Page Builder" />
            <div className="mb-8">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Visual Landing Page Builder</h1>
                <p className="text-xl text-slate-500 dark:text-slate-400">Design professional SaaS landing pages visually and export the code instantly.</p>
            </div>
            <DynamicLandingPageBuilder />
            <ToolContent slug="landing-page-builder" />
        </div>
    );
}
