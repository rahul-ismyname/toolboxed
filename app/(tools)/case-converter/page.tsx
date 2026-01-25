import { CaseConverter } from '@/components/tools/developer/CaseConverter';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Case Converter | Change Text Case Online',
    description: 'Instantly convert text between camelCase, snake_case, PascalCase, kebab-case, and more. Essential tool for developers and writers.',
    keywords: ['case converter', 'camelcase converter', 'snake_case', 'pascalcase', 'text transformation'],
};

const faqItems = [
    {
        question: "What cases are supported?",
        answer: "We support camelCase, PascalCase, snake_case, CONSTANT_CASE, kebab-case, Title Case, lowercase, and UPPERCASE."
    },
    {
        question: "Is this tool safe for code?",
        answer: "Yes, our algorithms are designed to handle code snippets and variable names accurately, preserving original word boundaries where possible."
    }
];

const howToSteps: Step[] = [
    {
        title: "Input Text",
        description: "Type or paste your text into the main input area."
    },
    {
        title: "View Results",
        description: "Your text is instantly transformed into all supported cases in the cards below."
    },
    {
        title: "Copy",
        description: "Click any result card to copy the transformed text to your clipboard."
    }
];

export default function CasePage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Case Converter
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Convert string cases for code or content.
                    </p>
                </div>

                <CaseConverter />
            </div>

            <HowToSection title="How to use" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
