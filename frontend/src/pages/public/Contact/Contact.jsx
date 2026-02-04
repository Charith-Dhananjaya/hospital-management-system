import { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiCheck } from 'react-icons/fi';
import './Contact.css';

const contactInfo = [
    {
        icon: FiMapPin,
        title: 'Address',
        lines: ['123 Healthcare Avenue', 'Medical District, MD 12345', 'United States'],
    },
    {
        icon: FiPhone,
        title: 'Phone Numbers',
        lines: ['General: +1 (555) 123-4567', 'Emergency: 911', 'Pharmacy: +1 (555) 123-4568'],
    },
    {
        icon: FiMail,
        title: 'Email',
        lines: ['info@legionhealthcare.com', 'appointments@legionhealthcare.com', 'support@legionhealthcare.com'],
    },
    {
        icon: FiClock,
        title: 'Working Hours',
        lines: ['Monday - Friday: 8:00 AM - 8:00 PM', 'Saturday: 9:00 AM - 5:00 PM', 'Emergency: 24/7'],
    },
];

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setLoading(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    return (
        <div className="contact-page">
            {/* Hero Section */}
            <section className="page-header">
                <div className="container">
                    <h1>Contact Us</h1>
                    <p>We're here to help. Reach out to us for any questions or concerns.</p>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="contact-info section">
                <div className="container">
                    <div className="contact-info__grid">
                        {contactInfo.map((info, index) => (
                            <div key={index} className="contact-info-card">
                                <div className="contact-info-card__icon">
                                    <info.icon size={24} />
                                </div>
                                <h3 className="contact-info-card__title">{info.title}</h3>
                                <div className="contact-info-card__lines">
                                    {info.lines.map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form & Map */}
            <section className="contact-main section bg-secondary">
                <div className="container">
                    <div className="contact-main__grid">
                        {/* Contact Form */}
                        <div className="contact-form-wrapper">
                            <h2 className="contact-form__title">Send us a Message</h2>
                            <p className="contact-form__subtitle">
                                Have a question? Fill out the form below and we'll get back to you within 24 hours.
                            </p>

                            {submitted ? (
                                <div className="contact-form__success">
                                    <div className="contact-form__success-icon">
                                        <FiCheck size={32} />
                                    </div>
                                    <h3>Message Sent Successfully!</h3>
                                    <p>Thank you for contacting us. We'll get back to you shortly.</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setSubmitted(false)}
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="contact-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Full Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="form-input"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Email Address *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="form-input"
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="form-input"
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Subject *</label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="form-input"
                                                placeholder="How can we help?"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Message *</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="form-textarea"
                                            placeholder="Tell us more about your inquiry..."
                                            rows="5"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>Sending...</>
                                        ) : (
                                            <>
                                                <FiSend /> Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Map */}
                        <div className="contact-map">
                            <div className="contact-map__placeholder">
                                <FiMapPin size={48} />
                                <h3>Our Location</h3>
                                <p>123 Healthcare Avenue<br />Medical District, MD 12345</p>
                                <a
                                    href="https://maps.google.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline"
                                >
                                    Open in Google Maps
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contact;
