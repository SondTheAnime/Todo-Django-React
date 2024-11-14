import { XMarkIcon } from '@heroicons/react/24/outline';
import { Task } from '../types/Task';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import FilePreview from './FilePreview';
import { useState } from 'react';

interface TaskViewModalProps {
    task: Task;
    onClose: () => void;
}

export default function TaskViewModal({ task, onClose }: TaskViewModalProps) {
    const [showPreview, setShowPreview] = useState(false);

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

    const getPriorityText = (priority: number) => {
        switch (priority) {
            case 3:
                return 'Alta';
            case 2:
                return 'Média';
            default:
                return 'Baixa';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full p-6">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {task.title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Descrição
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {task.description || 'Sem descrição'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Status
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {getStatusText(task.status)}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Prioridade
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {getPriorityText(task.priority)}
                            </p>
                        </div>
                    </div>

                    {task.category_details && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Categoria
                            </h3>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: task.category_details.color }}
                                />
                                <span className="text-gray-600 dark:text-gray-400">
                                    {task.category_details.name}
                                </span>
                            </div>
                        </div>
                    )}

                    {task.due_date && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Data de Vencimento
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {format(new Date(task.due_date), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                            </p>
                        </div>
                    )}

                    {task.attachment && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Anexo
                            </h3>
                            <div className="flex items-center gap-2">
                                <a
                                    href={typeof task.attachment === 'string' ? task.attachment : '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    {typeof task.attachment === 'string' 
                                        ? task.attachment.split('/').pop() 
                                        : task.attachment.name}
                                </a>
                                {typeof task.attachment === 'string' && (
                                    <button
                                        onClick={() => setShowPreview(true)}
                                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                    >
                                        Pré-visualizar
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {showPreview && task.attachment && typeof task.attachment === 'string' && (
                    <FilePreview
                        fileUrl={task.attachment}
                        onClose={() => setShowPreview(false)}
                    />
                )}
            </div>
        </div>
    );
} 