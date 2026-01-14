import { useState } from 'react';
import './StudentSection.css';

const StudentSection = ({ studentData, examResults, feePayments, feeStructures }) => {
    const [activeTab, setActiveTab] = useState('profile');

    // Mock data for student if not fully provided
    const student = studentData || {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        course: 'Computer Science',
        grade: 'A',
        status: 'Active',
        phone: '+1 234 567 890',
        address: '123 Academic Way, University Town',
        joinDate: 'Sept 2023',
        attendance: 94,
        fees: {
            total: 12000,
            paid: 8000,
            pending: 4000
        },
        results: [
            { subject: 'Data Structures', marks: 88, grade: 'A' },
            { subject: 'Algorithms', marks: 92, grade: 'A+' },
            { subject: 'Web Development', marks: 85, grade: 'A' },
            { subject: 'Database Systems', marks: 78, grade: 'B+' }
        ]
    };

    // Filter results for this student
    const myResults = examResults ? examResults.filter(r => r.studentId === student.id) : (student.results || []);

    // Filter fees for this student
    const myPayments = feePayments ? feePayments.filter(p => p.studentId === student.id) : [];
    const myStructure = feeStructures ? feeStructures.find(f => f.course === student.course) : null;

    const totalFee = myStructure ? myStructure.amount : (student.fees?.total || 12000);
    const totalPaid = myPayments.length > 0 ? myPayments.reduce((acc, curr) => acc + curr.amount, 0) : (student.fees?.paid || 8000);
    const pendingFee = totalFee - totalPaid;

    return (
        <div className="student-container">
            <div className="student-header-main">
                <div className="welcome-box">
                    <h2 className="student-title">Student Portal</h2>
                    <p className="student-subtitle">Access your academic records and personal profile</p>
                </div>
                <div className="student-badge">
                    <div className="badge-icon">🎓</div>
                    <div>
                        <div className="badge-name">{student.name}</div>
                        <div className="badge-role">Student ID: #STU-{student.id}</div>
                    </div>
                </div>
            </div>

            <div className="student-tabs">
                <button
                    className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <span>👤</span> Profile
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
                    <span>📝</span> Results
                </button>
                <button
                    className={`tab-btn ${activeTab === 'fees' ? 'active' : ''}`}
                    onClick={() => setActiveTab('fees')}
                >
                    <span>💰</span> Fees
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'profile' && (
                    <div className="student-grid">
                        <div className="student-card profile-info-card">
                            <h3 className="card-title"><span>👤</span> Personal Information</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Full Name</label>
                                    <div>{student.name}</div>
                                </div>
                                <div className="info-item">
                                    <label>Email Address</label>
                                    <div>{student.email}</div>
                                </div>
                                <div className="info-item">
                                    <label>Phone Number</label>
                                    <div>{student.phone || '+1 234 567 890'}</div>
                                </div>
                                <div className="info-item">
                                    <label>Home Address</label>
                                    <div>{student.address || 'University Housing, Block A'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="student-card profile-academic-card">
                            <h3 className="card-title"><span>📚</span> Academic Details</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Enrolled Course</label>
                                    <div>{student.course}</div>
                                </div>
                                <div className="info-item">
                                    <label>Enrollment Year</label>
                                    <div>{student.joinDate || '2023'}</div>
                                </div>
                                <div className="info-item">
                                    <label>Current Status</label>
                                    <div className={`status-pill ${student.status.toLowerCase()}`}>{student.status}</div>
                                </div>
                                <div className="info-item">
                                    <label>Overall Grade</label>
                                    <div className="grade-pill">{student.grade}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'attendance' && (
                    <div className="student-grid">
                        <div className="student-card chart-card">
                            <h3 className="card-title"><span>📈</span> Attendance Overview</h3>
                            <div className="attendance-large-stat">
                                <div className="stat-circle">
                                    <span className="stat-number">{student.attendance || 94}%</span>
                                    <span className="stat-label">Total Attendance</span>
                                </div>
                                <div className="stat-details">
                                    <div className="detail-row">
                                        <span>Total Classes</span>
                                        <span className="value">120</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Present</span>
                                        <span className="value green">113</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Absent</span>
                                        <span className="value red">7</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="student-card history-card">
                            <h3 className="card-title"><span>📅</span> Recent Records</h3>
                            <div className="mini-history">
                                {[
                                    { date: 'Oct 12, 2023', subject: 'Data Structures', status: 'Present' },
                                    { date: 'Oct 11, 2023', subject: 'Algorithms', status: 'Present' },
                                    { date: 'Oct 10, 2023', subject: 'Web Dev', status: 'Absent' },
                                    { date: 'Oct 09, 2023', subject: 'Databases', status: 'Present' },
                                ].map((item, i) => (
                                    <div key={i} className="history-item">
                                        <div className="date">{item.date}</div>
                                        <div className="subject">{item.subject}</div>
                                        <div className={`status ${item.status.toLowerCase()}`}>{item.status}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'results' && (
                    <div className="student-card full-width-card">
                        <div className="card-header-flex">
                            <h3 className="card-title"><span>📝</span> Semester Performance</h3>
                            <button className="btn btn-outline btn-sm">Download Marksheet</button>
                        </div>
                        <div className="table-responsive">
                            <table className="student-table">
                                <thead>
                                    <tr>
                                        <th>Subject Name</th>
                                        <th>Score</th>
                                        <th>Max Marks</th>
                                        <th>Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myResults.length > 0 ? (
                                        myResults.map((res, i) => (
                                            <tr key={i}>
                                                <td><span className="subject-name">{res.examName}</span></td>
                                                <td>{res.marksObtained} / {res.maxMarks}</td>
                                                <td>{res.maxMarks}</td>
                                                <td>
                                                    <span className={`grade-pill ${res.grade ? res.grade.toLowerCase().replace('+', '-plus') : ''}`}>
                                                        {res.grade}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No results available yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'fees' && (
                    <div className="student-grid">
                        <div className="student-card fee-summary-card">
                            <h3 className="card-title"><span>💰</span> Fee Summary</h3>
                            <div className="fee-stats">
                                <div className="fee-item total">
                                    <label>Total Fee</label>
                                    <div className="amount">${totalFee.toLocaleString()}</div>
                                </div>
                                <div className="fee-item paid">
                                    <label>Paid Amount</label>
                                    <div className="amount">${totalPaid.toLocaleString()}</div>
                                </div>
                                <div className="fee-item pending">
                                    <label>Pending Amount</label>
                                    <div className="amount" style={{ color: pendingFee > 0 ? '#dc2626' : '#166534' }}>
                                        ${pendingFee.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            {pendingFee > 0 && <button className="btn btn-primary pay-now-btn">Pay Fees Now</button>}
                        </div>

                        <div className="student-card transactions-card">
                            <h3 className="card-title"><span>📜</span> Recent Transactions</h3>
                            <div className="transaction-list">
                                {myPayments.length > 0 ? (
                                    myPayments.map((tx, i) => (
                                        <div key={i} className="tx-item">
                                            <div className="tx-meta">
                                                <span className="tx-date">{tx.date}</span>
                                                <span className="tx-id">{tx.transactionId}</span>
                                            </div>
                                            <div className="tx-amount">${tx.amount}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-data">No transactions found.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentSection;
