import { TrashIcon, PencilIcon, ExclamationCircleIcon, ExclamationTriangleIcon, MinusCircleIcon } from '@heroicons/react/24/outline';
import type { Task } from '../services/taskService';

interface TaskCardProps {
    task: Task;
    onStatusChange: (taskId: number, newStatus: Task['status']) => void;
    onDelete: (taskId: number) => void;
    onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onStatusChange, onDelete, onEdit }: TaskCardProps) {
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

    return (
        <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            {task.title}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${priorityInfo.bgColor} ${priorityInfo.color}`}>
                            {priorityInfo.icon}
                            {priorityInfo.text}
                        </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {task.description}
                    </p>
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
                        <select
                            value={task.status}
                            onChange={(e) => task.id && onStatusChange(task.id, e.target.value as Task['status'])}
                            className={`text-sm rounded-lg px-2 py-1 border ${getStatusColor(task.status)}`}
                        >
                            <option value="pending" className="bg-white dark:bg-gray-800">Pendente</option>
                            <option value="in_progress" className="bg-white dark:bg-gray-800">Em Andamento</option>
                            <option value="completed" className="bg-white dark:bg-gray-800">Concluída</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(task)}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </button>
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