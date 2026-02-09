import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    FiHome, FiCalendar, FiUsers, FiSettings, FiLogOut,
    FiMenu, FiX, FiClock, FiCheckCircle, FiActivity,
    FiChevronRight, FiUser
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { appointmentApi } from '../../../api/appointmentApi';
import { doctorApi } from '../../../api/doctorApi';
import { patientApi } from '../../../api/patientApi';
import { medicalRecordApi } from '../../../api/medicalRecordApi';
import ComingSoon from '../../../components/common/ComingSoon';
import Loader from '../../../components/common/Loader';
import { CompleteDoctorProfile } from '../../../components/dashboard/CompleteProfile';
import CompleteAppointmentModal from '../../../components/dashboard/CompleteAppointmentModal';
import '../patient/PatientDashboard.css';
import DoctorSettings from './DoctorSettings';
function DashboardHome() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [needsProfile, setNeedsProfile] = useState(false);
    const [doctorProfile, setDoctorProfile] = useState(null);
    const [data, setData] = useState({
        todayAppointments: [],
        totalPatients: 0,
        completedToday: 0,
        pendingToday: 0,
    });

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    const fetchDashboardData = async () => {
        setLoading(true);
        setNeedsProfile(false);
        try {
            // First, get doctor profile to get the correct doctor ID
            let doctorId = null;
            try {
                const profileResponse = await doctorApi.getMyProfile();
                doctorId = profileResponse.data?.id;
                setDoctorProfile(profileResponse.data);
            } catch (profileErr) {
                console.log('No doctor profile found or not logged in:', profileErr);
                // Check if it's a 404 - means profile doesn't exist
                if (profileErr.response?.status === 404) {
                    setNeedsProfile(true);
                    setLoading(false);
                    return;
                }
            }

            if (doctorId) {
                const response = await appointmentApi.getByDoctor(doctorId);
                const appointments = response.data || [];

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                const todaysAppts = appointments.filter(apt => {
                    const aptDate = new Date(apt.appointmentTime);
                    return aptDate >= today && aptDate < tomorrow;
                });

                // Fetch patient details for today's appointments
                const enrichedTodaysAppts = await Promise.all(
                    todaysAppts.map(async (apt) => {
                        if (apt.patientId) {
                            try {
                                const patientRes = await patientApi.getById(apt.patientId);
                                return { ...apt, patientName: patientRes.data?.firstName + ' ' + patientRes.data?.lastName || 'Patient' };
                            } catch (e) {
                                return { ...apt, patientName: 'Patient' };
                            }
                        }
                        return { ...apt, patientName: 'Patient' };
                    })
                );

                const completed = enrichedTodaysAppts.filter(apt => apt.status === 'COMPLETED');
                const pending = enrichedTodaysAppts.filter(apt => apt.status !== 'COMPLETED' && apt.status !== 'CANCELLED');

                // Get unique patients
                const uniquePatients = new Set(appointments.map(apt => apt.patientId));

                setData({
                    todayAppointments: enrichedTodaysAppts,
                    totalPatients: uniquePatients.size,
                    completedToday: completed.length,
                    pendingToday: pending.length,
                });
            } else {
                setData({
                    todayAppointments: [],
                    totalPatients: 0,
                    completedToday: 0,
                    pendingToday: 0,
                });
            }

        } catch (err) {
            console.log('Failed to fetch doctor data:', err);
            setData({
                todayAppointments: [],
                totalPatients: 0,
                completedToday: 0,
                pendingToday: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleProfileComplete = (profile) => {
        console.log('Profile completed:', profile);
        setDoctorProfile(profile);
        setNeedsProfile(false);
        fetchDashboardData();
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="dashboard-content dashboard-loading">
                <Loader text="Loading dashboard..." />
            </div>
        );
    }

    // Show profile completion form if doctor profile doesn't exist
    if (needsProfile) {
        return (
            <div className="dashboard-content">
                <CompleteDoctorProfile
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
                    <h1>Welcome, Dr. {user?.name?.split(' ')[0] || 'Doctor'}! 👋</h1>
                    <p>Here's your schedule for today</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="dashboard-stats">
                <div className="stat-card stat-card--primary">
                    <div className="stat-card__icon">
                        <FiCalendar />
                    </div>
                    <div className="stat-card__info">
                        <span className="stat-card__value">{data.todayAppointments.length}</span>
                        <span className="stat-card__label">Today's Appointments</span>
                    </div>
                </div>
                <div className="stat-card stat-card--warning">
                    <div className="stat-card__icon">
                        <FiClock />
                    </div>
                    <div className="stat-card__info">
                        <span className="stat-card__value">{data.pendingToday}</span>
                        <span className="stat-card__label">Pending Today</span>
                    </div>
                </div>
                <div className="stat-card stat-card--success">
                    <div className="stat-card__icon">
                        <FiCheckCircle />
                    </div>
                    <div className="stat-card__info">
                        <span className="stat-card__value">{data.completedToday}</span>
                        <span className="stat-card__label">Completed Today</span>
                    </div>
                </div>
                <div className="stat-card stat-card--info">
                    <div className="stat-card__icon">
                        <FiUsers />
                    </div>
                    <div className="stat-card__info">
                        <span className="stat-card__value">{data.totalPatients}</span>
                        <span className="stat-card__label">Total Patients</span>
                    </div>
                </div>
            </div>

            {/* Today's Schedule */}
            <div className="dashboard-section">
                <div className="dashboard-section__header">
                    <h2><FiCalendar /> Today's Schedule</h2>
                    <Link to="/doctor/appointments" className="section-link">
                        View All <FiChevronRight />
                    </Link>
                </div>

                {data.todayAppointments.length > 0 ? (
                    <div className="appointments-list">
                        {data.todayAppointments.map((apt) => (
                            <div key={apt.id} className="appointment-card">
                                <div className="appointment-card__date">
                                    <span className="date-day">{formatTime(apt.appointmentTime)}</span>
                                </div>
                                <div className="appointment-card__info">
                                    <h4>{apt.patientName || 'Patient'}</h4>
                                    <p className="appointment-reason">{apt.reasonForVisit || 'General Consultation'}</p>
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
                        <h3>No Appointments Today</h3>
                        <p>You don't have any scheduled appointments for today.</p>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="dashboard-section">
                <h2>Quick Actions</h2>
                <div className="quick-actions">
                    <Link to="/doctor/appointments" className="quick-action-card">
                        <FiCalendar />
                        <span>All Appointments</span>
                    </Link>
                    <Link to="/doctor/patients" className="quick-action-card">
                        <FiUsers />
                        <span>My Patients</span>
                    </Link>
                    <Link to="/doctor/schedule" className="quick-action-card">
                        <FiClock />
                        <span>My Schedule</span>
                    </Link>
                    <Link to="/doctor/settings" className="quick-action-card">
                        <FiSettings />
                        <span>Settings</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Appointments with real data
function Appointments() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState('all');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, [user]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            // First, get doctor profile to get the correct doctor ID
            let doctorId = null;
            try {
                const profileResponse = await doctorApi.getMyProfile();
                doctorId = profileResponse.data?.id;
            } catch (profileErr) {
                console.log('No doctor profile found:', profileErr);
            }

            if (doctorId) {
                const response = await appointmentApi.getByDoctor(doctorId);
                const appointmentsData = response.data || [];

                // Fetch patient details for all appointments
                const enrichedAppointments = await Promise.all(
                    appointmentsData.map(async (apt) => {
                        if (apt.patientId) {
                            try {
                                const patientRes = await patientApi.getById(apt.patientId);
                                return { ...apt, patientName: patientRes.data?.firstName + ' ' + patientRes.data?.lastName || 'Patient' };
                            } catch (e) {
                                return { ...apt, patientName: 'Patient' };
                            }
                        }
                        return { ...apt, patientName: 'Patient' };
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

    const handleCompleteClick = (apt) => {
        setSelectedAppointment(apt);
        setIsModalOpen(true);
    };

    const handleModalComplete = async (id, data) => {
        try {
            // 1. Create Medical Record
            // Need doctorId and patientId. 
            // selectedAppointment has the enriched patient details including patientId
            // And we can use user.id or fetch profile again, but best to rely on what we have.
            // Actually, we must ensure we have the correct doctorId (profile ID).
            // Simplest way: use the appointment.doctorId which we know is correct.

            if (selectedAppointment) {
                await medicalRecordApi.create({
                    appointmentId: id,
                    patientId: selectedAppointment.patientId,
                    doctorId: selectedAppointment.doctorId,
                    diagnosis: data.diagnosis,
                    prescription: data.prescription,
                    doctorNotes: data.doctorNotes
                });
            }

            // 2. Update Appointment Status
            await appointmentApi.update(id, {
                status: 'COMPLETED'
            });

            console.log('Medical Info Saved:', data);
            setIsModalOpen(false);
            fetchAppointments(); // Refresh list
        } catch (error) {
            console.error('Failed to complete appointment:', error);
            alert('Failed to update appointment. Please try again.');
        }
    };

    const filteredAppointments = appointments.filter(apt => {
        if (filter === 'all') return true;
        if (filter === 'today') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const aptDate = new Date(apt.appointmentTime);
            return aptDate >= today && aptDate < tomorrow;
        }
        if (filter === 'upcoming') return new Date(apt.appointmentTime) > new Date();
        if (filter === 'completed') return apt.status === 'COMPLETED';
        return true;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="dashboard-content">
            <div className="dashboard-page-header">
                <div>
                    <h1>Appointments</h1>
                    <p>View and manage your appointments</p>
                </div>
            </div>

            {/* Filters */}
            <div className="filter-tabs">
                {['all', 'today', 'upcoming', 'completed'].map(f => (
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
                <div className="appointments-list">
                    {filteredAppointments.map((apt) => (
                        <div key={apt.id} className="appointment-card">
                            <div className="appointment-card__date">
                                <span className="date-day">{new Date(apt.appointmentTime).getDate()}</span>
                                <span className="date-month">
                                    {new Date(apt.appointmentTime).toLocaleDateString('en-US', { month: 'short' })}
                                </span>
                            </div>
                            <div className="appointment-card__info">
                                <h4>{apt.patientName || 'Patient'}</h4>
                                <p className="appointment-time">
                                    <FiClock /> {formatDate(apt.appointmentTime)}
                                </p>
                                <p className="appointment-reason">{apt.reasonForVisit || 'General Consultation'}</p>
                            </div>
                            <div className="appointment-card__actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div className={`appointment-card__status status-${apt.status?.toLowerCase() || 'scheduled'}`}>
                                    {apt.status || 'Scheduled'}
                                </div>
                                {apt.status !== 'COMPLETED' && apt.status !== 'CANCELLED' && (
                                    <button
                                        className="btn btn-sm btn-primary"
                                        style={{ padding: '4px 12px', fontSize: '12px' }}
                                        onClick={() => handleCompleteClick(apt)}
                                    >
                                        Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <FiCalendar size={48} />
                    <h3>No Appointments Found</h3>
                    <p>{filter === 'all' ? "You don't have any appointments yet." : `No ${filter} appointments.`}</p>
                </div>
            )}

            <CompleteAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onComplete={handleModalComplete}
                appointment={selectedAppointment}
            />
        </div>
    );
}

// Patients - Coming Soon
function Patients() {
    return (
        <div className="dashboard-content">
            <ComingSoon
                title="My Patients"
                message="Patient management and medical records will be available here soon."
                showBack={false}
            />
        </div>
    );
}

// Schedule - Coming Soon
function Schedule() {
    return (
        <div className="dashboard-content">
            <ComingSoon
                title="My Schedule"
                message="Availability management and schedule settings will be available here soon."
                showBack={false}
            />
        </div>
    );
}



function DoctorDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profilePic, setProfilePic] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await doctorApi.getMyProfile();
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
        { path: '/doctor', label: 'Dashboard', icon: FiHome, exact: true },
        { path: '/doctor/appointments', label: 'Appointments', icon: FiCalendar },
        { path: '/doctor/patients', label: 'Patients', icon: FiUsers },
        { path: '/doctor/schedule', label: 'Schedule', icon: FiClock },
        { path: '/doctor/settings', label: 'Settings', icon: FiSettings },
    ];

    const isActive = (path, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="dashboard-layout">
            <header className="dashboard-mobile-header">
                <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? <FiX /> : <FiMenu />}
                </button>
                <span className="dashboard-mobile-title">Doctor Dashboard</span>
            </header>

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
                            user?.name?.charAt(0) || 'D'
                        )}
                    </div>
                    <div className="sidebar-user__info">
                        <span className="sidebar-user__name">Dr. {user?.name || 'Doctor'}</span>
                        <span className="sidebar-user__role">Doctor</span>
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

            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

            <main className="dashboard-main">
                <Routes>
                    <Route index element={<DashboardHome />} />
                    <Route path="appointments" element={<Appointments />} />
                    <Route path="patients" element={<Patients />} />
                    <Route path="schedule" element={<Schedule />} />
                    <Route path="settings" element={<DoctorSettings />} />
                </Routes>
            </main>
        </div>
    );
}

export default DoctorDashboard;
