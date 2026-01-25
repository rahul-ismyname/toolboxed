import { UuidGenerator } from '@/components/tools/developer/UuidGenerator';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'UUID Generator | Create V1, V3, V4, V5 UUIDs Instantly',
    description: 'Free online UUID generator. Create specialized Universally Unique Identifiers (Version 1, 3, 4, 5) individually or in bulk. Secure client-side generation.',
    keywords: ['uuid generator', 'guid generator', 'v4 uuid', 'random uuid', 'unique identifier', 'generate guid online'],
    alternates: {
        canonical: '/uuid-generator',
    },
};

const faqItems = [
    {
        question: "Is this secure?",
        answer: "Yes! All UUIDs are generated locally in your browser using the standard 'uuid' library. No data is sent to our servers."
    },
    {
        question: "Which version should I use?",
        answer: "Version 4 (Random) is the most common and suitable for most use cases like database keys or session IDs. Use Version 1 if you need time-ordered IDs."
    },
    {
        question: "What are Version 3 and 5?",
        answer: "These are deterministic UUIDs generated from a namespace and a name (string). If you input the same namespace and name, you always get the same UUID. V5 (SHA-1) is preferred over V3 (MD5)."
    }
];

const howToSteps: Step[] = [
    {
        title: "Select Version",
        description: "Choose between V4 (Random), V1 (Timestamp), or V3/V5 (Name-based). V4 is the default and most popular."
    },
    {
        title: "Configure Options",
        description: "Adjust the quantity slider to generate multiple IDs at once. Toggle Uppercase if needed."
    },
    {
        title: "Copy Result",
        description: "Click the copy button to grab your unique identifiers."
    }
];

export default function UuidGeneratorPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        UUID Generator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Generate universally unique identifiers instantly.
                    </p>
                </div>

                <UuidGenerator />
            </div>

            <HowToSection title="How to use UUID Generator" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
