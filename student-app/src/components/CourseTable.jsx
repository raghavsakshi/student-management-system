import './StudentTable.css'; // Reusing table styles

const CourseTable = ({ courses, teachers, onEdit, onDelete, onView }) => {
    const getTeacherName = (teacherId) => {
        const teacher = teachers.find(t => t.id === teacherId);
        return teacher ? teacher.name : 'Unassigned';
    };

    return (
        <div className="table-container">
            <div className="table-wrapper">
                <table className="student-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Course Name</th>
                            <th>Code</th>
                            <th>Department</th>
                            <th>Credits</th>
                            <th>Assigned Teacher</th>
                            <th>Subjects</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="empty-state">
                                    <span className="empty-icon">📭</span>
                                    <p>No courses found</p>
                                </td>
                            </tr>
                        ) : (
                            courses.map((course) => (
                                <tr key={course.id} className="table-row">
                                    <td className="student-id">#{course.id}</td>
                                    <td>
                                        <div className="student-name-cell">
                                            <span className="student-name">{course.name}</span>
                                        </div>
                                    </td>
                                    <td className="student-course">{course.code}</td>
                                    <td className="student-email">{course.department}</td>
                                    <td>{course.credits}</td>
                                    <td className="student-course">{getTeacherName(course.assignedTeacher)}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                            {course.subjects && course.subjects.slice(0, 2).map((subject, idx) => (
                                                <span key={idx} className="grade-badge" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>{subject}</span>
                                            ))}
                                            {course.subjects && course.subjects.length > 2 && (
                                                <span className="grade-badge" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>+{course.subjects.length - 2}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-icon btn-view"
                                                onClick={() => onView(course)}
                                                title="View Details"
                                            >
                                                👁️
                                            </button>
                                            <button
                                                className="btn-icon btn-edit"
                                                onClick={() => onEdit(course)}
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn-icon btn-delete"
                                                onClick={() => onDelete(course.id)}
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

export default CourseTable;
