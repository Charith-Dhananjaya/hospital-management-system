import { Link } from 'react-router-dom';
import {
    FiPhone,
    FiMail,
    FiMapPin,
    FiClock,
    FiFacebook,
    FiTwitter,
    FiInstagram,
    FiLinkedin,
    FiYoutube
} from 'react-icons/fi';
import './Footer.css';

const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/services', label: 'Services' },
    { path: '/doctors', label: 'Our Doctors' },
    { path: '/appointments', label: 'Book Appointment' },
    { path: '/contact', label: 'Contact Us' },
];

const departments = [
    { path: '/services#cardiology', label: 'Cardiology' },
    { path: '/services#neurology', label: 'Neurology' },
    { path: '/services#orthopedics', label: 'Orthopedics' },
    { path: '/services#pediatrics', label: 'Pediatrics' },
    { path: '/services#dermatology', label: 'Dermatology' },
    { path: '/services#emergency', label: 'Emergency Care' },
];

const socialLinks = [
    { icon: FiFacebook, href: '#', label: 'Facebook' },
    { icon: FiTwitter, href: '#', label: 'Twitter' },
    { icon: FiInstagram, href: '#', label: 'Instagram' },
    { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
    { icon: FiYoutube, href: '#', label: 'YouTube' },
];

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            {/* Main Footer */}
            <div className="footer__main">
                <div className="container">
                    <div className="footer__grid">
                        {/* Brand Section */}
                        <div className="footer__brand">
                            <Link to="/" className="footer__logo">
                                <img src="/logo.png" alt="Legion Healthcare" className="footer__logo-image" />
                                <div className="footer__logo-text">
                                    <span className="footer__logo-name">Legion</span>
                                    <span className="footer__logo-tagline">Healthcare Center</span>
                                </div>
                            </Link>
                            <p className="footer__description">
                                Providing compassionate, world-class healthcare services to our community.
                                Your health is our priority, and we're here for you 24/7.
                            </p>
                            <div className="footer__social">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        className="footer__social-link"
                                        aria-label={social.label}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <social.icon size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="footer__section">
                            <h4 className="footer__section-title">Quick Links</h4>
                            <ul className="footer__links">
                                {quickLinks.map((link) => (
                                    <li key={link.path}>
                                        <Link to={link.path} className="footer__link">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Departments */}
                        <div className="footer__section">
                            <h4 className="footer__section-title">Departments</h4>
                            <ul className="footer__links">
                                {departments.map((dept) => (
                                    <li key={dept.path}>
                                        <Link to={dept.path} className="footer__link">
                                            {dept.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="footer__section">
                            <h4 className="footer__section-title">Contact Us</h4>
                            <ul className="footer__contact">
                                <li className="footer__contact-item">
                                    <FiMapPin className="footer__contact-icon" />
                                    <span>123 Healthcare Avenue,<br />Medical District, MD 12345</span>
                                </li>
                                <li className="footer__contact-item">
                                    <FiPhone className="footer__contact-icon" />
                                    <div>
                                        <a href="tel:+15551234567">+1 (555) 123-4567</a>
                                        <span className="footer__contact-label">General Inquiries</span>
                                    </div>
                                </li>
                                <li className="footer__contact-item">
                                    <FiMail className="footer__contact-icon" />
                                    <a href="mailto:info@legionhealthcare.com">info@legionhealthcare.com</a>
                                </li>
                                <li className="footer__contact-item">
                                    <FiClock className="footer__contact-icon" />
                                    <div>
                                        <span>Mon - Fri: 8:00 AM - 8:00 PM</span>
                                        <span className="footer__contact-label">Emergency: 24/7</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer__bottom">
                <div className="container">
                    <div className="footer__bottom-inner">
                        <p className="footer__copyright">
                            © {currentYear} Legion Healthcare Center. All rights reserved.
                        </p>
                        <nav className="footer__legal">
                            <Link to="/privacy">Privacy Policy</Link>
                            <Link to="/terms">Terms of Service</Link>
                            <Link to="/accessibility">Accessibility</Link>
                        </nav>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
