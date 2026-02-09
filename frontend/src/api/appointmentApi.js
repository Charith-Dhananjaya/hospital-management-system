import apiClient from './config';

export const appointmentApi = {
    /**
     * Get all appointments
     */
    getAll: () => {
        return apiClient.get('/api/appointments');
    },

    /**
     * Get appointment by ID
     * @param {number} id - Appointment ID
     */
    getById: (id) => {
        return apiClient.get(`/api/appointments/${id}`);
    },

    /**
     * Get appointments by patient ID
     * @param {number} patientId - Patient ID
     */
    getByPatient: (patientId) => {
        return apiClient.get(`/api/appointments/patient/${patientId}`);
    },

    /**
     * Get appointments by doctor ID
     * @param {number} doctorId - Doctor ID
     */
    getByDoctor: (doctorId) => {
        return apiClient.get(`/api/appointments/doctor/${doctorId}`);
    },

    /**
     * Create new appointment
     * @param {Object} appointmentData - Appointment data
     * @param {number} appointmentData.patientId - Patient ID
     * @param {number} appointmentData.doctorId - Doctor ID
     * @param {string} appointmentData.appointmentTime - ISO date string
     * @param {string} appointmentData.reasonForVisit - Reason for visit
     */
    create: (appointmentData) => {
        return apiClient.post('/api/appointments', appointmentData);
    },

    /**
     * Update appointment
     * @param {number} id - Appointment ID
     * @param {Object} appointmentData - Updated appointment data
     */
    update: (id, appointmentData) => {
        return apiClient.put(`/api/appointments/${id}`, appointmentData);
    },

    /**
     * Cancel appointment
     * @param {number} id - Appointment ID
     */
    cancel: (id) => {
        return apiClient.patch(`/api/appointments/${id}/cancel`);
    },
};

export default appointmentApi;
