import { FiTarget, FiEye, FiHeart, FiUsers, FiAward, FiShield, FiStar, FiCheck } from 'react-icons/fi';
import './About.css';

const values = [
    {
        icon: FiHeart,
        title: 'Compassion',
        description: 'We treat every patient with empathy, respect, and understanding.',
    },
    {
        icon: FiShield,
        title: 'Excellence',
        description: 'We strive for the highest standards in medical care and patient safety.',
    },
    {
        icon: FiUsers,
        title: 'Teamwork',
        description: 'We collaborate across disciplines to provide comprehensive care.',
    },
    {
        icon: FiStar,
        title: 'Innovation',
        description: 'We embrace new technologies and methods to improve patient outcomes.',
    },
];

const timeline = [
    { year: '2009', title: 'Foundation', description: 'Legion Healthcare Center was established with a vision to provide world-class healthcare.' },
    { year: '2012', title: 'Expansion', description: 'Opened new wings for Cardiology and Neurology departments.' },
    { year: '2015', title: 'Accreditation', description: 'Received JCI accreditation for quality and patient safety.' },
    { year: '2018', title: 'Technology Upgrade', description: 'Implemented state-of-the-art diagnostic and treatment equipment.' },
    { year: '2021', title: 'Community Award', description: 'Recognized as the best hospital for community service.' },
    { year: '2024', title: 'Digital Health', description: 'Launched telemedicine services and patient portal.' },
];

const leadership = [
    { name: 'Dr. James Wilson', role: 'Chief Executive Officer', specialty: 'Healthcare Administration' },
    { name: 'Dr. Sarah Chen', role: 'Medical Director', specialty: 'Internal Medicine' },
    { name: 'Dr. Michael Ross', role: 'Chief of Surgery', specialty: 'General Surgery' },
    { name: 'Dr. Emily Parker', role: 'Head of Research', specialty: 'Clinical Research' },
];

function About() {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="page-header">
                <div className="container">
                    <h1>About Legion Healthcare</h1>
                    <p>A legacy of excellence in healthcare, serving our community with compassion and expertise since 2009.</p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="mission-vision section">
                <div className="container">
                    <div className="mission-vision__grid">
                        <div className="mission-card">
                            <div className="mission-card__icon">
                                <FiTarget size={32} />
                            </div>
                            <h2 className="mission-card__title">Our Mission</h2>
                            <p className="mission-card__text">
                                To provide exceptional healthcare services that improve the quality of life
                                for our patients and community. We are committed to delivering compassionate,
                                patient-centered care using the latest medical advancements and evidence-based practices.
                            </p>
                        </div>
                        <div className="mission-card">
                            <div className="mission-card__icon mission-card__icon--secondary">
                                <FiEye size={32} />
                            </div>
                            <h2 className="mission-card__title">Our Vision</h2>
                            <p className="mission-card__text">
                                To be the leading healthcare provider recognized for clinical excellence,
                                innovative treatments, and exceptional patient experiences. We aspire to set
                                new standards in healthcare delivery and become the trusted choice for families.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="our-story section bg-secondary">
                <div className="container">
                    <div className="our-story__content">
                        <span className="section-badge">Our Story</span>
                        <h2 className="section-title">A Journey of Healing and Hope</h2>
                        <div className="our-story__text">
                            <p>
                                Legion Healthcare Center was founded in 2009 by a group of dedicated physicians
                                who shared a common vision: to create a healthcare facility that puts patients first.
                                What started as a small clinic has grown into a comprehensive medical center serving
                                thousands of patients each year.
                            </p>
                            <p>
                                Over the years, we have continuously invested in the latest medical technologies
                                and recruited top specialists from around the world. Our commitment to excellence
                                has earned us numerous accolades and, more importantly, the trust of our community.
                            </p>
                            <p>
                                Today, Legion Healthcare Center stands as a beacon of hope for those seeking quality
                                healthcare. With over 50 physicians, state-of-the-art facilities, and a patient-first
                                philosophy, we continue to fulfill our founding mission every single day.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="timeline-section section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Our History</span>
                        <h2 className="section-title">Milestones & Achievements</h2>
                    </div>
                    <div className="timeline">
                        {timeline.map((item, index) => (
                            <div key={index} className="timeline__item">
                                <div className="timeline__marker">
                                    <span className="timeline__year">{item.year}</span>
                                </div>
                                <div className="timeline__content">
                                    <h3 className="timeline__title">{item.title}</h3>
                                    <p className="timeline__description">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="values-section section bg-secondary">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">What We Stand For</span>
                        <h2 className="section-title">Our Core Values</h2>
                        <p className="section-subtitle">
                            These values guide everything we do at Legion Healthcare Center
                        </p>
                    </div>
                    <div className="values__grid">
                        {values.map((value, index) => (
                            <div key={index} className="value-card">
                                <div className="value-card__icon">
                                    <value.icon size={28} />
                                </div>
                                <h3 className="value-card__title">{value.title}</h3>
                                <p className="value-card__description">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Leadership */}
            <section className="leadership-section section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Our Team</span>
                        <h2 className="section-title">Leadership Team</h2>
                        <p className="section-subtitle">
                            Meet the experienced professionals leading our healthcare mission
                        </p>
                    </div>
                    <div className="leadership__grid">
                        {leadership.map((leader, index) => (
                            <div key={index} className="leader-card">
                                <div className="leader-card__avatar">
                                    {leader.name.charAt(0)}
                                </div>
                                <h3 className="leader-card__name">{leader.name}</h3>
                                <p className="leader-card__role">{leader.role}</p>
                                <p className="leader-card__specialty">{leader.specialty}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="why-us-section section bg-secondary">
                <div className="container">
                    <div className="why-us__grid">
                        <div className="why-us__content">
                            <span className="section-badge">Why Legion Healthcare</span>
                            <h2 className="section-title text-left">Why Patients Choose Us</h2>
                            <ul className="why-us__list">
                                <li>
                                    <FiCheck className="why-us__check" />
                                    <span>50+ experienced specialists across all medical disciplines</span>
                                </li>
                                <li>
                                    <FiCheck className="why-us__check" />
                                    <span>State-of-the-art diagnostic and treatment facilities</span>
                                </li>
                                <li>
                                    <FiCheck className="why-us__check" />
                                    <span>24/7 emergency care with rapid response teams</span>
                                </li>
                                <li>
                                    <FiCheck className="why-us__check" />
                                    <span>Patient-centered approach with personalized treatment plans</span>
                                </li>
                                <li>
                                    <FiCheck className="why-us__check" />
                                    <span>JCI accredited for quality and patient safety</span>
                                </li>
                                <li>
                                    <FiCheck className="why-us__check" />
                                    <span>Convenient location with ample parking</span>
                                </li>
                            </ul>
                        </div>
                        <div className="why-us__stats">
                            <div className="stat-card">
                                <FiAward className="stat-card__icon" />
                                <span className="stat-card__value">15+</span>
                                <span className="stat-card__label">Years of Excellence</span>
                            </div>
                            <div className="stat-card">
                                <FiUsers className="stat-card__icon" />
                                <span className="stat-card__value">10,000+</span>
                                <span className="stat-card__label">Patients Served</span>
                            </div>
                            <div className="stat-card">
                                <FiHeart className="stat-card__icon" />
                                <span className="stat-card__value">98%</span>
                                <span className="stat-card__label">Patient Satisfaction</span>
                            </div>
                            <div className="stat-card">
                                <FiShield className="stat-card__icon" />
                                <span className="stat-card__value">50+</span>
                                <span className="stat-card__label">Expert Doctors</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;
