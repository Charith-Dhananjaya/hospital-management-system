import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../api/config';
import './Auth.css';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [serverStatus, setServerStatus] = useState('checking');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const from = location.state?.from?.pathname || '/';

    // Check for success message from registration
    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Clear the message from history
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // Check server connectivity on mount
    useEffect(() => {
        checkServerStatus();
    }, []);

    const checkServerStatus = async () => {
        setServerStatus('checking');
        try {
            // Try the auth endpoint - it's public
            await apiClient.post('/auth/login', {}, { timeout: 5000 });
            setServerStatus('online');
        } catch (err) {
            // Any response means server is reachable
            if (err.response) {
                setServerStatus('online');
            } else {
                setServerStatus('offline');
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccessMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email.trim()) {
            setError('Please enter your email address');
            return;
        }

        if (!formData.password) {
            setError('Please enter your password');
            return;
        }

        setLoading(true);
        setError('');

        const result = await login(formData.email, formData.password);

        if (result.success) {
            // Redirect based on user role
            const dashboardPath =
                result.user.role === 'ADMIN' ? '/admin' :
                    result.user.role === 'DOCTOR' ? '/doctor' :
                        '/patient';
            navigate(from !== '/' ? from : dashboardPath, { replace: true });
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-left">
                    <Link to="/" className="auth-logo">
                        <img src="/logo.png" alt="Legion Healthcare" />
                        <span>Legion Healthcare</span>
                    </Link>
                    <div className="auth-hero">
                        <h1>Welcome Back!</h1>
                        <p>Sign in to access your health dashboard, manage appointments, and connect with your healthcare team.</p>
                    </div>
                </div>

                <div className="auth-right">
                    <div className="auth-form-container">
                        <div className="auth-header">
                            <h2>Sign In</h2>
                            <p>Enter your credentials to continue</p>
                        </div>

                        {/* Server Status Indicator */}
                        <div className={`server-status server-status--${serverStatus}`}>
                            {serverStatus === 'checking' && (
                                <>
                                    <span className="spinner-small"></span>
                                    <span>Checking server connection...</span>
                                </>
                            )}
                            {serverStatus === 'online' && (
                                <>
                                    <FiCheckCircle />
                                    <span>Server connected (localhost:9191)</span>
                                </>
                            )}
                            {serverStatus === 'offline' && (
                                <>
                                    <FiAlertCircle />
                                    <span>Cannot reach server. Check if backend is running.</span>
                                    <button onClick={checkServerStatus} className="retry-btn">Retry</button>
                                </>
                            )}
                        </div>

                        {successMessage && (
                            <div className="auth-success">
                                <FiCheckCircle />
                                <span>{successMessage}</span>
                            </div>
                        )}

                        {error && (
                            <div className="auth-error">
                                <FiAlertCircle />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <div className="input-with-icon">
                                    <FiMail className="input-icon" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div className="input-with-icon">
                                    <FiLock className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="input-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-row-between">
                                <label className="checkbox-label">
                                    <input type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="form-link">Forgot password?</Link>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={loading || serverStatus === 'offline'}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>Don't have an account?{' '}
                                <Link to="/register">Create account <FiArrowRight /></Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
