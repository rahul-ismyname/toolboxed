import { PomodoroTimer } from '@/components/tools/health/PomodoroTimer';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pomodoro Timer | Focus Timer for Productivity',
    description: 'Free online Pomodoro timer. Boost your productivity with the 25-minute work, 5-minute break technique. Features audio notifications and visual progress.',
    keywords: ['pomodoro timer', 'focus timer', 'productivity timer', 'study timer', 'tomato timer'],
    alternates: {
        canonical: '/pomodoro-timer',
    },
};

export default function PomodoroPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Pomodoro Focus"
                    description="Master your time with the Pomodoro technique."
                />

                <PomodoroTimer />
            </div>

            <ToolContent slug="pomodoro-timer" />
        </div>
    );
}
