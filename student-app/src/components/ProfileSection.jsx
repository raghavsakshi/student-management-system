import { useState, useEffect } from 'react';
import './ProfileSection.css';

const ProfileSection = ({ user, userRole, onUpdateProfile, onChangePassword }) => {
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('profileActiveTab') || 'edit';
    });

    useEffect(() => {
        localStorage.setItem('profileActiveTab', activeTab);
    }, [activeTab]);

    // Profile Form State
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        id: user.id || ''
    });

    // Password Form State
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    // Settings State
    const [settings, setSettings] = useState({
        emailNotifs: true,
        smsNotifs: false,
        darkMode: false,
        publicProfile: true
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        onUpdateProfile(formData);
        alert('Profile updated successfully!');
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            alert('New passwords do not match!');
            return;
        }
        if (passwordData.new.length < 6) {
            alert('Password must be at least 6 characters!');
            return;
        }
        onChangePassword(passwordData);
        setPasswordData({ current: '', new: '', confirm: '' });
        alert('Password changed successfully!');
    };

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="profile-container">
            {/* Header */}
            <div className="profile-header">
                <div className="profile-avatar-wrapper">
                    <div className="profile-avatar">
                        {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <div className="avatar-overlay">📷</div>
                </div>
                <h2 className="profile-name">{user.name}</h2>
                <span className="profile-role-badge">
                    {userRole === 'admin' ? 'Administrator' :
                        userRole === 'teacher' ? `Teacher ID: #${user.id}` :
                            `Student ID: #${user.id}`}
                </span>
            </div>

            {/* Navigation Tabs */}
            <div className="profile-nav">
                <button
                    className={`profile-nav-btn ${activeTab === 'edit' ? 'active' : ''}`}
                    onClick={() => setActiveTab('edit')}
                >
                    Edit Profile
                </button>
                <button
                    className={`profile-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
                    onClick={() => setActiveTab('security')}
                >
                    Security
                </button>
                <button
                    className={`profile-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    Settings
                </button>
            </div>

            {/* Content Area */}
            <div className="profile-content">
                {/* Edit Profile Tab */}
                {activeTab === 'edit' && (
                    <div className="profile-card">
                        <form onSubmit={handleProfileSubmit}>
                            <div className="profile-form-grid">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        className="input"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        className="input"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        className="input"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="123 Main St..."
                                    />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <div className="profile-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    className="input"
                                    required
                                    value={passwordData.current}
                                    onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    className="input"
                                    required
                                    value={passwordData.new}
                                    onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    className="input"
                                    required
                                    value={passwordData.confirm}
                                    onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">Change Password</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="profile-card">
                        <div className="setting-item">
                            <div className="setting-info">
                                <h4>Email Notifications</h4>
                                <p>Receive emails about updates and announcements</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.emailNotifs}
                                    onChange={() => toggleSetting('emailNotifs')}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <div className="setting-info">
                                <h4>SMS Notifications</h4>
                                <p>Receive text messages for urgent alerts</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.smsNotifs}
                                    onChange={() => toggleSetting('smsNotifs')}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="setting-item">
                            <div className="setting-info">
                                <h4>Dark Mode</h4>
                                <p>Switch to a dark color theme</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.darkMode}
                                    onChange={() => toggleSetting('darkMode')}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileSection;
