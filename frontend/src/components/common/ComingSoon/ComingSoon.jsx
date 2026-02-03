import { FiClock, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './ComingSoon.css';

function ComingSoon({
    title = 'Coming Soon',
    message = 'This feature is currently under development.',
    showBack = true
}) {
    const navigate = useNavigate();

    return (
        <div className="coming-soon">
            <div className="coming-soon__icon">
                <FiClock />
            </div>
            <h2 className="coming-soon__title">{title}</h2>
            <p className="coming-soon__message">{message}</p>
            <div className="coming-soon__dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            {showBack && (
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-outline coming-soon__btn"
                >
                    <FiArrowLeft /> Go Back
                </button>
            )}
        </div>
    );
}

export default ComingSoon;
