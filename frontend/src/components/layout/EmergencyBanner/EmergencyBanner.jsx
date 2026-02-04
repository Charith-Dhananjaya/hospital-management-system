import { FiPhone, FiAlertCircle } from 'react-icons/fi';
import './EmergencyBanner.css';

function EmergencyBanner() {
    return (
        <div className="emergency-banner">
            <div className="container">
                <div className="emergency-banner__content">
                    <div className="emergency-banner__left">
                        <FiAlertCircle className="emergency-banner__icon emergency-banner__icon--pulse" />
                        <span className="emergency-banner__text">
                            <strong>Emergency?</strong> We're available 24/7
                        </span>
                    </div>
                    <div className="emergency-banner__right">
                        <a href="tel:911" className="emergency-banner__link emergency-banner__link--emergency">
                            <FiPhone />
                            <span>911</span>
                        </a>
                        <span className="emergency-banner__divider">|</span>
                        <a href="tel:+15551234567" className="emergency-banner__link">
                            <FiPhone />
                            <span>+1 (555) 123-4567</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmergencyBanner;
