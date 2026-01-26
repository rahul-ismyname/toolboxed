import { MarkdownPreviewer } from '@/components/tools/developer/MarkdownPreviewer';
import { TitleSection } from '@/components/shared/TitleSection';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Markdown Previewer | Live Online Markdown Editor',
    description: 'Write and preview Markdown in real-time. Use our side-by-side editor to format your README files, documentation, and blog posts with ease.',
    keywords: ['markdown previewer', 'markdown editor', 'online markdown viewer', 'live markdown preview', 'format readme online'],
    alternates: {
        canonical: '/markdown-previewer',
    },
};

export default function MarkdownPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                <TitleSection
                    title="Markdown Previewer"
                    description="The simple way to write and format documentation."
                />

                <MarkdownPreviewer />
            </div>

            <ToolContent slug="markdown-previewer" />
        </div>
    );
}
