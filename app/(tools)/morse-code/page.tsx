import { MorseCode } from '@/components/tools/utility/MorseCode';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Morse Code Converter | Audio Support & Real-time Translation',
    description: 'Convert text to Morse code and Morse to text instantly. Features real-time audio playback, copy functionality, and international standard support.',
    keywords: ['morse code converter', 'text to morse', 'morse audio player', 'international morse code', 'decoder'],
    alternates: {
        canonical: '/morse-code',
    },
};

const faqItems = [
    {
        question: "Can I play the Morse code audio?",
        answer: "Yes! Simply type your text and click the Play icon to hear the Morse code sequence with standard timing."
    },
    {
        question: "Does this support international characters?",
        answer: "We support the standard International Morse Code alphabet, including common punctuation marks."
    },
    {
        question: "How do I decode Morse code?",
        answer: "Switch to 'Morse To Text' mode and type dots (.) and dashes (-). Use spaces to separate letters and slashes (/) to separate words."
    }
];

const howToSteps: Step[] = [
    {
        title: "Choose Direction",
        description: "Select 'Text to Morse' or 'Morse to Text' depending on your needs."
    },
    {
        title: "Type & Listen",
        description: "Enter your message. The conversion happens instantly. Click the speaker icon to hear it played back."
    },
    {
        title: "Copy Output",
        description: "Use the copy button to quickly grab the result for use in other apps."
    }
];

export default function MorseCodePage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Morse Code Converter
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Translate text to dots and dashes with audio.
                    </p>
                </div>

                <MorseCode />
            </div>

            <HowToSection title="Using the Converter" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
