import { Link } from 'react-router-dom';
import {
    FiHeart,
    FiActivity,
    FiBriefcase,
    FiUsers,
    FiSun,
    FiEye,
    FiDroplet,
    FiShield,
    FiZap,
    FiThermometer,
    FiPlus,
    FiArrowRight
} from 'react-icons/fi';
import './Services.css';

const departments = [
    {
        id: 'emergency',
        icon: FiZap,
        name: 'Emergency Medicine',
        description: 'Our 24/7 emergency department provides immediate, life-saving care for acute illnesses, injuries, and medical emergencies. Staffed by board-certified emergency physicians and trauma specialists.',
        services: ['Trauma Care', 'Cardiac Emergencies', 'Stroke Response', 'Pediatric Emergencies', 'Poison Control'],
        color: '#E53E3E',
    },
    {
        id: 'cardiology',
        icon: FiHeart,
        name: 'Cardiology',
        description: 'Comprehensive heart and vascular care including diagnosis, treatment, and prevention of cardiovascular diseases. Our cardiologists use advanced imaging and interventional procedures.',
        services: ['Echocardiography', 'Cardiac Catheterization', 'Angioplasty', 'Pacemaker Implantation', 'Heart Failure Management'],
        color: '#E53E3E',
    },
    {
        id: 'neurology',
        icon: FiActivity,
        name: 'Neurology',
        description: 'Expert diagnosis and treatment of neurological conditions affecting the brain, spinal cord, and nervous system. From headaches to complex neurological disorders.',
        services: ['Stroke Treatment', 'Epilepsy Management', 'Movement Disorders', 'Multiple Sclerosis', 'Neuromuscular Diseases'],
        color: '#805AD5',
    },
    {
        id: 'orthopedics',
        icon: FiBriefcase,
        name: 'Orthopedics',
        description: 'Advanced bone, joint, and muscle care for patients of all ages. Our orthopedic surgeons specialize in joint replacement, sports medicine, and trauma surgery.',
        services: ['Joint Replacement', 'Sports Medicine', 'Spine Surgery', 'Fracture Care', 'Arthroscopic Surgery'],
        color: '#38A169',
    },
    {
        id: 'pediatrics',
        icon: FiUsers,
        name: 'Pediatrics',
        description: 'Gentle, specialized healthcare for infants, children, and adolescents. Our pediatricians provide preventive care, routine checkups, and treatment for childhood illnesses.',
        services: ['Well-Child Visits', 'Vaccinations', 'Developmental Screening', 'Acute Illness Care', 'Adolescent Medicine'],
        color: '#00B4D8',
    },
    {
        id: 'oncology',
        icon: FiShield,
        name: 'Oncology',
        description: 'Compassionate cancer care with cutting-edge treatments and personalized therapy plans. Our multidisciplinary team provides comprehensive oncology services.',
        services: ['Chemotherapy', 'Radiation Therapy', 'Surgical Oncology', 'Immunotherapy', 'Palliative Care'],
        color: '#ED8936',
    },
    {
        id: 'gynecology',
        icon: FiHeart,
        name: 'Gynecology & Obstetrics',
        description: 'Complete women\'s health services from adolescence through menopause. Our specialists provide prenatal care, delivery services, and gynecological treatments.',
        services: ['Prenatal Care', 'Labor & Delivery', 'High-Risk Pregnancy', 'Gynecological Surgery', 'Menopause Management'],
        color: '#D53F8C',
    },
    {
        id: 'dermatology',
        icon: FiSun,
        name: 'Dermatology',
        description: 'Comprehensive skin care services for medical, surgical, and cosmetic dermatology. Treatment for skin conditions, skin cancer screening, and aesthetic procedures.',
        services: ['Skin Cancer Screening', 'Acne Treatment', 'Eczema & Psoriasis', 'Cosmetic Procedures', 'Mohs Surgery'],
        color: '#F6AD55',
    },
    {
        id: 'ophthalmology',
        icon: FiEye,
        name: 'Ophthalmology',
        description: 'Complete eye care services from routine exams to complex surgeries. Our ophthalmologists treat all eye conditions and perform vision-correcting procedures.',
        services: ['Cataract Surgery', 'LASIK', 'Glaucoma Treatment', 'Retinal Care', 'Pediatric Eye Care'],
        color: '#4299E1',
    },
    {
        id: 'radiology',
        icon: FiDroplet,
        name: 'Radiology & Imaging',
        description: 'State-of-the-art diagnostic imaging services using the latest technology. Our radiologists provide accurate, timely interpretations for all imaging studies.',
        services: ['X-Ray', 'CT Scan', 'MRI', 'Ultrasound', 'Mammography'],
        color: '#667EEA',
    },
    {
        id: 'laboratory',
        icon: FiThermometer,
        name: 'Laboratory Services',
        description: 'Comprehensive clinical laboratory services with fast, accurate results. Our lab is equipped with advanced analyzers for all routine and specialized testing.',
        services: ['Blood Tests', 'Urinalysis', 'Microbiology', 'Pathology', 'Genetic Testing'],
        color: '#48BB78',
    },
    {
        id: 'pharmacy',
        icon: FiPlus,
        name: 'Pharmacy',
        description: 'Full-service pharmacy with expert pharmacists available to answer questions and ensure safe medication use. Convenient prescription filling and medication counseling.',
        services: ['Prescription Filling', 'Medication Counseling', 'Immunizations', 'Specialty Medications', 'Home Delivery'],
        color: '#38B2AC',
    },
];

