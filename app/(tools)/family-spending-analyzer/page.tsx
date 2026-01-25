import FamilySpendingAnalyzer from '@/components/tools/business/FamilySpendingAnalyzer';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Family Spending Analyzer | Track Income & Expenses',
    description: 'A comprehensive tool for families to track income, log expenses, visualize spending habits, and export monthly reports.',
    keywords: ['spending analyzer', 'budget tracker', 'family finance', 'expense manager', 'finance report'],
    alternates: {
        canonical: '/family-spending-analyzer',
    },
};

export default function FamilySpendingPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Family Spending Analyzer
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Track your family's financial health with detailed analytics and reports.
                    </p>
                </div>

                <FamilySpendingAnalyzer />
            </div>
        </div>
    );
}
