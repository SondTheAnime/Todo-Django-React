import { useEffect, useState } from 'react';
import { taskService } from '../../services/taskService';

export default function Dashboard() {
    const [stats, setStats] = useState({
        pending: 0,
        in_progress: 0,
        completed: 0
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const tasks = await taskService.list();
            const counts = tasks.reduce((acc, task) => {
                acc[task.status]++;
                return acc;
            }, {
                pending: 0,
                in_progress: 0,
                completed: 0
            });
            setStats(counts);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Tarefas Pendentes</h2>
                    <p className="text-3xl font-bold text-primary-600">{stats.pending}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Em Andamento</h2>
                    <p className="text-3xl font-bold text-yellow-600">{stats.in_progress}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Concluídas</h2>
                    <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                </div>
            </div>
        </div>
    );
} 