import { JsonFormatter } from '@/components/tools/developer/JsonFormatter';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'JSON Formatter & Validator | Prettify JSON Online',
    description: 'Format, validate, and minify your JSON data. Clean up messy JSON with beautiful indentation instantly.',
    keywords: ['json formatter', 'json validator', 'json prettifier', 'minify json', 'developer tools'],
    alternates: {
        canonical: '/json-formatter',
    },
};

const faqItems = [
    {
        question: "Is my JSON data kept private?",
        answer: "Absolutely. All formatting and validation happens locally in your browser. We never transmit or store your data."
    },
    {
        question: "What indentation does it use?",
        answer: "The 'Prettify' function uses a standard 2-space indentation for clean, readable results."
    }
];

const howToSteps: Step[] = [
    {
        title: "Paste JSON",
        description: "Paste your raw or messy JSON string into the editor."
    },
    {
        title: "Click Prettify",
        description: "Click the Prettify button to automatically format and indent your code."
    },
    {
        title: "Validate",
        description: "If there's an error in your JSON, a red message will appear at the bottom with the details."
    }
];

export default function JsonPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        JSON Formatter
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Readable data for developers, in seconds.
                    </p>
                </div>

                <JsonFormatter />
            </div>

            <HowToSection title="Using the Formatter" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
