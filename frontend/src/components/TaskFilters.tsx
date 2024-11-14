import { useState } from 'react';
import { Category } from '../types/Category';

interface TaskFiltersProps {
    onFilterChange: (filters: any) => void;
    categories: any[];
}

export default function TaskFilters({ onFilterChange, categories }: TaskFiltersProps) {
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        category: '',
        search: '',
        ordering: '-created_at'
    });

    const handleFilterChange = (field: string, value: string) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const getFilterLabel = (filterType: string) => {
        switch (filterType) {
            case 'status':
                return 'Status';
            case 'priority':
                return 'Prioridade';
            case 'category':
                return 'Categoria';
            case 'ordering':
                return 'Ordenar por';
            default:
                return '';
        }
    };

    const getFilterOptions = (filterType: string, categories: Category[]) => {
        switch (filterType) {
            case 'status':
                return [
                    { value: '', label: 'Todos' },
                    { value: 'pending', label: 'Pendente' },
                    { value: 'in_progress', label: 'Em Andamento' },
                    { value: 'completed', label: 'Concluída' }
                ];
            case 'priority':
                return [
                    { value: '', label: 'Todas' },
                    { value: '1', label: 'Baixa' },
                    { value: '2', label: 'Média' },
                    { value: '3', label: 'Alta' }
                ];
            case 'category':
                return [
                    { value: '', label: 'Todas' },
                    { value: 'none', label: 'Sem categoria' },
                    ...categories.map(category => ({
                        value: String(category.id),
                        label: category.name
                    }))
                ];
            case 'ordering':
                return [
                    { value: '-created_at', label: 'Data de criação (mais recente)' },
                    { value: 'created_at', label: 'Data de criação (mais antiga)' },
                    { value: '-due_date', label: 'Data de vencimento (mais recente)' },
                    { value: 'due_date', label: 'Data de vencimento (mais antiga)' },
                    { value: '-priority', label: 'Prioridade (maior)' },
                    { value: 'priority', label: 'Prioridade (menor)' }
                ];
            default:
                return [];
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Busca por texto */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Buscar
                    </label>
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        placeholder="Buscar tarefas..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                </div>

                {/* Filtros Select */}
                {['status', 'priority', 'category', 'ordering'].map((filterType) => (
                    <div key={filterType}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            {getFilterLabel(filterType)}
                        </label>
                        <select
                            value={filters[filterType as keyof typeof filters]}
                            onChange={(e) => handleFilterChange(filterType, e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            {getFilterOptions(filterType, categories).map((option) => (
                                <option 
                                    key={option.value} 
                                    value={option.value}
                                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
} 