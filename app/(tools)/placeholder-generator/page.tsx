import { PlaceholderGenerator } from '@/components/tools/utility/PlaceholderGenerator';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Image Placeholder Generator | Custom Dummy Images for Developers',
    description: 'Generate custom placeholder image URLs for your web projects. Customize width, height, colors, and text instantly with our free online dummy image tool.',
    keywords: ['image placeholder generator', 'dummy image tool', 'placeholder url creator', 'developer utility', 'mockup image generator'],
    alternates: {
        canonical: '/placeholder-generator',
    },
};

const faqItems = [
    {
        question: "How do I use these images?",
        answer: "Simply use the generated URL in the 'src' attribute of your <img> tags. They are perfect for prototyping layouts before you have the final assets ready."
    },
    {
        question: "Are there any bandwidth limits?",
        answer: "We use the placehold.co service, which is very reliable. However, for high-traffic production websites, we recommend hosting your own final images once the design is complete."
    },
    {
        question: "Can I use specific image formats?",
        answer: "Yes! Our generator supports PNG, JPG, WebP, and SVG formats to match your specific developmental needs."
    }
];

const howToSteps: Step[] = [
    {
        title: "Set Dimensions",
        description: "Enter the width and height you need for your prototype space."
    },
    {
        title: "Customize Look",
        description: "Pick background and text colors, and optionally add a label like 'Main Hero' or 'User Avatar'."
    },
    {
        title: "Grab Code",
        description: "Copy the direct URL, HTML snippet, or Markdown link to use directly in your code editor."
    }
];

export default function PlaceholderPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Image Placeholder Generator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Create custom mock images for your web prototypes.
                    </p>
                </div>

                <PlaceholderGenerator />
            </div>

            <HowToSection title="Quick Prototyping" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
