import { StopwatchTimer } from '@/components/tools/utility/StopwatchTimer';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Stopwatch & Timer | Free Online Time Tracking Tool',
    description: 'A high-precision online stopwatch and countdown timer. Track laps with the stopwatch or set focus alerts with the timer. Perfect for work, study, and workouts.',
    keywords: ['online stopwatch', 'countdown timer', 'lap timer', 'time tracking tool', 'pomodoro timer', 'precise stopwatch'],
    alternates: {
        canonical: '/stopwatch-timer',
    },
};

const faqItems = [
    {
        question: "How accurate is the stopwatch?",
        answer: "Our stopwatch tracks time down to the hundredth of a second (centisecond), making it suitable for sports and precise measurements."
    },
    {
        question: "Can I use this for Pomodoro?",
        answer: "Absolutely! Simply switch to the 'Timer' mode, click the time to set it to 25 minutes, and start your focus session."
    },
    {
        question: "Does it work in the background?",
        answer: "Yes, once started, the timer or stopwatch will continue to run as long as the browser tab remains open. However, some browsers may throttle background tabs, so we recommend keeping the tab active for critical timing."
    }
];

const howToSteps: Step[] = [
    {
        title: "Toggle Mode",
        description: "Switch between the Stopwatch for measuring elapsed time and the Timer for countdowns."
    },
    {
        title: "Set & Start",
        description: "Click the big play button to begin. In Timer mode, you can tap the time to manually enter minutes."
    },
    {
        title: "Lap Tracking",
        description: "While the stopwatch is running, use the flag icon to record intermediate times (laps) without stopping the main clock."
    }
];

export default function StopwatchPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        Stopwatch & Timer
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Precise time tracking for every task.
                    </p>
                </div>

                <StopwatchTimer />
            </div>

            <HowToSection title="Master Your Time" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
