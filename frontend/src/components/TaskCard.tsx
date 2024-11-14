import { TrashIcon, PencilIcon, ExclamationCircleIcon, ExclamationTriangleIcon, MinusCircleIcon, ClockIcon, DocumentIcon } from '@heroicons/react/24/outline';
import type { Task, TaskStatus } from '../types/Task';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import FilePreview from './FilePreview';

interface TaskCardProps {
    task: Task;
    onStatusChange: (taskId: number, status: Task['status']) => void;
    onDelete: (taskId: number) => void;
    onEdit: (task: Task) => void;
    onUpdateDueDate: (taskId: number, dueDate: string) => void;
}

export default function TaskCard({ task, onStatusChange, onDelete, onEdit, onUpdateDueDate }: TaskCardProps) {
    const getPriorityInfo = (priority: number) => {
        switch (priority) {
            case 3:
                return {
                    text: 'Alta',
                    color: 'text-red-600 dark:text-red-400',
                    bgColor: 'bg-red-100 dark:bg-red-900/30',
                    icon: <ExclamationCircleIcon className="h-5 w-5" />
                };
            case 2:
                return {
                    text: 'Média',
                    color: 'text-yellow-600 dark:text-yellow-400',
                    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
                    icon: <ExclamationTriangleIcon className="h-5 w-5" />
                };
            default:
                return {
                    text: 'Baixa',
                    color: 'text-blue-600 dark:text-blue-400',
                    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
                    icon: <MinusCircleIcon className="h-5 w-5" />
                };
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 dark:border-green-700';
            case 'in_progress':
                return 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 dark:border-yellow-700';
            case 'overdue':
                return 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 dark:border-red-700';
            default:
                return 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 dark:border-blue-700';
        }
    };

    // const getStatusText = (status: string) => {
    //     switch (status) {
    //         case 'completed':
    //             return 'Concluída';
    //         case 'in_progress':
    //             return 'Em Andamento';
    //         default:
    //             return 'Pendente';
    //     }
    // };

    const priorityInfo = getPriorityInfo(task.priority);

    const handleEditClick = () => {
        onEdit(task);
    };

    const isTaskOverdue = (task: Task) => {
        if (!task.due_date || task.status === 'completed') return false;
        return new Date(task.due_date) < new Date();
    };

    const isOverdue = isTaskOverdue(task);

    const handleDebugSetOverdue = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (task.id) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const isoDate = yesterday.toISOString();
            console.log('Debug - Tarefa:', task.title);
            console.log('Debug - ID:', task.id);
            console.log('Debug - Nova data:', isoDate);
            onUpdateDueDate(task.id, isoDate);
        }
    };

    const [showPreview, setShowPreview] = useState(false);

    const renderAttachment = (attachment: string) => {
        const fileName = attachment.split('/').pop();
        const cleanUrl = attachment.replace('http://localhost:8000', '');
        const fullUrl = `http://localhost:8000${cleanUrl}`;
        console.log('URL do anexo:', fullUrl);
        return (
            <div className="flex items-center gap-2">
                <a
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                    <DocumentIcon className="h-4 w-4" />
                    {fileName}
                </a>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setShowPreview(true);
                    }}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                    Pré-visualizar
                </button>
                {showPreview && (
                    <FilePreview
                        fileUrl={attachment}
                        onClose={() => setShowPreview(false)}
                    />
                )}
            </div>
        );
    };

    return (
        <div className={`p-4 ${isOverdue ? 'bg-red-50 dark:bg-red-900/10' : ''}`}>
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className={`font-semibold ${isTaskOverdue(task)
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-900 dark:text-white'
                            }`}>
                            {task.title}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${priorityInfo.bgColor} ${priorityInfo.color}`}>
                            {priorityInfo.icon}
                            {priorityInfo.text}
                        </span>
                    </div>
                    <p className={`mb-3 ${isTaskOverdue(task)
                        ? 'text-red-500 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-300'
                        }`}>
                        {task.description}
                    </p>
                    {task.due_date && (
                        <div className="flex items-center gap-2 text-sm">
                            <ClockIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className={`${new Date(task.due_date) < new Date() && task.status !== 'completed'
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                Vence em {format(new Date(task.due_date), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                            </span>
                        </div>
                    )}
                    {task.attachment && (
                        <div className="mt-2">
                            {renderAttachment(task.attachment as string)}
                        </div>
                    )}
                    <div className="flex items-center gap-4">
                        {task.category_details && (
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: task.category_details.color }}
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {task.category_details.name}
                                </span>
                            </div>
                        )}
                        {isOverdue ? (
                            <div className="text-sm px-2 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
                                Tarefa Vencida
                            </div>
                        ) : (
                            <select
                                value={task.status}
                                onChange={(e) => {
                                    if (task.id) {
                                        const newStatus = e.target.value as TaskStatus;
                                        onStatusChange(task.id, newStatus);
                                    }
                                }}
                                className={`text-sm rounded-lg px-2 py-1 border ${getStatusColor(task.status)}`}
                            >
                                <option value="pending" className="bg-white dark:bg-gray-800">Pendente</option>
                                <option value="in_progress" className="bg-white dark:bg-gray-800">Em Andamento</option>
                                <option value="completed" className="bg-white dark:bg-gray-800">Concluída</option>
                            </select>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    {import.meta.env.DEV && (
                        <button
                            onClick={handleDebugSetOverdue}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                            Debug: Set Overdue
                        </button>
                    )}
                    {!isOverdue && (
                        <button
                            onClick={handleEditClick}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                            <PencilIcon className="h-5 w-5" />
                        </button>
                    )}
                    <button
                        onClick={() => task.id && onDelete(task.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
} 