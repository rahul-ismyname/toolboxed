'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, Trash2, Calendar, GripVertical, CheckCircle2, Circle, AlertCircle, X, Layout, CheckSquare, Clock } from 'lucide-react';

// --- TYPES ---
type Priority = 'low' | 'medium' | 'high';

interface Subtask {
    id: string;
    text: string;
    completed: boolean;
}

interface Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    dueDate: string; // YYYY-MM-DD
    subtasks: Subtask[];
    createdAt: string;
}

interface Column {
    id: string;
    title: string;
    tasks: Task[];
    color: string;
}

// Empty initial state as requested
const INITIAL_DATA: Column[] = [
    {
        id: 'todo',
        title: 'To Do',
        color: 'bg-slate-100 dark:bg-slate-800',
        tasks: []
    },
    {
        id: 'in-progress',
        title: 'In Progress',
        color: 'bg-blue-50 dark:bg-blue-900/10',
        tasks: []
    },
    {
        id: 'done',
        title: 'Done',
        color: 'bg-emerald-50 dark:bg-emerald-900/10',
        tasks: []
    }
];

export function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>(INITIAL_DATA);
    const [isClient, setIsClient] = useState(false);

    // Edit Modal State
    const [editingTask, setEditingTask] = useState<{ colId: string, task: Task } | null>(null);
    const [isNewTask, setIsNewTask] = useState(false);

    // Initial Load
    useEffect(() => {
        setIsClient(true);
        const saved = localStorage.getItem('kanban-board');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Simple migration check: ensure tasks have subtasks array if older version
                const migrated = parsed.map((col: Column) => ({
                    ...col,
                    tasks: col.tasks.map(t => ({
                        ...t,
                        subtasks: t.subtasks || [],
                        dueDate: t.dueDate || ''
                    }))
                }));
                setColumns(migrated);
            } catch (e) {
                console.error("Failed to load board", e);
            }
        }
    }, []);

    // Auto Save
    useEffect(() => {
        if (isClient) {
            localStorage.setItem('kanban-board', JSON.stringify(columns));
        }
    }, [columns, isClient]);

    // --- ACTIONS ---

    const addTask = (colId: string) => {
        const newTask: Task = {
            id: Date.now().toString(),
            title: '',
            description: '',
            priority: 'medium',
            dueDate: '',
            subtasks: [],
            createdAt: new Date().toISOString()
        };
        setEditingTask({ colId, task: newTask });
        setIsNewTask(true);
    };

    const saveTask = (colId: string, task: Task) => {
        if (!task.title.trim()) return;

        setColumns(cols => cols.map(col => {
            if (col.id !== colId) return col;
            if (isNewTask) {
                return { ...col, tasks: [...col.tasks, task] };
            } else {
                return { ...col, tasks: col.tasks.map(t => t.id === task.id ? task : t) };
            }
        }));
        setEditingTask(null);
        setIsNewTask(false);
    };

    const deleteTask = (colId: string, taskId: string) => {
        if (!confirm('Delete this task?')) return;
        setColumns(cols => cols.map(col => {
            if (col.id !== colId) return col;
            return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
        }));
        setEditingTask(null);
    };

    // Subtask helpers
    const addSubtask = () => {
        if (!editingTask) return;
        const newSub: Subtask = { id: Date.now().toString(), text: '', completed: false };
        setEditingTask({
            ...editingTask,
            task: { ...editingTask.task, subtasks: [...editingTask.task.subtasks, newSub] }
        });
    };

    const updateSubtask = (subId: string, field: keyof Subtask, val: any) => {
        if (!editingTask) return;
        setEditingTask({
            ...editingTask,
            task: {
                ...editingTask.task,
                subtasks: editingTask.task.subtasks.map(s => s.id === subId ? { ...s, [field]: val } : s)
            }
        });
    };

    const removeSubtask = (subId: string) => {
        if (!editingTask) return;
        setEditingTask({
            ...editingTask,
            task: {
                ...editingTask.task,
                subtasks: editingTask.task.subtasks.filter(s => s.id !== subId)
            }
        });
    };

    // --- DRAG AND DROP LOGIC (HTML5 Native) ---

    const [draggedTask, setDraggedTask] = useState<{ taskId: string, sourceColId: string } | null>(null);

    const onDragStart = (e: React.DragEvent, taskId: string, sourceColId: string) => {
        setDraggedTask({ taskId, sourceColId });
        e.dataTransfer.effectAllowed = 'move';
        // Hack for some browsers to enable drag
        const ghost = document.createElement('div');
        ghost.style.opacity = '0';
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 0, 0);
        setTimeout(() => document.body.removeChild(ghost), 0);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const onDrop = (e: React.DragEvent, targetColId: string) => {
        e.preventDefault();
        if (!draggedTask) return;

        const { taskId, sourceColId } = draggedTask;
        if (sourceColId === targetColId) return;

        // Find task
        const sourceCol = columns.find(c => c.id === sourceColId);
        const task = sourceCol?.tasks.find(t => t.id === taskId);

        if (task && sourceCol) {
            setColumns(cols => cols.map(col => {
                if (col.id === sourceColId) {
                    return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
                }
                if (col.id === targetColId) {
                    return { ...col, tasks: [...col.tasks, task] };
                }
                return col;
            }));
        }
        setDraggedTask(null);
    };

    if (!isClient) return null;

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">

            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-700 dark:text-white font-bold text-lg">
                    <Layout className="w-6 h-6 text-emerald-500" />
                    Project Board
                </div>
                <button
                    onClick={() => { if (confirm('Clear all tasks? No undo.')) setColumns(INITIAL_DATA); }}
                    className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
                >
                    Clear Board
                </button>
            </div>

            {/* Board Area */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 md:p-6 snap-x snap-mandatory">
                <div className="flex gap-4 md:gap-6 h-full min-w-max">
                    {columns.map(col => (
                        <div
                            key={col.id}
                            onDragOver={onDragOver}
                            onDrop={(e) => onDrop(e, col.id)}
                            className={`w-[85vw] md:w-80 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 ${col.color} bg-opacity-50 transition-colors snap-center`}
                        >
                            {/* Column Header */}
                            <div className="p-4 flex items-center justify-between font-bold text-slate-700 dark:text-slate-200">
                                <span className="flex items-center gap-2">
                                    {col.title}
                                    <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full text-xs opacity-60">
                                        {col.tasks.length}
                                    </span>
                                </span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => addTask(col.id)}
                                        className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Task List */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                <AnimatePresence>
                                    {col.tasks.length === 0 && (
                                        <div className="h-24 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-400 text-sm italic">
                                            Drop items here
                                        </div>
                                    )}
                                    {col.tasks.map(task => {
                                        const subtasks = task.subtasks || [];
                                        const completed = subtasks.filter(s => s.completed).length;
                                        const total = subtasks.length;

                                        return (
                                            <motion.div
                                                key={task.id}
                                                layoutId={task.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                draggable
                                                onDragStart={(e) => onDragStart(e as any, task.id, col.id)}
                                                onClick={() => { setIsNewTask(false); setEditingTask({ colId: col.id, task }); }}
                                                className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-emerald-500/30 transition-all group relative overflow-hidden"
                                            >
                                                {/* Left accent bar based on priority */}
                                                <div className={`absolute top-0 bottom-0 left-0 w-1 ${task.priority === 'high' ? 'bg-red-500' :
                                                    task.priority === 'medium' ? 'bg-blue-500' : 'bg-slate-300'
                                                    }`}></div>

                                                <div className="pl-3">
                                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1 leading-tight">{task.title}</h4>

                                                    {task.description && (
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{task.description}</p>
                                                    )}

                                                    <div className="flex items-center gap-3 mt-2">
                                                        {task.dueDate && (
                                                            <div className={`flex items-center gap-1 text-[10px] font-bold ${new Date(task.dueDate) < new Date() ? 'text-red-500' : 'text-slate-400'}`}>
                                                                <Clock className="w-3 h-3" />
                                                                <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                            </div>
                                                        )}

                                                        {total > 0 && (
                                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                                                <CheckSquare className="w-3 h-3" />
                                                                <span>{completed}/{total}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Task Editor Modal */}
            <AnimatePresence>
                {editingTask && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <h3 className="font-bold text-lg">{isNewTask ? 'New Task' : 'Edit Task'}</h3>
                                <button onClick={() => setEditingTask(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6 overflow-y-auto">
                                {/* Title Input */}
                                <div>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={editingTask.task.title}
                                        onChange={e => setEditingTask({ ...editingTask, task: { ...editingTask.task, title: e.target.value } })}
                                        className="w-full text-xl font-bold bg-transparent border-none p-0 focus:ring-0 placeholder-slate-300"
                                        placeholder="Enter task title..."
                                    />
                                </div>

                                {/* Meta Row 1: Priority & Date */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Priority</label>
                                        <div className="flex gap-2">
                                            {(['low', 'medium', 'high'] as const).map(p => (
                                                <button
                                                    key={p}
                                                    onClick={() => setEditingTask({ ...editingTask, task: { ...editingTask.task, priority: p } })}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize border transition-all w-full ${editingTask.task.priority === p
                                                        ? 'border-transparent bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                                        : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-300'
                                                        }`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase">Due Date</label>
                                        <input
                                            type="date"
                                            value={editingTask.task.dueDate}
                                            onChange={e => setEditingTask({ ...editingTask, task: { ...editingTask.task, dueDate: e.target.value } })}
                                            className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                                    <textarea
                                        rows={3}
                                        value={editingTask.task.description}
                                        onChange={e => setEditingTask({ ...editingTask, task: { ...editingTask.task, description: e.target.value } })}
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-emerald-500 transition-colors"
                                        placeholder="Add details, notes, or links..."
                                    />
                                </div>

                                {/* Checklist */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                                            <CheckSquare className="w-3 h-3" /> Subtasks
                                        </label>
                                        <button
                                            onClick={addSubtask}
                                            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                                        >
                                            <Plus className="w-3 h-3" /> Add item
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {editingTask.task.subtasks.map((sub, idx) => (
                                            <div key={sub.id} className="flex items-center gap-2 group">
                                                <button
                                                    onClick={() => updateSubtask(sub.id, 'completed', !sub.completed)}
                                                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${sub.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-emerald-500'}`}
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                </button>
                                                <input
                                                    type="text"
                                                    value={sub.text}
                                                    onChange={(e) => updateSubtask(sub.id, 'text', e.target.value)}
                                                    className={`flex-1 bg-transparent border-none p-0 focus:ring-0 text-sm ${sub.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}
                                                    placeholder="Subtask..."
                                                />
                                                <button onClick={() => removeSubtask(sub.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {editingTask.task.subtasks.length === 0 && (
                                            <div onClick={addSubtask} className="text-sm text-slate-400 italic cursor-pointer hover:text-emerald-500">
                                                Click to add a checklist item...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                                {!isNewTask ? (
                                    <button
                                        onClick={() => deleteTask(editingTask.colId, editingTask.task.id)}
                                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete
                                    </button>
                                ) : <div />}

                                <button
                                    onClick={() => saveTask(editingTask.colId, editingTask.task)}
                                    disabled={!editingTask.task.title.trim()}
                                    className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 px-6 py-2 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-200 dark:shadow-none"
                                >
                                    Save Task
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
