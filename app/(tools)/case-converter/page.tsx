import { CaseConverter } from '@/components/tools/utility/CaseConverter';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Case Converter | UPPERCASE, lowercase, Title Case & More',
    description: 'Easily change the case of your text online. Convert to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, and snake_case instantly.',
    keywords: ['case converter', 'uppercase to lowercase', 'title case tool', 'text transformation', 'camelcase converter', 'sentence case online'],
    alternates: {
        canonical: '/case-converter',
    },
};

const faqItems = [
    {
        question: "What text cases are supported?",
        answer: "Our tool supports UPPERCASE, lowercase, Sentence case, Title Case, camelCase, and snake_case. Every transformation is performed instantly as you click."
    },
    {
        question: "Does it count words and characters?",
        answer: "Yes! The tool provides a real-time count of words and characters below the editor, making it useful for social media or SEO text planning."
    },
    {
        question: "Is there a limit to the text length?",
        answer: "There's no hard limit. All processing happens in your browser, so it can handle large blocks of text efficiently."
    }
];

const howToSteps: Step[] = [
    {
        title: "Paste Text",
        description: "Paste your content into the large text area at the center."
    },
    {
        title: "Select Case",
        description: "Choose your desired transformation from the toolbar or the advanced buttons below."
    },
    {
        title: "Copy Result",
        description: "Click the copy icon to grab your formatted text and use it anywhere."
    }
];

export default function CasePage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Case Converter
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Transform your text into any format instantly.
                    </p>
                </div>

                <CaseConverter />
            </div>

            <HowToSection title="Better Text Formatting" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
