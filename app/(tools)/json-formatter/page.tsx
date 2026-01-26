import { JsonFormatter } from '@/components/tools/developer/JsonFormatter';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'JSON Formatter & Validator | Prettify JSON Online',
    description: 'Format, validate, and minify your JSON data. Clean up messy JSON with beautiful indentation instantly.',
    keywords: ['json formatter', 'json validator', 'json prettifier', 'minify json', 'developer tools'],
    alternates: {
        canonical: '/json-formatter',
    },
};

export default function JsonPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="JSON Formatter"
                    description="Readable data for developers, in seconds."
                />

                <JsonFormatter />
            </div>

            <ToolContent slug="json-formatter" />
        </div>
    );
}
