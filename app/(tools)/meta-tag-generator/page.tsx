import { MetaTagGenerator } from '@/components/tools/developer/MetaTagGenerator';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Meta Tag Generator | SEO & Social Media Preview Tool',
    description: 'Create optimized meta tags for SEO, Open Graph (Facebook), and Twitter Cards. Preview exactly how your website will look in search results and social shares.',
    keywords: ['meta tag generator', 'seo tool', 'open graph generator', 'twitter card generator', 'social media preview', 'website previewer'],
    alternates: {
        canonical: '/meta-tag-generator',
    },
};

export default function MetaTagPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Meta Tag Generator"
                    description="Boost your SEO and social clicks with perfect tags."
                />

                <MetaTagGenerator />
            </div>

            <ToolContent slug="meta-tag-generator" />
        </div>
    );
}
