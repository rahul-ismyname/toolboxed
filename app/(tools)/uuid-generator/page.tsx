import { UuidGenerator } from '@/components/tools/developer/UuidGenerator';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'UUID Generator | Create V1, V3, V4, V5 UUIDs Instantly',
    description: 'Free online UUID generator. Create specialized Universally Unique Identifiers (Version 1, 3, 4, 5) individually or in bulk. Secure client-side generation.',
    keywords: ['uuid generator', 'guid generator', 'v4 uuid', 'random uuid', 'unique identifier', 'generate guid online'],
    alternates: {
        canonical: '/uuid-generator',
    },
};

export default function UuidGeneratorPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="UUID Generator"
                    description="Generate universally unique identifiers instantly."
                />

                <UuidGenerator />
            </div>

            <ToolContent slug="uuid-generator" />
        </div>
    );
}
