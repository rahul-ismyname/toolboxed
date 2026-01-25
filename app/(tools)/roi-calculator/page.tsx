import { RoiCalculator } from '@/components/tools/business/RoiCalculator';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'ROI Calculator | Calculate Return on Investment',
    description: 'Calculate the Return on Investment (ROI) for your marketing campaigns or business projects. Simple, fast, and free.',
    keywords: ['roi calculator', 'return on investment', 'marketing roi', 'profit calculator', 'business tools'],
};

const faqItems = [
    {
        question: "What is ROI?",
        answer: "ROI stands for Return on Investment. It is a performance measure used to evaluate the efficiency or profitability of an investment."
    },
    {
        question: "How is ROI calculated?",
        answer: "The formula is: (Revenue - Cost) / Cost * 100. This gives you a percentage representing your return relative to your investment."
    },
    {
        question: "What is a good ROI?",
        answer: "A 'good' ROI depends on your industry. Generally, anything positive is good, but many businesses aim for a 5:1 ratio (500%) for marketing campaigns to account for overhead."
    }
];

const howToSteps: Step[] = [
    {
        title: "Enter Costs",
        description: "Input the total amount you spent on the campaign or project (Ad Spend, Software costs, etc.)."
    },
    {
        title: "Enter Revenue",
        description: "Input the total revenue generated directly attributed to that investment."
    },
    {
        title: "Analyze Results",
        description: "Review your ROI percentage and Profit/Loss amount to make data-driven decisions."
    }
];

export default function RoiCalcPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        ROI Calculator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Measure the profitability of your investments.
                    </p>
                </div>

                <RoiCalculator />
            </div>

            <HowToSection title="How to Calculate ROI" steps={howToSteps} />

            <FaqSection items={faqItems} />
        </div>
    );
}
