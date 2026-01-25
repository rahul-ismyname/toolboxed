import { TextStats } from '@/components/tools/utility/TextStats';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Advanced Text Statistics | Word Count & Reading Analysis',
    description: 'Analyze your text deeply. Check word counts, estimated reading time, character frequency, and sentence structure instantly.',
    keywords: ['text analyzer', 'word counter', 'reading time calculator', 'character count', 'text statistics'],
    alternates: {
        canonical: '/text-statistics',
    },
};

const faqItems = [
    {
        question: "How is reading time calculated?",
        answer: "We estimate reading time based on an average reading speed of 200 words per minute (wpm), which is standard for most adults."
    },
    {
        question: "Is my text saved?",
        answer: "No. All analysis happens instantly in your browser. Your text is never sent to any server or stored anywhere."
    },
    {
        question: "What does 'No Spaces' mean?",
        answer: "This is the character count excluding all whitespace (spaces, tabs, newlines). It's useful for certain social media or SMS limits."
    }
];

const howToSteps: Step[] = [
    {
        title: "Paste Text",
        description: "Copy and paste your document, essay, or draft into the large text area."
    },
    {
        title: "View Insights",
        description: "Instantly see the word count, reading time, and other metrics update on the right."
    },
    {
        title: "Analyze Distribution",
        description: "Scroll down to see the letter frequency chart to identify overused characters or patterns."
    }
];

export default function TextStatsPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Advanced Text Statistics
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Get deep insights into your writing instantly.
                    </p>
                </div>

                <TextStats />
            </div>

            <HowToSection title="Understanding the Data" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
