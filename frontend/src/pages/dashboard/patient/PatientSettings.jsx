import { useState, useEffect } from 'react';
import { patientApi } from '../../../api/patientApi';
import { FiUser, FiPhone, FiMapPin, FiCheck, FiAlertCircle } from 'react-icons/fi';
import Loader from '../../../components/common/Loader';
import '../../../components/dashboard/CompleteProfile/CompleteProfile.css'; // Reuse styles

function PatientSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [patient, setPatient] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        age: '',
        phoneNumber: '',
        address: '',
        medicalHistory: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await patientApi.getMyProfile();
            const data = response.data;
            setPatient(data);
            setFormData({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                age: data.age || '',
                phoneNumber: data.phoneNumber || '',
                address: data.address || '',
                medicalHistory: data.medicalHistory || '',
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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await patientApi.update(patient.id, {
                ...formData,
                age: parseInt(formData.age, 10) || 0,
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

            <div className="complete-profile__card" style={{ maxWidth: '100%', margin: 0 }}>
                {error && (
                    <div className="complete-profile__error">
                        <FiAlertCircle />
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="success-message" style={{
                        backgroundColor: '#d1fae5', color: '#065f46', padding: '1rem',
                        borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <FiCheck style={{ marginRight: '8px' }} />
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="complete-profile__form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            disabled
                            className="input-disabled"
                            style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="age">Age</label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                min="1"
                                max="120"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="medicalHistory">Medical History</label>
                        <textarea
                            id="medicalHistory"
                            name="medicalHistory"
                            value={formData.medicalHistory}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PatientSettings;
