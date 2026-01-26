import { RandomChoice } from '@/components/tools/utility/RandomChoice';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Random Choice Maker | Decision Helper & Picker',
    description: 'Can\'t decide? Enter your options and let our Random Choice Maker pick a winner with a fun shuffle animation.',
    keywords: ['random choice generator', 'decision maker', 'random picker', 'list shuffler', 'lucky draw'],
    alternates: {
        canonical: '/random-choice',
    },
};

export default function RandomChoicePage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Random Choice Maker"
                    description="Let fate decide with a fun, animated picker."
                />

                <RandomChoice />
            </div>

            <ToolContent slug="random-choice" />
        </div>
    );
}
