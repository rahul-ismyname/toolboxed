import { Suspense } from 'react';
import { APIPlayground } from '@/components/tools/developer/APIPlayground';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';
import { getCombinedTitle } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
    const slug = 'api-playground';
    const combinedTitle = getCombinedTitle(slug);
    const description = 'Professional browser-based API testing tool. Send GET, POST, PUT, DELETE requests, configure headers, and inspect JSON responses instantly.';

    return {
        title: combinedTitle || 'API Playground - Online HTTP Client & API Tester',
        description,
        keywords: [
            'api playground', 'api tester online', 'http client', 'rest api tester',
            'postman online alternative', 'send http requests', 'json api tester'
        ],
        alternates: {
            canonical: '/api-playground',
        },
        openGraph: {
            title: combinedTitle || 'API Playground - Professional API Testing Tool',
            description,
            type: 'website',
            url: 'https://toolboxed.online/api-playground',
            siteName: 'Toolboxed',
        },
        twitter: {
            card: 'summary_large_image',
            title: combinedTitle || 'API Playground',
            description,
        }
    };
}

export default function APIPlaygroundPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="API Playground"
                    description="Professional HTTP client for testing and debugging APIs directly in your browser."
                />

                <Suspense fallback={<div className="min-h-[600px] animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl" />}>
                    <APIPlayground />
                </Suspense>
            </div>

            <ToolContent slug="api-playground" />
        </div>
    );
}
