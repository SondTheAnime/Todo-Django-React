import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { authService } from '../../services/authService';

export default function Register() {
    const navigate = useNavigate();
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
            await authService.register({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Erro ao criar conta');
        }
    };

    return (
        <div className="flex align-items-center justify-content-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-30rem">
                <h2 className="text-center text-2xl font-bold mb-4">Criar Conta</h2>
                <form onSubmit={handleSubmit} className="flex flex-column gap-3">
                    {error && <Message severity="error" text={error} />}
                    
                    <div className="flex flex-column gap-2">
                        <label htmlFor="username">Nome de usuário</label>
                        <InputText
                            id="username"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="email">Email</label>
                        <InputText
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="password">Senha</label>
                        <Password
                            id="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="confirmPassword">Confirme a senha</label>
                        <Password
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            feedback={false}
                            required
                        />
                    </div>

                    <Button type="submit" label="Criar conta" className="mt-2" />

                    <div className="text-center mt-3">
                        <Link to="/login" className="text-blue-500 hover:text-blue-700">
                            Já tem uma conta? Faça login
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    );
} 