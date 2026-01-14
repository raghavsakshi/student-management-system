import './StudentProfileModal.css'; // Reusing profile styles

const TeacherProfileModal = ({ isOpen, teacher, onClose }) => {
    if (!isOpen || !teacher) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="profile-modal-content glass" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>

                <div className="profile-header">
                    <div className="profile-photo-container">
                        {teacher.photo ? (
                            <img src={teacher.photo} alt={teacher.name} className="profile-photo" />
                        ) : (
                            <div className="profile-avatar-placeholder">
                                {teacher.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span className="status-pill status-active">
                            Active
                        </span>
                    </div>
                    <div className="profile-basic-info">
                        <h2 className="profile-name">{teacher.name}</h2>
                        <p className="profile-email">{teacher.email}</p>
                        <div className="profile-main-stats">
                            <div className="mini-stat">
                                <span className="stat-label">Dept</span>
                                <span className="stat-value">{teacher.department}</span>
                            </div>
                            <div className="mini-stat">
                                <span className="stat-label">Role</span>
                                <span className="stat-value">Faculty</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-details-grid">
                    <div className="detail-item full-width">
                        <span className="detail-label">Assigned Subjects</span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                            {teacher.subjects && teacher.subjects.map((subject, idx) => (
                                <span key={idx} className="grade-badge" style={{ fontSize: '0.8rem' }}>{subject}</span>
                            ))}
                        </div>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Phone</span>
                        <span className="detail-value">{teacher.phone || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Office</span>
                        <span className="detail-value">Main Building, Room 402</span>
                    </div>
                </div>

                <div className="profile-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Close Profile</button>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfileModal;
