import { HtmlEntitiesTool } from '@/components/tools/developer/HtmlEntitiesTool';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'HTML Entity Encoder & Decoder | Convert Special Characters',
    description: 'Safely encode special characters into HTML entities or decode entities back to plain text. Perfect for web developers and content managers needing to prevent XSS or display raw HTML.',
    keywords: ['html entity encoder', 'html entity decoder', 'html character encoding', 'encode html entities', 'decode html special characters'],
    alternates: {
        canonical: '/html-entities',
    },
};

export default function HtmlEntitiesPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="HTML Entity Encoder & Decoder"
                    description="Sanitize and format your web content safely."
                />

                <HtmlEntitiesTool />
            </div>

            <ToolContent slug="html-entities" />
        </div>
    );
}
