import { TimestampConverter } from '@/components/tools/developer/TimestampConverter';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Unix Timestamp Converter | Epoch Time',
    description: 'Convert Unix timestamps to human-readable dates and vice versa. View the current Epoch time live.',
    keywords: ['unix timestamp', 'epoch converter', 'unix time', 'date to timestamp', 'developer tools'],
    alternates: {
        canonical: '/unix-timestamp',
    },
};

export default function TimestampPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Unix Timestamp Converter"
                    description="Decode computer time for developers."
                />

                <TimestampConverter />
            </div>

            <ToolContent slug="unix-timestamp" />
        </div>
    );
}
