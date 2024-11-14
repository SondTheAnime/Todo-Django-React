import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../../services/taskService';
import { categoryService } from '../../services/categoryService';
import FileUpload from '../../components/FileUpload';
import { Category } from '../../types/Category';

type TaskStatus = 'pending' | 'in_progress' | 'completed';
type TaskPriority = 1 | 2 | 3;

export default function TaskForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "" as string | number,
        status: "pending" as TaskStatus,
        priority: 1 as TaskPriority,
        due_date: "" as string,
        attachment: null as File | null,
    });
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await categoryService.list();
            setCategories(data);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
            case 'in_progress':
                return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300';
            default:
                return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300';
        }
    };

    const getPriorityColor = (priority: number) => {
        switch (priority) {
            case 3:
                return 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300';
            case 2:
                return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300';
            default:
                return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300';
        }
    };

    // const validatePriority = (value: number): TaskPriority => {
    //     if (value >= 1 && value <= 3) {
    //         return value as TaskPriority;
    //     }
    //     return 1;
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();

            // Adiciona os campos básicos
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('status', formData.status);
            formDataToSend.append('priority', String(formData.priority));
            
            // Adiciona categoria apenas se existir
            if (formData.category) {
                formDataToSend.append('category', String(formData.category));
            }

            // Adiciona data de vencimento apenas se existir
            if (formData.due_date) {
                formDataToSend.append('due_date', new Date(formData.due_date).toISOString());
            }

            // Adiciona anexo apenas se existir
            if (formData.attachment) {
                formDataToSend.append('attachment', formData.attachment);
            }

            await taskService.create(formDataToSend);
            navigate('/tasks');
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            alert('Erro ao criar tarefa. Por favor, tente novamente.');
        }
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as TaskStatus;
        setFormData(prev => ({ ...prev, status: newStatus }));
    };

    const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPriority = Number(e.target.value) as TaskPriority;
        setFormData(prev => ({ ...prev, priority: newPriority }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = new Date(e.target.value);
        const now = new Date();

        if (selectedDate < now) {
            alert('A data de vencimento não pode ser anterior à data atual');
            return;
        }

        setFormData({ ...formData, due_date: e.target.value });
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Nova Tarefa</h1>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Título
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Digite o título da tarefa"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Descrição
                        </label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Digite a descrição da tarefa"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Categoria
                            </label>
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={handleStatusChange}
                                className={`w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${getStatusColor(formData.status)}`}
                            >
                                <option value="pending" className="bg-white dark:bg-gray-800">Pendente</option>
                                <option value="in_progress" className="bg-white dark:bg-gray-800">Em Andamento</option>
                                <option value="completed" className="bg-white dark:bg-gray-800">Concluída</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Prioridade
                            </label>
                            <select
                                value={formData.priority}
                                onChange={handlePriorityChange}
                                className={`w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${getPriorityColor(formData.priority)}`}
                            >
                                <option value={1} className="bg-white dark:bg-gray-800">Baixa</option>
                                <option value={2} className="bg-white dark:bg-gray-800">Média</option>
                                <option value={3} className="bg-white dark:bg-gray-800">Alta</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Data de Vencimento
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.due_date}
                            onChange={handleDateChange}
                            min={new Date().toISOString().slice(0, 16)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <FileUpload
                        onFileSelect={(file) => setFormData({ ...formData, attachment: file })}
                    />

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}