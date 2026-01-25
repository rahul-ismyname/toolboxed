import { LoanCalculator } from '@/components/tools/business/LoanCalculator';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Loan & EMI Calculator | Calculate Monthly Payments Online',
    description: 'Calculate your Equated Monthly Installment (EMI) for home, car, or personal loans. See a breakdown of principal vs interest over your loan tenure.',
    keywords: ['loan calculator', 'emi calculator', 'mortgage calculator', 'personal loan tool', 'calculate monthly payment'],
    alternates: {
        canonical: '/loan-calculator',
    },
};

const faqItems = [
    {
        question: "What is an EMI?",
        answer: "EMI stands for Equated Monthly Installment. It is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are applied to both interest and principal each month so that over a specified number of years, the loan is paid off in full."
    },
    {
        question: "How is the interest calculated?",
        answer: "This calculator uses the reducing balance method. Interest is calculated on the outstanding loan amount at the end of each month, which means as you pay off the principal, the interest component of your EMI decreases."
    },
    {
        question: "Does this include taxes or insurance?",
        answer: "No. This tool calculates the base principal and interest EMI. Depending on your lender, you may have additional costs such as property tax, insurance, or processing fees."
    }
];

const howToSteps: Step[] = [
    {
        title: "Loan Amount",
        description: "Enter the total amount of money you intend to borrow."
    },
    {
        title: "Interest Rate",
        description: "Input the annual interest rate offered by your bank or lender."
    },
    {
        title: "Loan Tenure",
        description: "Select the number of years you have to repay the loan."
    }
];

export default function LoanPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Loan / EMI Calculator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Plan your finances with precision.
                    </p>
                </div>

                <LoanCalculator />
            </div>

            <HowToSection title="Financial Planning" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
