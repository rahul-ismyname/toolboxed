import { TextStats } from '@/components/tools/utility/TextStats';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Advanced Text Statistics | Word Count & Reading Analysis',
    description: 'Analyze your text deeply. Check word counts, estimated reading time, character frequency, and sentence structure instantly.',
    keywords: ['text analyzer', 'word counter', 'reading time calculator', 'character count', 'text statistics'],
    alternates: {
        canonical: '/text-statistics',
    },
};

export default function TextStatsPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Advanced Text Statistics"
                    description="Get deep insights into your writing instantly."
                />

                <TextStats />
            </div>

            <ToolContent slug="text-statistics" />
        </div>
    );
}
