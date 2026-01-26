import { DiffChecker } from '@/components/tools/developer/DiffChecker';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Text Diff Checker | Compare Two Texts Online',
    description: 'Quickly find differences between two blocks of text. Highlight additions and deletions side-by-side with our free online diff tool.',
    keywords: ['text diff checker', 'compare text online', 'diff tool', 'text comparison', 'code diff checker'],
    alternates: {
        canonical: '/diff-checker',
    },
};

export default function DiffPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Text Diff Checker"
                    description="Spot every change, instantly."
                />

                <DiffChecker />
            </div>

            <ToolContent slug="diff-checker" />
        </div>
    );
}
