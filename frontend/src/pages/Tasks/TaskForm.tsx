import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../../services/taskService';

export default function TaskForm() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await taskService.create({
                title,
                description,
                status: 'pending'
            });
            navigate('/tasks');
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
        }
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-6">Nova Tarefa</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Título
                        </label>
                        <input
                            type="text"
                            className="input-field w-full"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Digite o título da tarefa"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Descrição
                        </label>
                        <textarea
                            className="input-field w-full"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Digite a descrição da tarefa"
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary">
                        Salvar
                    </button>
                </form>
            </div>
        </div>
    );
} 