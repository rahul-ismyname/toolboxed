import { DiffChecker } from '@/components/tools/developer/DiffChecker';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Text Diff Checker | Compare Two Texts Online',
    description: 'Quickly find differences between two blocks of text. Highlight additions and deletions side-by-side with our free online diff tool.',
    keywords: ['text diff checker', 'compare text online', 'diff tool', 'text comparison', 'code diff checker'],
    alternates: {
        canonical: '/diff-checker',
    },
};

const faqItems = [
    {
        question: "How does the diff checker work?",
        answer: "Our tool performs a line-by-line comparison between the 'Original' and 'Changed' text blocks. It identifies which lines have been added (green), which have been removed (red), and which remain unchanged."
    },
    {
        question: "Is my text data stored?",
        answer: "No. All text comparison happens locally in your browser. We never transmit or store your content on our servers, making it safe for comparing sensitive code or documents."
    },
    {
        question: "What is this tool useful for?",
        answer: "It's perfect for developers reviewing code changes, writers comparing draft versions, or anyone who needs to quickly spot the differences between two similar pieces of text."
    }
];

const howToSteps: Step[] = [
    {
        title: "Input Original",
        description: "Paste your base text or original code into the left editor window."
    },
    {
        title: "Input Changed",
        description: "Paste the modified version into the right editor window."
    },
    {
        title: "Review Diff",
        description: "Scroll down to see a side-by-side analysis with highlighted changes."
    }
];

export default function DiffPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Text Diff Checker
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Spot every change, instantly.
                    </p>
                </div>

                <DiffChecker />
            </div>

            <HowToSection title="Using the Diff Tool" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
