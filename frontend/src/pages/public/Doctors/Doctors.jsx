import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiMapPin, FiStar, FiArrowRight } from 'react-icons/fi';
import { doctorApi } from '../../../api/doctorApi';
import Loader from '../../../components/common/Loader';
import './Doctors.css';

// Mock data for when API is not available
const mockDoctors = [
    {
        id: 1,
        name: 'Dr. Sarah Johnson',
        specialization: 'Cardiology',
        qualifications: 'MD, FACC, Board Certified',
        consultationFee: 150,
        isAvailable: true,
        experience: '15 years',
        rating: 4.9,
    },
    {
        id: 2,
        name: 'Dr. Michael Chen',
        specialization: 'Neurology',
        qualifications: 'MD, PhD, Board Certified',
        consultationFee: 175,
        isAvailable: true,
        experience: '12 years',
        rating: 4.8,
    },
    {
        id: 3,
        name: 'Dr. Emily Rodriguez',
        specialization: 'Pediatrics',
        qualifications: 'MD, FAAP',
        consultationFee: 120,
        isAvailable: true,
        experience: '10 years',
        rating: 4.9,
    },
    {
        id: 4,
        name: 'Dr. James Wilson',
        specialization: 'Orthopedics',
        qualifications: 'MD, FAAOS',
        consultationFee: 160,
        isAvailable: false,
        experience: '18 years',
        rating: 4.7,
    },
    {
        id: 5,
        name: 'Dr. Lisa Park',
        specialization: 'Dermatology',
        qualifications: 'MD, FAAD',
        consultationFee: 140,
        isAvailable: true,
        experience: '8 years',
        rating: 4.8,
    },
    {
        id: 6,
        name: 'Dr. David Thompson',
        specialization: 'Oncology',
        qualifications: 'MD, Board Certified',
        consultationFee: 200,
        isAvailable: true,
        experience: '20 years',
        rating: 4.9,
    },
    {
        id: 7,
        name: 'Dr. Maria Garcia',
        specialization: 'Gynecology',
        qualifications: 'MD, FACOG',
        consultationFee: 145,
        isAvailable: true,
        experience: '14 years',
        rating: 4.8,
    },
    {
        id: 8,
        name: 'Dr. Robert Kim',
        specialization: 'Emergency Medicine',
        qualifications: 'MD, FACEP',
        consultationFee: 180,
        isAvailable: true,
        experience: '16 years',
        rating: 4.7,
    },
];

const specializations = [
    'All Specialties',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Dermatology',
    'Oncology',
    'Gynecology',
    'Emergency Medicine',
    'Ophthalmology',
];

function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        filterDoctors();
    }, [doctors, searchTerm, selectedSpecialty, showAvailableOnly]);

    const fetchDoctors = async () => {
        try {
            const response = await doctorApi.getAll();
            setDoctors(response.data);
        } catch (error) {
            console.log('Using mock data - API not available');
            setDoctors(mockDoctors);
        } finally {
            setLoading(false);
        }
    };

    const filterDoctors = () => {
        let filtered = [...doctors];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (doc) =>
                    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Specialty filter
        if (selectedSpecialty !== 'All Specialties') {
            filtered = filtered.filter((doc) => doc.specialization === selectedSpecialty);
        }

        // Availability filter
        if (showAvailableOnly) {
            filtered = filtered.filter((doc) => doc.isAvailable);
        }

        setFilteredDoctors(filtered);
    };

    if (loading) {
        return (
            <div className="doctors-page">
                <div className="page-loader">
                    <Loader size="lg" text="Loading doctors..." />
                </div>
            </div>
        );
    }

    return (
        <div className="doctors-page">
            {/* Hero Section */}
            <section className="page-header">
                <div className="container">
                    <h1>Our Doctors</h1>
                    <p>Meet our team of experienced and dedicated healthcare professionals.</p>
                </div>
            </section>

            {/* Filters Section */}
            <section className="doctors-filters">
                <div className="container">
                    <div className="doctors-filters__wrapper">
                        {/* Search */}
                        <div className="doctors-filters__search">
                            <FiSearch className="doctors-filters__search-icon" />
                            <input
                                type="text"
                                placeholder="Search by name or specialty..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="doctors-filters__search-input"
                            />
                        </div>

                        {/* Specialty Filter */}
                        <div className="doctors-filters__select-wrapper">
                            <FiFilter className="doctors-filters__select-icon" />
                            <select
                                value={selectedSpecialty}
                                onChange={(e) => setSelectedSpecialty(e.target.value)}
                                className="doctors-filters__select"
                            >
                                {specializations.map((spec) => (
                                    <option key={spec} value={spec}>
                                        {spec}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Availability Toggle */}
                        <label className="doctors-filters__toggle">
                            <input
                                type="checkbox"
                                checked={showAvailableOnly}
                                onChange={(e) => setShowAvailableOnly(e.target.checked)}
                            />
                            <span className="doctors-filters__toggle-slider" />
                            <span className="doctors-filters__toggle-label">Available Now</span>
                        </label>
                    </div>

                    <p className="doctors-filters__count">
                        Showing {filteredDoctors.length} of {doctors.length} doctors
                    </p>
                </div>
            </section>

            {/* Doctors Grid */}
            <section className="doctors-list section">
                <div className="container">
                    {filteredDoctors.length > 0 ? (
                        <div className="doctors-grid">
                            {filteredDoctors.map((doctor) => (
                                <div key={doctor.id} className="doctor-card">
                                    <div className="doctor-card__image">
                                        <img
                                            src={doctor.imageUrl || `/images/doctors/doctor-${(doctor.id % 6) + 1}.png`}
                                            alt={doctor.name}
                                            className="doctor-card__photo"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="doctor-card__avatar" style={{ display: 'none' }}>
                                            {doctor.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        {doctor.isAvailable && (
                                            <span className="doctor-card__available-badge">Available</span>
                                        )}
                                    </div>
                                    <div className="doctor-card__content">
                                        <h3 className="doctor-card__name">{doctor.name}</h3>
                                        <p className="doctor-card__specialty">{doctor.specialization}</p>
                                        <p className="doctor-card__qualifications">{doctor.qualifications}</p>

                                        <div className="doctor-card__meta">
                                            {doctor.experience && (
                                                <span className="doctor-card__experience">
                                                    <FiMapPin size={14} /> {doctor.experience}
                                                </span>
                                            )}
                                            {doctor.rating && (
                                                <span className="doctor-card__rating">
                                                    <FiStar size={14} /> {doctor.rating}
                                                </span>
                                            )}
                                        </div>

                                        <div className="doctor-card__footer">
                                            <span className="doctor-card__fee">
                                                ${doctor.consultationFee} <small>/ visit</small>
                                            </span>
                                            <Link to={`/doctors/${doctor.id}`} className="doctor-card__link">
                                                View Profile <FiArrowRight />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="doctors-empty">
                            <h3>No doctors found</h3>
                            <p>Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Doctors;
