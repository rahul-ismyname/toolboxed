import { JsonFormatter } from '@/components/tools/json/JsonFormatter';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'JSON Formatter & Validator | Prettify and Minify JSON Online',
    description: 'Free online JSON formatter, validator, and minifier. Beautify your JSON code or compress it for production. Syntax highlighting and error detection included.',
    keywords: ['json formatter', 'json validator', 'json prettify', 'minify json', 'json editor online'],
    alternates: {
        canonical: '/json-formatter',
    },
};



export default function JsonToolPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <Breadcrumb category="Developer" name="JSON Formatter" />
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        JSON Formatter & Validator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        The professional's choice for debugging and formatting JSON data.
                    </p>
                </div>

                <JsonFormatter />
            </div>

            <ToolContent slug="json-formatter" />
        </div>
    );
}
