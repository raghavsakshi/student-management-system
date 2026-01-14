import { useState } from 'react';
import './GradesSection.css';

const GradesSection = ({ exams, examResults, students, onCreateExam, onAddMarks, userRole }) => {
    const [activeTab, setActiveTab] = useState('list');
    const [selectedExam, setSelectedExam] = useState(null);
    const [marksInput, setMarksInput] = useState({});
    const [newExamData, setNewExamData] = useState({
        name: '',
        course: '',
        date: '',
        maxMarks: 100,
        totalMarks: 100
    });

    const courses = [...new Set(students.map(s => s.course))];

    // Filter exams by course if needed, for demo we show all
    const sortedExams = [...exams].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Initialize marks input when an exam is selected
    const handleSelectExamForMarks = (exam) => {
        setSelectedExam(exam);
        const currentMarks = {};
        // Pre-fill existing marks if any
        examResults
            .filter(r => r.examId === exam.id)
            .forEach(r => {
                currentMarks[r.studentId] = r.marksObtained;
            });
        setMarksInput(currentMarks);
        setActiveTab('marks');
    };

    const handleMarkChange = (studentId, value) => {
        setMarksInput(prev => ({
            ...prev,
            [studentId]: value
        }));
    };

    const handleSaveMarks = () => {
        if (!selectedExam) return;

        const marksData = Object.entries(marksInput).map(([studentId, marks]) => ({
            studentId: parseInt(studentId),
            marks: parseFloat(marks)
        }));

        onAddMarks(selectedExam.id, marksData);
        alert('Marks saved successfully!');
        setActiveTab('results');
    };

    const handleCreateExamSubmit = (e) => {
        e.preventDefault();
        onCreateExam(newExamData);
        setNewExamData({
            name: '',
            course: '',
            date: '',
            maxMarks: 100,
            totalMarks: 100
        });
        alert('Exam created successfully!');
        setActiveTab('list');
    };

    const getExamStats = (examId) => {
        const results = examResults.filter(r => r.examId === examId);
        if (results.length === 0) return null;

        const marks = results.map(r => r.marksObtained);
        return {
            average: (marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(1),
            highest: Math.max(...marks),
            lowest: Math.min(...marks),
            count: marks.length
        };
    };

    return (
        <div className="grades-container">
            <div className="grades-header">
                <h2 className="grades-title">Examination & Results</h2>
                <p className="grades-subtitle">Manage exams, marks, and view results</p>
            </div>

            <div className="grades-tabs">
                <button
                    className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
                    onClick={() => setActiveTab('list')}
                >
                    📋 Exams List
                </button>
                {(userRole === 'admin' || userRole === 'teacher') && (
                    <>
                        <button
                            className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
                            onClick={() => setActiveTab('create')}
                        >
                            ➕ Create Exam
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'marks' ? 'active' : ''}`}
                            onClick={() => setActiveTab('marks')}
                            disabled={!selectedExam && activeTab !== 'marks'}
                        >
                            ✏️ Manage Marks
                        </button>
                    </>
                )}
                <button
                    className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
                    onClick={() => setActiveTab('results')}
                >
                    📊 Results Overview
                </button>
            </div>

            <div className="tab-content">
                {/* Exams List Tab */}
                {activeTab === 'list' && (
                    <div className="grades-card">
                        <div className="table-responsive">
                            <table className="attendance-table">
                                <thead>
                                    <tr>
                                        <th>Exam Name</th>
                                        <th>Course</th>
                                        <th>Date</th>
                                        <th>Max Marks</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedExams.map(exam => (
                                        <tr key={exam.id}>
                                            <td>{exam.name}</td>
                                            <td>{exam.course}</td>
                                            <td>{new Date(exam.date).toLocaleDateString()}</td>
                                            <td>{exam.maxMarks}</td>
                                            <td>
                                                <span className={`exam-status ${exam.status.toLowerCase()}`}>
                                                    {exam.status}
                                                </span>
                                            </td>
                                            <td>
                                                {(userRole === 'admin' || userRole === 'teacher') && (
                                                    <button
                                                        className="btn btn-sm btn-outline"
                                                        onClick={() => handleSelectExamForMarks(exam)}
                                                        style={{ marginRight: '0.5rem' }}
                                                    >
                                                        Marks
                                                    </button>
                                                )}
                                                <button
                                                    className="btn btn-sm btn-outline"
                                                    onClick={() => {
                                                        setSelectedExam(exam);
                                                        setActiveTab('results');
                                                    }}
                                                >
                                                    Results
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Create Exam Tab */}
                {activeTab === 'create' && (
                    <div className="grades-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <form onSubmit={handleCreateExamSubmit}>
                            <div className="form-group">
                                <label>Exam Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={newExamData.name}
                                    onChange={(e) => setNewExamData({ ...newExamData, name: e.target.value })}
                                    required
                                    placeholder="e.g. Midterm Spring 2024"
                                />
                            </div>
                            <div className="form-group">
                                <label>Course</label>
                                <select
                                    className="input"
                                    value={newExamData.course}
                                    onChange={(e) => setNewExamData({ ...newExamData, course: e.target.value })}
                                    required
                                >
                                    <option value="">Select Course</option>
                                    {courses.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={newExamData.date}
                                    onChange={(e) => setNewExamData({ ...newExamData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Maximum Marks</label>
                                <input
                                    type="number"
                                    className="input"
                                    value={newExamData.maxMarks}
                                    onChange={(e) => setNewExamData({ ...newExamData, maxMarks: parseInt(e.target.value) })}
                                    required
                                    min="10"
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">Create Exam</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Manage Marks Tab */}
                {activeTab === 'marks' && selectedExam && (
                    <div className="grades-card">
                        <div className="grades-header">
                            <h3>Entering marks for: {selectedExam.name} ({selectedExam.course})</h3>
                            <p>Max Marks: {selectedExam.maxMarks}</p>
                        </div>

                        <div className="table-responsive">
                            <table className="attendance-table">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Marks Obtained</th>
                                        <th>Percentage</th>
                                        <th>Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students
                                        .filter(s => s.course === selectedExam.course)
                                        .map(student => {
                                            const marks = marksInput[student.id] || '';
                                            const percentage = marks ? ((marks / selectedExam.maxMarks) * 100).toFixed(1) : '-';
                                            let grade = '-';
                                            if (marks) {
                                                if (percentage >= 90) grade = 'A+';
                                                else if (percentage >= 80) grade = 'A';
                                                else if (percentage >= 70) grade = 'B+';
                                                else if (percentage >= 60) grade = 'B';
                                                else if (percentage >= 50) grade = 'C';
                                                else if (percentage >= 40) grade = 'D';
                                                else grade = 'F';
                                            }

                                            return (
                                                <tr key={student.id}>
                                                    <td>{student.name}</td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="marks-input"
                                                            value={marks}
                                                            onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                                            max={selectedExam.maxMarks}
                                                            min="0"
                                                        />
                                                    </td>
                                                    <td>{percentage}%</td>
                                                    <td>
                                                        <span className={`grade-badge ${grade.toLowerCase().replace('+', '-plus')}`}>
                                                            {grade}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                        <div className="form-actions">
                            <button className="btn btn-secondary" onClick={() => setActiveTab('list')}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSaveMarks}>Save Marks</button>
                        </div>
                    </div>
                )}

                {/* Results Overview Tab */}
                {activeTab === 'results' && (
                    <div className="grades-card">
                        <div className="grades-controls">
                            <div className="control-group">
                                <label>Select Exam:</label>
                                <select
                                    className="input"
                                    onChange={(e) => {
                                        const exam = exams.find(ex => ex.id === parseInt(e.target.value));
                                        setSelectedExam(exam);
                                    }}
                                    value={selectedExam?.id || ''}
                                >
                                    <option value="">Select an exam...</option>
                                    {sortedExams.map(exam => (
                                        <option key={exam.id} value={exam.id}>
                                            {exam.name} - {exam.course}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {selectedExam && getExamStats(selectedExam.id) && (
                            <>
                                <div className="stats-grid">
                                    <div className="stat-box">
                                        <h3>Class Average</h3>
                                        <div className="value">{getExamStats(selectedExam.id).average}</div>
                                    </div>
                                    <div className="stat-box">
                                        <h3>Highest Score</h3>
                                        <div className="value">{getExamStats(selectedExam.id).highest}</div>
                                    </div>
                                    <div className="stat-box">
                                        <h3>Lowest Score</h3>
                                        <div className="value">{getExamStats(selectedExam.id).lowest}</div>
                                    </div>
                                    <div className="stat-box">
                                        <h3>Students Graded</h3>
                                        <div className="value">{getExamStats(selectedExam.id).count}</div>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table className="attendance-table">
                                        <thead>
                                            <tr>
                                                <th>Student Name</th>
                                                <th>Marks</th>
                                                <th>Percentage</th>
                                                <th>Grade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {examResults
                                                .filter(r => r.examId === selectedExam.id)
                                                .sort((a, b) => b.marksObtained - a.marksObtained)
                                                .map(result => (
                                                    <tr key={result.id}>
                                                        <td>{result.studentName}</td>
                                                        <td>{result.marksObtained} / {result.maxMarks}</td>
                                                        <td>{result.percentage}%</td>
                                                        <td>
                                                            <span className={`grade-badge ${result.grade.toLowerCase().replace('+', '-plus')}`}>
                                                                {result.grade}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                        {selectedExam && !getExamStats(selectedExam.id) && (
                            <div className="empty-state">
                                <p>No results found for this exam yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div >
    );
};

export default GradesSection;
