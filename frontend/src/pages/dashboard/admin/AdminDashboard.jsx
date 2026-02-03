import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    FiHome, FiUsers, FiUserPlus, FiCalendar, FiSettings,
    FiLogOut, FiMenu, FiX, FiBarChart2, FiActivity, FiTrendingUp,
    FiChevronRight, FiSearch
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { appointmentApi } from '../../../api/appointmentApi';
import { doctorApi } from '../../../api/doctorApi';
import { patientApi } from '../../../api/patientApi';
import ComingSoon from '../../../components/common/ComingSoon';
import Loader from '../../../components/common/Loader';
import '../patient/PatientDashboard.css';

// Dashboard Home with real data
function DashboardHome() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        totalDoctors: 0,
        totalPatients: 0,
        totalAppointments: 0,
        todayAppointments: 0,
        recentAppointments: [],
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch doctors
            let doctorCount = 0;
            try {
                const doctorsRes = await doctorApi.getAll();
                doctorCount = doctorsRes.data?.length || 0;
            } catch (e) { console.log('Failed to fetch doctors:', e); }

            // Fetch patients
            let patientCount = 0;
            try {
                const patientsRes = await patientApi.getAll();
                patientCount = patientsRes.data?.length || 0;
            } catch (e) { console.log('Failed to fetch patients:', e); }

            // Fetch appointments
            let appointments = [];
            let todayCount = 0;
            try {
                const appointmentsRes = await appointmentApi.getAll();
                appointments = appointmentsRes.data || [];

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                todayCount = appointments.filter(apt => {
                    const aptDate = new Date(apt.appointmentTime);
                    return aptDate >= today && aptDate < tomorrow;
                }).length;
            } catch (e) { console.log('Failed to fetch appointments:', e); }

            setData({
                totalDoctors: doctorCount,
                totalPatients: patientCount,
                totalAppointments: appointments.length,
                todayAppointments: todayCount,
                recentAppointments: appointments.slice(0, 5),
            });
        } catch (err) {
            console.log('Failed to fetch admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-content dashboard-loading">
                <Loader text="Loading admin dashboard..." />
            </div>
        );
    }

    return (
        <div className="dashboard-content">
            {/* Welcome Header */}
            <div className="dashboard-welcome">
                <div className="dashboard-welcome__text">
                    <h1>Admin Dashboard 🏥</h1>
                    <p>Hospital operations overview</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="dashboard-stats">
                <div className="stat-card stat-card--primary">
                    <div className="stat-card__icon">
                        <FiUsers />
                    </div>
                    <div className="stat-card__info">
                        <span className="stat-card__value">{data.totalDoctors}</span>
                        <span className="stat-card__label">Total Doctors</span>
                    </div>
                </div>
                <div className="stat-card stat-card--success">
                    <div className="stat-card__icon">
                        <FiUserPlus />
                    </div>
                    <div className="stat-card__info">
                        <span className="stat-card__value">{data.totalPatients}</span>
                        <span className="stat-card__label">Total Patients</span>
                    </div>
                </div>
                <div className="stat-card stat-card--warning">
                    <div className="stat-card__icon">
                        <FiCalendar />
                    </div>
                    <div className="stat-card__info">
                        <span className="stat-card__value">{data.todayAppointments}</span>
                        <span className="stat-card__label">Today's Appointments</span>
                    </div>
                </div>
                <div className="stat-card stat-card--info">
                    <div className="stat-card__icon">
                        <FiActivity />
                    </div>
                    <div className="stat-card__info">
                        <span className="stat-card__value">{data.totalAppointments}</span>
                        <span className="stat-card__label">Total Appointments</span>
                    </div>
                </div>
            </div>

            {/* Recent Appointments */}
            <div className="dashboard-section">
                <div className="dashboard-section__header">
                    <h2><FiCalendar /> Recent Appointments</h2>
                    <Link to="/admin/appointments" className="section-link">
                        View All <FiChevronRight />
                    </Link>
                </div>

                {data.recentAppointments.length > 0 ? (
                    <div className="appointments-list">
                        {data.recentAppointments.map((apt) => (
                            <div key={apt.id} className="appointment-card">
                                <div className="appointment-card__date">
                                    <span className="date-day">{new Date(apt.appointmentTime).getDate()}</span>
                                    <span className="date-month">
                                        {new Date(apt.appointmentTime).toLocaleDateString('en-US', { month: 'short' })}
                                    </span>
                                </div>
                                <div className="appointment-card__info">
                                    <h4>{apt.patientName || 'Patient'} → {apt.doctorName || 'Doctor'}</h4>
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
                        <h3>No Appointments Yet</h3>
                        <p>Appointments will appear here when scheduled.</p>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="dashboard-section">
                <h2>Quick Actions</h2>
                <div className="quick-actions">
                    <Link to="/admin/doctors" className="quick-action-card">
                        <FiUsers />
                        <span>Manage Doctors</span>
                    </Link>
                    <Link to="/admin/patients" className="quick-action-card">
                        <FiUserPlus />
                        <span>Manage Patients</span>
                    </Link>
                    <Link to="/admin/appointments" className="quick-action-card">
                        <FiCalendar />
                        <span>All Appointments</span>
                    </Link>
                    <Link to="/admin/reports" className="quick-action-card">
                        <FiBarChart2 />
                        <span>Reports</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Manage Doctors - Coming Soon
function ManageDoctors() {
    return (
        <div className="dashboard-content">
            <ComingSoon
                title="Manage Doctors"
                message="Doctor management features including add, edit, and profile management will be available here soon."
                showBack={false}
            />
        </div>
    );
}

// Manage Patients - Coming Soon
function ManagePatients() {
    return (
        <div className="dashboard-content">
            <ComingSoon
                title="Manage Patients"
                message="Patient management and records access will be available here soon."
                showBack={false}
            />
        </div>
    );
}

// All Appointments - Coming Soon
function AllAppointments() {
    return (
        <div className="dashboard-content">
            <ComingSoon
                title="All Appointments"
                message="Complete appointment management with filtering and status updates will be available here soon."
                showBack={false}
            />
        </div>
    );
}

// Reports - Coming Soon
function Reports() {
    return (
        <div className="dashboard-content">
            <ComingSoon
                title="Reports & Analytics"
                message="Hospital analytics, revenue reports, and performance metrics will be available here soon."
                showBack={false}
            />
        </div>
    );
}

// Settings - Coming Soon
function AdminSettings() {
    return (
        <div className="dashboard-content">
            <ComingSoon
                title="Settings"
                message="System settings and configuration options will be available here soon."
                showBack={false}
            />
        </div>
    );
}

function AdminDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: FiHome, exact: true },
        { path: '/admin/doctors', label: 'Manage Doctors', icon: FiUsers },
        { path: '/admin/patients', label: 'Manage Patients', icon: FiUserPlus },
        { path: '/admin/appointments', label: 'Appointments', icon: FiCalendar },
        { path: '/admin/reports', label: 'Reports', icon: FiBarChart2 },
        { path: '/admin/settings', label: 'Settings', icon: FiSettings },
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
                <span className="dashboard-mobile-title">Admin Dashboard</span>
            </header>

            <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Link to="/" className="sidebar-logo">
                        <img src="/logo.png" alt="Legion Healthcare" />
                        <span>Legion Healthcare</span>
                    </Link>
                </div>

                <div className="sidebar-user">
                    <div className="sidebar-user__avatar">{user?.name?.charAt(0) || 'A'}</div>
                    <div className="sidebar-user__info">
                        <span className="sidebar-user__name">{user?.name || 'Admin'}</span>
                        <span className="sidebar-user__role">Administrator</span>
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
                    <Route path="doctors" element={<ManageDoctors />} />
                    <Route path="patients" element={<ManagePatients />} />
                    <Route path="appointments" element={<AllAppointments />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Routes>
            </main>
        </div>
    );
}

export default AdminDashboard;
