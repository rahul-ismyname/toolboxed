import { CurrencyConverter } from '@/components/tools/business/CurrencyConverter';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Currency Converter | Live Exchange Rates',
    description: 'Free online currency converter with live exchange rates. Convert USD, EUR, GBP, INR and over 150+ world currencies instantly.',
    keywords: ['currency converter', 'exchange rates', 'money converter', 'usd to eur', 'foreign exchange'],
};

const faqItems = [
    {
        question: "How often are rates updated?",
        answer: "Our rates are sourced from open-market data and are updated daily to ensure accuracy for general use."
    },
    {
        question: "Is this free to use?",
        answer: "Yes, completely free. We use open-source data to provide this service without any subscription fees."
    },
    {
        question: "Can I use this for trading?",
        answer: "While we strive for accuracy, these rates are for informational purposes only. We do not recommend using them for high-value forex trading."
    }
];

const howToSteps: Step[] = [
    {
        title: "Enter Amount",
        description: "Type the value you want to convert in the first box."
    },
    {
        title: "Select Currencies",
        description: "Choose your 'From' and 'To' currencies from the dropdown lists."
    },
    {
        title: "View Result",
        description: "The conversion happens instantly. You can also click the swap button to reverse the currencies."
    }
];

export default function CurrencyPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Currency Converter
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Live exchange rates for 150+ currencies.
                    </p>
                </div>

                <CurrencyConverter />
            </div>

            <HowToSection title="Simple Conversion" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
