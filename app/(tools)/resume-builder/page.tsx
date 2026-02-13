import { Suspense } from 'react';
import { DynamicResumeBuilder } from '@/components/tools/DynamicTools';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';
import { ToolShell } from '@/components/layout/ToolShell';

export const metadata: Metadata = {
    title: 'Professional Resume Builder | ATS-Friendly CV Maker Online',
    description: 'Create professional, ATS-optimized resumes instantly with our live preview builder. Export to PDF, customize sections, and 100% private.',
    keywords: ['resume builder', 'cv maker', 'online resume creator', 'ats friendly resume', 'free pdf resume'],
    alternates: {
        canonical: '/resume-builder',
    },
};

export default function ResumeBuilderPage() {
    return (
        <ToolShell toolId="resume-builder" fullWidth>
            <Suspense fallback={<div className="min-h-[500px] animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl" />}>
                <DynamicResumeBuilder />
            </Suspense>
            <div className="mt-12">
                <ToolContent slug="resume-builder" />
            </div>
        </ToolShell>
    );
}
