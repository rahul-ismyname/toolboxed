import { CurrencyConverter } from '@/components/tools/business/CurrencyConverter';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Currency Converter | Live Exchange Rates',
    description: 'Free online currency converter with live exchange rates. Convert USD, EUR, GBP, INR and over 150+ world currencies instantly.',
    keywords: ['currency converter', 'exchange rates', 'money converter', 'usd to eur', 'foreign exchange'],
};

export default function CurrencyPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Currency Converter"
                    description="Live exchange rates for 150+ currencies."
                />

                <CurrencyConverter />
            </div>

            <ToolContent slug="currency-converter" />
        </div>
    );
}
