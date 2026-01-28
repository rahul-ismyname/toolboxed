
import { Metadata } from 'next';
import { ToolContent } from '@/components/tools/ToolContent';
import { CodePlayground } from '@/components/tools/developer/CodePlayground';

export const metadata: Metadata = {
    title: 'Code Playground | Toolboxed',
    description: 'Instant HTML, CSS, and JavaScript sandbox with live preview. Prototype ideas, test snippets, and export your code instantly.',
    openGraph: {
        title: 'Code Playground | Toolboxed',
        description: 'Instant HTML, CSS, and JavaScript sandbox with live preview.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Code Playground | Toolboxed',
        description: 'Instant HTML, CSS, and JavaScript sandbox with live preview.',
    },
};

export default function CodePlaygroundPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                Code <span className="text-emerald-500">Playground</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl">
                A lightweight, secure sandbox for web experiments. Write HTML, CSS, and JS and see the results instantly.
            </p>

            <div className="mb-12">
                <CodePlayground />
            </div>

            <ToolContent slug="code-playground" />
        </div>
    );
}
