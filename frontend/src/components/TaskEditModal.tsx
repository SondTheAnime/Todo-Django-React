import { useState } from 'react';
import type { Task } from '../services/taskService';
import type { Category } from '../services/categoryService';
import FileUpload from './FileUpload';

interface TaskEditModalProps {
    task: Task;
    categories: Category[];
    onClose: () => void;
    onSave: (taskId: number, updatedTask: Partial<Task> | FormData) => Promise<void>;
}

export default function TaskEditModal({ task, categories, onClose, onSave }: TaskEditModalProps) {
    const [formData, setFormData] = useState({
        title: task.title,
        description: task.description,
        status: task.status,
        category: task.category,
        priority: task.priority,
        due_date: task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '',
        attachment: task.attachment || null
    });

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

    const getPriorityColor = (priority: number) => {
        switch (priority) {
            case 3:
                return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
            case 2:
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
            default:
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (task.id) {
            const formDataToSend = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined && key !== 'attachment') {
                    if (key === 'due_date') {
                        formDataToSend.append(key, value ? new Date(value as string).toISOString() : '');
                    } else {
                        formDataToSend.append(key, String(value));
                    }
                }
            });

            if (formData.attachment instanceof File) {
                formDataToSend.append('attachment', formData.attachment);
            }

            await onSave(task.id, formDataToSend);
            onClose();
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = new Date(e.target.value);
        const taskCreationDate = task.created_at ? new Date(task.created_at) : new Date();

        if (selectedDate < taskCreationDate) {
            alert('A data de vencimento não pode ser anterior à data de criação da tarefa');
            return;
        }

        setFormData({ ...formData, due_date: e.target.value });
    };

    const renderCurrentAttachment = () => {
        if (typeof task.attachment === 'string' && task.attachment) {
            const fileName = task.attachment.split('/').pop();
            return (
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Anexo atual: <a href={`http://localhost:8000${task.attachment}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{fileName}</a>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800/95 rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Editar Tarefa
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Título
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Descrição
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            rows={4}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Categoria
                        </label>
                        <select
                            value={formData.category || ''}
                            onChange={(e) => setFormData({ ...formData, category: Number(e.target.value) || null })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="">Sem categoria</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Status
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                            className={`w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 ${getStatusColor(formData.status)}`}
                        >
                            <option value="pending" className="!bg-white dark:!bg-gray-800">Pendente</option>
                            <option value="in_progress" className="!bg-white dark:!bg-gray-800">Em Andamento</option>
                            <option value="completed" className="!bg-white dark:!bg-gray-800">Concluída</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Prioridade
                        </label>
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) as Task['priority'] })}
                            className={`w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 ${getPriorityColor(formData.priority)}`}
                        >
                            <option value={1} className="!bg-white dark:!bg-gray-800">Baixa</option>
                            <option value={2} className="!bg-white dark:!bg-gray-800">Média</option>
                            <option value={3} className="!bg-white dark:!bg-gray-800">Alta</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Data de Vencimento
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.due_date}
                            onChange={handleDateChange}
                            min={task.created_at ? new Date(task.created_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Anexo
                        </label>
                        {renderCurrentAttachment()}
                        <FileUpload
                            onFileSelect={(file) => setFormData({ ...formData, attachment: file })}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 