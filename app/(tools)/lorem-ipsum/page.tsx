import { LoremGenerator } from '@/components/tools/developer/LoremGenerator';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Lorem Ipsum Generator | Dummy Text for Designers',
    description: 'Generate standard Lorem Ipsum placeholder text for your designs. Customize paragraph, sentence, or word counts suitable for any layout.',
    keywords: ['lorem ipsum generator', 'dummy text', 'placeholder text', 'lipsum', 'text generator'],
};

const faqItems = [
    {
        question: "What is Lorem Ipsum?",
        answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry's standard dummy text ever since the 1500s."
    },
    {
        question: "Why do we use it?",
        answer: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. Lorem Ipsum provides a more-or-less normal distribution of letters."
    }
];

const howToSteps: Step[] = [
    {
        title: "Select Unit",
        description: "Choose whether you need paragraphs, sentences, or individual words."
    },
    {
        title: "Set Count",
        description: "Adjust the number to match the length of text you need."
    },
    {
        title: "Copy",
        description: "Click the 'Copy' button to paste it directly into your design tool or code."
    }
];

export default function LoremPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Lorem Ipsum Generator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Professional placeholder text for your next project.
                    </p>
                </div>

                <LoremGenerator />
            </div>

            <HowToSection title="Using the Generator" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
