import { DynamicResumeBuilder } from '@/components/tools/DynamicTools';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Ultimate Resume Builder | Toolboxed',
    description: 'Create professional resumes instantly with our live preview builder. Export to PDF, customize themes, and land your dream job.',
};

export default function ResumeBuilderPage() {
    return <DynamicResumeBuilder />;
}
