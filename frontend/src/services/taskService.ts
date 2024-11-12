import api from './api';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export interface Task {
    id?: number;
    title: string;
    description: string;
    status: TaskStatus;
    category: number | null;
    category_details?: {
        id: number;
        name: string;
        color: string;
    };
    priority: 1 | 2 | 3;
    created_at?: string;
    due_date: string | null;
    is_overdue: boolean;
    attachment?: File | string | null;
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

    async create(taskData: Partial<Task> & { attachment?: File | null }) {
        const formData = new FormData();

        // Adiciona os dados da tarefa
        Object.entries(taskData).forEach(([key, value]) => {
            if (value !== null && value !== undefined && key !== 'attachment') {
                // Converte o valor para string baseado no tipo
                if (typeof value === 'object') {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        // Adiciona o arquivo se existir
        if (taskData.attachment instanceof File) {
            formData.append("attachment", taskData.attachment);
        }

        const response = await api.post('/tasks/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async update(taskId: number, task: Partial<Task> | FormData) {
        let data: FormData;

        if (!(task instanceof FormData)) {
            data = new FormData();
            Object.entries(task).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === 'due_date' && typeof value === 'string') {
                        data.append(key, value);
                    } else if (typeof value === 'object') {
                        data.append(key, JSON.stringify(value));
                    } else {
                        data.append(key, String(value));
                    }
                }
            });
        } else {
            data = task;
        }

        const response = await api.put(`/tasks/${taskId}/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async delete(id: number) {
        await api.delete(`/tasks/${id}/`);
    }
}; 