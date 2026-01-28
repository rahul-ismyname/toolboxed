'use client';

import dynamic from 'next/dynamic';

const Loading = ({ name, color }: { name: string, color: string }) => (
    <div className="min-h-[500px] flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
        <div className="text-center">
            <div className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4`} style={{ borderLeftColor: color, borderRightColor: color, borderBottomColor: color }}></div>
            <p className="text-slate-500 font-medium tracking-wide">Initializing {name}...</p>
        </div>
    </div>
);

export const DynamicLandingPageBuilder = dynamic(
    () => import('./business/LandingPageBuilder').then(mod => mod.LandingPageBuilder),
    { ssr: false, loading: () => <Loading name="Landing Page Studio" color="#3b82f6" /> }
);

export const DynamicResumeBuilder = dynamic(
    () => import('./utility/ResumeBuilder').then(mod => mod.ResumeBuilder),
    { ssr: false, loading: () => <Loading name="Resume Studio" color="#10b981" /> }
);

export const DynamicMindMapBuilder = dynamic(
    () => import('./design/MindMapBuilder').then(mod => mod.MindMapBuilder),
    { ssr: false, loading: () => <Loading name="Mind Map Engine" color="#10b981" /> }
);

export const DynamicKanbanBoard = dynamic(
    () => import('./business/KanbanBoard').then(mod => mod.KanbanBoard),
    { ssr: false, loading: () => <Loading name="Kanban Workspace" color="#3b82f6" /> }
);

export const DynamicMermaidEditor = dynamic(
    () => import('./design/MermaidEditor').then(mod => mod.MermaidEditor),
    { ssr: false, loading: () => <Loading name="Diagram Visualizer" color="#3b82f6" /> }
);

export const DynamicPaintApp = dynamic(
    () => import('./design/PaintApp').then(mod => mod.PaintApp),
    { ssr: false, loading: () => <Loading name="Design Canvas" color="#10b981" /> }
);

export const DynamicImagePdfCompressor = dynamic(
    () => import('./media/ImagePdfCompressor').then(mod => mod.ImagePdfCompressor),
    { ssr: false, loading: () => <Loading name="Image & PDF Compressor" color="#3b82f6" /> }
);

export const DynamicInvoiceBuilder = dynamic(
    () => import('./business/InvoiceBuilder').then(mod => mod.InvoiceBuilder),
    { ssr: false, loading: () => <Loading name="Invoice Studio" color="#3b82f6" /> }
);

export const DynamicPDFMaster = dynamic(
    () => import('./utility/PDFMaster').then(mod => mod.PDFMaster),
    { ssr: false, loading: () => <Loading name="PDF Master" color="#ef4444" /> }
);

export const DynamicAnimatedPatternMaster = dynamic(
    () => import('./design/AnimatedPatternMaster').then(mod => mod.AnimatedPatternMaster),
    { ssr: false, loading: () => <Loading name="Pattern Studio" color="#6366f1" /> }
);
export const DynamicStickmanAnimator = dynamic(
    () => import('./design/StickmanAnimator').then(mod => mod.StickmanAnimator),
    { ssr: false, loading: () => <Loading name="Stickman Studio" color="#10b981" /> }
);
