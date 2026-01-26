import { TimeBlockPlanner } from '@/components/tools/business/TimeBlockPlanner';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Time-Block Day Planner | Paint Your Schedule',
    description: 'Visual day planner to paint your 24-hour schedule with color-coded categories. Boost productivity by blocking out focused work time.',
    keywords: ['time blocking', 'day planner', 'schedule maker', 'productivity tool', 'calendar visuals'],
    alternates: {
        canonical: '/time-block-planner',
    },
};

export default function TimeBlockPlannerPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Time-Block Day Planner"
                    description="Visualize your perfect day with color-coded blocks."
                />

                <TimeBlockPlanner />
            </div>

            <ToolContent slug="time-block-planner" />
        </div>
    );
}
