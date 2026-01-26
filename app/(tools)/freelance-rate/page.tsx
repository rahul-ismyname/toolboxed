import { FreelanceRateCalc } from '@/components/tools/business/FreelanceRateCalc';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Freelance Hourly Rate Calculator | Calculate Your Billable Rate',
    description: 'Determine exactly how much you should charge as a freelancer to meet your income goals. Accounts for taxes, expenses, and vacation time.',
    keywords: ['freelance rate calculator', 'hourly rate calculator', 'contractor rate', 'billable hours calculator', 'freelance pricing'],
};

export default function FreelanceCalcPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
                <TitleSection
                    title="Freelance Rate Calculator"
                    description="Ensure your business is profitable by charging the right amount."
                />

                <FreelanceRateCalc />
            </div>

            <ToolContent slug="freelance-rate" />
        </div>
    );
}
