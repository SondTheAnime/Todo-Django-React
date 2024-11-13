import { createContext, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { useAuthStore } from '../hooks/useAuthStatus';

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
    login: (email: string, password: string) => Promise<LoginResponse>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setAuthenticated, setShowLoginModal } = useAuthStore();

    useEffect(() => {
        const handleAuthError = () => {
            setAuthenticated(false);
            setShowLoginModal(true);
        };

        window.addEventListener('auth:error', handleAuthError);
        return () => window.removeEventListener('auth:error', handleAuthError);
    }, []);

    const login = async (email: string, password: string): Promise<LoginResponse> => {
        try {
            const response = await authService.login(email, password);
            setAuthenticated(true);
            setShowLoginModal(false);
            return response;
        } catch (error) {
            setAuthenticated(false);
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await authService.logout();
            setAuthenticated(false);
        } catch (error) {
            console.error('Erro no logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ login, logout }}>
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