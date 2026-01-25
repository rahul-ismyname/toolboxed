import { RandomChoice } from '@/components/tools/utility/RandomChoice';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Random Choice Maker | Decision Helper & Picker',
    description: 'Can\'t decide? Enter your options and let our Random Choice Maker pick a winner with a fun shuffle animation.',
    keywords: ['random choice generator', 'decision maker', 'random picker', 'list shuffler', 'lucky draw'],
    alternates: {
        canonical: '/random-choice',
    },
};

const faqItems = [
    {
        question: "Is the selection truly random?",
        answer: "Yes, we use a cryptographic-strength randomization method to ensure a fair and unprejudiced selection every time."
    },
    {
        question: "How many options can I add?",
        answer: "You can add as many options as you like! Just paste a list and we'll handle the rest."
    },
    {
        question: "Can I remove options?",
        answer: "Yes, individual options can be removed if you want to narrow down the list before spinning again."
    }
];

const howToSteps: Step[] = [
    {
        title: "Add Options",
        description: "Type your choices in the text box. Separate them by commas or new lines."
    },
    {
        title: "Shuffle",
        description: "Click the 'ADD OPTIONS' button, then hit the big 'SHUFFLE & PICK' button."
    },
    {
        title: "See the Winner",
        description: "Enjoy the animation as the tool cycles through your list and lands on the chosen item."
    }
];

export default function RandomChoicePage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Random Choice Maker
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Let fate decide with a fun, animated picker.
                    </p>
                </div>

                <RandomChoice />
            </div>

            <HowToSection title="How to Decide" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
