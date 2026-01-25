import { UrlEncoder } from '@/components/tools/developer/UrlEncoder';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'URL Encoder / Decoder | Percent-encoding Tool',
    description: 'Easily encode or decode URLs. Convert special characters to their percent-encoded counterparts for safe query strings and API usage.',
    keywords: ['url encoder', 'url decoder', 'percent encoding', 'uri component', 'query string encoder'],
};

const faqItems = [
    {
        question: "What is URL Encoding?",
        answer: "URL encoding converts characters into a format that can be transmitted over the Internet. It replaces unsafe ASCII characters with a \"%\" followed by two hexadecimal digits."
    },
    {
        question: "When should I use this?",
        answer: "Use it to clean up URLs with special characters, debug query strings, or prepare data for API requests that require percent-encoding."
    }
];

const howToSteps: Step[] = [
    {
        title: "Choose Mode",
        description: "Type in either the 'Decoded' or 'Encoded' box. The other side updates automatically."
    },
    {
        title: "Check for Errors",
        description: "If your input is invalid (like a bad % sequence), an error message will appear."
    },
    {
        title: "Copy Output",
        description: "Use the copy button above the result you need."
    }
];

export default function UrlEncoderPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        URL Encoder / Decoder
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Transform URIs and simplify query strings safely.
                    </p>
                </div>

                <UrlEncoder />
            </div>

            <HowToSection title="How to use" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
