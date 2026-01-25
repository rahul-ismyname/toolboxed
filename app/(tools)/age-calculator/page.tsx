import { AgeCalculator } from '@/components/tools/utility/AgeCalculator';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Age Calculator | Calculate Your Chronological Age Online',
    description: 'Quickly calculate your age in years, months, and days. Find out how many days you have lived and see the countdown to your next birthday.',
    keywords: ['age calculator', 'chronological age', 'how old am i', 'birthday calculator', 'age in days'],
    alternates: {
        canonical: '/age-calculator',
    },
};

const faqItems = [
    {
        question: "How is the age calculated?",
        answer: "The age is calculated chronologically by comparing your birth date with today's date (or any target date you specify). It considers leap years and differing month lengths for 100% accuracy."
    },
    {
        question: "Can I use this for things other than birthdays?",
        answer: "Absolutely! You can use it to calculate the age of a contract, the duration of a project, or how long ago any specific event occurred."
    },
    {
        question: "Is my birth date stored?",
        answer: "Never. All calculations are performed instantly in your browser. No personal data is ever transmitted to our servers or saved."
    }
];

const howToSteps: Step[] = [
    {
        title: "Enter Birth Date",
        description: "Select your date of birth using the date picker or by typing it in."
    },
    {
        title: "Set Target Date",
        description: "By default, this is set to today, but you can choose any future or past date to see your age at that specific time."
    },
    {
        title: "Review Results",
        description: "Your detailed age breakdown and fun lifecycle stats will appear instantly below the inputs."
    }
];

export default function AgeCalcPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Age Calculator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Detailed chronological age and fun facts.
                    </p>
                </div>

                <AgeCalculator />
            </div>

            <HowToSection title="How to use the Age Calculator" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
