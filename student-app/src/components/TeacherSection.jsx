import { useState } from 'react';
import './TeacherSection.css';

const TeacherSection = ({ teacherData, studentsData, onEditProfile }) => {
    const assignedClasses = teacherData?.subjects || [];
    const teacherName = teacherData?.name || 'Teacher';
    const [selectedClass, setSelectedClass] = useState(assignedClasses[0] || null);
    const [activeTab, setActiveTab] = useState('overview');

    const classStudents = studentsData.filter(s => s.course === selectedClass);

    // Mock scores for Exam Results
    const getStudentScore = (id) => {
        const scores = { 1: 85, 2: 92, 3: 78, 4: 0, 5: 88, 6: 82, 7: 90, 8: 85 };
        return scores[id] || 'N/A';
    };

    return (
        <div className="teacher-container">
            <div className="teacher-header-main">
                <div className="welcome-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 className="teacher-title">Welcome, {teacherName}</h2>
                            <p className="teacher-subtitle">Manage your classes, students, and academic performance</p>
                        </div>
                        <button className="btn btn-outline btn-sm" onClick={onEditProfile}>
                            ✏️ Edit Profile
                        </button>
                    </div>
                </div>
                <div className="class-selector-top">
                    <label>Currently Viewing:</label>
                    <select
                        value={selectedClass || ''}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="class-select-dropdown"
                    >
                        {assignedClasses.length > 0 ? (
                            assignedClasses.map((className, index) => (
                                <option key={index} value={className}>{className}</option>
                            ))
                        ) : (
                            <option value="">No subjects assigned</option>
                        )}
                    </select>
                </div>
            </div>

            <div className="teacher-tabs">
                <button
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <span>📊</span> Overview
                </button>
                <button
                    className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
                    onClick={() => setActiveTab('students')}
                >
                    <span>👥</span> Student List
                </button>
                <button
                    className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
                    onClick={() => setActiveTab('attendance')}
                >
                    <span>📅</span> Attendance
                </button>
                <button
                    className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
                    onClick={() => setActiveTab('results')}
                >
                    <span>📝</span> Exam Results
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'overview' && (
                    <div className="teacher-grid">
                        <div className="teacher-card">
                            <h3 className="card-title"><span>📅</span> Assigned Subjects</h3>
                            <div className="class-list">
                                {assignedClasses.length > 0 ? (
                                    assignedClasses.map((className, index) => (
                                        <div
                                            key={index}
                                            className={`class-item ${selectedClass === className ? 'active' : ''}`}
                                            onClick={() => setSelectedClass(className)}
                                        >
                                            <div>
                                                <div className="class-name">{className}</div>
                                                <div className="class-meta">Regular Batch • 2024</div>
                                            </div>
                                            <span className="nav-icon">→</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state" style={{ padding: '1rem' }}>No subjects assigned</div>
                                )}
                            </div>
                        </div>

                        <div className="teacher-card">
                            <h3 className="card-title"><span>📊</span> Class Performance</h3>
                            <div className="performance-stats">
                                <div className="stat-row" style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span className="class-meta">Class Average</span>
                                        <span className="class-name">85%</span>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div className="progress-bar-fill" style={{ width: '85%', background: 'var(--primary-color)' }}></div>
                                    </div>
                                </div>
                                <div className="stat-row">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span className="class-meta">Attendance Rate</span>
                                        <span className="class-name">92%</span>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div className="progress-bar-fill" style={{ width: '92%', background: '#22c55e' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="teacher-card">
                            <h3 className="card-title"><span>⚡</span> Quick Actions</h3>
                            <div className="action-buttons">
                                <button className="btn btn-primary" onClick={() => setActiveTab('attendance')}>Mark Attendance</button>
                                <button className="btn btn-outline">Post Announcement</button>
                                <button className="btn btn-outline">Schedule Exam</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'students' && (
                    <div className="teacher-card full-width-card">
                        <div className="card-header-flex">
                            <h3 className="card-title"><span>👥</span> Student List - {selectedClass}</h3>
                            <span className="student-count-badge">{classStudents.length} Students</span>
                        </div>
                        <div className="table-responsive">
                            <table className="teacher-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Grade</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classStudents.map(student => (
                                        <tr key={student.id}>
                                            <td><span className="student-name-main">{student.name}</span></td>
                                            <td><span className="class-meta">{student.email}</span></td>
                                            <td><span className="grade-pill">{student.grade}</span></td>
                                            <td>
                                                <span className={`status-pill ${student.status === 'Active' ? 'active' : 'inactive'}`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'attendance' && (
                    <div className="teacher-card full-width-card">
                        <div className="card-header-flex">
                            <h3 className="card-title"><span>📅</span> Daily Attendance</h3>
                            <button className="btn btn-primary btn-sm">Save Changes</button>
                        </div>
                        <div className="table-responsive">
                            <table className="teacher-table">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classStudents.map(student => (
                                        <tr key={student.id}>
                                            <td>{student.name}</td>
                                            <td className="class-meta">{student.email}</td>
                                            <td>
                                                <span className={`attendance-badge ${student.status === 'Active' ? 'present' : 'absent'}`}>
                                                    {student.status === 'Active' ? 'Present' : 'Absent'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="toggle-group">
                                                    <button className="toggle-btn present-toggle active">P</button>
                                                    <button className="toggle-btn absent-toggle">A</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'results' && (
                    <div className="teacher-card full-width-card">
                        <div className="card-header-flex">
                            <h3 className="card-title"><span>📝</span> Exam Results</h3>
                            <button className="btn btn-primary btn-sm">Upload Excel</button>
                        </div>
                        <div className="table-responsive">
                            <table className="teacher-table">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Midterm (%)</th>
                                        <th>Finals (%)</th>
                                        <th>Total Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classStudents.map(student => (
                                        <tr key={student.id}>
                                            <td>{student.name}</td>
                                            <td>{getStudentScore(student.id)}</td>
                                            <td>{getStudentScore(student.id) + 5 > 100 ? 100 : getStudentScore(student.id) + 5}</td>
                                            <td><strong className="grade-text">{student.grade}</strong></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default TeacherSection;
