import { FreelanceRateCalc } from '@/components/tools/business/FreelanceRateCalc';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Freelance Hourly Rate Calculator | Calculate Your Billable Rate',
    description: 'Determine exactly how much you should charge as a freelancer to meet your income goals. Accounts for taxes, expenses, and vacation time.',
    keywords: ['freelance rate calculator', 'hourly rate calculator', 'contractor rate', 'billable hours calculator', 'freelance pricing'],
};

const faqItems = [
    {
        question: "How do I calculate my billable hours?",
        answer: "Billable hours are the hours you actually charge clients for. As a freelancer, you perform many non-billable tasks (marketing, admin, emails). A safe estimate is usually 60-70% of your total working hours."
    },
    {
        question: "Does this account for taxes?",
        answer: "Yes, you can adjust the estimated tax rate. We recommend setting aside 25-30% for taxes to be safe, but you should consult a tax professional for your specific situation."
    },
    {
        question: "Should I charge hourly or per project?",
        answer: "This calculator gives you a baseline hourly rate. Often, charging per project (value-based pricing) allows for higher margins, but knowing your minimum hourly requirement ensures you don't underprice your fixed-fee quotes."
    }
];

const howToSteps: Step[] = [
    {
        title: "Set Income Goal",
        description: "Enter the 'Take Home' pay you need to support your lifestyle."
    },
    {
        title: "Add Expenses",
        description: "Input your business costs (software, equipment, insurance) to ensure they are covered."
    },
    {
        title: "Define Schedule",
        description: "Be realistic about how many hours you can bill per week and how much vacation you plan to take."
    }
];

export default function FreelanceCalcPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Freelance Rate Calculator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Ensure your business is profitable by charging the right amount.
                    </p>
                </div>

                <FreelanceRateCalc />
            </div>

            <HowToSection title="How to Calculate Your Rate" steps={howToSteps} />

            <FaqSection items={faqItems} />
        </div>
    );
}
