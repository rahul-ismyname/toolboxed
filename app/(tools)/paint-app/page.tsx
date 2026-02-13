import { DynamicPaintApp } from '@/components/tools/DynamicTools';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';
import { ToolShell } from '@/components/layout/ToolShell';

export const metadata: Metadata = {
    title: 'Paint App | Free Online Drawing Tool',
    description: 'Sketch, draw, and create digital art directly in your browser. Features pencil, shapes, custom colors, and image export.',
    keywords: ['paint online', 'drawing tool', 'sketchpad', 'digital art', 'canvas app'],
    alternates: {
        canonical: '/paint-app',
    },
};

export default function PaintPage() {
    return (
        <ToolShell toolId="paint-app" fullWidth noPadding>
            <div className="h-[calc(100vh-64px)] p-4">
                <DynamicPaintApp />
            </div>
            <div className="p-8">
                <ToolContent slug="paint-app" />
            </div>
        </ToolShell>
    );
}
