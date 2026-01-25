import { UnitConverter } from '@/components/tools/utility/UnitConverter';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Unit Converter | Length, Weight, Temperature',
    description: 'Fast and accurate online unit converter. Convert between Metric and Imperial units for length, weight, and temperature.',
    keywords: ['unit converter', 'metric converter', 'imperial converter', 'length converter', 'weight converter'],
};

const faqItems = [
    {
        question: "Is this converter accurate?",
        answer: "Yes, we use standard international conversion factors for all calculations to ensure high precision."
    },
    {
        question: "What units are supported?",
        answer: "We currently support common units for Length (meters, feet, miles etc.), Weight (kilograms, pounds, ounces etc.), and Temperature (Celsius, Fahrenheit, Kelvin)."
    }
];

const howToSteps: Step[] = [
    {
        title: "Select Category",
        description: "Choose the type of measurement you want to convert (Length, Weight, or Temperature) from the tabs."
    },
    {
        title: "Enter Value",
        description: "Type the amount you want to convert."
    },
    {
        title: "Choose Units",
        description: "Select the 'From' and 'To' units. The result updates instantly."
    }
];

export default function UnitConverterPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Unit Converter
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Convert between Metric and Imperial units instantly.
                    </p>
                </div>

                <UnitConverter />
            </div>

            <HowToSection title="How to use" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
