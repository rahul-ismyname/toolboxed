import { DynamicMindMapBuilder } from '@/components/tools/DynamicTools';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Mind Map Builder | Free Online Brainstorming Tool',
    description: 'Create beautiful, infinite mind maps directly in your browser. Organize your thoughts and plan projects visually.',
};

export default function MindMapPage() {
    return (
        <>
            <DynamicMindMapBuilder />
            <ToolContent slug="mind-map" />
        </>
    );
}
