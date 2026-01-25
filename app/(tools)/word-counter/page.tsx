import { WordCounter } from '@/components/tools/utility/WordCounter';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Word Counter | Detailed Text Statistics',
    description: 'Free online word counter with character, sentence, and paragraph counts. Estimate reading and speaking time instantly.',
    keywords: ['word counter', 'character count', 'reading time calculator', 'text analysis', 'word density'],
};

const faqItems = [
    {
        question: "How is reading time calculated?",
        answer: "We use an average reading speed of 200 words per minute, which is standard for most adults."
    },
    {
        question: "Does it count spaces as characters?",
        answer: "Our tool shows both total characters (with spaces) and characters without spaces for maximum precision."
    }
];

const howToSteps: Step[] = [
    {
        title: "Paste Text",
        description: "Paste your article, essay, or code into the large text area."
    },
    {
        title: "Review Stats",
        description: "Instantly see word counts, character counts, and structural statistics."
    },
    {
        title: "Analyze Content",
        description: "Check the 'Time Estimates' and 'Top Keywords' sections for deeper insights into your writing."
    }
];

export default function WordPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Word Counter
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Deep text analysis and statistics.
                    </p>
                </div>

                <WordCounter />
            </div>

            <HowToSection title="Using the Counter" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
