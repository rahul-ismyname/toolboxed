import { PrivacyPolicyGenerator } from '@/components/tools/utility/PrivacyPolicyGenerator';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Free Privacy Policy Generator | GDPR Ready Template',
    description: 'Create a standard privacy policy for your website or app in seconds. Free, simple, and ready to use.',
    keywords: ['privacy policy generator', 'free privacy policy', 'gdpr template', 'legal disclaimer generator'],
};

const faqItems = [
    {
        question: "Is this legal advice?",
        answer: "No. This tool generates a generic template based on common internet standards. It is not a substitute for professional legal advice, especially for complex businesses."
    },
    {
        question: "Is it really free?",
        answer: "Yes, this tool is 100% free to use. You can copy the text and use it on your site immediately."
    }
];

const howToSteps: Step[] = [
    {
        title: "Enter Details",
        description: "Fill in your Company Name, Website URL, and Contact Email."
    },
    {
        title: "Generate",
        description: "Click the 'Generate Policy' button to create your custom text."
    },
    {
        title: "Copy & Paste",
        description: "Copy the result and paste it into your website CMS or app settings."
    }
];

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Privacy Policy Generator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Protect your business with a standard data policy.
                    </p>
                </div>

                <PrivacyPolicyGenerator />
            </div>

            <HowToSection title="How to Use" steps={howToSteps} />

            <FaqSection items={faqItems} />
        </div>
    );
}
