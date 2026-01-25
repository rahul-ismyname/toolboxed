import { LoremIpsumGenerator } from '@/components/tools/utility/LoremIpsumGenerator';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Lorem Ipsum Generator | Free Online Placeholder Text Tool',
    description: 'Generate custom Lorem Ipsum text for your web designs or print projects. Choose between paragraphs, sentences, or words and copy the result instantly.',
    keywords: ['lorem ipsum generator', 'placeholder text tool', 'dummy text online', 'filler text generator', 'web design placeholder', 'lorem ipsum paragraphs'],
    alternates: {
        canonical: '/lorem-ipsum',
    },
};

const faqItems = [
    {
        question: "What is Lorem Ipsum?",
        answer: "Lorem ipsum, in graphical and textual context, is a filler text that is commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. It has been the industry's standard dummy text since the 1500s."
    },
    {
        question: "Why use placeholder text?",
        answer: "Using placeholder text like Lorem Ipsum allows designers to focus on the layout, typography, and visual hierarchy of a project without being distracted by the actual content."
    },
    {
        question: "Is the generated text random?",
        answer: "Yes! While it uses established Latin-like patterns, our generator mixes sentences to ensure you get a unique block of text for every prototype."
    }
];

const howToSteps: Step[] = [
    {
        title: "Choose Amount",
        description: "Select how many paragraphs, sentences, or words you need using the numeric input."
    },
    {
        title: "Select Unit",
        description: "Toggle between 'Paragraphs', 'Sentences', or 'Words' to match your mockup's needs."
    },
    {
        title: "Copy Result",
        description: "Click the copy button to save the text to your clipboard for your design software or code editor."
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
                        The designer's standard for placeholder content.
                    </p>
                </div>

                <LoremIpsumGenerator />
            </div>

            <HowToSection title="Designing for Content" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
