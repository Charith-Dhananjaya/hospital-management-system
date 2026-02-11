import { useState, useEffect } from 'react';
import { FiX, FiCheck, FiFileText, FiActivity } from 'react-icons/fi';
import './CompleteAppointmentModal.css';

const CompleteAppointmentModal = ({ isOpen, onClose, onComplete, appointment, initialData }) => {
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');
    const [prescription, setPrescription] = useState('');
    const [loading, setLoading] = useState(false);

    // Initialize state when modal opens or initialData changes
    useEffect(() => {
        if (isOpen && initialData) {
            setDiagnosis(initialData.diagnosis || '');
            setNotes(initialData.doctorNotes || '');
            setPrescription(initialData.prescription || '');
        } else if (isOpen) {
            // Reset if opening effectively as new
            setDiagnosis('');
            setNotes('');
            setPrescription('');
        }
    }, [isOpen, initialData]);

    if (!isOpen || !appointment) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onComplete(appointment.id, {
                diagnosis,
                doctorNotes: notes,
                prescription,
                status: 'COMPLETED'
            });
            onClose();
        } catch (error) {
            console.error("Error in modal:", error);
        } finally {
            setLoading(false);
        }
    };

    const isUpdate = !!initialData;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>{isUpdate ? 'Update Medical Record' : 'Complete Appointment'}</h2>
                    <button className="modal-close" onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="patient-summary">
                        <h3>Patient: {appointment.patientName}</h3>
                        <p className="visit-reason">
                            <strong>Reason for Visit:</strong> {appointment.reasonForVisit}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">
                                <FiActivity /> Diagnosis
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="E.g., Seasonal Flu, Migraine..."
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FiFileText /> Doctor Notes / Symptoms
                            </label>
                            <textarea
                                className="form-textarea"
                                rows="3"
                                placeholder="Patient reported symptoms, observations..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FiFileText /> Prescription
                            </label>
                            <textarea
                                className="form-textarea"
                                rows="3"
                                placeholder="Medications, dosage, instructions..."
                                value={prescription}
                                onChange={(e) => setPrescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn btn-outline" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Saving...' : (isUpdate ? 'Update Record' : 'Complete Appointment')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompleteAppointmentModal;
