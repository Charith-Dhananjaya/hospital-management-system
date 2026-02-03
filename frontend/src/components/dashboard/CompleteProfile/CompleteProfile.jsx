import { useState } from 'react';
import { FiUser, FiPhone, FiMapPin, FiCalendar, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { patientApi } from '../../../api/patientApi';
import './CompleteProfile.css';

function CompleteProfile({ onComplete, userName, userEmail }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        firstName: userName?.split(' ')[0] || '',
        lastName: userName?.split(' ').slice(1).join(' ') || '',
        age: '',
        phoneNumber: '',
        address: '',
        medicalHistory: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await patientApi.create({
                ...formData,
                age: parseInt(formData.age, 10) || 0,
            });
            console.log('Patient profile created:', response.data);
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
            <div className="complete-profile__card">
                <div className="complete-profile__header">
                    <div className="complete-profile__icon">
                        <FiUser />
                    </div>
                    <h2>Complete Your Profile</h2>
                    <p>Please provide your details to continue using our healthcare services</p>
                </div>

                {error && (
                    <div className="complete-profile__error">
                        <FiAlertCircle />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="complete-profile__form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name *</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter first name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name *</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="age">Age *</label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Your age"
                                min="1"
                                max="120"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number *</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="+1 (555) 123-4567"
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
                            placeholder="Your address"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="medicalHistory">Medical History</label>
                        <textarea
                            id="medicalHistory"
                            name="medicalHistory"
                            value={formData.medicalHistory}
                            onChange={handleChange}
                            placeholder="Any pre-existing conditions, allergies, or medications..."
                            rows={3}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading}
                    >
                        {loading ? (
                            <>Creating Profile...</>
                        ) : (
                            <>
                                <FiCheck /> Complete Profile
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CompleteProfile;
