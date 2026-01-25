import { PasswordGenerator } from '@/components/tools/utility/PasswordGenerator';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Secure Password Generator | Random Strong Password Tool',
    description: 'Generate strong, random passwords instantly. Customize length and characters to ensure maximum security for your accounts.',
    keywords: ['password generator', 'random password', 'secure password', 'strong password', 'password creator'],
};

const faqItems = [
    {
        question: "Is this password generator safe?",
        answer: "Yes. All passwords are generated locally in your browser using cryptographic randomness. No data is ever sent to our servers."
    },
    {
        question: "What makes a strong password?",
        answer: "A strong password should be at least 12 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special symbols."
    },
    {
        question: "Why should I use random passwords?",
        answer: "Random passwords are much harder for hackers to guess or crack compared to passwords based on personal information or dictionary words."
    }
];

const howToSteps: Step[] = [
    {
        title: "Choose Length",
        description: "Use the slider to select a password length. We recommend at least 12 characters for good security."
    },
    {
        title: "Select Options",
        description: "Toggle Uppercase, Lowercase, Numbers, and Symbols based on your requirements."
    },
    {
        title: "Copy & Use",
        description: "Click the Copy button to instantly save your new strong password to your clipboard."
    }
];

export default function PasswordGeneratorPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Password Generator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Create secure passwords in milliseconds.
                    </p>
                </div>

                <PasswordGenerator />
            </div>

            <HowToSection title="How to Generate Secure Passwords" steps={howToSteps} />

            <FaqSection items={faqItems} />
        </div>
    );
}
