import { DynamicKanbanBoard } from '@/components/tools/DynamicTools';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Project Kanban Board | Free Task Management Tool',
    description: 'A simple, drag-and-drop Kanban board for managing your personal projects and tasks. Auto-saves to your browser.',
};

export default function KanbanPage() {
    return (
        <>
            <DynamicKanbanBoard />
            <ToolContent slug="kanban-board" />
        </>
    );
}
