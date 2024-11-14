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