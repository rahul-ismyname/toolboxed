import { HtmlEntitiesTool } from '@/components/tools/developer/HtmlEntitiesTool';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'HTML Entity Encoder & Decoder | Convert Special Characters',
    description: 'Safely encode special characters into HTML entities or decode entities back to plain text. Perfect for web developers and content managers needing to prevent XSS or display raw HTML.',
    keywords: ['html entity encoder', 'html entity decoder', 'html character encoding', 'encode html entities', 'decode html special characters'],
    alternates: {
        canonical: '/html-entities',
    },
};

const faqItems = [
    {
        question: "What are HTML entities?",
        answer: "HTML entities are sequences of characters used to display reserved characters (like < and >) or invisible characters (like non-breaking spaces) that would otherwise be interpreted as code by the browser."
    },
    {
        question: "Why should I encode my text?",
        answer: "Encoding is essential for security (preventing Cross-Site Scripting or XSS) and for ensuring that special symbols appear correctly on your webpage without breaking the underlying HTML structure."
    },
    {
        question: "Is this tool secure?",
        answer: "Yes. All encoding and decoding happen instantly within your browser using the standard DOM API. Your content is never uploaded to any server."
    }
];

const howToSteps: Step[] = [
    {
        title: "Input Text",
        description: "Paste your raw text or HTML-encoded string into the editor box."
    },
    {
        title: "Choose Action",
        description: "Click 'Encode' to convert symbols like '&' into '&amp;', or 'Decode' to revert them to plain text."
    },
    {
        title: "Copy Result",
        description: "Use the copy icon to quickly grab your formatted content for use in your project."
    }
];

export default function HtmlEntitiesPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        HTML Entity Encoder & Decoder
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Sanitize and format your web content safely.
                    </p>
                </div>

                <HtmlEntitiesTool />
            </div>

            <HowToSection title="Web Development Safety" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
