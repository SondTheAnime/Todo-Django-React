import api from './api';

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

interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export const authService = {
    async login(email: string, password: string) {
        const response = await api.post<LoginResponse>('/auth/login/', {
            username: email,
            password
        });

        if (response.data.tokens) {
            localStorage.setItem('access_token', response.data.tokens.access);
            localStorage.setItem('refresh_token', response.data.tokens.refresh);
        }

        return response.data;
    },

    async logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return api.post('/auth/logout/');
    },

    async checkAuth() {
        try {
            const response = await api.get('/auth/check/');
            return response.data;
        } catch (error) {
            return { isAuthenticated: false };
        }
    },

    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) throw new Error('Refresh token não encontrado');

            const response = await api.post('/token/refresh/', {
                refresh: refreshToken
            });

            const { access } = response.data;
            localStorage.setItem('access_token', access);
            return access;
        } catch (error) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            throw error;
        }
    },

    async register(data: RegisterData) {
        const response = await api.post<LoginResponse>('/auth/register/', data);
        
        if (response.data.tokens) {
            localStorage.setItem('access_token', response.data.tokens.access);
            localStorage.setItem('refresh_token', response.data.tokens.refresh);
        }
        
        return response.data;
    }
}; 