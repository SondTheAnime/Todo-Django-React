import { Dialog } from '@headlessui/react';
import { useAuthStore } from '../hooks/useAuthStatus';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export function LoginModal() {
    const { showLoginModal } = useAuthStore();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            setError('');
        } catch (err) {
            setError('Credenciais inválidas');
        }
    };

    return (
        <Dialog
            open={showLoginModal}
            onClose={() => {}}
            className="fixed inset-0 z-50 overflow-y-auto"
        >
            <div className="flex min-h-screen items-center justify-center">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                        Faça login para continuar
                    </Dialog.Title>
                    
                    <form onSubmit={handleSubmit} className="mt-4">
                        {error && (
                            <div className="mb-4 text-sm text-red-600">{error}</div>
                        )}
                        <div className="space-y-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-full rounded-lg border p-2"
                                required
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Senha"
                                className="w-full rounded-lg border p-2"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
                            >
                                Entrar
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}