import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

interface LoginResponse {
    detail: string;
    user: {
        id: number;
        username: string;
        email: string;
    };
    tokens: {
        access: string;
        refresh: string;
    };
}

interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<LoginResponse>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            login('joaovictorbrtor2@gmail.com', 'admin123');
        }
    }, []);

    const login = async (email: string, password: string): Promise<LoginResponse> => {
        try {
            const response = await authService.login(email, password);
            setIsAuthenticated(true);
            return response;
        } catch (error) {
            console.error('Erro no login:', error);
            setIsAuthenticated(false);
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await authService.logout();
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Erro no logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
} 