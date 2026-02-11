import apiClient from './config';

export const medicalRecordApi = {
    /**
     * Create a new medical record
     * @param {Object} data - Medical record data
     */
    create: (data) => {
        return apiClient.post('/api/medical-records', data);
    },

    /**
     * Get medical record by Appointment ID
     * @param {number} appointmentId 
     */
    getByAppointmentId: (appointmentId) => {
        return apiClient.get(`/api/medical-records/appointment/${appointmentId}`);
    },

    /**
     * Get medical record by ID
     * @param {number} id 
     */
    getById: (id) => {
        return apiClient.get(`/api/medical-records/${id}`);
    },

    /**
     * Get patient's medical history
     * @param {number} patientId 
     */
    getByPatient: (patientId) => {
        return apiClient.get(`/api/medical-records/patient/${patientId}`);
    },

    /**
     * Get doctor's created records
     * @param {number} doctorId 
     */
    getByDoctor: (doctorId) => {
        return apiClient.get(`/api/medical-records/doctor/${doctorId}`);
    },

    /**
     * Update a medical record
     * @param {number} id 
     * @param {Object} data 
     */
    update: (id, data) => {
        return apiClient.put(`/api/medical-records/${id}`, data);
    },

    /**
     * Delete a medical record
     * @param {number} id 
     */
    delete: (id) => {
        return apiClient.delete(`/api/medical-records/${id}`);
    }
};

export default medicalRecordApi;
