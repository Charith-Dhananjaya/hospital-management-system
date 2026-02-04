import { useState, useEffect } from 'react';
import { doctorApi } from '../../../api/doctorApi';
import { FiUser, FiPhone, FiAward, FiBriefcase, FiDollarSign, FiSave, FiAlertCircle, FiCheck } from 'react-icons/fi';
import Loader from '../../../components/common/Loader';
import '../../../components/dashboard/CompleteProfile/CompleteDoctorProfile.css'; // Reuse styles

function DoctorSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
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

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await doctorApi.getMyProfile();
            const data = response.data;
            setDoctor(data);
            setFormData({
                name: data.name || '',
                email: data.email || '',
                phoneNumber: data.phoneNumber || '',
                specialization: data.specialization || '',
                qualifications: data.qualifications || '',
                consultationFee: data.consultationFee || '',
                isAvailable: data.isAvailable
            });
        } catch (err) {
            console.error('Failed to fetch profile:', err);
            setError('Failed to load profile data.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await doctorApi.update(doctor.id, {
                ...formData,
                consultationFee: parseFloat(formData.consultationFee)
            });
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Failed to update profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader text="Loading settings..." />;

    return (
        <div className="dashboard-content">
            <div className="dashboard-page-header">
                <h1>Settings</h1>
                <p>Manage your profile and account settings</p>
            </div>

            <div className="complete-profile-card" style={{ maxWidth: '100%', margin: 0 }}>
                {error && (
                    <div className="error-message">
                        <FiAlertCircle style={{ marginRight: '8px' }} />
                        {error}
                    </div>
                )}
                {success && (
                    <div className="success-message" style={{
                        backgroundColor: '#d1fae5', color: '#065f46', padding: '1rem',
                        borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center'
                    }}>
                        <FiCheck style={{ marginRight: '8px' }} />
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="complete-profile-form">
                    <div className="form-section">
                        <h3><FiUser /> Personal Details</h3>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                                className="input-disabled"
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <div className="input-with-icon">
                                <FiPhone />
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3><FiBriefcase /> Professional Information</h3>

                        <div className="form-group">
                            <label>Specialization</label>
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
                            <label>Qualifications</label>
                            <div className="input-with-icon">
                                <FiAward />
                                <input
                                    type="text"
                                    name="qualifications"
                                    value={formData.qualifications}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Consultation Fee ($)</label>
                            <div className="input-with-icon">
                                <FiDollarSign />
                                <input
                                    type="number"
                                    name="consultationFee"
                                    value={formData.consultationFee}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-submit" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default DoctorSettings;
