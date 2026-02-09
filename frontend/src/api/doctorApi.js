import apiClient from './config';

export const doctorApi = {
    /**
     * Get all doctors
     */
    getAll: () => {
        return apiClient.get('/api/doctors');
    },

    /**
     * Get doctor by ID
     * @param {number} id - Doctor ID
     */
    getById: (id) => {
        return apiClient.get(`/api/doctors/${id}`);
    },

    /**
     * Get doctors by specialization
     * @param {string} specialization - Specialization name
     */
    getBySpecialization: (specialization) => {
        return apiClient.get('/api/doctors/specialization', {
            params: { specialization },
        });
    },

    /**
     * Get doctors by availability status
     * @param {boolean} status - Availability status
     */
    getByAvailability: (status) => {
        return apiClient.get('/api/doctors/availability', {
            params: { status },
        });
    },

    /**
     * Get current doctor's profile (requires auth)
     */
    getMyProfile: () => {
        return apiClient.get('/api/doctors/my-profile');
    },

    /**
     * Create doctor profile (requires auth)
     * @param {Object} doctorData - Doctor profile data
     */
    createProfile: (doctorData) => {
        return apiClient.post('/api/doctors/my-profile', doctorData);
    },

    /**
     * Update doctor by ID
     * @param {number} id - Doctor ID
     * @param {Object} doctorData - Updated doctor data
     */
    update: (id, doctorData) => {
        return apiClient.put(`/api/doctors/${id}`, doctorData);
    },

    /**
     * Update doctor availability
     * @param {number} id - Doctor ID
     * @param {boolean} status - New availability status
     */
    updateAvailability: (id, status) => {
        return apiClient.patch(`/api/doctors/${id}/availability`, null, {
            params: { status },
        });
    },

    /**
     * Delete doctor
     * @param {number} id - Doctor ID
     */
    delete: (id) => {
        return apiClient.delete(`/api/doctors/${id}`);
    },
};

export default doctorApi;
