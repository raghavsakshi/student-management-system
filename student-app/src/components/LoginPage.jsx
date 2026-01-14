import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
    const location = useLocation();
    const [email, setEmail] = useState(location.state?.email || '');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // Default role
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password, role }),
                });

                const data = await response.json();

                if (response.ok) {
                    onLogin(data);
                } else {
                    // Fallback to client-side logic for "Arbitrary Login" demo feature
                    // If backend rejects (e.g. user not found), we still pass data to App.jsx 
                    // which handles the "create on the fly" logic.
                    console.warn("Backend rejected login, falling back to client-side demo logic:", data.message);

                    // Construct a mock user object from form data
                    const mockUser = {
                        email: email,
                        role: role,
                        name: email.split('@')[0],
                        // Add a flag so App.jsx knows this wasn't authenticated by backend if needed
                        // But for now, App.jsx handles it via list checks
                    };
                    onLogin(mockUser);
                }
            } catch (error) {
                console.error("Login error:", error);
                // Even on network error, allow demo login? 
                // Maybe better to show error, but for "arbitrary login" request, let's allow it.
                const mockUser = {
                    email: email,
                    role: role,
                    name: email.split('@')[0],
                };
                onLogin(mockUser);
            }
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className="login-container">
            {/* Background Orbs for visual appeal */}
            <div className="background-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

            <div className="login-card glass slide-in">
                <div className="login-header">
                    <span className="login-logo">🎓</span>
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Please enter your details to Login</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label className="form-label">Select Role</label>
                        <div className="role-selection">
                            <label className={`role-option ${role === 'student' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={role === 'student'}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                                Student
                            </label>
                            <label className={`role-option ${role === 'teacher' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="teacher"
                                    checked={role === 'teacher'}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                                Teacher
                            </label>

                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <div className="input-container">
                            <span className="input-icon">✉️</span>
                            <input
                                type="email"
                                id="email"
                                className={`input login-input ${errors.email ? 'input-error' : ''}`}
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors({ ...errors, email: '' });
                                }}
                            />
                        </div>
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <div className="input-container">
                            <span className="input-icon">🔒</span>
                            <input
                                type="password"
                                id="password"
                                className={`input login-input ${errors.password ? 'input-error' : ''}`}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) setErrors({ ...errors, password: '' });
                                }}
                            />
                        </div>
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                        <Link to="/forgot-password" size="sm" className="forgot-password">Forgot password?</Link>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-login"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>

                    {errors.submit && <div className="error-message centered">{errors.submit}</div>}

                    <div className="login-divider">OR</div>

                    <div className="social-login">
                        <button type="button" className="btn btn-secondary btn-social">
                            <span>G</span> Google
                        </button>
                        <button type="button" className="btn btn-secondary btn-social">
                            <span>🐱</span> GitHub
                        </button>
                    </div>
                </form>

                <div className="login-footer">
                    Don't have an account?
                    <Link to="/signup" className="link-signup">Create Account</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
