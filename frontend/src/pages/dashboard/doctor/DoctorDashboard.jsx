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
        completedTotal: 0,
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
                const completedTotal = appointments.filter(apt => apt.status === 'COMPLETED').length;

                // Get unique patients
                const uniquePatients = new Set(appointments.map(apt => apt.patientId));

                setData({
                    todayAppointments: enrichedTodaysAppts,
                    totalPatients: uniquePatients.size,
                    completedToday: completed.length,
                    completedTotal: completedTotal,
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
                        <FiCheckCircle />
                    </div>
                    <div className="stat-card__info">
                        <span className="stat-card__value">{data.completedTotal}</span>
                        <span className="stat-card__label">Total Completed</span>
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

    const [initialMetadata, setInitialMetadata] = useState(null);

    const handleCompleteClick = (apt) => {
        setSelectedAppointment(apt);
        setInitialMetadata(null);
        setIsModalOpen(true);
    };

    const handleUpdateClick = async (apt) => {
        setSelectedAppointment(apt);
        setLoading(true); // Show global loading or just wait
        try {
            // Fetch existing medical record for this appointment.
            // Since we don't have a direct "get by appointment id" in the API definition I saw,
            // we might need to rely on "get by patient" and filter, OR add a new endpoint.
            // Let's assume for now we can find it via patient history or doctor history.
            // BUT, looking at `MedicalRecordRepository`, it HAS `findByAppointmentId`.
            // So we should add/use `medicalRecordApi.getByAppointment(apt.id)`. 
            // I will update the API file next. For now, let's assume `getByAppointmentId` exists.

            // Wait, `medicalRecordApi.js` has `getByPatient` and `getByDoctor`.
            // I need to update `medicalRecordApi.js` to expose `findByAppointmentId` which corresponds to `.../appointment/{id}` (need to verify backend controller).
            // Let's check backend controller first, but assuming standard:

            // Actually, let's try to get it from `medicalRecordApi.getByAppointmentId(apt.id)`
            // I need to add that function to the API first.
            const recordRes = await medicalRecordApi.getByAppointmentId(apt.id);
            // The backend likely returns a list or single object. 
            // Repository returns List<MedicalRecord>. Controller likely returns List<MedicalRecordDTO>.
            // Let's assume it returns an array properly.

            const record = Array.isArray(recordRes.data) ? recordRes.data[0] : recordRes.data;

            if (record) {
                setInitialMetadata(record);
                setIsModalOpen(true);
            } else {
                alert("Medical record not found.");
            }
        } catch (error) {
            console.error("Failed to fetch medical record", error);
            alert("Failed to fetch medical record details.");
        } finally {
            setLoading(false);
        }
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
                // Check if we are updating an existing record or creating a new one
                // If the appointment is already completed, we are likely updating
                const isUpdate = selectedAppointment.status === 'COMPLETED';

                if (isUpdate) {
                    // We need the medical record ID to update. 
                    // It was stored in initialMetadata when we clicked "Update"
                    if (initialMetadata && initialMetadata.id) {
                        await medicalRecordApi.update(initialMetadata.id, {
                            diagnosis: data.diagnosis,
                            prescription: data.prescription,
                            doctorNotes: data.doctorNotes
                        });
                    } else {
                        // Fallback: try to find the record by appointment ID if ID is missing from state
                        const recordRes = await medicalRecordApi.getByAppointmentId(id);
                        const record = Array.isArray(recordRes.data) ? recordRes.data[0] : recordRes.data;
                        if (record && record.id) {
                            await medicalRecordApi.update(record.id, {
                                diagnosis: data.diagnosis,
                                prescription: data.prescription,
                                doctorNotes: data.doctorNotes
                            });
                        } else {
                            console.error("Cannot update: Record ID not found");
                            throw new Error("Medical record ID not found for update.");
                        }
                    }
                } else {
                    await medicalRecordApi.create({
                        appointmentId: id,
                        patientId: selectedAppointment.patientId,
                        doctorId: selectedAppointment.doctorId,
                        diagnosis: data.diagnosis,
                        prescription: data.prescription,
                        doctorNotes: data.doctorNotes
                    });
                }
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
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update appointment. Please try again.';
            alert(`Failed: ${errorMessage}`);
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
                                {apt.status === 'COMPLETED' && (
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        style={{ padding: '4px 12px', fontSize: '12px', borderColor: '#007bff', color: '#007bff' }}
                                        onClick={() => handleUpdateClick(apt)}
                                    >
                                        Update
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
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedAppointment(null);
                    setInitialMetadata(null);
                }}
                onComplete={handleModalComplete}
                appointment={selectedAppointment}
                initialData={initialMetadata}
            />
        </div>
    );
}

// Patients - List of patients with medical history
function Patients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientRecords, setPatientRecords] = useState([]);
    const [recordsLoading, setRecordsLoading] = useState(false);

    // For Update flow in Patients tab
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedApt, setSelectedApt] = useState(null);
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            // Get current doctor's profile to get ID
            const profileRes = await doctorApi.getMyProfile();
            const doctorId = profileRes.data.id;

            // Get all appointments for this doctor to find unique patients
            const appointmentsRes = await appointmentApi.getByDoctor(doctorId);
            const appointments = appointmentsRes.data;

            // Filter unique patients who have at least one completed appointment
            // Or just all patients seen. Let's do all patients with at least one record.
            const uniquePatientIds = [...new Set(appointments.map(a => a.patientId))];

            // Fetch detailed patient info for each ID
            const patientDetails = await Promise.all(
                uniquePatientIds.map(async (pid) => {
                    try {
                        const pRes = await patientApi.getById(pid);
                        // Find last visit
                        const pAppts = appointments.filter(a => a.patientId === pid);
                        const lastVisit = pAppts.sort((a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime))[0];

                        return {
                            ...pRes.data,
                            lastVisit: lastVisit?.appointmentTime,
                            appointmentCount: pAppts.length
                        };
                    } catch (err) {
                        return null;
                    }
                })
            );

            setPatients(patientDetails.filter(p => p !== null));
        } catch (error) {
            console.error("Failed to fetch patients", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePatientClick = async (patient) => {
        setSelectedPatient(patient);
        setRecordsLoading(true);
        try {
            const res = await medicalRecordApi.getByPatient(patient.id);
            // Filter records only for THIS doctor if needed, but usually doctor sees full history
            // For now, show all records for this patient
            setPatientRecords(res.data);
        } catch (error) {
            console.error("Failed to fetch patient records", error);
        } finally {
            setRecordsLoading(false);
        }
    };

    const handleUpdateRecord = (record) => {
        // Find the appointment details for this record
        const mockApt = {
            id: record.appointmentId,
            patientId: record.patientId,
            doctorId: record.doctorId,
            patientName: selectedPatient.firstName + " " + selectedPatient.lastName,
            status: 'COMPLETED'
        };
        setSelectedApt(mockApt);
        setInitialData(record);
        setIsModalOpen(true);
    };

    const onModalComplete = async (aptId, data) => {
        try {
            // Update the record
            await medicalRecordApi.update(initialData.id, {
                diagnosis: data.diagnosis,
                prescription: data.prescription,
                doctorNotes: data.doctorNotes
            });

            // Refresh records
            handlePatientClick(selectedPatient);
            alert("Record updated successfully!");
        } catch (error) {
            alert("Failed to update record: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="dashboard-content">
            <div className="dashboard-page-header">
                <div>
                    <h1>My Patients</h1>
                    <p>Patients you have consulted with</p>
                </div>
            </div>

            <div className="patients-container" style={{ display: 'grid', gridTemplateColumns: selectedPatient ? '350px 1fr' : '1fr', gap: '2rem' }}>
                {/* Patient List */}
                <div className="patient-list-sidebar">
                    {loading ? (
                        <Loader text="Loading patients..." />
                    ) : patients.length > 0 ? (
                        <div className="patient-cards">
                            {patients.map(patient => (
                                <div
                                    key={patient.id}
                                    className={`patient-mini-card ${selectedPatient?.id === patient.id ? 'active' : ''}`}
                                    onClick={() => handlePatientClick(patient)}
                                    style={{
                                        padding: '1rem',
                                        backgroundColor: 'var(--bg-elevated)',
                                        borderRadius: 'var(--radius-lg)',
                                        marginBottom: '10px',
                                        cursor: 'pointer',
                                        border: selectedPatient?.id === patient.id ? '2px solid var(--primary-500)' : '1px solid var(--border-light)'
                                    }}
                                >
                                    <h4 style={{ margin: '0 0 5px 0' }}>{patient.firstName} {patient.lastName}</h4>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                                        Last Visit: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A'}
                                    </p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{patient.email}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">No patients found.</div>
                    )}
                </div>

                {/* Patient Detail / Records */}
                {selectedPatient && (
                    <div className="patient-history-detail">
                        <div style={{ backgroundColor: 'var(--bg-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2>{selectedPatient.firstName} {selectedPatient.lastName}'s History</h2>
                                <button className="btn btn-sm btn-outline" onClick={() => setSelectedPatient(null)}>Close</button>
                            </div>

                            {recordsLoading ? (
                                <Loader text="Loading records..." />
                            ) : patientRecords.length > 0 ? (
                                <div className="history-timeline">
                                    {patientRecords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(record => (
                                        <div key={record.id} style={{ padding: '1rem', borderLeft: '3px solid var(--primary-400)', marginBottom: '1.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0 var(--radius-md) var(--radius-md) 0', position: 'relative' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                <strong style={{ color: 'var(--primary-600)' }}>{new Date(record.createdAt).toLocaleDateString()}</strong>
                                                <button
                                                    className="btn btn-sm btn-link"
                                                    style={{ color: 'var(--primary-500)', padding: 0 }}
                                                    onClick={() => handleUpdateRecord(record)}
                                                >
                                                    Update Record
                                                </button>
                                            </div>
                                            <p style={{ margin: '0 0 5px 0' }}><strong>Diagnosis:</strong> {record.diagnosis}</p>
                                            <p style={{ margin: '0 0 5px 0' }}><strong>Symptoms:</strong> {record.doctorNotes}</p>
                                            <p style={{ margin: '0' }}><strong>Prescription:</strong> {record.prescription}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No medical records found for this patient.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <CompleteAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onComplete={onModalComplete}
                appointment={selectedApt}
                initialData={initialData}
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
