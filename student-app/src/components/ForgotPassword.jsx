import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';
import './LoginPage.css'; // Reusing some styles

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            setError('Email is required');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email');
            return;
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className="forgot-password-container">
            {/* Background Orbs */}
            <div className="background-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
            </div>

            <div className="forgot-password-card glass fade-in">
                <div className="forgot-password-header">
                    <h1 className="forgot-password-title">Reset Password</h1>
                    {!isSubmitted ? (
                        <p className="forgot-password-subtitle">
                            Enter your email and we'll send you a link to reset your password.
                        </p>
                    ) : (
                        <p className="forgot-password-subtitle">
                            Check your inbox for further instructions.
                        </p>
                    )}
                </div>

                {!isSubmitted ? (
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="input-container">
                                <span className="input-icon">✉️</span>
                                <input
                                    type="email"
                                    className={`input login-input ${error ? 'input-error' : ''}`}
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError('');
                                    }}
                                />
                            </div>
                            {error && <span className="error-message">{error}</span>}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-login"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending Link...' : 'Send Recovery Link'}
                        </button>
                    </form>
                ) : (
                    <div className="recovery-success">
                        <span className="success-icon">📧</span>
                        <h3>Recovery Link Sent!</h3>
                        <p>If an account exists for {email}, you will receive an email shortly.</p>
                    </div>
                )}

                <div className="text-center">
                    <Link to="/login" className="back-to-login">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
