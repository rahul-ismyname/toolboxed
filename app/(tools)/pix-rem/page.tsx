import { PixelConverter } from '@/components/tools/developer/PixelConverter';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pixel to REM Converter | CSS Unit Calculator',
    description: 'Convert PX pixels to REM units instantly. Essential tool for responsive web design and creating accessible layouts.',
    keywords: ['px to rem', 'rem converter', 'css units', 'web design calculator', 'responsive design'],
};

const faqItems = [
    {
        question: "Why use REM instead of PX?",
        answer: "REM (Root EM) units are relative to the root HTML font size (default 16px). Using REM allows users to scale the entire website's type size using their browser settings, making your site more accessible."
    },
    {
        question: "What is the default base size?",
        answer: "Most modern browsers have a default font-size of 16px. This is why 16px = 1rem is the standard convention, but you can change the base size in our calculator if needed."
    }
];

const howToSteps: Step[] = [
    {
        title: "Enter Pixels",
        description: "Type your pixel value (e.g., 24) into the left box."
    },
    {
        title: "Get REM",
        description: "Instantly see the converted REM value (e.g., 1.5) on the right."
    },
    {
        title: "Adjust Base",
        description: "If your project uses a different root font size (like 10px or 14px), change the Base setting at the bottom."
    }
];

export default function PixelConverterPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        PX to REM Converter
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Modern CSS units made simple.
                    </p>
                </div>

                <PixelConverter />
            </div>

            <HowToSection title="Using the Converter" steps={howToSteps} />

            <FaqSection items={faqItems} />
        </div>
    );
}
