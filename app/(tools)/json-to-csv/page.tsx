import { JsonToCsv } from '@/components/tools/developer/JsonToCsv';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'JSON to CSV Converter | Online Data Conversion Tool',
    description: 'Quickly convert JSON arrays of objects into CSV format. Clean, safe, and 100% client-side conversion. Download your result as a .csv file instantly.',
    keywords: ['json to csv', 'convert json to csv online', 'json converter', 'data transformation tool', 'developer utilities', 'json to excel'],
    alternates: {
        canonical: '/json-to-csv',
    },
};

export default function JsonCsvPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="JSON to CSV Converter"
                    description="Transform structured data into spreadsheets effortlessly."
                />

                <JsonToCsv />
            </div>

            <ToolContent slug="json-to-csv" />
        </div>
    );
}
