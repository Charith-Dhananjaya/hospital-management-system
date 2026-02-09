import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiClock, FiAward, FiPhone, FiMail, FiCalendar, FiArrowLeft } from 'react-icons/fi';
import { doctorApi } from '../../../api/doctorApi';
import Loader from '../../../components/common/Loader';
import './DoctorProfile.css';

const mockDoctor = {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiology',
    qualifications: 'MD, FACC, Board Certified in Cardiovascular Disease',
    consultationFee: 150,
    isAvailable: true,
    email: 'sarah.johnson@legionhealthcare.com',
    contactNumber: '+1 (555) 123-4567',
    bio: 'Dr. Sarah Johnson is a highly experienced cardiologist with over 15 years of practice in diagnosing and treating cardiovascular conditions. She completed her medical degree at Johns Hopkins University and her cardiology fellowship at Cleveland Clinic. Dr. Johnson is passionate about preventive cardiology and patient education.',
    education: [
        { degree: 'MD', institution: 'Johns Hopkins University School of Medicine', year: '2005' },
        { degree: 'Residency, Internal Medicine', institution: 'Massachusetts General Hospital', year: '2008' },
        { degree: 'Fellowship, Cardiovascular Disease', institution: 'Cleveland Clinic', year: '2011' },
    ],
    experience: '15 years',
    languages: ['English', 'Spanish'],
    specialties: ['Preventive Cardiology', 'Heart Failure', 'Echocardiography', 'Cardiac Rehabilitation'],
    availability: {
        'Monday': '9:00 AM - 5:00 PM',
        'Tuesday': '9:00 AM - 5:00 PM',
        'Wednesday': '9:00 AM - 1:00 PM',
        'Thursday': '9:00 AM - 5:00 PM',
        'Friday': '9:00 AM - 3:00 PM',
    }
};

function DoctorProfile() {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDoctor();
    }, [id]);

    const fetchDoctor = async () => {
        try {
            const response = await doctorApi.getById(id);
            setDoctor({ ...mockDoctor, ...response.data });
        } catch {
            setDoctor(mockDoctor);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="doctor-profile-page">
                <div className="page-loader"><Loader size="lg" text="Loading profile..." /></div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="doctor-profile-page">
                <div className="container section">
                    <h2>Doctor not found</h2>
                    <Link to="/doctors" className="btn btn-primary">Back to Doctors</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="doctor-profile-page">
            <section className="doctor-profile-header">
                <div className="container">
                    <Link to="/doctors" className="back-link">
                        <FiArrowLeft /> Back to Doctors
                    </Link>
                    <div className="doctor-profile-header__content">
                        <div className="doctor-profile-header__avatar">
                            {doctor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="doctor-profile-header__info">
                            <h1>{doctor.name}</h1>
                            <p className="doctor-profile-header__specialty">{doctor.specialization}</p>
                            <p className="doctor-profile-header__qualifications">{doctor.qualifications}</p>
                            <div className="doctor-profile-header__meta">
                                <span><FiAward /> {doctor.experience || '15 years'} experience</span>
                                <span><FiStar /> 4.9 rating</span>
                                {doctor.isAvailable && <span className="available-badge">Available</span>}
                            </div>
                        </div>
                        <div className="doctor-profile-header__actions">
                            <Link to="/appointments" className="btn btn-primary btn-lg">
                                <FiCalendar /> Book Appointment
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="doctor-profile-content section">
                <div className="container">
                    <div className="doctor-profile-grid">
                        <div className="doctor-profile-main">
                            {/* About */}
                            <div className="profile-section">
                                <h2>About</h2>
                                <p>{doctor.bio}</p>
                            </div>

                            {/* Education */}
                            <div className="profile-section">
                                <h2>Education & Training</h2>
                                <div className="education-list">
                                    {doctor.education?.map((edu, index) => (
                                        <div key={index} className="education-item">
                                            <span className="education-year">{edu.year}</span>
                                            <div className="education-details">
                                                <span className="education-degree">{edu.degree}</span>
                                                <span className="education-institution">{edu.institution}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Specialties */}
                            <div className="profile-section">
                                <h2>Areas of Expertise</h2>
                                <div className="specialties-list">
                                    {doctor.specialties?.map((specialty, index) => (
                                        <span key={index} className="specialty-tag">{specialty}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="doctor-profile-sidebar">
                            {/* Contact */}
                            <div className="sidebar-card">
                                <h3>Contact Information</h3>
                                <div className="contact-info">
                                    <p><FiPhone /> {doctor.contactNumber}</p>
                                    <p><FiMail /> {doctor.email}</p>
                                </div>
                            </div>

                            {/* Availability */}
                            <div className="sidebar-card">
                                <h3><FiClock /> Availability</h3>
                                <div className="availability-list">
                                    {Object.entries(doctor.availability || {}).map(([day, time]) => (
                                        <div key={day} className="availability-item">
                                            <span className="day">{day}</span>
                                            <span className="time">{time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Fee */}
                            <div className="sidebar-card fee-card">
                                <span className="fee-label">Consultation Fee</span>
                                <span className="fee-amount">${doctor.consultationFee}</span>
                                <span className="fee-note">per visit</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default DoctorProfile;
