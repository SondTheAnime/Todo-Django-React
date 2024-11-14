import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            toast.current?.show({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Credenciais inválidas', 
                life: 3000 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <div className="text-900 text-3xl font-medium mb-3">Bem-vindo!</div>
                <span className="text-600 font-medium mb-5">Faça login para continuar</span>
                
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="flex flex-column gap-2 mb-4">
                        <label htmlFor="email" className="text-900 font-medium">Email</label>
                        <InputText
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full"
                            required
                        />
                    </div>
                    
                    <div className="flex flex-column gap-2 mb-4">
                        <label htmlFor="password" className="text-900 font-medium">Senha</label>
                        <Password
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            feedback={false}
                            toggleMask
                            className="w-full"
                            required
                        />
                    </div>
                    
                    <Button
                        label="Entrar"
                        type="submit"
                        className="w-full"
                        loading={loading}
                    />
                </form>
                
                <div className="flex align-items-center justify-content-center gap-4 mt-4">
                    <Link to="/auth/register" className="text-primary hover:underline">
                        Criar conta
                    </Link>
                </div>
            </div>
        </>
    );
} 