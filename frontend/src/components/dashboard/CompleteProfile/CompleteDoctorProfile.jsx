import { useState } from 'react';
import { FiUser, FiPhone, FiBriefcase, FiAward, FiDollarSign, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { doctorApi } from '../../../api/doctorApi';
import './CompleteDoctorProfile.css';

function CompleteDoctorProfile({ onComplete, userName, userEmail }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: userName || '',
        email: userEmail || '',
        phoneNumber: '',
        specialization: '',
        qualifications: '',
        consultationFee: '',
        isAvailable: true
    });

    const specializations = [
        'General Practitioner', 'Cardiologist', 'Neurologist', 'Pediatrician',
        'Orthopedic Surgeon', 'Dermatologist', 'Psychiatrist', 'Dentist',
        'ENT Specialist', 'Ophthalmologist'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await doctorApi.createProfile({
                ...formData,
                consultationFee: parseFloat(formData.consultationFee) || 0
            });
            console.log('Doctor profile created:', response.data);
            if (onComplete) {
                onComplete(response.data);
            }
        } catch (err) {
            console.error('Failed to create profile:', err);
            setError(err.response?.data?.message || 'Failed to create profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="complete-profile">
            <div className="complete-profile-card">
                <div className="complete-profile-header">
                    <div className="complete-profile-icon">
                        <FiUser />
                    </div>
                    <h2>Complete Doctor Profile</h2>
                    <p>Please provide your professional details to set up your practice</p>
                </div>

                {error && (
                    <div className="error-message">
                        <FiAlertCircle />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="complete-profile-form">
                    <div className="form-section">
                        <h3><FiUser /> Personal Details</h3>
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Dr. John Doe"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number *</label>
                            <div className="input-with-icon">
                                <FiPhone />
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 123-4567"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3><FiBriefcase /> Professional Info</h3>
                        <div className="form-group">
                            <label>Specialization *</label>
                            <div className="input-with-icon">
                                <FiBriefcase />
                                <select
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Specialization</option>
                                    {specializations.map(spec => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Qualifications *</label>
                            <div className="input-with-icon">
                                <FiAward />
                                <input
                                    type="text"
                                    name="qualifications"
                                    value={formData.qualifications}
                                    onChange={handleChange}
                                    placeholder="MBBS, MD, etc."
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Consultation Fee ($) *</label>
                            <div className="input-with-icon">
                                <FiDollarSign />
                                <input
                                    type="number"
                                    name="consultationFee"
                                    value={formData.consultationFee}
                                    onChange={handleChange}
                                    placeholder="50.00"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>Creating Profile...</>
                        ) : (
                            <>
                                <FiCheck /> Complete Setup
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CompleteDoctorProfile;
