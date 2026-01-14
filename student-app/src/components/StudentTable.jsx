import './StudentTable.css';

const StudentTable = ({ students, onEdit, onDelete, onView }) => {
    return (
        <div className="table-container">
            <div className="table-wrapper">
                <table className="student-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Course</th>
                            <th>Grade</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="empty-state">
                                    <span className="empty-icon">📭</span>
                                    <p>No students found</p>
                                </td>
                            </tr>
                        ) : (
                            students.map((student) => (
                                <tr key={student.id} className="table-row">
                                    <td className="student-id">#{student.id}</td>
                                    <td>
                                        <div className="student-name-cell">
                                            <div className="student-avatar">
                                                {student.photo ? (
                                                    <img src={student.photo} alt={student.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                                ) : (
                                                    student.name.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <span className="student-name">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="student-email">{student.email}</td>
                                    <td className="student-course">{student.course}</td>
                                    <td>
                                        <span className="grade-badge">{student.grade}</span>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${student.status.toLowerCase()}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-icon btn-view"
                                                onClick={() => onView(student)}
                                                title="View Profile"
                                            >
                                                👁️
                                            </button>
                                            <button
                                                className="btn-icon btn-edit"
                                                onClick={() => onEdit(student)}
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn-icon btn-delete"
                                                onClick={() => onDelete(student.id)}
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

export default StudentTable;
