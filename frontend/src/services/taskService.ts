import api from './api';

export interface Task {
    id?: number;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    created_at?: string;
}

interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export const taskService = {
    async list() {
        const response = await api.get<PaginatedResponse<Task>>('/tasks/');
        return response.data.results;
    },

    async create(task: Omit<Task, 'id' | 'created_at'>) {
        const response = await api.post<Task>('/tasks/', task);
        return response.data;
    },

    async update(id: number, task: Partial<Task>) {
        const response = await api.patch<Task>(`/tasks/${id}/`, task);
        return response.data;
    },

    async delete(id: number) {
        await api.delete(`/tasks/${id}/`);
    }
}; 