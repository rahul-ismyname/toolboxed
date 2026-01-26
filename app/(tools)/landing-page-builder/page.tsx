import { DynamicLandingPageBuilder } from '@/components/tools/DynamicTools';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Visual Landing Page Builder | Toolboxed',
    description: 'Design professional SaaS landing pages visually and export the code instantly. Featuring one-click templates and advanced customization.',
};

export default function LandingPageBuilderPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Visual Landing Page Builder</h1>
                <p className="text-slate-600 dark:text-slate-400">Design professional SaaS landing pages visually and export the code instantly.</p>
            </div>
            <DynamicLandingPageBuilder />
        </div>
    );
}
