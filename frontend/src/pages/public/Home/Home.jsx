import { Link } from 'react-router-dom';
import {
    FiArrowRight,
    FiCalendar,
    FiUsers,
    FiAward,
    FiClock,
    FiHeart,
    FiActivity,
    FiShield,
    FiPhone
} from 'react-icons/fi';
import './Home.css';

// Stats data
const stats = [
    { icon: FiUsers, value: '50+', label: 'Expert Doctors' },
    { icon: FiHeart, value: '10,000+', label: 'Happy Patients' },
    { icon: FiAward, value: '15+', label: 'Years Experience' },
    { icon: FiActivity, value: '24/7', label: 'Emergency Care' },
];

// Featured departments
const departments = [
    {
        icon: FiHeart,
        name: 'Cardiology',
        description: 'Comprehensive heart and vascular care with advanced diagnostics.',
        color: '#E53E3E'
    },
    {
        icon: FiActivity,
        name: 'Neurology',
        description: 'Expert treatment for brain, spine, and nervous system disorders.',
        color: '#805AD5'
    },
    {
        icon: FiShield,
        name: 'Orthopedics',
        description: 'Advanced bone, joint, and muscle care for active living.',
        color: '#38A169'
    },
    {
        icon: FiUsers,
        name: 'Pediatrics',
        description: 'Gentle, specialized healthcare for children of all ages.',
        color: '#00B4D8'
    },
    {
        icon: FiHeart,
        name: 'Oncology',
        description: 'Compassionate cancer care with cutting-edge treatments.',
        color: '#ED8936'
    },
    {
        icon: FiActivity,
        name: 'Emergency',
        description: '24/7 emergency services with rapid response teams.',
        color: '#E53E3E'
    },
];

// Quick links
const quickLinks = [
    {
        icon: FiCalendar,
        title: 'Book Appointment',
        description: 'Schedule a visit with our specialists',
        link: '/appointments',
        color: 'primary'
    },
    {
        icon: FiUsers,
        title: 'Find a Doctor',
        description: 'Search our expert medical team',
        link: '/doctors',
        color: 'secondary'
    },
    {
        icon: FiPhone,
        title: 'Emergency Care',
        description: '24/7 emergency medical services',
        link: '/contact',
        color: 'error'
    },
    {
        icon: FiClock,
        title: 'Working Hours',
        description: 'Mon-Fri: 8AM-8PM, Emergency: 24/7',
        link: '/contact',
        color: 'success'
    },
];

function Home() {
    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero__background">
                    <div className="hero__gradient" />
                </div>
                <div className="container">
                    <div className="hero__content">
                        <div className="hero__text">
                            <span className="hero__badge">Trusted Healthcare Partner</span>
                            <h1 className="hero__title">
                                Caring for You,
                                <span className="hero__title-accent"> Every Step</span>
                                <br />of the Way
                            </h1>
                            <p className="hero__description">
                                At Legion Healthcare Center, we combine cutting-edge medical technology
                                with compassionate care to deliver world-class healthcare services
                                to our community.
                            </p>
                            <div className="hero__cta">
                                <Link to="/appointments" className="btn btn-primary btn-lg">
                                    Book Appointment
                                    <FiArrowRight />
                                </Link>
                                <Link to="/services" className="btn btn-white btn-lg">
                                    Our Services
                                </Link>
                            </div>
                        </div>
                        <div className="hero__image">
                            <div className="hero__image-container">
                                <div className="hero__image-decoration hero__image-decoration--1" />
                                <div className="hero__image-decoration hero__image-decoration--2" />
                                <div className="hero__image-placeholder">
                                    <FiHeart className="hero__image-icon" />
                                    <span>Expert Medical Care</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats">
                <div className="container">
                    <div className="stats__grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stats__item">
                                <div className="stats__icon">
                                    <stat.icon size={28} />
                                </div>
                                <div className="stats__content">
                                    <span className="stats__value">{stat.value}</span>
                                    <span className="stats__label">{stat.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Links Section */}
            <section className="quick-links section">
                <div className="container">
                    <div className="quick-links__grid">
                        {quickLinks.map((item, index) => (
                            <Link key={index} to={item.link} className={`quick-link-card quick-link-card--${item.color}`}>
                                <div className="quick-link-card__icon">
                                    <item.icon size={24} />
                                </div>
                                <div className="quick-link-card__content">
                                    <h3 className="quick-link-card__title">{item.title}</h3>
                                    <p className="quick-link-card__description">{item.description}</p>
                                </div>
                                <FiArrowRight className="quick-link-card__arrow" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Preview Section */}
            <section className="about-preview section bg-secondary">
                <div className="container">
                    <div className="about-preview__grid">
                        <div className="about-preview__content">
                            <span className="section-badge">About Us</span>
                            <h2 className="section-title text-left">
                                A Legacy of Excellence in Healthcare
                            </h2>
                            <p className="about-preview__text">
                                For over 15 years, Legion Healthcare Center has been at the forefront
                                of medical innovation and patient care. Our team of 50+ specialists
                                across various disciplines work together to provide comprehensive
                                healthcare solutions.
                            </p>
                            <ul className="about-preview__features">
                                <li>
                                    <FiShield className="about-preview__feature-icon" />
                                    State-of-the-art medical facilities
                                </li>
                                <li>
                                    <FiUsers className="about-preview__feature-icon" />
                                    Experienced and compassionate staff
                                </li>
                                <li>
                                    <FiHeart className="about-preview__feature-icon" />
                                    Patient-centered approach to care
                                </li>
                                <li>
                                    <FiActivity className="about-preview__feature-icon" />
                                    Advanced diagnostic technologies
                                </li>
                            </ul>
                            <Link to="/about" className="btn btn-primary">
                                Learn More About Us
                                <FiArrowRight />
                            </Link>
                        </div>
                        <div className="about-preview__image">
                            <div className="about-preview__image-card">
                                <div className="about-preview__image-placeholder">
                                    <FiUsers size={48} />
                                    <span>Our Healthcare Team</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Departments Section */}
            <section className="departments section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Our Specialties</span>
                        <h2 className="section-title">Expert Care Across All Departments</h2>
                        <p className="section-subtitle">
                            Our specialized departments offer comprehensive care for all your health needs
                        </p>
                    </div>
                    <div className="departments__grid">
                        {departments.map((dept, index) => (
                            <div key={index} className="department-card">
                                <div
                                    className="department-card__icon"
                                    style={{ backgroundColor: `${dept.color}15`, color: dept.color }}
                                >
                                    <dept.icon size={28} />
                                </div>
                                <h3 className="department-card__title">{dept.name}</h3>
                                <p className="department-card__description">{dept.description}</p>
                                <Link to={`/services#${dept.name.toLowerCase()}`} className="department-card__link">
                                    Learn More <FiArrowRight />
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div className="departments__cta">
                        <Link to="/services" className="btn btn-outline">
                            View All Departments
                            <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-card__content">
                            <h2 className="cta-card__title">Ready to Get Started?</h2>
                            <p className="cta-card__description">
                                Book an appointment with our specialists today and take the first step
                                towards better health.
                            </p>
                        </div>
                        <div className="cta-card__actions">
                            <Link to="/appointments" className="btn btn-white btn-lg">
                                Book Appointment
                            </Link>
                            <a href="tel:+15551234567" className="btn btn-outline btn-lg cta-btn-outline">
                                <FiPhone />
                                Call Us Now
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
