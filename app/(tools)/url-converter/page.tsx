import { UrlEncoderDecoder } from '@/components/tools/developer/UrlEncoderDecoder';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'URL Encoder & Decoder | Percent-Encoding Online Tool',
    description: 'Safely encode or decode URLs and query parameters. Convert special characters into percent-encoded format for safe transmission over the web.',
    keywords: ['url encoder', 'url decoder', 'percent encoding', 'encode url online', 'decode url parameters', 'web developer tool'],
    alternates: {
        canonical: '/url-converter',
    },
};

const faqItems = [
    {
        question: "Why do I need to encode URLs?",
        answer: "URLs can only contain a limited set of characters from the US-ASCII character set. Characters like spaces, brackets, or ampersands can break a URL if not properly encoded into their percent-encoded format (e.g., ' ' becomes '%20')."
    },
    {
        question: "What is Percent-Encoding?",
        answer: "Percent-encoding is a mechanism for encoding information in a Uniform Resource Identifier (URI). It involves replacing non-ASCII or reserved characters with a '%' followed by their two-digit hexadecimal representation."
    },
    {
        question: "Is this tool safe for sensitive URLs?",
        answer: "Yes. All processing happens entirely within your web browser. Your URLs are never sent to our servers or stored anywhere."
    }
];

const howToSteps: Step[] = [
    {
        title: "Enter URL",
        description: "Paste your raw URL or encoded string into the input area."
    },
    {
        title: "Select Action",
        description: "Click 'Encode' to make it web-safe, or 'Decode' to revert it to a human-readable format."
    },
    {
        title: "Copy & Use",
        description: "Click the copy icon to grab your result and paste it into your code or browser."
    }
];

export default function UrlPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        URL Encoder & Decoder
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Convert URLs and query parameters safely.
                    </p>
                </div>

                <UrlEncoderDecoder />
            </div>

            <HowToSection title="Web Safety Standards" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
