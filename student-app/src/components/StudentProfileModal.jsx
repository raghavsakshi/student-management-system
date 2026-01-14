import './StudentProfileModal.css';

const StudentProfileModal = ({ isOpen, student, onClose }) => {
    if (!isOpen || !student) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="profile-modal-content glass" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>

                <div className="profile-header">
                    <div className="profile-photo-container">
                        {student.photo ? (
                            <img src={student.photo} alt={student.name} className="profile-photo" />
                        ) : (
                            <div className="profile-avatar-placeholder">
                                {student.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span className={`status-pill status-${student.status.toLowerCase()}`}>
                            {student.status}
                        </span>
                    </div>
                    <div className="profile-basic-info">
                        <h2 className="profile-name">{student.name}</h2>
                        <p className="profile-email">{student.email}</p>
                        <div className="profile-main-stats">
                            <div className="mini-stat">
                                <span className="stat-label">Class</span>
                                <span className="stat-value">{student.class || 'N/A'}</span>
                            </div>
                            <div className="mini-stat">
                                <span className="stat-label">Grade</span>
                                <span className="stat-value">{student.grade}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-details-grid">
                    <div className="detail-item">
                        <span className="detail-label">Course</span>
                        <span className="detail-value">{student.course}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Phone</span>
                        <span className="detail-value">{student.phone || 'N/A'}</span>
                    </div>
                    <div className="detail-item full-width">
                        <span className="detail-label">Address</span>
                        <span className="detail-value">{student.address || 'N/A'}</span>
                    </div>
                </div>

                <div className="profile-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Close Profile</button>
                </div>
            </div>
        </div>
    );
};

export default StudentProfileModal;
