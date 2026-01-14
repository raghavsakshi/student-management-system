import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Reuse login styles for exact match

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (errors[id]) setErrors(prev => ({ ...prev, [id]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            try {
                // Ensure this matches your backend URL (check .env or config)
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        role: 'student' // Default role
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Registration successful
                    console.log('Registered user:', data);
                    // Pass email to login page to pre-fill or just redirect
                    navigate('/login', { state: { email: formData.email } });
                } else {
                    setErrors({ submit: data.message || 'Registration failed. Please try again.' });
                    setIsLoading(false);
                }
            } catch (error) {
                setErrors({ submit: 'Network error. Please try again.' });
                setIsLoading(false);
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
                    <h1 className="login-title">Welcome to EduManage</h1>
                    <p className="login-subtitle">Join us to start your journey</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Full Name</label>
                        <div className="input-container">
                            <span className="input-icon">👤</span>
                            <input
                                type="text"
                                id="name"
                                className={`input login-input ${errors.name ? 'input-error' : ''}`}
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <div className="input-container">
                            <span className="input-icon">✉️</span>
                            <input
                                type="email"
                                id="email"
                                className={`input login-input ${errors.email ? 'input-error' : ''}`}
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
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
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-container">
                            <span className="input-icon">🛡️</span>
                            <input
                                type="password"
                                id="confirmPassword"
                                className={`input login-input ${errors.confirmPassword ? 'input-error' : ''}`}
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-login"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating account...' : 'Sign Up'}
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
                    Already have an account?
                    <Link to="/login" className="link-signup">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
