import { GlassGenerator } from '@/components/tools/developer/GlassGenerator';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'CSS Glassmorphism Generator | Modern Design Tool',
    description: 'Create beautiful glass-styled UI elements with our visual Glassmorphism generator. Adjust blur, transparency, and borders, then copy the CSS code.',
    keywords: ['glassmorphism generator', 'css glass effect', 'modern ui tools', 'backdrop filter tool', 'css design generator'],
    alternates: {
        canonical: '/glassmorphism-generator',
    },
};

const faqItems = [
    {
        question: "What is Glassmorphism?",
        answer: "Glassmorphism is a design trend characterized by a frosted glass effect. It relies primarily on a combination of background blur, transparency, and multi-layered shadows to create depth and a 'glass-like' appearance in user interfaces."
    },
    {
        question: "Does it work in all browsers?",
        answer: "Modern browsers (Chrome, Edge, Firefox, Safari) support the 'backdrop-filter' property required for the blur effect. For older browsers, it will gracefully degrade to a simple semi-transparent background."
    },
    {
        question: "Can I use the generated code in production?",
        answer: "Absolutely! The generator provides standard CSS along with vendor prefixes to ensure maximum compatibility across different web browsers."
    }
];

const howToSteps: Step[] = [
    {
        title: "Adjust Blur",
        description: "Use the slider to set the intensity of the frosted glass effect."
    },
    {
        title: "Set Transparency",
        description: "Dial in the opacity of the background tint to match your UI's lighting."
    },
    {
        title: "Copy CSS",
        description: "Grab the auto-generated CSS code and paste it directly into your project's stylesheet."
    }
];

export default function GlassPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Glassmorphism Generator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Design premium UI components in seconds.
                    </p>
                </div>

                <GlassGenerator />
            </div>

            <HowToSection title="Designing for Web" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
