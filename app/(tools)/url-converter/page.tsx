import { UrlEncoderDecoder } from '@/components/tools/developer/UrlEncoderDecoder';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'URL Encoder & Decoder | Percent-Encoding Online Tool',
    description: 'Safely encode or decode URLs and query parameters. Convert special characters into percent-encoded format for safe transmission over the web.',
    keywords: ['url encoder', 'url decoder', 'percent encoding', 'encode url online', 'decode url parameters', 'web developer tool'],
    alternates: {
        canonical: '/url-converter',
    },
};

export default function UrlPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="URL Encoder & Decoder"
                    description="Convert URLs and query parameters safely."
                />

                <UrlEncoderDecoder />
            </div>

            <ToolContent slug="url-converter" />
        </div>
    );
}
