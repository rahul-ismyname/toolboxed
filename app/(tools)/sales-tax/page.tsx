import { SalesTaxCalculator } from '@/components/tools/business/SalesTaxCalculator';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

import { getCombinedTitle } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
    const slug = 'sales-tax';
    const combinedTitle = getCombinedTitle(slug);

    return {
        title: combinedTitle,
        description: 'Quickly calculate sales tax or reverse-calculate taxes from a total amount. Support for custom tax rates, GST, and VAT scenarios.',
        keywords: ['sales tax calculator', 'calculadora de impuestos', 'बिक्री कर कैलकुलेटर', 'gst calculator', 'vat calculator', 'reverse tax calculator', 'calculate tax online', 'business tax tool'],
        alternates: {
            canonical: '/sales-tax',
        },
    };
}

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
