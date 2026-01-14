import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'students', label: 'Students', icon: '👥', path: '/students' },
    { id: 'teachers', label: 'Teachers', icon: '👨‍🏫', path: '/teachers' },
    { id: 'courses', label: 'Courses', icon: '📚', path: '/courses' },
    { id: 'attendance', label: 'Attendance', icon: '✓', path: '/attendance' },
    { id: 'fees', label: 'Fees', icon: '💰', path: '/fees' },
    { id: 'grades', label: 'Grades', icon: '📈', path: '/grades' },
  ];

  const activePage = menuItems.find(item => location.pathname === item.path)?.id || 'dashboard';

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🎓</span>
          {!isCollapsed && <span className="logo-text">EduManage</span>}
        </div>
        <button
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
          title="Profile"
          onClick={() => navigate('/profile')}
        >
          <span className="nav-icon">👤</span>
          {!isCollapsed && <span className="nav-label">Profile</span>}
        </button>
        <button className="nav-item logout" title="Logout" onClick={onLogout}>
          <span className="nav-icon">🚪</span>
          {!isCollapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
