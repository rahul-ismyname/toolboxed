import { SalesTaxCalculator } from '@/components/tools/business/SalesTaxCalculator';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sales Tax Calculator | Calculate GST, VAT & Taxes Online',
    description: 'Quickly calculate sales tax or reverse-calculate taxes from a total amount. Support for custom tax rates, GST, and VAT scenarios.',
    keywords: ['sales tax calculator', 'gst calculator', 'vat calculator', 'reverse tax calculator', 'calculate tax online', 'business tax tool'],
    alternates: {
        canonical: '/sales-tax',
    },
};

const faqItems = [
    {
        question: "How do I calculate tax 'backwards'?",
        answer: "Use our 'Remove Tax' toggle. If you have a total price that already includes tax, this mode will strip the tax to reveal the original net price. This is common for VAT (Value Added Tax) calculations."
    },
    {
        question: "What tax rate should I use?",
        answer: "Tax rates vary by country and state. For example, in the US, combined state and local sales tax often ranges from 5% to 10%. In Europe, VAT usually ranges from 15% to 25%."
    },
    {
        question: "Is this tool suitable for GST?",
        answer: "Yes! GST (Goods and Services Tax) works exactly like a standard sales tax percentage. You can use this tool for any single-tier percentage-based tax system."
    }
];

const howToSteps: Step[] = [
    {
        title: "Input Amount",
        description: "Enter the dollar amount you want to calculate tax for."
    },
    {
        title: "Set Percentage",
        description: "Enter the tax rate assigned to your region or product category."
    },
    {
        title: "Choose Operation",
        description: "Decide whether you need to add tax to a net price or remove tax from a gross (inclusive) total."
    }
];

export default function SalesTaxPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Sales Tax Calculator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Calculate taxes, GST, and VAT with a single tap.
                    </p>
                </div>

                <SalesTaxCalculator />
            </div>

            <HowToSection title="Financial Precision" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
