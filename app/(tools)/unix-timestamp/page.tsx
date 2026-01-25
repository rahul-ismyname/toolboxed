import { TimestampConverter } from '@/components/tools/developer/TimestampConverter';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Unix Timestamp Converter | Epoch Time',
    description: 'Convert Unix timestamps to human-readable dates and vice versa. View the current Epoch time live.',
    keywords: ['unix timestamp', 'epoch converter', 'unix time', 'date to timestamp', 'developer tools'],
};

const faqItems = [
    {
        question: "What is Unix Time?",
        answer: "Unix time (also known as Epoch time) is the number of seconds that have elapsed since January 1, 1970 (UTC), not counting leap seconds."
    },
    {
        question: "Why does it start from 1970?",
        answer: "January 1, 1970 was chosen as the Epoch for the Unix operating system. It provides a uniform way to track time across different systems."
    }
];

const howToSteps: Step[] = [
    {
        title: "View Current Time",
        description: "The top card shows the current live Unix timestamp."
    },
    {
        title: "Convert Epoch",
        description: "Paste a timestamp into the left card to see the human-readable date."
    },
    {
        title: "Convert Date",
        description: "Select a date and time in the right card to generate its Unix timestamp."
    }
];

export default function TimestampPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Unix Timestamp Converter
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Decode computer time for developers.
                    </p>
                </div>

                <TimestampConverter />
            </div>

            <HowToSection title="How to use" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
