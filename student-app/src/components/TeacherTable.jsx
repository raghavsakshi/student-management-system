import './TeacherTable.css';

const TeacherTable = ({ teachers, onEdit, onDelete, onView }) => {
    return (
        <div className="table-container">
            <div className="table-wrapper">
                <table className="student-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Subjects</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="empty-state">
                                    <span className="empty-icon">📭</span>
                                    <p>No teachers found</p>
                                </td>
                            </tr>
                        ) : (
                            teachers.map((teacher) => (
                                <tr key={teacher.id} className="table-row">
                                    <td className="student-id">#{teacher.id}</td>
                                    <td>
                                        <div className="student-name-cell">
                                            <div className="student-avatar">
                                                {teacher.photo ? (
                                                    <img src={teacher.photo} alt={teacher.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                                ) : (
                                                    teacher.name.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <span className="student-name">{teacher.name}</span>
                                        </div>
                                    </td>
                                    <td className="student-email">{teacher.email}</td>
                                    <td className="student-course">{teacher.department}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                            {teacher.subjects && teacher.subjects.map((subject, idx) => (
                                                <span key={idx} className="grade-badge" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>{subject}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-icon btn-view"
                                                onClick={() => onView(teacher)}
                                                title="View Profile"
                                            >
                                                👁️
                                            </button>
                                            <button
                                                className="btn-icon btn-edit"
                                                onClick={() => onEdit(teacher)}
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn-icon btn-delete"
                                                onClick={() => onDelete(teacher.id)}
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeacherTable;
