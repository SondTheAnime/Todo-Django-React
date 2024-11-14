import api from './api';

interface DashboardStats {
    status_distribution: {
        status: string;
        count: number;
    }[];
    category_distribution: {
        category__name: string | null;
        category__color: string | null;
        count: number;
    }[];
    overdue_count: number;
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
}

export const dashboardService = {
    async getStats(): Promise<DashboardStats> {
        const response = await api.get('/dashboard/stats/');
        return response.data;
    }
}; 