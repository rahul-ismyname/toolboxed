import { DynamicPDFMaster } from '@/components/tools/DynamicTools';
import { ToolContent } from '@/components/tools/ToolContent';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { BackButton } from '@/components/shared/BackButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy-First PDF Master | Merge, Split & Sign PDFs',
    description: 'The ultimate privacy-first suite for your sensitive documents. Merge, split, protect, and sign PDFs entirely in your browser. No files are ever uploaded.',
    keywords: ['pdf master', 'merge pdf', 'split pdf', 'sign pdf online', 'privacy pdf tool'],
    alternates: {
        canonical: '/pdf-master',
    },
};

export default function PDFMasterPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <BackButton />
                <Breadcrumb category="Utility" name="PDF Master" />

                <div className="mb-12">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">PDF Master</h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400">
                        The ultimate privacy-first suite for your sensitive documents.
                    </p>
                </div>

                <DynamicPDFMaster />
                <ToolContent slug="pdf-master" />
            </div>
        </div>
    );
}
