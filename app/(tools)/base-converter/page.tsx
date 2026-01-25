import { BaseConverter } from '@/components/tools/developer/BaseConverter';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Base Converter | Binary, Hex, Decimal & Octal',
    description: 'Instant number base conversion tool for developers. Convert between Binary, Hexadecimal, Decimal, and Octal with support for large numbers.',
    keywords: ['base converter', 'binary to hex', 'decimal to binary', 'hex converter', 'programmer calculator', 'number bases'],
    alternates: {
        canonical: '/base-converter',
    },
};

const faqItems = [
    {
        question: "Does it support large numbers?",
        answer: "Yes, we use the BigInt implementation to support essentially arbitrarily large integers, far exceeding standard calculator limits."
    },
    {
        question: "Can I copy the results?",
        answer: "Absolutely. Each field has a dedicated copy button for one-click clipboard access."
    },
    {
        question: "Is the conversion real-time?",
        answer: "Yes, as soon as you type in any field, all other fields update instantly to match."
    }
];

const howToSteps: Step[] = [
    {
        title: "Select Input",
        description: "Type into any field (Decimal, Hex, Binary, or Octal)."
    },
    {
        title: "Instant Sync",
        description: "Watch as all other fields automatically update to the equivalent value."
    },
    {
        title: "Clean Input",
        description: "The tool automatically filters out invalid characters for each base (e.g., 'G' generally won't type in Hex)."
    }
];

export default function BaseConverterPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Base Converter
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Seamlessly convert between Decimal, Hex, Binary, and Octal.
                    </p>
                </div>

                <BaseConverter />
            </div>

            <HowToSection title="Conversion Guide" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
