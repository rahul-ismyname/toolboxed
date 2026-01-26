import { SqlFormatter } from '@/components/tools/developer/SqlFormatter';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'SQL Formatter & Validator | Beautify SQL Online',
    description: 'Format, beautify, and validate SQL queries online. Supports PostgreSQL, MySQL, SQL Server, and more. Free developer tool.',
    keywords: ['sql formatter', 'sql beautifier', 'format sql online', 'mysql formatter', 'postgresql formatter', 'sql validator'],
    alternates: {
        canonical: '/sql-formatter',
    },
};

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

            <SqlFormatter />
            <ToolContent slug="sql-formatter" />
        </div>
    );
}
