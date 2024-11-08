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
            loadTasks(); // Recarrega a lista após atualização
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
        }
    };

    const handleDelete = async (taskId: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
            try {
                await taskService.delete(taskId);
                loadTasks(); // Recarrega a lista após exclusão
            } catch (error) {
                console.error('Erro ao excluir tarefa:', error);
            }
        }
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tarefas</h1>
                <Link to="/tasks/new" className="btn-primary">
                    Nova Tarefa
                </Link>
            </div>
            <div className="bg-white rounded-lg shadow">
                {loading ? (
                    <div className="p-4">Carregando...</div>
                ) : tasks.length === 0 ? (
                    <div className="p-4">
                        <p className="text-gray-500">Nenhuma tarefa encontrada.</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {tasks.map((task) => (
                            <div key={task.id} className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold">{task.title}</h3>
                                        <p className="text-gray-600 mt-1">{task.description}</p>
                                        <div className="mt-2 flex gap-2">
                                            <select
                                                value={task.status}
                                                onChange={(e) => task.id && handleStatusChange(task.id, e.target.value as Task['status'])}
                                                className="text-sm border rounded px-2 py-1"
                                            >
                                                <option value="pending">Pendente</option>
                                                <option value="in_progress">Em Andamento</option>
                                                <option value="completed">Concluída</option>
                                            </select>
                                            <span className={`inline-block px-2 py-1 rounded text-sm ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-blue-100 text-blue-800'
                                                }`}>
                                                {task.status === 'completed' ? 'Concluída' :
                                                    task.status === 'in_progress' ? 'Em Andamento' :
                                                        'Pendente'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => task.id && handleDelete(task.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 