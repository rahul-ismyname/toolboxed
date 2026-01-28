import { Suspense } from 'react';
import { DynamicMindMapBuilder } from '@/components/tools/DynamicTools';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Mind Map Builder | Free Online Brainstorming & Planning Tool',
    description: 'Create beautiful, infinite mind maps directly in your browser. Organize your thoughts and plan projects visually. No signup required, 100% private.',
    keywords: ['mind map online', 'brainstorming tool', 'visual planner', 'concept map builder', 'free mindmap'],
    alternates: {
        canonical: '/mind-map',
    },
};

export default function MindMapPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
                <Breadcrumb category="Design" name="Mind Map Builder" />
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4">
                        Mind Map Builder
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Organize your thoughts on an infinite canvas.
                    </p>
                </div>
                <Suspense fallback={<div className="min-h-[500px] animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl" />}>
                    <DynamicMindMapBuilder />
                </Suspense>
            </div>
            <ToolContent slug="mind-map" />
        </div>
    );
}
