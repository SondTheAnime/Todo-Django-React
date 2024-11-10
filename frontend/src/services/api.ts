import axios from 'axios';
import { authService } from './authService';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para adicionar o token CSRF
api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
        try {
            const { data } = await axios.get('http://localhost:8000/api/csrf/', {
                withCredentials: true
            });
            config.headers['X-CSRFToken'] = data.csrfToken;
        } catch (error) {
            console.error('Erro ao obter token CSRF:', error);
        }
    }

    // Adicione estas headers
    config.headers['Accept'] = 'application/json';
    config.headers['Content-Type'] = 'application/json';

    return config;
});

api.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            url: response.config.url,
            method: response.config.method,
            status: response.status,
            data: response.data,
            headers: response.headers,
        });
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newToken = await authService.refreshToken();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Se o refresh falhar, redireciona para login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api; 