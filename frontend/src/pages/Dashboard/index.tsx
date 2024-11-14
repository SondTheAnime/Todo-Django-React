import { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { Chart } from 'primereact/chart';
import { ClockIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await dashboardService.getStats();
            setStats(data);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    const statusChartData = {
        labels: ['Pendentes', 'Em Andamento', 'Concluídas', 'Atrasadas'],
        datasets: [{
            data: stats?.status_distribution?.map((item: any) => item.count) || [],
            backgroundColor: [
                'rgba(99, 102, 241, 0.8)',   // Indigo para pendentes
                'rgba(245, 158, 11, 0.8)',   // Amber para em andamento
                'rgba(16, 185, 129, 0.8)',   // Emerald para concluídas
                'rgba(239, 68, 68, 0.8)'     // Red para atrasadas
            ],
            borderColor: [
                'rgb(99, 102, 241)',
                'rgb(245, 158, 11)',
                'rgb(16, 185, 129)',
                'rgb(239, 68, 68)'
            ],
            borderWidth: 2
        }]
    };

    const categoryChartData = {
        labels: stats?.category_distribution?.map((item: any) => item.category__name) || [],
        datasets: [{
            data: stats?.category_distribution?.map((item: any) => item.count) || [],
            backgroundColor: stats?.category_distribution?.map((item: any) => item.category__color) || [],
            borderColor: stats?.category_distribution?.map((item: any) => item.category__color) || [],
            borderWidth: 1
        }]
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 20,
                    color: 'rgb(156, 163, 175)',
                    font: {
                        size: 14
                    },
                    generateLabels: (chart: any) => {
                        const datasets = chart.data.datasets[0];
                        return chart.data.labels.map((label: string, index: number) => ({
                            text: `${label} (${datasets.data[index]})`,
                            fillStyle: datasets.backgroundColor[index],
                            strokeStyle: datasets.borderColor[index],
                            lineWidth: 1,
                            hidden: false
                        }));
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value} ${value === 1 ? 'tarefa' : 'tarefas'}`;
                    }
                }
            }
        },
        maintainAspectRatio: false
    };

    if (loading || !stats) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                Dashboard
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center gap-4">
                        <ClockIcon className="h-10 w-10 opacity-80" />
                        <div>
                            <h2 className="text-lg font-medium opacity-90">
                                Tarefas Pendentes
                            </h2>
                            <p className="text-4xl font-bold mt-1">
                                {stats?.pending_tasks || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center gap-4">
                        <CheckCircleIcon className="h-10 w-10 opacity-80" />
                        <div>
                            <h2 className="text-lg font-medium opacity-90">
                                Tarefas Concluídas
                            </h2>
                            <p className="text-4xl font-bold mt-1">
                                {stats?.completed_tasks || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center gap-4">
                        <ExclamationCircleIcon className="h-10 w-10 opacity-80" />
                        <div>
                            <h2 className="text-lg font-medium opacity-90">
                                Tarefas Atrasadas
                            </h2>
                            <p className="text-4xl font-bold mt-1">
                                {stats?.overdue_count || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                        Distribuição por Status
                    </h2>
                    <div className="h-80">
                        <Chart type="doughnut" data={statusChartData} options={chartOptions} />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                        Distribuição por Categoria
                    </h2>
                    <div className="h-80">
                        <Chart type="doughnut" data={categoryChartData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
} 