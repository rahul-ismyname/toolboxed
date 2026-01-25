import { PomodoroTimer } from '@/components/tools/health/PomodoroTimer';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pomodoro Timer | Focus Timer for Productivity',
    description: 'Free online Pomodoro timer. Boost your productivity with the 25-minute work, 5-minute break technique. Features audio notifications and visual progress.',
    keywords: ['pomodoro timer', 'focus timer', 'productivity timer', 'study timer', 'tomato timer'],
    alternates: {
        canonical: '/pomodoro-timer',
    },
};

const faqItems = [
    {
        question: "What is the Pomodoro Technique?",
        answer: "It's a time management method where you break work into 25-minute intervals separated by short breaks. It helps maintain focus and prevent burnout."
    },
    {
        question: "Can I customize the time?",
        answer: "This tool uses the standard 25/5/15 minute presets for simplicity and adherence to the core technique."
    },
    {
        question: "Does it work in the background?",
        answer: "Yes, the timer continues running even if you switch tabs, and it will play a sound notification when time is up."
    }
];

const howToSteps: Step[] = [
    {
        title: "Choose Mode",
        description: "Select 'Focus' for work, or one of the break modes."
    },
    {
        title: "Start",
        description: "Click the play button to begin the countdown."
    },
    {
        title: "Focus",
        description: "Work on your task until you hear the bell, then take a break!"
    }
];

export default function PomodoroPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Pomodoro Focus
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Master your time with the Pomodoro technique.
                    </p>
                </div>

                <PomodoroTimer />
            </div>

            <HowToSection title="How it Works" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
