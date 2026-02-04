import apiClient from './config';

export const authApi = {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @param {string} userData.name - User's full name
     * @param {string} userData.email - User's email
     * @param {string} userData.password - User's password
     * @param {string} userData.role - User role (PATIENT, DOCTOR, ADMIN)
     */
    register: (userData) => {
        return apiClient.post('/auth/register', userData);
    },

    /**
     * Login user
     * @param {Object} credentials - Login credentials
     * @param {string} credentials.email - User's email
     * @param {string} credentials.password - User's password
     */
    login: (credentials) => {
        return apiClient.post('/auth/login', credentials);
    },

    /**
     * Verify token (optional - if backend supports it)
     */
    verifyToken: () => {
        return apiClient.get('/auth/verify');
    },

    /**
     * Refresh token (optional - if backend supports it)
     */
    refreshToken: () => {
        return apiClient.post('/auth/refresh');
    },
};

export default authApi;