function Services() {
    return (
        <div className="services-page">
            {/* Hero Section */}
            <section className="page-header">
                <div className="container">
                    <h1>Our Services & Departments</h1>
                    <p>Comprehensive healthcare services across all medical specialties, delivered with expertise and compassion.</p>
                </div>
            </section>

            {/* Intro Section */}
            <section className="services-intro section">
                <div className="container">
                    <div className="services-intro__content">
                        <h2>World-Class Medical Care</h2>
                        <p>
                            At Legion Healthcare Center, we offer a comprehensive range of medical services
                            designed to meet all your healthcare needs. Our team of specialists works
                            collaboratively to provide integrated, patient-centered care using the latest
                            medical technologies and evidence-based practices.
                        </p>
                    </div>
                </div>
            </section>

            {/* Departments Grid */}
            <section className="departments-section section bg-secondary">
                <div className="container">
                    <div className="departments-grid">
                        {departments.map((dept) => (
                            <div key={dept.id} id={dept.id} className="department-detail-card">
                                <div className="department-detail-card__header">
                                    <div
                                        className="department-detail-card__icon"
                                        style={{ backgroundColor: `${dept.color}15`, color: dept.color }}
                                    >
                                        <dept.icon size={32} />
                                    </div>
                                    <h3 className="department-detail-card__name">{dept.name}</h3>
                                </div>
                                <p className="department-detail-card__description">{dept.description}</p>
                                <div className="department-detail-card__services">
                                    <h4>Key Services:</h4>
                                    <ul>
                                        {dept.services.map((service, index) => (
                                            <li key={index}>{service}</li>
                                        ))}
                                    </ul>
                                </div>
                                <Link to="/appointments" className="department-detail-card__link">
                                    Book Appointment <FiArrowRight />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="services-cta section">
                <div className="container">
                    <div className="services-cta__content">
                        <h2>Need Help Finding the Right Department?</h2>
                        <p>
                            Our patient services team is here to help you navigate our services
                            and find the right specialist for your needs.
                        </p>
                        <div className="services-cta__actions">
                            <Link to="/contact" className="btn btn-primary btn-lg">
                                Contact Us
                            </Link>
                            <Link to="/doctors" className="btn btn-outline btn-lg">
                                View Our Doctors
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Services;
