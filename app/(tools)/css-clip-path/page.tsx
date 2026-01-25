import { ClipPathGenerator } from '@/components/tools/design/ClipPathGenerator';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'CSS Clip Path Generator | Create Custom CSS Shapes Online',
    description: 'Interactive CSS clip-path maker. Drag and drop points to create polygons, circles, and custom shapes. Copy ready-to-use CSS code instantly.',
    keywords: ['css clip path generator', 'clip-path maker', 'css shapes generator', 'polygon generator', 'css masking tool'],
    alternates: {
        canonical: '/css-clip-path',
    },
};

const faqItems = [
    {
        question: "What browsers support clip-path?",
        answer: "Most modern browsers (Chrome, Firefox, Safari, Edge) support `clip-path`. It's a standard CSS property widely used for creative layouts."
    },
    {
        question: "Does this affect the element's layout?",
        answer: "No, `clip-path` only affects the visibility of the element. It does not change the element's actual dimensions or flow in the document."
    },
    {
        question: "Can I animate these shapes?",
        answer: "Yes! As long as the number of points in the polygon remains the same, you can transition between different `clip-path` values using CSS transitions or animations."
    }
];

const howToSteps: Step[] = [
    {
        title: "Choose a Shape",
        description: "Start with a preset like Triangle, Pentagon, or Circle used the buttons below the editor."
    },
    {
        title: "Edit Points",
        description: "Drag the white handles on the shape to customize its form. Create any polygon you can imagine."
    },
    {
        title: "Copy CSS",
        description: "Grab the generated CSS code from the panel on the right and paste it into your stylesheet."
    }
];

export default function ClipPathPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        CSS Clip Path Generator
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Create complex shapes and masks with CSS.
                    </p>
                </div>

                <ClipPathGenerator />
            </div>

            <HowToSection title="Using the Generator" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
