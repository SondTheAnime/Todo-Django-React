import axios from 'axios';
import { authService } from './authService';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true
});

// Interceptor para adicionar o token CSRF
api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Não definir Content-Type para requisições multipart/form-data
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    } else {
        config.headers['Content-Type'] = 'application/json';
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

    config.headers['Accept'] = 'application/json';

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const newToken = await authService.refreshToken();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                
                window.dispatchEvent(new CustomEvent('auth:error'));
                
                return Promise.reject(error);
            }
        }

        if (error.response?.status === 401) {
            window.dispatchEvent(new CustomEvent('auth:error'));
        }

        return Promise.reject(error);
    }
);

export default api; 