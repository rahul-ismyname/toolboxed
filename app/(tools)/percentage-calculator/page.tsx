import { PercentageCalculator } from '@/components/tools/utility/PercentageCalculator';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Percentage Calculator | Free Online Percentage Tool',
    description: 'Calculate percentages, percentage change, and relative values instantly. A versatile tool for business, finance, and everyday math.',
    keywords: ['percentage calculator', 'percent change calculator', 'calculate percentage of', 'free math tools', 'percentage increase calculator'],
    alternates: {
        canonical: '/percentage-calculator',
    },
};

const faqItems = [
    {
        question: "How do I calculate a percentage?",
        answer: "To find the percentage of a number, multiply the number by the percentage fraction (e.g., to find 20% of 100, do 100 * 0.20 = 20)."
    },
    {
        question: "What is percentage increase?",
        answer: "Percentage increase is the difference between the final and initial value, divided by the absolute value of the initial value, multiplied by 100."
    },
    {
        question: "Is this tool mobile friendly?",
        answer: "Yes! Toolboxed is fully responsive, so you can calculate percentages on the go from any device."
    }
];

const howToSteps: Step[] = [
    {
        title: "Choose Calculation",
        description: "Pick the scenario that fits your needs: find a percentage, find the ratio, or find the change."
    },
    {
        title: "Enter Values",
        description: "Type your numbers into the provided input fields."
    },
    {
        title: "Get Result",
        description: "The calculation updates automatically as you type, with clear visual feedback."
    }
];

export default function PercentagePage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Percentage Calculator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Solve any percentage problem in seconds.
                    </p>
                </div>

                <PercentageCalculator />
            </div>

            <HowToSection title="Math made simple" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
