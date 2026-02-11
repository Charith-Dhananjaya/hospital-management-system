import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiUser, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { doctorApi } from '../../../api/doctorApi';
import { appointmentApi } from '../../../api/appointmentApi';
import { patientApi } from '../../../api/patientApi';
import { useAuth } from '../../../context/AuthContext';
import './Appointments.css';

const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
];



function Appointments() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [step, setStep] = useState(1);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('');

    const [formData, setFormData] = useState({
        department: '',
        doctorId: '',
        date: '',
        time: '',
        patientName: '',
        patientEmail: '',
        patientPhone: '',
        reasonForVisit: '',
    });

    // Extract unique specializations
    const specializations = [...new Set(doctors.map(doc => doc.specialization))];

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData(prev => ({
                ...prev,
                patientName: user.name || '',
                patientEmail: user.email || '',
            }));
        }
    }, [isAuthenticated, user]);

    const fetchDoctors = async () => {
        try {
            const response = await doctorApi.getAll();
            setDoctors(response.data);
        } catch (error) {
            console.error('Failed to fetch doctors:', error);
            setDoctors([]);
        }
    };

    const filteredDoctors = doctors.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpec = selectedSpecialization ? doc.specialization === selectedSpecialization : true;
        return matchesSearch && matchesSpec;
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTimeSelect = (time) => {
        setFormData({ ...formData, time });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent submission if not on the final step (e.g., pressing Enter in search)
        if (step !== 3) return;

        setLoading(true);
        setError(null);

        try {
            if (isAuthenticated) {
                // First, get the patient profile to get the correct patient ID
                let patientId = null;
                try {
                    const profileResponse = await patientApi.getMyProfile();
                    patientId = profileResponse.data?.id;
                } catch (profileErr) {
                    console.error('No patient profile found:', profileErr);
                    setError('Please complete your patient profile before booking an appointment. Go to your Dashboard to complete your profile.');
                    setLoading(false);
                    return;
                }

                if (!patientId) {
                    setError('Patient profile not found. Please complete your profile first.');
                    setLoading(false);
                    return;
                }

                await appointmentApi.create({
                    patientId: patientId,
                    doctorId: parseInt(formData.doctorId),
                    appointmentTime: `${formData.date}T${convertTo24Hour(formData.time)}`,
                    reasonForVisit: formData.reasonForVisit,
                });

                setSubmitted(true);
            } else {
                // Guest booking not supported yet, force login
                setError('You must be logged in to book an appointment.');
                // Optional: Redirect to login or show modal
                // navigate('/login'); 
            }
        } catch (error) {
            console.error('Booking failed:', error);
            setError(error.response?.data?.message || 'Failed to book appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const convertTo24Hour = (time12h) => {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        if (modifier === 'PM' && hours !== '12') hours = parseInt(hours) + 12;
        if (modifier === 'AM' && hours === '12') hours = '00';
        return `${hours}:${minutes}:00`;
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    if (submitted) {
        return (
            <div className="appointments-page">
                <section className="page-header">
                    <div className="container">
                        <h1>Appointment Booked!</h1>
                    </div>
                </section>
                <section className="appointment-success section">
                    <div className="container">
                        <div className="appointment-success__card">
                            <div className="appointment-success__icon">
                                <FiCheck size={48} />
                            </div>
                            <h2>Your Appointment is Confirmed</h2>
                            <p>We've sent a confirmation email to {formData.patientEmail}</p>
                            <div className="appointment-success__details">
                                <div><strong>Doctor:</strong> {doctors.find(d => d.id == formData.doctorId)?.name}</div>
                                <div><strong>Date:</strong> {new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                <div><strong>Time:</strong> {formData.time}</div>
                            </div>
                            <button onClick={() => navigate('/')} className="btn btn-primary btn-lg">
                                Back to Home
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="appointments-page">
            <section className="page-header">
                <div className="container">
                    <h1>Book an Appointment</h1>
                    <p>Schedule your visit with our healthcare professionals.</p>
                </div>
            </section>

            <section className="appointment-booking section">
                <div className="container">
                    {/* Progress Steps */}
                    <div className="appointment-steps">
                        {['Select Doctor', 'Choose Time', 'Your Details'].map((label, index) => (
                            <div key={index} className={`appointment-step ${step > index ? 'completed' : ''} ${step === index + 1 ? 'active' : ''}`}>
                                <div className="appointment-step__number">{step > index ? <FiCheck /> : index + 1}</div>
                                <span className="appointment-step__label">{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="appointment-error">
                            <FiAlertCircle />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="appointment-form">
                        {/* Step 1: Select Doctor */}
                        {step === 1 && (
                            <div className="appointment-form__step">
                                <h2><FiUser /> Select a Doctor</h2>

                                <div className="doctor-filters">
                                    <div className="form-group">
                                        <label className="form-label">Specialization</label>
                                        <select
                                            className="form-select"
                                            value={selectedSpecialization}
                                            onChange={(e) => setSelectedSpecialization(e.target.value)}
                                        >
                                            <option value="">All Specializations</option>
                                            {specializations.map(spec => (
                                                <option key={spec} value={spec}>{spec}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label className="form-label">Search Doctor</label>
                                        <input
                                            type="text"
                                            placeholder="Search by name..."
                                            className="form-input"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') e.preventDefault();
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="doctor-grid-container">
                                    <label className="form-label">Available Doctors *</label>

                                    {filteredDoctors.length === 0 ? (
                                        <div className="empty-state-message">
                                            <div className="empty-state-icon"><FiUser /></div>
                                            <p>No doctors found.</p>
                                            <small>{doctors.length === 0 ? "No doctors are registered in the system yet." : "Try adjusting your filters."}</small>
                                        </div>
                                    ) : (
                                        <div className="doctor-grid">
                                            {filteredDoctors.map((doc) => (
                                                <div
                                                    key={doc.id}
                                                    className={`doctor-card ${formData.doctorId == doc.id ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, doctorId: doc.id }));
                                                    }}
                                                >
                                                    <div className="doctor-card__avatar">
                                                        {doc.profilePicture ? (
                                                            <img src={doc.profilePicture} alt={doc.name} />
                                                        ) : (
                                                            <div className="avatar-placeholder">{doc.name.charAt(0)}</div>
                                                        )}
                                                        {formData.doctorId == doc.id && (
                                                            <div className="selected-indicator"><FiCheck /></div>
                                                        )}
                                                    </div>
                                                    <div className="doctor-card__info">
                                                        <h4>{doc.name}</h4>
                                                        <span className="doctor-specialization">{doc.specialization}</span>
                                                        {doc.consultationFee && (
                                                            <span className="doctor-fee">${doc.consultationFee}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="appointment-form__actions">
                                    <button type="button" onClick={nextStep} className="btn btn-primary" disabled={!formData.doctorId}>
                                        Continue
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Choose Time */}
                        {step === 2 && (
                            <div className="appointment-form__step">
                                <h2><FiCalendar /> Select Date & Time</h2>
                                <div className="form-group">
                                    <label className="form-label">Preferred Date *</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        min={getMinDate()}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Preferred Time *</label>
                                    <div className="time-slots">
                                        {timeSlots.map((time) => (
                                            <button
                                                key={time}
                                                type="button"
                                                className={`time-slot ${formData.time === time ? 'selected' : ''}`}
                                                onClick={() => handleTimeSelect(time)}
                                            >
                                                <FiClock /> {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="appointment-form__actions">
                                    <button type="button" onClick={prevStep} className="btn btn-outline">Back</button>
                                    <button type="button" onClick={nextStep} className="btn btn-primary" disabled={!formData.date || !formData.time}>
                                        Continue
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Patient Details */}
                        {step === 3 && (
                            <div className="appointment-form__step">
                                <h2><FiUser /> Your Details</h2>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Full Name *</label>
                                        <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} className="form-input" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email *</label>
                                        <input type="email" name="patientEmail" value={formData.patientEmail} onChange={handleChange} className="form-input" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number *</label>
                                    <input type="tel" name="patientPhone" value={formData.patientPhone} onChange={handleChange} className="form-input" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Reason for Visit</label>
                                    <textarea name="reasonForVisit" value={formData.reasonForVisit} onChange={handleChange} className="form-textarea" rows="3" />
                                </div>
                                <div className="appointment-form__actions">
                                    <button type="button" onClick={prevStep} className="btn btn-outline">Back</button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Booking...' : 'Confirm Booking'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </section>
        </div>
    );
}

export default Appointments;
