import api from './api';
import { Task } from '../types/Task';

interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export const taskService = {
    async list(filters: any): Promise<PaginatedResponse<Task>> {
        const response = await api.get<PaginatedResponse<Task>>('/tasks/', { params: filters });
        return response.data;
    },

    async create(taskData: FormData): Promise<Task> {
        const response = await api.post<Task>('/tasks/', taskData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async update(taskId: number, taskData: FormData): Promise<Task> {
        const response = await api.patch<Task>(`/tasks/${taskId}/`, taskData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async updateStatus(taskId: number, status: string): Promise<Task> {
        const response = await api.patch<Task>(`/tasks/${taskId}/status/`, { status });
        return response.data;
    },

    async updateDueDate(taskId: number, dueDate: Date): Promise<Task> {
        const response = await api.patch<Task>(`/tasks/${taskId}/due_date/`, { due_date: dueDate });
        return response.data;
    },

    async delete(taskId: number): Promise<void> {
        await api.delete(`/tasks/${taskId}/`);
    }
}; 