import axios from 'axios';

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
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers,
        });
        return Promise.reject(error);
    }
);

export default api; 