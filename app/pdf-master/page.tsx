'use client';

import { DynamicPDFMaster } from '@/components/tools/DynamicTools';
import { ToolContent } from '@/components/tools/ToolContent';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function PDFMasterPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all mb-8 group"
                >
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

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
