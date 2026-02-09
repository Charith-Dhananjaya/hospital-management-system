import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

// Helper to extract error message from various error formats
const extractErrorMessage = (error, defaultMessage) => {
    // Check for our enhanced userMessage from API interceptor
    if (error.userMessage) {
        return error.userMessage;
    }

    // Check response data for various error message formats
    if (error.response?.data) {
        const data = error.response.data;

        // Check common error message fields
        if (data.message) return data.message;
        if (data.error) return data.error;
        if (data.errors && Array.isArray(data.errors)) {
            return data.errors.join(', ');
        }
        if (typeof data === 'string') return data;

        // Spring Boot validation errors
        if (data.fieldErrors) {
            return Object.values(data.fieldErrors).join(', ');
        }
    }

    // Network errors
    if (error.code === 'ERR_NETWORK') {
        return 'Cannot connect to server. Please ensure the backend is running.';
    }

    if (error.code === 'ECONNABORTED') {
        return 'Request timed out. The server may be busy.';
    }

    // Status-based messages
    if (error.response?.status) {
        const status = error.response.status;
        if (status === 400) return 'Invalid request. Please check your input.';
        if (status === 401) return 'Invalid credentials. Please try again.';
        if (status === 403) return 'Access denied. You do not have permission.';
        if (status === 404) return 'Service not found. Please check API Gateway.';
        if (status === 409) return 'This email is already registered.';
        if (status === 500) return 'Server error. Please try again later.';
        if (status === 503) return 'Service unavailable. Please try again later.';
    }

    return defaultMessage;
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);




    const login = useCallback(async (email, password) => {
        try {


            // Backend returns: { message, token, userId, name, role }
            const { token: newToken, userId, name, role, message } = response.data;

            if (!newToken) {
                return {
                    success: false,
                    error: message || 'Login failed: No token received from server'
                };
            }

            const userData = {
                id: userId,
                name: name,
                email: email,
                role: role
            };

            // Store token and user data
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(newToken);
            setUser(userData);

            // console.log('✅ Login successful:', userData);
            return { success: true, user: userData };
        } catch (error) {
            console.error('❌ Login failed:', error);
            const errorMessage = extractErrorMessage(error, 'Login failed. Please check your credentials.');
            return {
                success: false,
                error: errorMessage
            };
        }
    }, []);

    const register = useCallback(async (userData) => {
        try {
            console.log('📝 Attempting registration:', { ...userData, password: '***' });
            const response = await authApi.register(userData);

            console.log('📦 Registration response:', response.data);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('❌ Registration failed:', error);
            const errorMessage = extractErrorMessage(error, 'Registration failed. Please try again.');
            return {
                success: false,
                error: errorMessage
            };
        }
    }, []);

    const logout = useCallback(() => {
        console.log('🚪 Logging out...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    }, []);

    const updateUser = useCallback((userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    }, []);

    // Initialize user from token
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Failed to parse saved user:', error);
                logout();
            }
        }

        setLoading(false);
    }, [logout]);



    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateUser,
        // Role helpers
        isAdmin: user?.role === 'ADMIN',
        isDoctor: user?.role === 'DOCTOR',
        isPatient: user?.role === 'PATIENT',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
