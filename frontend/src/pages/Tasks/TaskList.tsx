import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { taskService, Task, TaskStatus } from '../../services/taskService';
import { categoryService, Category } from '../../services/categoryService';
import TaskCard from '../../components/TaskCard';
import TaskEditModal from '../../components/TaskEditModal';

export default function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [overdueTasksCount, setOverdueTasksCount] = useState(0);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const overdueTasks = tasks.filter(task => {
            if (!task.due_date || task.status === 'completed') return false;
            return new Date(task.due_date) < new Date();
        });
        setOverdueTasksCount(overdueTasks.length);
    }, [tasks]);

    const loadData = async () => {
        try {
            const [tasksData, categoriesData] = await Promise.all([
                taskService.list(),
                categoryService.list()
            ]);
            setTasks(Array.isArray(tasksData) ? tasksData : []);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
    };

    const handleSave = async (taskId: number, updatedTask: Partial<Task> | FormData) => {
        try {
            await taskService.update(taskId, updatedTask);
            loadData();
            setEditingTask(null);
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
        }
    };

    const handleStatusChange = async (taskId: number, newStatus: TaskStatus) => {
        try {
            const taskToUpdate = tasks.find(t => t.id === taskId);
            if (!taskToUpdate) return;

            const updatedTask = {
                title: taskToUpdate.title,
                description: taskToUpdate.description,
                status: newStatus,
                priority: taskToUpdate.priority,
                category: taskToUpdate.category,
                due_date: taskToUpdate.due_date
            };

            await taskService.update(taskId, updatedTask);
            await loadData();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            alert('Erro ao atualizar o status da tarefa');
        }
    };

    const handleDelete = async (taskId: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
            try {
                await taskService.delete(taskId);
                loadData();
            } catch (error) {
                console.error('Erro ao excluir tarefa:', error);
            }
        }
    };

    const handleUpdateDueDate = async (taskId: number, dueDate: string) => {
        try {
            const taskToUpdate = tasks.find(t => t.id === taskId);
            console.log('Debug - Atualizando data de vencimento');
            console.log('Debug - Tarefa encontrada:', taskToUpdate);
            console.log('Debug - Nova data:', dueDate);

            if (!taskToUpdate) {
                console.log('Debug - Tarefa não encontrada!');
                return;
            }

            const updatedTask = {
                title: taskToUpdate.title,
                description: taskToUpdate.description,
                status: taskToUpdate.status,
                priority: taskToUpdate.priority,
                category: taskToUpdate.category,
                due_date: dueDate
            };

            console.log('Debug - Dados para atualização:', updatedTask);
            await taskService.update(taskId, updatedTask);
            console.log('Debug - Atualização concluída com sucesso');
            await loadData();
        } catch (error) {
            console.error('Debug - Erro ao atualizar data de vencimento:', error);
            alert('Erro ao atualizar a data de vencimento da tarefa');
        }
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tarefas</h1>
                    {overdueTasksCount > 0 && (
                        <p className="text-red-600 dark:text-red-400 mt-2">
                            {overdueTasksCount} {overdueTasksCount === 1 ? 'tarefa vencida' : 'tarefas vencidas'}
                        </p>
                    )}
                </div>
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
                            <TaskCard
                                key={task.id}
                                task={task}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                                onUpdateDueDate={handleUpdateDueDate}
                            />
                        ))}
                    </div>
                )}
            </div>

            {editingTask && (
                <TaskEditModal
                    task={editingTask}
                    categories={categories}
                    onClose={() => setEditingTask(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
} 