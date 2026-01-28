import { Suspense } from 'react';
import { SqlFormatter } from '@/components/tools/developer/SqlFormatter';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

import { getCombinedTitle } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
    const slug = 'sql-formatter';
    const combinedTitle = getCombinedTitle(slug);

    return {
        title: combinedTitle,
        description: 'Format, beautify, and validate SQL queries online. Supports PostgreSQL, MySQL, SQL Server, and more. Free developer tool.',
        keywords: ['sql formatter', 'formateador sql', 'sql फॉर्मेटर', 'sql beautifier', 'format sql online', 'mysql formatter', 'postgresql formatter', 'sql validator'],
        alternates: {
            canonical: '/sql-formatter',
        },
    };
}

export default function SQLFormatterPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <BackButton />
            <Breadcrumb category="Developer" name="SQL Formatter" />
            <div className="max-w-3xl mx-auto text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                    SQL Formatter
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    Beautify and debug your SQL queries instantly. Supports multiple dialects including PostgreSQL, MySQL, and standard SQL.
                </p>
            </div>

            <Suspense fallback={<div className="min-h-[500px] animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl" />}>
                <SqlFormatter />
            </Suspense>
            <ToolContent slug="sql-formatter" />
        </div>
    );
}
