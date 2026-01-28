import { Suspense } from 'react';
import { DynamicResumeBuilder } from '@/components/tools/DynamicTools';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
                <Breadcrumb category="Business" name="Resume Builder" />
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4">
                        Resume Builder
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Create a professional, ATS-optimized resume in minutes.
                    </p>
                </div>
                <Suspense fallback={<div className="min-h-[500px] animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl" />}>
                    <DynamicResumeBuilder />
                </Suspense>
            </div>
            <ToolContent slug="resume-builder" />
        </div>
    );
}
