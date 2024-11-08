import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { taskService, Task } from '../../services/taskService';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const data = await taskService.list();
            const tasksArray = Array.isArray(data) ? data : [];
            setTasks(tasksArray);
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (taskId: number, newStatus: Task['status']) => {
        try {
            await taskService.update(taskId, { status: newStatus });
            loadTasks();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
        }
    };

    const handleDelete = async (taskId: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
            try {
                await taskService.delete(taskId);
                loadTasks();
            } catch (error) {
                console.error('Erro ao excluir tarefa:', error);
            }
        }
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tarefas</h1>
                <Link
                    to="/tasks/new"
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
                >
                    Nova Tarefa
                </Link>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                {loading ? (
                    <div className="p-4 text-gray-600 dark:text-gray-300">Carregando...</div>
                ) : tasks.length === 0 ? (
                    <div className="p-4">
                        <p className="text-gray-500 dark:text-gray-400">Nenhuma tarefa encontrada.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {tasks.map((task) => (
                            <div key={task.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{task.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-300 mt-1">{task.description}</p>
                                        <div className="mt-2 flex gap-2">
                                            <select
                                                value={task.status}
                                                onChange={(e) => task.id && handleStatusChange(task.id, e.target.value as Task['status'])}
                                                className="text-sm border rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                            >
                                                <option value="pending">Pendente</option>
                                                <option value="in_progress">Em Andamento</option>
                                                <option value="completed">Concluída</option>
                                            </select>
                                            <span className={`inline-block px-2 py-1 rounded-lg text-sm ${task.status === 'completed'
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                                : task.status === 'in_progress'
                                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                                                }`}>
                                                {task.status === 'completed' ? 'Concluída' :
                                                    task.status === 'in_progress' ? 'Em Andamento' :
                                                        'Pendente'}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => task.id && handleDelete(task.id)}
                                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 