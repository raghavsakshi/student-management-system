import { useState } from 'react';
import './Header.css';

const Header = ({ onSearch, user }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    return (
        <header className="header">
            <div className="header-left">
                <h2 className="page-title">Dashboard</h2>
            </div>

            <div className="header-center">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search students, courses..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <div className="header-right">

                <div className="user-profile">
                    <div className="user-avatar">
                        <span>{user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AD'}</span>
                    </div>
                    <div className="user-info">
                        <span className="user-name">{user?.name || 'Admin User'}</span>
                        <span className="user-role">{user?.role || 'Administrator'}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
