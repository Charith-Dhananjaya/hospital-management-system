import apiClient from './config';

export const patientApi = {
    /**
     * Get all patients
     */
    getAll: () => {
        return apiClient.get('/api/patients');
    },

    /**
     * Get patient by ID
     * @param {number} id - Patient ID
     */
    getById: (id) => {
        return apiClient.get(`/api/patients/${id}`);
    },

    /**
     * Search patients by name
     * @param {string} name - Patient name to search
     */
    searchByName: (name) => {
        return apiClient.get('/api/patients/search', {
            params: { name },
        });
    },

    /**
     * Get current patient's profile (requires auth)
     */
    getMyProfile: () => {
        return apiClient.get('/api/patients/my-profile');
    },

    /**
     * Create patient profile (requires auth)
     * @param {Object} patientData - Patient profile data
     */
    create: (patientData) => {
        return apiClient.post('/api/patients', patientData);
    },

    /**
     * Update patient by ID
     * @param {number} id - Patient ID
     * @param {Object} patientData - Updated patient data
     */
    update: (id, patientData) => {
        return apiClient.put(`/api/patients/${id}`, patientData);
    },

    /**
     * Delete patient
     * @param {number} id - Patient ID
     */
    delete: (id) => {
        return apiClient.delete(`/api/patients/${id}`);
    },
};

export default patientApi;
