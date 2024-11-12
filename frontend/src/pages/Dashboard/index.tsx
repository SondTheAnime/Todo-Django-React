import { useEffect, useState } from 'react';
import { taskService } from '../../services/taskService';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

export default function Dashboard() {
    const [stats, setStats] = useState({
        pending: 0,
        in_progress: 0,
        completed: 0,
        overdue: 0
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const tasks = await taskService.list();
            const counts = tasks.reduce((acc, task) => {
                if (task.is_overdue) {
                    acc.overdue++;
                } else {
                    acc[task.status]++;
                }
                return acc;
            }, {
                pending: 0,
                in_progress: 0,
                completed: 0,
                overdue: 0
            });
            setStats(counts);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
                    <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                        Tarefas Pendentes
                    </h2>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.pending}
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
                    <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                        Em Andamento
                    </h2>
                    <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
                        {stats.in_progress}
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
                    <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                        Concluídas
                    </h2>
                    <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                        {stats.completed}
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all hover:shadow-xl border-2 border-red-500/20">
                    <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                        Tarefas Vencidas
                    </h2>
                    <p className="text-4xl font-bold text-red-600 dark:text-red-400">
                        {stats.overdue}
                    </p>
                </div>
            </div>
        </div>
    );
} 