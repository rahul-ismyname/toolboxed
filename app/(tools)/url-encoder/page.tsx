import { UrlEncoder } from '@/components/tools/developer/UrlEncoder';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'URL Encoder / Decoder | Percent-encoding Tool',
    description: 'Easily encode or decode URLs. Convert special characters to their percent-encoded counterparts for safe query strings and API usage.',
    keywords: ['url encoder', 'url decoder', 'percent encoding', 'uri component', 'query string encoder'],
    alternates: {
        canonical: '/url-converter',
    },
};


export default function UrlEncoderPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <Breadcrumb category="Developer" name="URL Encoder / Decoder" />
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        URL Encoder / Decoder
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Transform URIs and simplify query strings safely.
                    </p>
                </div>

                <UrlEncoder />
            </div>

            <ToolContent slug="url-converter" />
        </div>
    );
}
