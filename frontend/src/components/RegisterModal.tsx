import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { authService } from '../services/authService';

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function RegisterModal({ isOpen, onClose, onSuccess }: RegisterModalProps) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        try {
            await authService.register(formData);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Erro ao criar conta');
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className="fixed inset-0 z-50 overflow-y-auto"
        >
            <div className="flex min-h-screen items-center justify-center">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                    <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                        Criar nova conta
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="mt-4">
                        {error && (
                            <div className="mb-4 text-sm text-red-600">{error}</div>
                        )}
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                placeholder="Nome de usuário"
                                className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-white"
                                required
                            />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="Email"
                                className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-white"
                                required
                            />
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                placeholder="Senha"
                                className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-white"
                                required
                            />
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                placeholder="Confirme a senha"
                                className="w-full rounded-lg border p-2 dark:bg-gray-700 dark:text-white"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
                            >
                                Criar conta
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
} 