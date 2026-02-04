import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiSun, FiMoon, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import './Navbar.css';

const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/doctors', label: 'Doctors' },
    { path: '/appointments', label: 'Book Appointment' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
];

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { isAuthenticated, user, logout, isAdmin, isDoctor, isPatient } = useAuth();
    const location = useLocation();

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
    }, [location]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Get dashboard link based on user role
    const getDashboardLink = () => {
        if (isAdmin) return '/admin/dashboard';
        if (isDoctor) return '/doctor/dashboard';
        if (isPatient) return '/patient/dashboard';
        return '/patient/dashboard';
    };

    return (
        <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
            <div className="container">
                <nav className="navbar__inner">
                    {/* Logo */}
                    <Link to="/" className="navbar__logo">
                        <img src="/logo.png" alt="Legion Healthcare" className="navbar__logo-image" />
                        <div className="navbar__logo-text">
                            <span className="navbar__logo-name">Legion</span>
                            <span className="navbar__logo-tagline">Healthcare Center</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <ul className="navbar__nav">
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <NavLink
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* Actions */}
                    <div className="navbar__actions">
                        {/* Theme Toggle */}
                        <button
                            className="navbar__theme-toggle"
                            onClick={toggleTheme}
                            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
                        </button>

                        {/* Auth Buttons or User Menu */}
                        {isAuthenticated ? (
                            <div className="navbar__user-menu">
                                <button
                                    className="navbar__user-button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div className="navbar__user-avatar">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className="navbar__user-name">{user?.name || 'User'}</span>
                                    <FiChevronDown className={`navbar__dropdown-icon ${isDropdownOpen ? 'rotated' : ''}`} />
                                </button>

                                {isDropdownOpen && (
                                    <div className="navbar__dropdown">
                                        <Link to={getDashboardLink()} className="navbar__dropdown-item">
                                            <FiUser size={16} />
                                            Dashboard
                                        </Link>
                                        <button onClick={logout} className="navbar__dropdown-item navbar__dropdown-item--logout">
                                            <FiLogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="navbar__auth-buttons">
                                <Link to="/login" className="btn btn-ghost btn-sm">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary btn-sm">
                                    Register
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="navbar__mobile-toggle"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        >
                            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Navigation */}
                <div className={`navbar__mobile ${isMenuOpen ? 'navbar__mobile--open' : ''}`}>
                    <ul className="navbar__mobile-nav">
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <NavLink
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    <div className="navbar__mobile-actions">
                        {isAuthenticated ? (
                            <>
                                <Link to={getDashboardLink()} className="btn btn-primary w-full">
                                    Dashboard
                                </Link>
                                <button onClick={logout} className="btn btn-outline w-full">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline w-full">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary w-full">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
