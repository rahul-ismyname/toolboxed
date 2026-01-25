import { ColorConverter } from '@/components/tools/developer/ColorConverter';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Color Converter | HEX to RGB, HSL, CMYK',
    description: 'Convert HEX color codes to RGB, HSL, and CMYK formats. Essential tool for web designers and developers.',
    keywords: ['color converter', 'hex to rgb', 'hex to hsl', 'cmyk converter', 'web design tools'],
};

const faqItems = [
    {
        question: "What is a HEX code?",
        answer: "A HEX code is a six-digit hexadecimal number used in web design to represent colors. It starts with a '#' symbol."
    },
    {
        question: "What formats are provided?",
        answer: "We provide conversions for RGB (Red Green Blue), HSL (Hue Saturation Lightness), and CMYK (Cyan Magenta Yellow Key/Black)."
    }
];

const howToSteps: Step[] = [
    {
        title: "Enter HEX Code",
        description: "Type your color code (e.g., #3B82F6). You can omit the '#' symbol."
    },
    {
        title: "View Values",
        description: "The RGB, HSL, and CMYK values are calculated instantly."
    },
    {
        title: "Copy",
        description: "Click the copy icon next to any value to copy it to your clipboard."
    }
];

export default function ColorConverterPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Color Converter
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Transform colors for web and print.
                    </p>
                </div>

                <ColorConverter />
            </div>

            <HowToSection title="Using the Converter" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
