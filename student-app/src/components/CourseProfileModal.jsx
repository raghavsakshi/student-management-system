import './StudentProfileModal.css'; // Reusing profile styles

const CourseProfileModal = ({ isOpen, course, teachers, students, onClose }) => {
    if (!isOpen || !course) return null;

    const getTeacherName = (teacherId) => {
        const teacher = teachers?.find(t => t.id === teacherId);
        return teacher ? teacher.name : 'Unassigned';
    };

    const getTeacherEmail = (teacherId) => {
        const teacher = teachers?.find(t => t.id === teacherId);
        return teacher ? teacher.email : 'N/A';
    };

    const enrolledStudents = students?.filter(s => s.course === course.name).length || 0;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="profile-modal-content glass" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>

                <div className="profile-header">
                    <div className="profile-photo-container">
                        <div className="profile-avatar-placeholder" style={{ fontSize: '2rem' }}>
                            📚
                        </div>
                        <span className={`status-pill status-${course.status.toLowerCase()}`}>
                            {course.status}
                        </span>
                    </div>
                    <div className="profile-basic-info">
                        <h2 className="profile-name">{course.name}</h2>
                        <p className="profile-email">{course.code}</p>
                        <div className="profile-main-stats">
                            <div className="mini-stat">
                                <span className="stat-label">Credits</span>
                                <span className="stat-value">{course.credits}</span>
                            </div>
                            <div className="mini-stat">
                                <span className="stat-label">Students</span>
                                <span className="stat-value">{enrolledStudents}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-details-grid">
                    <div className="detail-item">
                        <span className="detail-label">Department</span>
                        <span className="detail-value">{course.department}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Assigned Teacher</span>
                        <span className="detail-value">{getTeacherName(course.assignedTeacher)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Teacher Email</span>
                        <span className="detail-value">{getTeacherEmail(course.assignedTeacher)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Enrolled Students</span>
                        <span className="detail-value">{enrolledStudents} students</span>
                    </div>
                    <div className="detail-item full-width">
                        <span className="detail-label">Description</span>
                        <span className="detail-value">{course.description || 'No description provided'}</span>
                    </div>
                    <div className="detail-item full-width">
                        <span className="detail-label">Subjects Covered</span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                            {course.subjects && course.subjects.map((subject, idx) => (
                                <span key={idx} className="grade-badge" style={{ fontSize: '0.8rem' }}>{subject}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="profile-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default CourseProfileModal;
