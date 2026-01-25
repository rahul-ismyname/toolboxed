import { CompoundInterest } from '@/components/tools/business/CompoundInterest';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Compound Interest Calculator | Predict Your Investment Growth',
    description: 'Calculate how your money grows over time with compound interest. Plan your savings, retirement, or investment strategies with our free online tool.',
    keywords: ['compound interest calculator', 'investment calculator', 'savings planner', 'future value calculator', 'retirement planning tool'],
    alternates: {
        canonical: '/compound-interest',
    },
};

const faqItems = [
    {
        question: "What is compound interest?",
        answer: "Compound interest is interest calculated on the initial principal, which also includes all of the accumulated interest from previous periods. It’s essentially 'interest on interest,' which allows your wealth to grow exponentially over time."
    },
    {
        question: "How often can interest be compounded?",
        answer: "Interest can be compounded annually, semi-annually, quarterly, monthly, or even daily. The more frequently interest is compounded, the higher the total future value because interest starts earning its own interest sooner."
    },
    {
        question: "Why should I use a compound interest calculator?",
        answer: "It helps you see the long-term impact of small consistent investments. It's a powerful tool for planning retirement, saving for a home, or understanding how high-interest debt can grow if not managed."
    }
];

const howToSteps: Step[] = [
    {
        title: "Initial Deposit",
        description: "Enter the amount of money you are starting with (e.g., $10,000)."
    },
    {
        title: "Monthly Contribution",
        description: "Add how much you plan to save every month on top of your initial deposit."
    },
    {
        title: "Interest & Period",
        description: "Input your expected annual interest rate and how many years you plan to stay invested."
    }
];

export default function CompoundPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Compound Interest Calculator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Visualise the power of exponential growth.
                    </p>
                </div>

                <CompoundInterest />
            </div>

            <HowToSection title="Maximize your savings" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
