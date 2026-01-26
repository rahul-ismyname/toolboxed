import { StopwatchTimer } from '@/components/tools/utility/StopwatchTimer';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Stopwatch & Timer | Free Online Time Tracking Tool',
    description: 'A high-precision online stopwatch and countdown timer. Track laps with the stopwatch or set focus alerts with the timer. Perfect for work, study, and workouts.',
    keywords: ['online stopwatch', 'countdown timer', 'lap timer', 'time tracking tool', 'pomodoro timer', 'precise stopwatch'],
    alternates: {
        canonical: '/stopwatch-timer',
    },
};

export default function StopwatchPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Stopwatch & Timer"
                    description="Precise time tracking for every task."
                />

                <StopwatchTimer />
            </div>

            <ToolContent slug="stopwatch-timer" />
        </div>
    );
}
