import { DynamicKanbanBoard } from '@/components/tools/DynamicTools';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { BackButton } from '@/components/shared/BackButton';
import { ToolContent } from '@/components/tools/ToolContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Personal Kanban Board | Free Online Task Management Tool',
    description: 'Manage tasks efficiently with our simple, drag-and-drop Kanban board. Private, offline-capable, and auto-saves to your browser.',
    keywords: ['kanban board online', 'task manager', 'personal project management', 'drag and drop board', 'free productivity tool'],
    alternates: {
        canonical: '/kanban-board',
    },
};

export default function KanbanPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors duration-300">
            <BackButton />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
                <Breadcrumb category="Business" name="Kanban Board" />
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4">
                        Kanban Board
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Manage your projects with simple, intuitive task columns.
                    </p>
                </div>
                <DynamicKanbanBoard />
            </div>
            <ToolContent slug="kanban-board" />
        </div>
    );
}
