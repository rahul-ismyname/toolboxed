import { AspectRatioCalculator } from '@/components/tools/design/AspectRatioCalculator';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Aspect Ratio Calculator | Resize Images & Video Dimensions',
    description: 'Free online aspect ratio calculator. Calculate dimensions (width/height) while maintaining ratio. Find common ratios like 16:9, 4:3, 1:1, and 9:16.',
    keywords: ['aspect ratio calculator', 'screen resolution calculator', 'resize image calculator', '16:9 calculator', '4:3 calculator'],
    alternates: {
        canonical: '/aspect-ratio-calculator',
    },
};

const faqItems = [
    {
        question: "What is Aspect Ratio?",
        answer: "Aspect ratio is the proportional relationship between the width and height of an image or screen. It is usually expressed as two numbers separated by a colon, like 16:9."
    },
    {
        question: "What is the common ratio for YouTube?",
        answer: "Standard YouTube videos are 16:9. YouTube Shorts are 9:16 (vertical)."
    },
    {
        question: "How do I calculate new dimensions?",
        answer: "Simply enter your original width and height, then enter ONE value for the new dimension. Our tool automatically calculates the missing value to keep the image from stretching."
    }
];

const howToSteps: Step[] = [
    {
        title: "Enter Dimensions",
        description: "Input the original width and height of your image or video."
    },
    {
        title: "Check Ratio",
        description: "The tool instantly displays the simplified aspect ratio (e.g., 16:9)."
    },
    {
        title: "Resize",
        description: "Type a new width or height in the 'New Dimensions' section to get the calculated matching value."
    }
];

export default function AspectRatioPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Aspect Ratio Calculator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Calculate pixel dimensions and image ratios effortlessly.
                    </p>
                </div>

                <AspectRatioCalculator />
            </div>

            <HowToSection title="Using the Calculator" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
