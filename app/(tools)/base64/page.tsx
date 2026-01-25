import { Base64Tool } from '@/components/tools/developer/Base64Tool';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Base64 Encoder & Decoder | Convert Text to Base64 Online',
    description: 'Encode and decode text to Base64 format instantly. Secure, client-side conversion for developers and data processing.',
    keywords: ['base64 encoder', 'base64 decoder', 'base64 online', 'convert to base64', 'decode base64'],
    alternates: {
        canonical: '/base64',
    },
};

const faqItems = [
    {
        question: "What is Base64 encoding?",
        answer: "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It's commonly used when there's a need to encode binary data that needs to be stored and transferred over media that are designed to deal with text."
    },
    {
        question: "Is my data secure?",
        answer: "Yes. Like all tools on Toolboxed, the Base64 conversion happens entirely in your browser using JavaScript. No data is sent to our servers."
    },
    {
        question: "Can I encode Unicode characters?",
        answer: "The standard atob/btoa functions in browsers have limited support for Unicode. This tool is optimized for ASCII text. For complex Unicode, you may need a specialized UTF-8 encoder."
    }
];

const howToSteps: Step[] = [
    {
        title: "Input Text",
        description: "Paste the text you want to encode or the Base64 string you want to decode into the editor."
    },
    {
        title: "Click Action",
        description: "Click 'Encode' to turn text into Base64, or 'Decode' to turn Base64 back into human-readable text."
    },
    {
        title: "Copy Result",
        description: "Use the copy icon in the toolbar to quickly save the result to your clipboard."
    }
];

export default function Base64Page() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Base64 Encoder & Decoder
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Reliable data encoding for modern workflows.
                    </p>
                </div>

                <Base64Tool />
            </div>

            <HowToSection title="Using the Base64 Tool" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
