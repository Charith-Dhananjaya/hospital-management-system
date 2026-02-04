import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiArrowRight, FiUserCheck, FiActivity, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../api/config';
import '../Login/Auth.css';

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [serverStatus, setServerStatus] = useState('checking'); // checking, online, offline

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'PATIENT',
    });

    // Check server connectivity on mount
    useEffect(() => {
        checkServerStatus();
    }, []);

    const checkServerStatus = async () => {
        setServerStatus('checking');
        try {
            // Try the auth endpoint - it's public and should return something
            // Even a 400/405 response means server is reachable
            await apiClient.post('/auth/login', {}, { timeout: 5000 });
            setServerStatus('online');
        } catch (err) {
            // Check if we got a response (server is online, just returned an error)
            if (err.response) {
                // Any response means the server is reachable
                console.log('Server status check: online (got response:', err.response.status, ')');
                setServerStatus('online');
            } else {
                // No response means network error / server down
                console.log('Server status check: offline (no response)');
                setServerStatus('offline');
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleRoleSelect = (role) => {
        setFormData({ ...formData, role });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!formData.name.trim()) {
            setError('Please enter your name');
            return;
        }

        if (!formData.email.trim()) {
            setError('Please enter your email address');
            return;
        }

        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        // Send data matching backend UserDTO: { name, email, password, role }
        const result = await register({
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            role: formData.role
        });

        if (result.success) {
            navigate('/login', {
                state: { message: 'Account created successfully! Please sign in.' }
            });
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
                        <h1>Join Legion Healthcare</h1>
                        <p>Create an account to book appointments, access your health records, and connect with our medical professionals.</p>
                    </div>
                </div>

                <div className="auth-right">
                    <div className="auth-form-container">
                        <div className="auth-header">
                            <h2>Create Account</h2>
                            <p>Fill in your details to get started</p>
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

                        {error && (
                            <div className="auth-error">
                                <FiAlertCircle />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label className="form-label">I am a</label>
                                <div className="role-selection">
                                    <label className={`role-option ${formData.role === 'PATIENT' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="PATIENT"
                                            checked={formData.role === 'PATIENT'}
                                            onChange={() => handleRoleSelect('PATIENT')}
                                        />
                                        <FiUserCheck className="role-option__icon" />
                                        <span>Patient</span>
                                    </label>
                                    <label className={`role-option ${formData.role === 'DOCTOR' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="DOCTOR"
                                            checked={formData.role === 'DOCTOR'}
                                            onChange={() => handleRoleSelect('DOCTOR')}
                                        />
                                        <FiActivity className="role-option__icon" />
                                        <span>Doctor</span>
                                    </label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <div className="input-with-icon">
                                    <FiUser className="input-icon" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>
                            </div>

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
                                        placeholder="Create a password (min 6 chars)"
                                        required
                                        minLength={6}
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

                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <div className="input-with-icon">
                                    <FiLock className="input-icon" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={loading || serverStatus === 'offline'}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>Already have an account?{' '}
                                <Link to="/login">Sign in <FiArrowRight /></Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
