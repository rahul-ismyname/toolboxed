import { ColorTool } from '@/components/tools/developer/ColorTool';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Color Converter | HEX, RGB, HSL Online Color Tool',
    description: 'Convert color codes between HEX, RGB, and HSL formats instantly. Use our visual color picker to find the perfect shade for your web design projects.',
    keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'hsl converter', 'color picker online', 'web design tools'],
    alternates: {
        canonical: '/color-converter',
    },
};

const faqItems = [
    {
        question: "What is the difference between HEX and RGB?",
        answer: "HEX is a 6-digit hexadecimal representation of a color (e.g., #FFFFFF). RGB represents colors based on Red, Green, and Blue intensity (e.g., 255, 255, 255). Both represent the same color but in different numeric systems."
    },
    {
        question: "What does HSL stand for?",
        answer: "HSL stands for Hue, Saturation, and Lightness. It is often more intuitive for designers because it separates the color (hue) from its intensity (saturation) and brightness (lightness)."
    },
    {
        question: "Is this tool free for commercial use?",
        answer: "Yes! All tools on Toolboxed are open-source and free to use for any personal or professional project."
    }
];

const howToSteps: Step[] = [
    {
        title: "Input Color",
        description: "Type or paste a HEX, RGB, or HSL color code into the input field."
    },
    {
        title: "Visual Picker",
        description: "Click the color preview box to open the system color picker and find a shade visually."
    },
    {
        title: "Copy Result",
        description: "Click the copy icon next to any format to save it to your clipboard for use in your CSS or design files."
    }
];

export default function ColorPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Color Converter
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Professional color tools for web designers.
                    </p>
                </div>

                <ColorTool />
            </div>

            <HowToSection title="Perfect your palette" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
