import api from './api';

export interface Category {
    id?: number;
    name: string;
    color: string;
    created_at?: string;
}

interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export const categoryService = {
    async list() {
        const response = await api.get<PaginatedResponse<Category>>('/categories/');
        return response.data.results;
    },

    async create(category: Omit<Category, 'id' | 'created_at'>) {
        const response = await api.post<Category>('/categories/', category);
        return response.data;
    },

    async update(id: number, category: Partial<Category>) {
        const response = await api.patch<Category>(`/categories/${id}/`, category);
        return response.data;
    },

    async delete(id: number) {
        await api.delete(`/categories/${id}/`);
    }
}; 