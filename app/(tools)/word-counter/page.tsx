import { WordCounter } from '@/components/tools/utility/WordCounter';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

import { getCombinedTitle } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
    const slug = 'word-counter';
    const combinedTitle = getCombinedTitle(slug);

    return {
        title: combinedTitle,
        description: 'Free online word counter with character, sentence, and paragraph counts. Estimate reading and speaking time instantly.',
        keywords: ['word counter', 'contador de palabras', 'वर्ड काउंटर', 'character count', 'reading time calculator', 'text analysis', 'word density'],
        alternates: {
            canonical: '/word-counter',
        },
    };
}

export default function WordPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Word Counter"
                    description="Deep text analysis and statistics."
                />

                <WordCounter />
            </div>

            <ToolContent slug="word-counter" />
        </div>
    );
}
