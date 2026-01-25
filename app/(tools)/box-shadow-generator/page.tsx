import { BoxShadowGenerator } from '@/components/tools/design/BoxShadowGenerator';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Box Shadow Generator | CSS Layered Shadow Maker',
    description: 'Create beautiful, layered CSS box-shadows visually. Add multiple shadows, control blur and spread, and copy the CSS code instantly.',
    keywords: ['box shadow generator', 'css shadow maker', 'layered shadows', 'css generator', 'neumorphism generator'],
    alternates: {
        canonical: '/box-shadow-generator',
    },
};

const faqItems = [
    {
        question: "Can I use multiple shadows?",
        answer: "Yes! You can add unlimited shadow layers to create realistic, deep effects like Neumorphism or material design elevation."
    },
    {
        question: "What is 'Inset'?",
        answer: "An inset shadow is drawn inside the element instead of outside. This is often used for pressed buttons or input fields."
    },
    {
        question: "Does this affect performance?",
        answer: "CSS box-shadows are generally performant, but using too many large blur radii on many elements can impact scrolling performance on low-end devices."
    }
];

const howToSteps: Step[] = [
    {
        title: "Add Layers",
        description: "Click 'Add Layer' to stack multiple shadows. Rearrange or adjust them individually."
    },
    {
        title: "Tune Controls",
        description: "Adjust X/Y offset, blur radius, spread, and color for each layer."
    },
    {
        title: "Copy CSS",
        description: "Copy the generated CSS snippet and paste it into your stylesheet."
    }
];

export default function BoxShadowPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Box Shadow Generator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Design smooth, layered shadows for modern UI.
                    </p>
                </div>

                <BoxShadowGenerator />
            </div>

            <HowToSection title="Designing Shadows" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
