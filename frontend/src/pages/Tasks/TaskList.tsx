import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TaskCard from '../../components/TaskCard';
import TaskFilters from '../../components/TaskFilters';
import { taskService } from '../../services/taskService';
import { categoryService } from '../../services/categoryService';
import { Task } from '../../types/Task';
import { Category } from '../../types/Category';
import TaskEditModal from '../../components/TaskEditModal';

export default function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        category: '',
        search: '',
        ordering: '-created_at'
    });

    useEffect(() => {
        loadData();
    }, [filters]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [tasksResponse, categoriesData] = await Promise.all([
                taskService.list(filters),
                categoryService.list()
            ]);
            
            setTasks(tasksResponse.results);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setTasks([]);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
    };

    const handleStatusChange = async (taskId: number, newStatus: string) => {
        try {
            await taskService.updateStatus(taskId, newStatus);
            loadData();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
        }
    };

    const handleDelete = async (taskId: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
            try {
                await taskService.delete(taskId);
                setTasks(tasks.filter(task => task.id !== taskId));
            } catch (error) {
                console.error('Erro ao excluir tarefa:', error);
            }
        }
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
    };

    const handleSaveEdit = async (taskId: number, updatedTask: FormData) => {
        try {
            await taskService.update(taskId, updatedTask);
            loadData();
            setEditingTask(null);
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
        }
    };

    const handleUpdateDueDate = async (taskId: number, newDate: string) => {
        try {
            await taskService.updateDueDate(taskId, new Date(newDate));
            loadData();
        } catch (error) {
            console.error('Erro ao atualizar data de vencimento:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Tarefas
                </h1>
                <Link
                    to="/tasks/new"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                    Nova Tarefa
                </Link>
            </div>

            <TaskFilters
                onFilterChange={handleFilterChange}
                categories={categories}
            />

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                {loading ? (
                    <div className="p-4">Carregando...</div>
                ) : tasks.length === 0 ? (
                    <div className="p-4">Nenhuma tarefa encontrada.</div>
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
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
} 