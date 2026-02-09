import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    FiHome, FiCalendar, FiFileText, FiSettings, FiLogOut,
    FiMenu, FiX, FiUser, FiClock, FiMapPin, FiPhone,
    FiPlus, FiChevronRight, FiActivity, FiHeart, FiBell
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { appointmentApi } from '../../../api/appointmentApi';
import { patientApi } from '../../../api/patientApi';
import { doctorApi } from '../../../api/doctorApi';
import ComingSoon from '../../../components/common/ComingSoon';
import Loader from '../../../components/common/Loader';
import CompleteProfile from '../../../components/dashboard/CompleteProfile';
import PatientSettings from './PatientSettings';

import './PatientDashboard.css';
function DashboardHome() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [needsProfile, setNeedsProfile] = useState(false);
    const [patientProfile, setPatientProfile] = useState(null);
    const [data, setData] = useState({
        appointments: [],
        upcomingCount: 0,
        pastCount: 0,
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        setNeedsProfile(false);
        try {
            // First, get patient profile to get the correct patient ID
            let patientId = null;
            try {
                const profileResponse = await patientApi.getMyProfile();
                patientId = profileResponse.data?.id;
                setPatientProfile(profileResponse.data);
            } catch (profileErr) {
                console.log('No patient profile found or not logged in:', profileErr);
                // Check if it's a 404 - means profile doesn't exist
                if (profileErr.response?.status === 404) {
                    setNeedsProfile(true);
                    setLoading(false);
                    return;
                }
            }

            // If we have a patient ID, fetch appointments
            if (patientId) {
                const response = await appointmentApi.getByPatient(patientId);
                const appointments = response.data || [];

                const now = new Date();
                const upcoming = appointments.filter(apt =>
                    new Date(apt.appointmentTime) > now && apt.status !== 'CANCELLED'
                );
                const past = appointments.filter(apt =>
                    new Date(apt.appointmentTime) <= now || apt.status === 'COMPLETED'
                );

                // Fetch doctor details for upcoming appointments
                const enrichedUpcoming = await Promise.all(
                    upcoming.slice(0, 3).map(async (apt) => {
                        if (apt.doctorId) {
                            try {
                                const doctorResponse = await doctorApi.getById(apt.doctorId);
                                return {
                                    ...apt,
                                    doctorName: doctorResponse.data?.name || 'Doctor'
                                };
                            } catch (err) {
                                console.log('Failed to fetch doctor:', err);
                                return { ...apt, doctorName: 'Doctor' };
                            }
                        }
                        return { ...apt, doctorName: 'Doctor' };
                    })
                );

                setData({
                    appointments: enrichedUpcoming,
                    upcomingCount: upcoming.length,
                    pastCount: past.length,
                });
            } else {
                // No patient profile - show empty state
                setData({
                    appointments: [],
                    upcomingCount: 0,
                    pastCount: 0,
                });
            }
        } catch (err) {
            console.log('Failed to fetch appointments:', err);
            // If API fails, show empty state
            setData({
                appointments: [],
                upcomingCount: 0,
                pastCount: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleProfileComplete = (profile) => {
        console.log('Profile completed:', profile);
        setPatientProfile(profile);
        setNeedsProfile(false);
        // Refetch dashboard data with new profile
        fetchDashboardData();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="dashboard-content dashboard-loading">
                <Loader text="Loading your dashboard..." />
            </div>
        );
    }

    // Show profile completion form if patient profile doesn't exist
    if (needsProfile) {
        return (
            <div className="dashboard-content">
                <CompleteProfile
                    onComplete={handleProfileComplete}
                    userName={user?.name}
                    userEmail={user?.email}
                />
            </div>
        );
    }

    return (
        <div className="dashboard-content">
            {/* Welcome Header */}
            <div className="dashboard-welcome">
                <div className="dashboard-welcome__text">
                    <h1>Welcome back, {user?.name?.split(' ')[0] || 'Patient'}! 👋</h1>
                    <p>Here's an overview of your health journey</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/appointments')}
                >
                    <FiPlus /> Book Appointment
                </button>
            </div>

            {/* Stats Cards */}
            <div className="dashboard-stats">
                <div className="stat-card stat-card--primary">
                    <div className="stat-card__icon">
                        <FiCalendar />
                    </div>
                    <div className="stat-card__info">
                        <span className="stat-card__value">{data.upcomingCount}</span>
                        <span className="stat-card__label">Upcoming Appointments</span>
                    </div>
                </div>
                <div className="stat-card stat-card--success">
                    <div className="stat-card__icon">
                        <FiFileText />
                    </div>
                    <div className="stat-card__info">
                        <span className="stat-card__value">{data.pastCount}</span>
                        <span className="stat-card__label">Past Visits</span>
                    </div>
                </div>
                <div className="stat-card stat-card--warning">
                    <div className="stat-card__icon">
                        <FiActivity />
                    </div>
                    <div className="stat-card__info">
                        <span className="stat-card__value">--</span>
                        <span className="stat-card__label">Health Score</span>
                    </div>
                </div>
                <div className="stat-card stat-card--info">
                    <div className="stat-card__icon">
                        <FiBell />
                    </div>
                    <div className="stat-card__info">
                        <span className="stat-card__value">0</span>
                        <span className="stat-card__label">Notifications</span>
                    </div>
                </div>
            </div>

            {/* Upcoming Appointments Section */}
            <div className="dashboard-section">
                <div className="dashboard-section__header">
                    <h2><FiCalendar /> Upcoming Appointments</h2>
                    <Link to="/patient/appointments" className="section-link">
                        View All <FiChevronRight />
                    </Link>
                </div>

                {data.appointments.length > 0 ? (
                    <div className="appointments-list">
                        {data.appointments.map((apt) => (
                            <div key={apt.id} className="appointment-card">
                                <div className="appointment-card__date">
                                    <span className="date-day">{new Date(apt.appointmentTime).getDate()}</span>
                                    <span className="date-month">
                                        {new Date(apt.appointmentTime).toLocaleDateString('en-US', { month: 'short' })}
                                    </span>
                                </div>
                                <div className="appointment-card__info">
                                    <h4>{apt.doctorName || 'Doctor'}</h4>
                                    <p className="appointment-time">
                                        <FiClock /> {formatDate(apt.appointmentTime)}
                                    </p>
                                    <p className="appointment-reason">{apt.reasonForVisit || 'General Checkup'}</p>
                                </div>
                                <div className={`appointment-card__status status-${apt.status?.toLowerCase() || 'scheduled'}`}>
                                    {apt.status || 'Scheduled'}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <FiCalendar size={48} />
                        <h3>No Upcoming Appointments</h3>
                        <p>You don't have any scheduled appointments.</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/appointments')}
                        >
                            <FiPlus /> Book Your First Appointment
                        </button>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="dashboard-section">
                <h2>Quick Actions</h2>
                <div className="quick-actions">
                    <Link to="/appointments" className="quick-action-card">
                        <FiCalendar />
                        <span>Book Appointment</span>
                    </Link>
                    <Link to="/doctors" className="quick-action-card">
                        <FiUser />
                        <span>Find Doctors</span>
                    </Link>
                    <Link to="/patient/records" className="quick-action-card">
                        <FiFileText />
                        <span>Medical Records</span>
                    </Link>
                    <Link to="/patient/settings" className="quick-action-card">
                        <FiSettings />
                        <span>Settings</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Appointments page with real data
function Appointments() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchAppointments();
    }, [user]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            // First, get patient profile to get the correct patient ID
            let patientId = null;
            try {
                const profileResponse = await patientApi.getMyProfile();
                patientId = profileResponse.data?.id;
            } catch (profileErr) {
                console.log('No patient profile found:', profileErr);
            }

            if (patientId) {
                const response = await appointmentApi.getByPatient(patientId);
                const appointmentsData = response.data || [];

                // Fetch doctor details for each appointment
                const enrichedAppointments = await Promise.all(
                    appointmentsData.map(async (apt) => {
                        if (apt.doctorId) {
                            try {
                                const doctorResponse = await doctorApi.getById(apt.doctorId);
                                return {
                                    ...apt,
                                    doctorName: doctorResponse.data?.name || 'Doctor'
                                };
                            } catch (err) {
                                console.log('Failed to fetch doctor:', err);
                                return { ...apt, doctorName: 'Doctor' };
                            }
                        }
                        return { ...apt, doctorName: 'Doctor' };
                    })
                );

                setAppointments(enrichedAppointments);
            } else {
                setAppointments([]);
            }
        } catch (err) {
            console.log('Failed to fetch appointments:', err);
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredAppointments = appointments.filter(apt => {
        if (filter === 'all') return true;
        if (filter === 'upcoming') return new Date(apt.appointmentTime) > new Date();
        if (filter === 'past') return new Date(apt.appointmentTime) <= new Date();
        if (filter === 'cancelled') return apt.status === 'CANCELLED';
        return true;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="dashboard-content">
            <div className="dashboard-page-header">
                <div>
                    <h1>My Appointments</h1>
                    <p>View and manage your appointments</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/appointments')}
                >
                    <FiPlus /> Book New
                </button>
            </div>

            {/* Filters */}
            <div className="filter-tabs">
                {['all', 'upcoming', 'past', 'cancelled'].map(f => (
                    <button
                        key={f}
                        className={`filter-tab ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <Loader text="Loading appointments..." />
            ) : filteredAppointments.length > 0 ? (
                <div className="appointments-list appointments-list--detailed">
                    {filteredAppointments.map((apt) => (
                        <div key={apt.id} className="appointment-card appointment-card--detailed">
                            <div className="appointment-card__date">
                                <span className="date-day">{new Date(apt.appointmentTime).getDate()}</span>
                                <span className="date-month">
                                    {new Date(apt.appointmentTime).toLocaleDateString('en-US', { month: 'short' })}
                                </span>
                            </div>
                            <div className="appointment-card__info">
                                <h4>{apt.doctorName || 'Doctor'}</h4>
                                <p className="appointment-time">
                                    <FiClock /> {formatDate(apt.appointmentTime)}
                                </p>
                                <p className="appointment-reason">{apt.reasonForVisit || 'General Checkup'}</p>
                            </div>
                            <div className={`appointment-card__status status-${apt.status?.toLowerCase() || 'scheduled'}`}>
                                {apt.status || 'Scheduled'}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <FiCalendar size={48} />
                    <h3>No Appointments Found</h3>
                    <p>{filter === 'all' ? "You haven't made any appointments yet." : `No ${filter} appointments.`}</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/appointments')}
                    >
                        <FiPlus /> Book Appointment
                    </button>
                </div>
            )}
        </div>
    );
}

// Medical Records - Coming Soon
function MedicalRecords() {
    return (
        <div className="dashboard-content">
            <ComingSoon
                title="Medical Records"
                message="Your medical history, test results, and prescriptions will be available here soon."
                showBack={false}
            />
        </div>
    );
}



function PatientDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profilePic, setProfilePic] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await patientApi.getMyProfile();
                setProfilePic(res.data?.profilePicture);
            } catch (err) {
                console.log("Failed to load profile picture");
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/patient', label: 'Dashboard', icon: FiHome, exact: true },
        { path: '/patient/appointments', label: 'Appointments', icon: FiCalendar },
        { path: '/patient/records', label: 'Medical Records', icon: FiFileText },
        { path: '/patient/settings', label: 'Settings', icon: FiSettings },
    ];

    const isActive = (path, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="dashboard-layout">
            {/* Mobile Header */}
            <header className="dashboard-mobile-header">
                <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? <FiX /> : <FiMenu />}
                </button>
                <span className="dashboard-mobile-title">Patient Dashboard</span>
            </header>

            {/* Sidebar */}
            <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Link to="/" className="sidebar-logo">
                        <img src="/logo.png" alt="Legion Healthcare" />
                        <span>Legion Healthcare</span>
                    </Link>
                </div>

                <div className="sidebar-user">
                    <div className="sidebar-user__avatar">
                        {profilePic ? (
                            <img
                                src={profilePic}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        ) : (
                            user?.name?.charAt(0) || 'P'
                        )}
                    </div>
                    <div className="sidebar-user__info">
                        <span className="sidebar-user__name">{user?.name || 'Patient'}</span>
                        <span className="sidebar-user__role">Patient</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-nav__item ${isActive(item.path, item.exact) ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="sidebar-nav__item sidebar-logout">
                        <FiLogOut />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

            {/* Main Content */}
            <main className="dashboard-main">
                <Routes>
                    <Route index element={<DashboardHome />} />
                    <Route path="appointments" element={<Appointments />} />
                    <Route path="records" element={<MedicalRecords />} />
                    <Route path="settings" element={<PatientSettings />} />
                </Routes>
            </main>
        </div>
    );
}

export default PatientDashboard;
