import { KanbanBoard } from '@/components/tools/business/KanbanBoard';

export const metadata = {
    title: 'Project Kanban Board | Free Task Management Tool',
    description: 'A simple, drag-and-drop Kanban board for managing your personal projects and tasks. Auto-saves to your browser.',
};

export default function KanbanPage() {
    return <KanbanBoard />;
}
