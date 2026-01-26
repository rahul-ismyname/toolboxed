import { LoanCalculator } from '@/components/tools/business/LoanCalculator';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Loan & EMI Calculator | Calculate Monthly Payments Online',
    description: 'Calculate your Equated Monthly Installment (EMI) for home, car, or personal loans. See a breakdown of principal vs interest over your loan tenure.',
    keywords: ['loan calculator', 'emi calculator', 'mortgage calculator', 'personal loan tool', 'calculate monthly payment'],
    alternates: {
        canonical: '/loan-calculator',
    },
};

export default function LoanPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Loan / EMI Calculator"
                    description="Plan your finances with precision."
                />

                <LoanCalculator />
            </div>

            <ToolContent slug="loan-calculator" />
        </div>
    );
}
