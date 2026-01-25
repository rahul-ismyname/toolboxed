import { PasswordGenerator } from '@/components/tools/security/PasswordGenerator';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Strong Password Generator | Secure & Random',
    description: 'Create secure, random passwords instantly. Customize length and character types to protect your online accounts.',
    keywords: ['password generator', 'secure password', 'random password', 'security tools', 'password strength'],
    alternates: {
        canonical: '/password-generator',
    },
};

const faqItems = [
    {
        question: "Is it safe to generate passwords here?",
        answer: "Yes. Passwords are generated entirely in your browser using local JavaScript. No data is ever sent to our servers or stored."
    },
    {
        question: "What makes a password strong?",
        answer: "A strong password is at least 12 characters long and includes a mix of uppercase letters, lowercase letters, numbers, and special symbols."
    }
];

const howToSteps: Step[] = [
    {
        title: "Choose Length",
        description: "Use the slider to set the desired length of your password (recommended: 16+)."
    },
    {
        title: "Select Options",
        description: "Toggle which characters to include: Uppercase, Lowercase, Numbers, and Symbols."
    },
    {
        title: "Copy & Use",
        description: "Click the copy button to save the generated password to your clipboard."
    }
];

export default function PasswordPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Password Generator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Generate unhackable passwords in one click.
                    </p>
                </div>

                <PasswordGenerator />
            </div>

            <HowToSection title="Using the Generator" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
