import { MermaidEditor } from '@/components/tools/design/MermaidEditor';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Mermaid.js Visualizer | Text to Diagram Online',
    description: 'Create flowcharts, sequence diagrams, and Gantt charts instantly by typing text. Detailed Mermaid.js live editor with SVG/PNG export.',
    keywords: ['mermaid live editor', 'text to diagram', 'flowchart maker', 'sequence diagram online', 'mermaidjs online'],
};

export default function MermaidPage() {
    return (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                    Mermaid Visualizer
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Turn text into diagrams instantly. Supports Flowcharts, Sequence, Class, State, and more.
                </p>
            </div>

            <Suspense fallback={<div className="text-center py-12">Loading Editor...</div>}>
                <MermaidEditor />
            </Suspense>
        </div>
    );
}
