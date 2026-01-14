import { useState } from 'react';
import './AttendanceSection.css';

const AttendanceSection = ({ students, attendanceRecords, onMarkAttendance, onBulkMarkAttendance }) => {
    const [activeTab, setActiveTab] = useState('mark');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedCourse, setSelectedCourse] = useState('All');
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [attendanceState, setAttendanceState] = useState({});

    const courses = ['All', ...new Set(students.map(s => s.course))];

    // Get filtered students based on selected course
    const getFilteredStudents = () => {
        return selectedCourse === 'All'
            ? students
            : students.filter(s => s.course === selectedCourse);
    };

    // Initialize attendance state for marking
    const initializeAttendanceState = () => {
        const state = {};
        getFilteredStudents().forEach(student => {
            const existing = attendanceRecords.find(
                r => r.studentId === student.id && r.date === selectedDate
            );
            state[student.id] = existing?.status || 'Present';
        });
        setAttendanceState(state);
    };

    // Handle individual attendance toggle
    const handleToggleAttendance = (studentId, status) => {
        setAttendanceState(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    // Handle bulk mark all
    const handleMarkAll = (status) => {
        const newState = {};
        getFilteredStudents().forEach(student => {
            newState[student.id] = status;
        });
        setAttendanceState(newState);
    };

    // Save attendance
    const handleSaveAttendance = () => {
        const attendanceList = Object.entries(attendanceState).map(([studentId, status]) => ({
            studentId: parseInt(studentId),
            date: selectedDate,
            status,
            course: students.find(s => s.id === parseInt(studentId))?.course
        }));
        onBulkMarkAttendance(attendanceList);
        alert('Attendance saved successfully!');
    };

    // Get attendance for a specific date
    const getDailyAttendance = () => {
        const filtered = getFilteredStudents();
        return filtered.map(student => {
            const record = attendanceRecords.find(
                r => r.studentId === student.id && r.date === selectedDate
            );
            return {
                ...student,
                status: record?.status || 'Not Marked'
            };
        });
    };

    // Calculate daily summary
    const getDailySummary = () => {
        const daily = getDailyAttendance();
        const present = daily.filter(d => d.status === 'Present').length;
        const absent = daily.filter(d => d.status === 'Absent').length;
        const late = daily.filter(d => d.status === 'Late').length;
        const total = daily.length;
        return { present, absent, late, total, percentage: total > 0 ? ((present + late) / total * 100).toFixed(1) : 0 };
    };

    // Calculate monthly report
    const getMonthlyReport = () => {
        const filtered = getFilteredStudents();
        const [year, month] = selectedMonth.split('-');

        return filtered.map(student => {
            const studentRecords = attendanceRecords.filter(r =>
                r.studentId === student.id &&
                r.date.startsWith(selectedMonth)
            );

            const present = studentRecords.filter(r => r.status === 'Present').length;
            const late = studentRecords.filter(r => r.status === 'Late').length;
            const absent = studentRecords.filter(r => r.status === 'Absent').length;
            const total = studentRecords.length;
            const percentage = total > 0 ? ((present + late) / total * 100).toFixed(1) : 0;

            return {
                ...student,
                present,
                late,
                absent,
                total,
                percentage
            };
        });
    };

    // Get attendance history
    const getAttendanceHistory = () => {
        return attendanceRecords.filter(r => {
            const inDateRange = r.date >= dateRange.start && r.date <= dateRange.end;
            const inCourse = selectedCourse === 'All' || r.course === selectedCourse;
            return inDateRange && inCourse;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    return (
        <div className="attendance-container">
            <div className="attendance-header">
                <h2 className="attendance-title">Attendance Management</h2>
                <p className="attendance-subtitle">Mark and track student attendance</p>
            </div>

            <div className="attendance-tabs">
                <button
                    className={`tab-btn ${activeTab === 'mark' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('mark'); initializeAttendanceState(); }}
                >
                    <span>✏️</span> Mark Attendance
                </button>
                <button
                    className={`tab-btn ${activeTab === 'daily' ? 'active' : ''}`}
                    onClick={() => setActiveTab('daily')}
                >
                    <span>📅</span> Daily View
                </button>
                <button
                    className={`tab-btn ${activeTab === 'monthly' ? 'active' : ''}`}
                    onClick={() => setActiveTab('monthly')}
                >
                    <span>📊</span> Monthly Report
                </button>
                <button
                    className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    <span>📜</span> History
                </button>
            </div>

            <div className="tab-content">
                {/* Mark Attendance Tab */}
                {activeTab === 'mark' && (
                    <div className="attendance-card">
                        <div className="attendance-controls">
                            <div className="control-group">
                                <label>Date:</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="input"
                                />
                            </div>
                            <div className="control-group">
                                <label>Course:</label>
                                <select
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    className="input"
                                >
                                    {courses.map(course => (
                                        <option key={course} value={course}>{course}</option>
                                    ))}
                                </select>
                            </div>
                            <button className="btn btn-outline btn-sm" onClick={() => handleMarkAll('Present')}>
                                ✓ Mark All Present
                            </button>
                            <button className="btn btn-outline btn-sm" onClick={() => handleMarkAll('Absent')}>
                                ✗ Mark All Absent
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table className="attendance-table">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Course</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getFilteredStudents().map(student => (
                                        <tr key={student.id}>
                                            <td>{student.name}</td>
                                            <td>{student.course}</td>
                                            <td>
                                                <div className="status-toggle">
                                                    <button
                                                        className={`status-btn ${attendanceState[student.id] === 'Present' ? 'active present' : ''}`}
                                                        onClick={() => handleToggleAttendance(student.id, 'Present')}
                                                    >
                                                        Present
                                                    </button>
                                                    <button
                                                        className={`status-btn ${attendanceState[student.id] === 'Late' ? 'active late' : ''}`}
                                                        onClick={() => handleToggleAttendance(student.id, 'Late')}
                                                    >
                                                        Late
                                                    </button>
                                                    <button
                                                        className={`status-btn ${attendanceState[student.id] === 'Absent' ? 'active absent' : ''}`}
                                                        onClick={() => handleToggleAttendance(student.id, 'Absent')}
                                                    >
                                                        Absent
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="attendance-actions">
                            <button className="btn btn-primary" onClick={handleSaveAttendance}>
                                💾 Save Attendance
                            </button>
                        </div>
                    </div>
                )}

                {/* Daily View Tab */}
                {activeTab === 'daily' && (
                    <div className="attendance-card">
                        <div className="attendance-controls">
                            <div className="control-group">
                                <label>Date:</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="input"
                                />
                            </div>
                            <div className="control-group">
                                <label>Course:</label>
                                <select
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    className="input"
                                >
                                    {courses.map(course => (
                                        <option key={course} value={course}>{course}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="summary-cards">
                            <div className="summary-card present">
                                <div className="summary-value">{getDailySummary().present}</div>
                                <div className="summary-label">Present</div>
                            </div>
                            <div className="summary-card absent">
                                <div className="summary-value">{getDailySummary().absent}</div>
                                <div className="summary-label">Absent</div>
                            </div>
                            <div className="summary-card late">
                                <div className="summary-value">{getDailySummary().late}</div>
                                <div className="summary-label">Late</div>
                            </div>
                            <div className="summary-card percentage">
                                <div className="summary-value">{getDailySummary().percentage}%</div>
                                <div className="summary-label">Attendance Rate</div>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="attendance-table">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Course</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getDailyAttendance().map(student => (
                                        <tr key={student.id}>
                                            <td>{student.name}</td>
                                            <td>{student.course}</td>
                                            <td>
                                                <span className={`status-badge ${student.status.toLowerCase()}`}>
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

                {/* Monthly Report Tab */}
                {activeTab === 'monthly' && (
                    <div className="attendance-card">
                        <div className="attendance-controls">
                            <div className="control-group">
                                <label>Month:</label>
                                <input
                                    type="month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="input"
                                />
                            </div>
                            <div className="control-group">
                                <label>Course:</label>
                                <select
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    className="input"
                                >
                                    {courses.map(course => (
                                        <option key={course} value={course}>{course}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="attendance-table">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Course</th>
                                        <th>Present</th>
                                        <th>Late</th>
                                        <th>Absent</th>
                                        <th>Total Days</th>
                                        <th>Attendance %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getMonthlyReport().map(student => (
                                        <tr key={student.id}>
                                            <td>{student.name}</td>
                                            <td>{student.course}</td>
                                            <td className="text-center">{student.present}</td>
                                            <td className="text-center">{student.late}</td>
                                            <td className="text-center">{student.absent}</td>
                                            <td className="text-center">{student.total}</td>
                                            <td>
                                                <span className={`percentage-badge ${student.percentage >= 75 ? 'good' : student.percentage >= 50 ? 'warning' : 'poor'}`}>
                                                    {student.percentage}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                    <div className="attendance-card">
                        <div className="attendance-controls">
                            <div className="control-group">
                                <label>From:</label>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <div className="control-group">
                                <label>To:</label>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <div className="control-group">
                                <label>Course:</label>
                                <select
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    className="input"
                                >
                                    {courses.map(course => (
                                        <option key={course} value={course}>{course}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="attendance-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Student Name</th>
                                        <th>Course</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getAttendanceHistory().map(record => (
                                        <tr key={record.id}>
                                            <td>{new Date(record.date).toLocaleDateString()}</td>
                                            <td>{record.studentName}</td>
                                            <td>{record.course}</td>
                                            <td>
                                                <span className={`status-badge ${record.status.toLowerCase()}`}>
                                                    {record.status}
                                                </span>
                                            </td>
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

export default AttendanceSection;
