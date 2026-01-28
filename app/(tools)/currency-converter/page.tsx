import { CurrencyConverter } from '@/components/tools/business/CurrencyConverter';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

import { getCombinedTitle } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
    const slug = 'currency-converter';
    const combinedTitle = getCombinedTitle(slug);

    return {
        title: combinedTitle,
        description: 'Free online currency converter with live exchange rates. Convert USD, EUR, GBP, INR and over 150+ world currencies instantly.',
        keywords: ['currency converter', 'conversor de divisas', 'मुद्रा परिवर्तक', 'exchange rates', 'money converter', 'usd to eur', 'foreign exchange'],
        alternates: {
            canonical: '/currency-converter',
        },
    };
}

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
