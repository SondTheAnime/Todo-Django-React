import { PencilIcon, TrashIcon, ExclamationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import type { Category } from '../types/Category';
import type { Task } from '../types/Task';
import { useState } from 'react';
import TaskViewModal from './TaskViewModal';

interface CategoryCardProps {
    category: Category;
    tasks: Task[];
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
}

export default function CategoryCard({ category, tasks, onEdit, onDelete }: CategoryCardProps) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
            case 'in_progress':
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
            default:
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Concluída';
            case 'in_progress':
                return 'Em Andamento';
            default:
                return 'Pendente';
        }
    };

    const isTaskOverdue = (task: Task) => {
        if (!task.due_date || task.status === 'completed') return false;
        return new Date(task.due_date) < new Date();
    };

    const renderTaskStatus = (task: Task) => {
        if (isTaskOverdue(task)) {
            return (
                <span className="px-2 py-1 text-xs rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                    Vencida
                </span>
            );
        }
        return (
            <span className={`px-2 py-1 text-xs rounded-lg ${getStatusColor(task.status)}`}>
                {getStatusText(task.status)}
            </span>
        );
    };

    const handleTaskClick = (e: React.MouseEvent, task: Task) => {
        e.preventDefault();
        setSelectedTask(task);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                        />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {category.name}
                        </h3>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(category)}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                            <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => category.id && onDelete(category.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <div className="mt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}
                    </span>
                </div>
            </div>
            <div className="p-4">
                {tasks.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        Nenhuma tarefa nesta categoria
                    </p>
                ) : (
                    <div className="space-y-3">
                        {tasks.map(task => (
                            <div
                                onClick={(e) => handleTaskClick(e, task)}
                                key={task.id}
                                className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className={`font-medium ${isTaskOverdue(task) ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                                                {task.title}
                                            </h4>
                                            {task.priority === 3 && (
                                                <ExclamationCircleIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                                            )}
                                            {task.priority === 2 && (
                                                <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                            )}
                                        </div>
                                        {task.description && (
                                            <p className={`text-sm mt-1 line-clamp-2 ${isTaskOverdue(task) ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                {task.description}
                                            </p>
                                        )}
                                    </div>
                                    {renderTaskStatus(task)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {selectedTask && (
                <TaskViewModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </div>
    );
} 