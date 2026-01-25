import { JsonFormatter } from '@/components/tools/json/JsonFormatter';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'JSON Formatter & Validator | Prettify and Minify JSON Online',
    description: 'Free online JSON formatter, validator, and minifier. Beautify your JSON code or compress it for production. Syntax highlighting and error detection included.',
    keywords: ['json formatter', 'json validator', 'json prettify', 'minify json', 'json editor online'],
};

const faqItems = [
    {
        question: "Is my JSON data safe?",
        answer: "Yes, absolutely. This tool runs entirely in your browser (client-side). Your data is never sent to any server, ensuring 100% privacy and security."
    },
    {
        question: "Why is my JSON invalid?",
        answer: "Common issues include trailing commas, missing quotes around keys, or using single quotes instead of double quotes. Our tool highlights these syntax errors so you can fix them quickly."
    },
    {
        question: "What is the difference between Prettify and Minify?",
        answer: "'Prettify' formats the JSON with indentation and newlines to make it human-readable. 'Minify' removes all unnecessary whitespace to make the file size as small as possible for machine transmission."
    }
];

const howToSteps: Step[] = [
    {
        title: "Paste Your Code",
        description: "Copy your raw string or object and paste it into the main editor window."
    },
    {
        title: "Choose Action",
        description: "Click 'Prettify' to make it readable or 'Minify' to compress it. Both actions automatically validate syntax."
    },
    {
        title: "Copy Result",
        description: "Use the 'Copy' button to grab your formatted code instantly."
    }
];

export default function JsonToolPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
                        JSON Formatter & Validator
                    </h1>
                    <p className="text-xl text-slate-500">
                        The professional's choice for debugging and formatting JSON data.
                    </p>
                </div>

                <JsonFormatter />
            </div>

            <HowToSection title="Using the JSON Tool" steps={howToSteps} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center prose">
                <h3>Developers love this tool</h3>
                <p>
                    We built this to be the fastest, cleanest JSON tool on the web. No ads, no lag, just code.
                    Whether you are debugging an API response or configuring a server, proper formatting is key.
                </p>
            </div>

            <FaqSection items={faqItems} />
        </div>
    );
}
