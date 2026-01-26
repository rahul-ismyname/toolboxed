import { Base64Tool } from '@/components/tools/developer/Base64Tool';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Base64 Encoder & Decoder | Convert Text to Base64 Online',
    description: 'Encode and decode text to Base64 format instantly. Secure, client-side conversion for developers and data processing.',
    keywords: ['base64 encoder', 'base64 decoder', 'base64 online', 'convert to base64', 'decode base64'],
    alternates: {
        canonical: '/base64',
    },
};

export default function Base64Page() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Base64 Encoder & Decoder"
                    description="Reliable data encoding for modern workflows."
                />

                <Base64Tool />
            </div>

            <ToolContent slug="base64" />
        </div>
    );
}
