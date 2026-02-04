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
import ComingSoon from '../../../components/common/ComingSoon';
import Loader from '../../../components/common/Loader';
import '../patient/PatientDashboard.css';
import DoctorSettings from './DoctorSettings';
function DashboardHome() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
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
        try {
            const response = await appointmentApi.getByDoctor(user?.id);
            const appointments = response.data || [];

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const todaysAppts = appointments.filter(apt => {
                const aptDate = new Date(apt.appointmentTime);
                return aptDate >= today && aptDate < tomorrow;
            });

            const completed = todaysAppts.filter(apt => apt.status === 'COMPLETED');
            const pending = todaysAppts.filter(apt => apt.status !== 'COMPLETED' && apt.status !== 'CANCELLED');

            // Get unique patients
            const uniquePatients = new Set(appointments.map(apt => apt.patientId));

            setData({
                todayAppointments: todaysAppts,
                totalPatients: uniquePatients.size,
                completedToday: completed.length,
                pendingToday: pending.length,
            });
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

    useEffect(() => {
        fetchAppointments();
    }, [user]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await appointmentApi.getByDoctor(user?.id);
            setAppointments(response.data || []);
        } catch (err) {
            console.log('Failed to fetch appointments:', err);
            setAppointments([]);
        } finally {
            setLoading(false);
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
                    <p>{filter === 'all' ? "You don't have any appointments yet." : `No ${filter} appointments.`}</p>
                </div>
            )}
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
                    <div className="sidebar-user__avatar">{user?.name?.charAt(0) || 'D'}</div>
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
