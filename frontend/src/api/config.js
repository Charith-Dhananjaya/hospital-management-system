import axios from 'axios';

// Base API configuration - API Gateway runs on port 9191
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9191';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token and log requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request for debugging
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data || '');

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - Handle common errors with detailed logging
apiClient.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.config.url}`, response.data);
        return response;
    },
    (error) => {
        // Log full error details
        console.error('❌ API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
        });

        // Handle 401 Unauthorized - token expired or invalid
        // BUT don't redirect if we're on auth pages or calling auth endpoints
        if (error.response?.status === 401) {
            const isAuthEndpoint = error.config?.url?.startsWith('/auth');
            const isAuthPage = window.location.pathname === '/login' ||
                window.location.pathname === '/register';

            // Only handle 401 for protected endpoints, not auth endpoints
            if (!isAuthEndpoint && !isAuthPage) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }

        // Create a more informative error
        const enhancedError = error;

        // Extract the most useful error message
        if (error.response?.data) {
            const data = error.response.data;
            enhancedError.userMessage =
                data.message ||
                data.error ||
                data.errors?.join(', ') ||
                (typeof data === 'string' ? data : null) ||
                `Error ${error.response.status}: ${error.response.statusText}`;
        } else if (error.code === 'ECONNABORTED') {
            enhancedError.userMessage = 'Request timed out. Server may be slow or unavailable.';
        } else if (!error.response) {
            enhancedError.userMessage = 'Cannot connect to server. Please check:\n1. Backend services are running\n2. API Gateway is on port 9191\n3. CORS is enabled';
        } else {
            enhancedError.userMessage = error.message || 'An unexpected error occurred';
        }

        return Promise.reject(enhancedError);
    }
);

export default apiClient;
export { API_BASE_URL };
