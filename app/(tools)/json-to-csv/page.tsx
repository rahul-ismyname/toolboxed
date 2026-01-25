import { JsonToCsv } from '@/components/tools/developer/JsonToCsv';
import { FaqSection } from '@/components/shared/FaqSection';
import { HowToSection, Step } from '@/components/shared/HowToSection';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'JSON to CSV Converter | Online Data Conversion Tool',
    description: 'Quickly convert JSON arrays of objects into CSV format. Clean, safe, and 100% client-side conversion. Download your result as a .csv file instantly.',
    keywords: ['json to csv', 'convert json to csv online', 'json converter', 'data transformation tool', 'developer utilities', 'json to excel'],
    alternates: {
        canonical: '/json-to-csv',
    },
};

const faqItems = [
    {
        question: "What format of JSON is required?",
        answer: "The tool expects an array of objects (e.g., [{\"name\": \"John\"}, ...]). Each key in the objects will become a column header in the CSV output."
    },
    {
        question: "Is my data privacy protected?",
        answer: "Yes. All conversion logic runs entirely in your web browser. Your JSON data is never uploaded to any server or stored in a database."
    },
    {
        question: "Can it handle nested objects?",
        answer: "For basic conversion, nested objects and arrays are stringified into the CSV cells. For complex flattening, we recommend cleaning your data before input."
    }
];

const howToSteps: Step[] = [
    {
        title: "Paste JSON",
        description: "Input your JSON array into the left editor window. Ensure it is valid JSON format."
    },
    {
        title: "Convert",
        description: "Click the 'Convert to CSV' button to process the data and see the preview in the right window."
    },
    {
        title: "Download or Copy",
        description: "Use the action buttons to copy the result to your clipboard or download it directly as a .csv file."
    }
];

export default function JsonCsvPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
                        JSON to CSV Converter
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Transform structured data into spreadsheets effortlessly.
                    </p>
                </div>

                <JsonToCsv />
            </div>

            <HowToSection title="Using the Converter" steps={howToSteps} />
            <FaqSection items={faqItems} />
        </div>
    );
}
