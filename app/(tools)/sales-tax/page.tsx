import { SalesTaxCalculator } from '@/components/tools/business/SalesTaxCalculator';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sales Tax Calculator | Calculate GST, VAT & Taxes Online',
    description: 'Quickly calculate sales tax or reverse-calculate taxes from a total amount. Support for custom tax rates, GST, and VAT scenarios.',
    keywords: ['sales tax calculator', 'gst calculator', 'vat calculator', 'reverse tax calculator', 'calculate tax online', 'business tax tool'],
    alternates: {
        canonical: '/sales-tax',
    },
};

export default function SalesTaxPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Sales Tax Calculator"
                    description="Calculate taxes, GST, and VAT with a single tap."
                />

                <SalesTaxCalculator />
            </div>

            <ToolContent slug="sales-tax" />
        </div>
    );
}
