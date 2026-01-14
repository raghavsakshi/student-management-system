import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import StudentTable from './components/StudentTable';
import AddStudentModal from './components/AddStudentModal';
import LoginPage from './components/LoginPage';
import ForgotPassword from './components/ForgotPassword';
import AdminSection from './components/AdminSection';
import TeacherSection from './components/TeacherSection';
import StudentSection from './components/StudentSection';
import StudentProfileModal from './components/StudentProfileModal';
import TeacherTable from './components/TeacherTable';
import AddTeacherModal from './components/AddTeacherModal';
import TeacherProfileModal from './components/TeacherProfileModal';
import CourseTable from './components/CourseTable';
import AddCourseModal from './components/AddCourseModal';
import CourseProfileModal from './components/CourseProfileModal';
import AttendanceSection from './components/AttendanceSection';
import GradesSection from './components/GradesSection';
import FeesSection from './components/FeesSection';
import ProfileSection from './components/ProfileSection';
import SignupPage from './components/SignupPage';
import './App.css';

// Mock data
const initialStudents = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', course: 'Computer Science', class: '10-A', grade: 'A', status: 'Active', phone: '+1234567890', address: '123 Tech Lane, Silicon Valley', photo: null },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', course: 'Business Administration', class: '12-B', grade: 'A+', status: 'Active', phone: '+1987654321', address: '456 Commerce St, New York', photo: null },
  { id: 3, name: 'Mike Johnson', email: 'mike.j@example.com', course: 'Engineering', class: '11-C', grade: 'B+', status: 'Active', phone: '+1122334455', address: '789 Engine Dr, Detroit', photo: null },
  { id: 4, name: 'Sarah Williams', email: 'sarah.w@example.com', course: 'Mathematics', class: '10-B', grade: 'A', status: 'Inactive', phone: '+1555666777', address: '321 Matrix Ave, Boston', photo: null },
  { id: 5, name: 'David Brown', email: 'david.b@example.com', course: 'Physics', class: '12-A', grade: 'B', status: 'Active', phone: '+1444333222', address: '654 Quantum Rd, Chicago', photo: null },
];

const initialTeachers = [
  { id: 1, name: 'Dr. Robert Carter', email: 'robert.carter@example.com', department: 'Computer Science', subjects: ['Computer Science', 'Engineering'], phone: '+1002233445', photo: null },
  { id: 2, name: 'Prof. Sarah Miller', email: 'sarah.miller@example.com', department: 'Mathematics', subjects: ['Mathematics'], phone: '+1005566778', photo: null },
  { id: 3, name: 'Dr. James Wilson', email: 'james.wilson@example.com', department: 'Engineering', subjects: ['Engineering'], phone: '+1009988776', photo: null },
  { id: 4, name: 'Prof. Elena Martinez', email: 'elena.martinez@example.com', department: 'Business Administration', subjects: ['Business Administration'], phone: '+1001122334', photo: null },
  { id: 5, name: 'Dr. Michael Taylor', email: 'michael.taylor@example.com', department: 'Physics', subjects: ['Physics'], phone: '+1004455667', photo: null },
];

const initialCourses = [
  { id: 1, name: 'Computer Science', code: 'CS101', department: 'Computer Science', credits: 4, description: 'Introduction to Computer Science', assignedTeacher: 1, subjects: ['Programming', 'Algorithms', 'Data Structures'], status: 'Active' },
  { id: 2, name: 'Business Administration', code: 'BA201', department: 'Business', credits: 3, description: 'Fundamentals of Business Management', assignedTeacher: 4, subjects: ['Management', 'Economics', 'Marketing'], status: 'Active' },
  { id: 3, name: 'Engineering', code: 'ENG301', department: 'Engineering', credits: 4, description: 'Core Engineering Principles', assignedTeacher: 3, subjects: ['Mechanics', 'Thermodynamics', 'Design'], status: 'Active' },
  { id: 4, name: 'Mathematics', code: 'MATH101', department: 'Mathematics', credits: 3, description: 'Advanced Mathematics', assignedTeacher: 2, subjects: ['Calculus', 'Algebra', 'Statistics'], status: 'Active' },
  { id: 5, name: 'Physics', code: 'PHY201', department: 'Physics', credits: 4, description: 'General Physics', assignedTeacher: 5, subjects: ['Mechanics', 'Optics', 'Quantum Physics'], status: 'Active' },
];

// Generate mock attendance data for past 30 days
const generateAttendanceData = () => {
  const records = [];
  let recordId = 1;
  const today = new Date();

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    const dateStr = date.toISOString().split('T')[0];

    initialStudents.forEach(student => {
      // Random attendance with 85% present rate
      const statuses = ['Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Absent', 'Late'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      records.push({
        id: recordId++,
        studentId: student.id,
        studentName: student.name,
        course: student.course,
        date: dateStr,
        status: status,
        markedBy: 1, // Dr. Robert Carter
        markedAt: new Date(date.getTime() + Math.random() * 3600000).toISOString()
      });
    });
  }

  return records;
};

const initialAttendanceRecords = generateAttendanceData();

// Mock Exam Data
const initialExams = [
  { id: 1, name: 'Midterm Exam', course: 'Computer Science', date: '2023-10-15', maxMarks: 100, totalMarks: 100, status: 'Completed', createdBy: 1 },
  { id: 2, name: 'Final Exam', course: 'Computer Science', date: '2023-12-10', maxMarks: 100, totalMarks: 100, status: 'Upcoming', createdBy: 1 },
  { id: 3, name: 'Midterm Exam', course: 'Mathematics', date: '2023-10-20', maxMarks: 50, totalMarks: 50, status: 'Completed', createdBy: 2 },
  { id: 4, name: 'Project Presentation', course: 'Business Administration', date: '2023-11-05', maxMarks: 50, totalMarks: 50, status: 'Completed', createdBy: 4 },
];

// Generate mock results
const generateInitialResults = () => {
  const results = [];
  let resultId = 1;
  const completedExams = initialExams.filter(e => e.status === 'Completed');

  completedExams.forEach(exam => {
    // Find students in this course
    const courseStudents = initialStudents.filter(s => s.course === exam.course);

    courseStudents.forEach(student => {
      // Random marks
      const marks = Math.floor(Math.random() * (exam.maxMarks - 40) + 40);
      const percentage = ((marks / exam.maxMarks) * 100).toFixed(1);

      let grade = 'F';
      if (percentage >= 90) grade = 'A+';
      else if (percentage >= 80) grade = 'A';
      else if (percentage >= 70) grade = 'B+';
      else if (percentage >= 60) grade = 'B';
      else if (percentage >= 50) grade = 'C';
      else if (percentage >= 40) grade = 'D';

      results.push({
        id: resultId++,
        examId: exam.id,
        examName: exam.name,
        studentId: student.id,
        studentName: student.name,
        course: student.course,
        marksObtained: marks,
        maxMarks: exam.maxMarks,
        percentage: parseFloat(percentage),
        grade: grade,
        date: exam.date
      });
    });
  });
  return results;
};

const initialExamResults = generateInitialResults();

// Mock Fees Data
const initialFeeStructures = [
  { id: 1, course: 'Computer Science', year: '2024', amount: 12000, title: 'Annual Tuition 2024', dueDate: '2024-01-31' },
  { id: 2, course: 'Mathematics', year: '2024', amount: 10000, title: 'Annual Tuition 2024', dueDate: '2024-01-31' },
  { id: 3, course: 'Business Administration', year: '2024', amount: 11000, title: 'Annual Tuition 2024', dueDate: '2024-01-31' },
  { id: 4, course: 'Art History', year: '2024', amount: 9000, title: 'Annual Tuition 2024', dueDate: '2024-01-31' },
];

const initialFeePayments = [
  { id: 1, studentId: 1, amount: 4000, date: '2023-08-10', type: 'Tuition', paymentMethod: 'Card', transactionId: 'TXN-98102', status: 'Completed', description: 'Semester 1 Partial' },
  { id: 2, studentId: 1, amount: 4000, date: '2023-09-05', type: 'Tuition', paymentMethod: 'Card', transactionId: 'TXN-98216', status: 'Completed', description: 'Semester 1 Final' },
  { id: 3, studentId: 2, amount: 5000, date: '2023-08-15', type: 'Tuition', paymentMethod: 'Online', transactionId: 'TXN-98155', status: 'Completed', description: 'Full Payment' },
];


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [activePage, setActivePage] = useState('dashboard');

  // Helper to load from localStorage
  const loadState = (key, initial) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  };

  const [students, setStudents] = useState(() => loadState('students', []));
  const [filteredStudents, setFilteredStudents] = useState(() => loadState('students', []));
  const [teachers, setTeachers] = useState(() => loadState('teachers', []));
  const [filteredTeachers, setFilteredTeachers] = useState(() => loadState('teachers', []));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('userRole') || 'admin';
  });
  const [viewingStudent, setViewingStudent] = useState(null);
  const [viewingTeacher, setViewingTeacher] = useState(null);

  const [courses, setCourses] = useState(() => loadState('courses', []));
  const [filteredCourses, setFilteredCourses] = useState(() => loadState('courses', []));

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [viewingCourse, setViewingCourse] = useState(null);

  const [attendanceRecords, setAttendanceRecords] = useState(() => loadState('attendanceRecords', []));
  const [exams, setExams] = useState(() => loadState('exams', []));
  const [examResults, setExamResults] = useState(() => loadState('examResults', []));
  const [feeStructures, setFeeStructures] = useState(() => loadState('feeStructures', []));
  const [feePayments, setFeePayments] = useState(() => loadState('feePayments', []));

  const navigate = useNavigate();
  const location = useLocation();

  // Persist state changes
  useEffect(() => { localStorage.setItem('students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('teachers', JSON.stringify(teachers)); }, [teachers]);
  useEffect(() => { localStorage.setItem('courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords)); }, [attendanceRecords]);
  useEffect(() => { localStorage.setItem('exams', JSON.stringify(exams)); }, [exams]);
  useEffect(() => { localStorage.setItem('examResults', JSON.stringify(examResults)); }, [examResults]);
  useEffect(() => { localStorage.setItem('feeStructures', JSON.stringify(feeStructures)); }, [feeStructures]);
  useEffect(() => { localStorage.setItem('feePayments', JSON.stringify(feePayments)); }, [feePayments]);

  // Persist Auth State
  useEffect(() => { localStorage.setItem('isAuthenticated', isAuthenticated); }, [isAuthenticated]);
  useEffect(() => { localStorage.setItem('currentUser', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('userRole', userRole); }, [userRole]);

  // Handle Login
  // Handle Login
  // Handle Login
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    console.log('Logged in as:', userData.email, 'Role:', userData.role);

    // Strict Role Handling
    if (userData.role === 'student') {
      const studentUser = students.find(s => s.email.toLowerCase() === userData.email.toLowerCase());
      if (studentUser) {
        setCurrentUser({ ...studentUser, role: 'Student' });
        setUserRole('student');
      } else {
        // Create new student
        const newStudent = {
          id: Math.max(...students.map(s => s.id), 0) + 1,
          name: userData.name || userData.email.split('@')[0],
          email: userData.email,
          course: 'Not Assigned',
          class: 'N/A',
          grade: 'N/A',
          status: 'Active',
          phone: 'N/A',
          address: 'N/A',
          photo: null
        };
        setStudents([...students, newStudent]);
        setFilteredStudents([...students, newStudent]);
        setCurrentUser({ ...newStudent, role: 'Student' });
        setUserRole('student');
      }
    } else if (userData.role === 'teacher') {
      const teacherUser = teachers.find(t => t.email.toLowerCase() === userData.email.toLowerCase());
      if (teacherUser) {
        setCurrentUser({ ...teacherUser, role: 'Teacher' });
        setUserRole('teacher');
      } else {
        // Create new teacher
        const newTeacher = {
          id: Math.max(...teachers.map(t => t.id), 0) + 1,
          name: userData.name || userData.email.split('@')[0],
          email: userData.email,
          department: 'General',
          subjects: [],
          phone: 'N/A',
          photo: null
        };
        setTeachers([...teachers, newTeacher]);
        setFilteredTeachers([...teachers, newTeacher]);
        setCurrentUser({ ...newTeacher, role: 'Teacher' });
        setUserRole('teacher');
      }
    } else {
      // Default / Admin
      setCurrentUser({
        name: userData.name || 'Admin User',
        role: userData.role || 'Administrator',
        email: userData.email,
        ...userData
      });
      setUserRole(userData.role || 'admin');
    }

    navigate('/dashboard');
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Statistics
  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === 'Active').length,
    avgGrade: 'A-',
    courses: [...new Set(students.map(s => s.course))].length,
    totalTeachers: initialTeachers.length,
  };

  // Course data for overview
  const courseOverviewData = [...new Set(students.map(s => s.course))].map(courseName => {
    const studentCount = students.filter(s => s.course === courseName).length;
    const dept = students.find(s => s.course === courseName)?.course; // Simplified
    return {
      name: courseName,
      department: dept,
      students: studentCount
    };
  });

  // Search functionality
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);

    const filteredT = teachers.filter(teacher =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTeachers(filteredT);
  };

  // Add or update student
  const handleAddOrUpdateStudent = (studentData) => {
    if (editingStudent) {
      // Update existing student
      const updated = students.map(s =>
        s.id === editingStudent.id ? { ...studentData, id: s.id } : s
      );
      setStudents(updated);
      setFilteredStudents(updated);
    } else {
      // Add new student
      const newStudent = {
        ...studentData,
        id: Math.max(...students.map(s => s.id), 0) + 1,
      };
      const updated = [...students, newStudent];
      setStudents(updated);
      setFilteredStudents(updated);
    }
    setEditingStudent(null);
  };

  // Add or update teacher
  const handleAddOrUpdateTeacher = (teacherData) => {
    if (editingTeacher) {
      const updated = teachers.map(t =>
        t.id === editingTeacher.id ? { ...teacherData, id: t.id } : t
      );
      setTeachers(updated);
      setFilteredTeachers(updated);
    } else {
      const newTeacher = {
        ...teacherData,
        id: Math.max(...teachers.map(t => t.id), 0) + 1,
      };
      const updated = [...teachers, newTeacher];
      setTeachers(updated);
      setFilteredTeachers(updated);
    }
    setEditingTeacher(null);
  };

  // Delete teacher
  const handleDeleteTeacher = (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      const updated = teachers.filter(t => t.id !== id);
      setTeachers(updated);
      setFilteredTeachers(updated);
    }
  };

  // Edit teacher
  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setIsTeacherModalOpen(true);
  };

  // View teacher profile
  const handleViewTeacher = (teacher) => {
    setViewingTeacher(teacher);
  };

  // Open modal for adding new teacher
  const handleOpenAddTeacherModal = () => {
    setEditingTeacher(null);
    setIsTeacherModalOpen(true);
  };


  // Open modal for adding new student
  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  // Delete student
  const handleDeleteStudent = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const updated = students.filter(s => s.id !== id);
      setStudents(updated);
      setFilteredStudents(updated);
    }
  };

  // Edit student
  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };


  // View student profile
  const handleViewStudent = (student) => {
    setViewingStudent(student);
  };

  // Course handlers
  const handleAddOrUpdateCourse = (courseData) => {
    if (editingCourse) {
      const updated = courses.map(c =>
        c.id === editingCourse.id ? { ...courseData, id: c.id } : c
      );
      setCourses(updated);
      setFilteredCourses(updated);
    } else {
      const newCourse = {
        ...courseData,
        id: Math.max(...courses.map(c => c.id), 0) + 1,
      };
      const updated = [...courses, newCourse];
      setCourses(updated);
      setFilteredCourses(updated);
    }
    setEditingCourse(null);
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      const updated = courses.filter(c => c.id !== id);
      setCourses(updated);
      setFilteredCourses(updated);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleViewCourse = (course) => {
    setViewingCourse(course);
  };

  const handleOpenAddCourseModal = () => {
    setEditingCourse(null);
    setIsCourseModalOpen(true);
  };

  // Attendance handlers
  const handleMarkAttendance = (attendanceData) => {
    // attendanceData: { studentId, date, status, course }
    const existing = attendanceRecords.find(
      r => r.studentId === attendanceData.studentId && r.date === attendanceData.date
    );

    if (existing) {
      // Update existing record
      const updated = attendanceRecords.map(r =>
        r.studentId === attendanceData.studentId && r.date === attendanceData.date
          ? { ...r, status: attendanceData.status, markedAt: new Date().toISOString() }
          : r
      );
      setAttendanceRecords(updated);
    } else {
      // Create new record
      const student = students.find(s => s.id === attendanceData.studentId);
      const newRecord = {
        id: Math.max(...attendanceRecords.map(r => r.id), 0) + 1,
        studentId: attendanceData.studentId,
        studentName: student?.name || '',
        course: attendanceData.course || student?.course || '',
        date: attendanceData.date,
        status: attendanceData.status,
        markedBy: teachers[0]?.id || 1,
        markedAt: new Date().toISOString()
      };
      setAttendanceRecords([...attendanceRecords, newRecord]);
    }
  };

  const handleBulkMarkAttendance = (attendanceList) => {
    // attendanceList: Array of { studentId, date, status, course }
    const newRecords = [];
    const updatedRecords = [...attendanceRecords];

    attendanceList.forEach(attendanceData => {
      const existingIndex = updatedRecords.findIndex(
        r => r.studentId === attendanceData.studentId && r.date === attendanceData.date
      );

      if (existingIndex !== -1) {
        updatedRecords[existingIndex] = {
          ...updatedRecords[existingIndex],
          status: attendanceData.status,
          markedAt: new Date().toISOString()
        };
      } else {
        const student = students.find(s => s.id === attendanceData.studentId);
        newRecords.push({
          id: Math.max(...updatedRecords.map(r => r.id), ...newRecords.map(r => r.id), 0) + newRecords.length + 1,
          studentId: attendanceData.studentId,
          studentName: student?.name || '',
          course: attendanceData.course || student?.course || '',
          date: attendanceData.date,
          status: attendanceData.status,
          markedBy: teachers[0]?.id || 1,
          markedAt: new Date().toISOString()
        });
      }
    });

    setAttendanceRecords([...updatedRecords, ...newRecords]);
  };

  // Exam Handlers
  const handleCreateExam = (examData) => {
    const newExam = {
      ...examData,
      id: Math.max(...exams.map(e => e.id), 0) + 1,
      status: new Date(examData.date) < new Date() ? 'Completed' : 'Upcoming',
      createdBy: teachers[0]?.id || 1
    };
    setExams([...exams, newExam]);
  };

  const calculateGrade = (marks, maxMarks) => {
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  const handleAddMarks = (examId, studentMarks) => {
    // studentMarks: [{ studentId, marks }]
    const exam = exams.find(e => e.id === examId);
    // If exam status is not completed, mark it as completed since we are adding marks
    if (exam.status !== 'Completed') {
      const updatedExams = exams.map(e => e.id === examId ? { ...e, status: 'Completed' } : e);
      setExams(updatedExams);
    }

    const newResults = [...examResults];

    studentMarks.forEach(mk => {
      const existingIndex = newResults.findIndex(r => r.examId === examId && r.studentId === mk.studentId);
      const student = students.find(s => s.id === mk.studentId);

      const resultData = {
        examId,
        examName: exam.name,
        studentId: mk.studentId,
        studentName: student.name,
        course: student.course,
        marksObtained: mk.marks,
        maxMarks: exam.maxMarks,
        percentage: parseFloat(((mk.marks / exam.maxMarks) * 100).toFixed(1)),
        grade: calculateGrade(mk.marks, exam.maxMarks),
        date: exam.date
      };

      if (existingIndex >= 0) {
        newResults[existingIndex] = { ...newResults[existingIndex], ...resultData };
      } else {
        newResults.push({
          id: Math.max(...newResults.map(r => r.id), ...newResults.slice(newResults.length).map(r => r.id), 0) + newResults.length + 1,
          ...resultData
        });
      }
    });
    setExamResults(newResults);
  };

  // Fees Handlers
  const handleAddFeeStructure = (structureData) => {
    const newStructure = {
      ...structureData,
      id: Math.max(...feeStructures.map(f => f.id), 0) + 1
    };
    setFeeStructures([...feeStructures, newStructure]);
  };

  const handleAddPayment = (paymentData) => {
    const newPayment = {
      ...paymentData,
      id: Math.max(...feePayments.map(p => p.id), 0) + 1,
      transactionId: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Completed'
    };
    setFeePayments([...feePayments, newPayment]);
  };

  // Profile Handlers
  const handleUpdateProfile = (updatedData) => {
    if (userRole === 'admin' || userRole === 'teacher') {
      const updatedTeachers = teachers.map(t =>
        t.id === (updatedData.id || teachers[0].id) ? { ...t, ...updatedData } : t
      );
      setTeachers(updatedTeachers);
    } else {
      const updatedStudents = students.map(s =>
        s.id === (updatedData.id || students[0].id) ? { ...s, ...updatedData } : s
      );
      setStudents(updatedStudents);
    }
  };

  const handleChangePassword = (passwordData) => {
    // Mock password change
    console.log('Password changed for', userRole, passwordData);
  };


  const AuthenticatedLayout = ({ children }) => (
    <div className="app">
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        <Header onSearch={handleSearch} user={currentUser} />
        <div className="content-area">
          {/* Role Switcher for Demo */}
          <div className="role-switcher" style={{
            marginBottom: '1rem',
            padding: '10px',
            background: 'var(--bg-card)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Current View:</span>
            <button
              className={`btn ${userRole === 'admin' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setUserRole('admin')}
              style={{ padding: '4px 12px', fontSize: '0.8rem' }}
            >Admin View</button>
            <button
              className={`btn ${userRole === 'teacher' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setUserRole('teacher')}
              style={{ padding: '4px 12px', fontSize: '0.8rem' }}
            >Teacher View</button>
            <button
              className={`btn ${userRole === 'student' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setUserRole('student')}
              style={{ padding: '4px 12px', fontSize: '0.8rem' }}
            >Student View</button>
          </div>
          {children}
        </div>
      </div>

      {/* Modals moved to layout level for global access */}
      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleAddOrUpdateStudent}
        editingStudent={editingStudent}
      />
      <AddTeacherModal
        isOpen={isTeacherModalOpen}
        onClose={() => {
          setIsTeacherModalOpen(false);
          setEditingTeacher(null);
        }}
        onSubmit={handleAddOrUpdateTeacher}
        editingTeacher={editingTeacher}
      />
      <StudentProfileModal
        isOpen={!!viewingStudent}
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
      />
      <TeacherProfileModal
        isOpen={!!viewingTeacher}
        teacher={viewingTeacher}
        onClose={() => setViewingTeacher(null)}
      />
      <AddCourseModal
        isOpen={isCourseModalOpen}
        onClose={() => {
          setIsCourseModalOpen(false);
          setEditingCourse(null);
        }}
        onSubmit={handleAddOrUpdateCourse}
        editingCourse={editingCourse}
        teachers={teachers}
      />
      <CourseProfileModal
        isOpen={!!viewingCourse}
        course={viewingCourse}
        teachers={teachers}
        students={students}
        onClose={() => setViewingCourse(null)}
      />
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/dashboard" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <AuthenticatedLayout>
              {/* Statistics Section */}
              <section className="stats-section">
                <StatCard icon="👥" value={stats.totalStudents} label="Total Students" trend={{ direction: 'up', value: 12 }} color="purple" />
                <StatCard icon="✓" value={stats.activeStudents} label="Active Students" trend={{ direction: 'up', value: 8 }} color="green" />
                <StatCard icon="📚" value={stats.courses} label="Active Courses" trend={{ direction: 'up', value: 5 }} color="blue" />
                <StatCard icon="📈" value={stats.avgGrade} label="Average Grade" trend={{ direction: 'up', value: 3 }} color="orange" />
              </section>

              {userRole === 'admin' ? (
                <AdminSection totalStudents={stats.totalStudents} totalTeachers={stats.totalTeachers} courseData={courseOverviewData} />
              ) : userRole === 'teacher' ? (
                <TeacherSection teacherData={teachers[0]} studentsData={students} onEditProfile={() => handleEditTeacher(teachers[0])} />
              ) : (
                <StudentSection studentData={students[0]} examResults={examResults} feePayments={feePayments} feeStructures={feeStructures} />
              )}
            </AuthenticatedLayout>
          ) : <Navigate to="/login" />
        }
      />

      <Route
        path="/profile"
        element={
          isAuthenticated ? (
            <AuthenticatedLayout>
              <ProfileSection
                user={userRole === 'student' ? students[0] : teachers[0]}
                userRole={userRole}
                onUpdateProfile={handleUpdateProfile}
                onChangePassword={handleChangePassword}
              />
            </AuthenticatedLayout>
          ) : <Navigate to="/login" />
        }
      />

      <Route
        path="/fees"
        element={
          isAuthenticated ? (
            <AuthenticatedLayout>
              <FeesSection
                feeStructures={feeStructures}
                feePayments={feePayments}
                students={students}
                onAddPayment={handleAddPayment}
                onAddFeeStructure={handleAddFeeStructure}
              />
            </AuthenticatedLayout>
          ) : <Navigate to="/login" />
        }
      />

      <Route
        path="/students"
        element={
          isAuthenticated ? (
            <AuthenticatedLayout>
              <section className="table-section">
                <div className="section-header">
                  <div>
                    <h2 className="section-title">Students List</h2>
                    <p className="section-subtitle">Manage and view all registered students</p>
                  </div>
                  {(userRole === 'admin' || userRole === 'teacher') && (
                    <button className="btn btn-primary" onClick={handleOpenAddModal}>➕ Add Student</button>
                  )}
                </div>
                <StudentTable students={filteredStudents} onEdit={handleEditStudent} onDelete={handleDeleteStudent} onView={handleViewStudent} />
              </section>
            </AuthenticatedLayout>
          ) : <Navigate to="/login" />
        }
      />

      <Route
        path="/teachers"
        element={
          isAuthenticated ? (
            <AuthenticatedLayout>
              <section className="table-section">
                <div className="section-header">
                  <div>
                    <h2 className="section-title">Teachers List</h2>
                    <p className="section-subtitle">Manage and view all registered teachers</p>
                  </div>
                  {(userRole === 'admin' || userRole === 'teacher') && (
                    <button className="btn btn-primary" onClick={handleOpenAddTeacherModal}>➕ Add Teacher</button>
                  )}
                </div>
                <TeacherTable teachers={filteredTeachers} onEdit={handleEditTeacher} onDelete={handleDeleteTeacher} onView={handleViewTeacher} />
              </section>
            </AuthenticatedLayout>
          ) : <Navigate to="/login" />
        }
      />

      <Route
        path="/courses"
        element={
          isAuthenticated ? (
            <AuthenticatedLayout>
              <section className="table-section">
                <div className="section-header">
                  <div>
                    <h2 className="section-title">Courses List</h2>
                    <p className="section-subtitle">Manage and view all courses</p>
                  </div>
                  {(userRole === 'admin' || userRole === 'teacher') && (
                    <button className="btn btn-primary" onClick={handleOpenAddCourseModal}>➕ Add Course</button>
                  )}
                </div>
                <CourseTable courses={filteredCourses} teachers={teachers} onEdit={handleEditCourse} onDelete={handleDeleteCourse} onView={handleViewCourse} />
              </section>
            </AuthenticatedLayout>
          ) : <Navigate to="/login" />
        }
      />

      <Route
        path="/grades"
        element={
          isAuthenticated ? (
            <AuthenticatedLayout>
              <GradesSection
                exams={exams}
                examResults={examResults}
                students={students}
                onCreateExam={handleCreateExam}
                onAddMarks={handleAddMarks}
                userRole={userRole}
              />
            </AuthenticatedLayout>
          ) : <Navigate to="/login" />
        }
      />

      <Route
        path="/attendance"
        element={
          isAuthenticated ? (
            <AuthenticatedLayout>
              <AttendanceSection
                students={students}
                attendanceRecords={attendanceRecords}
                onMarkAttendance={handleMarkAttendance}
                onBulkMarkAttendance={handleBulkMarkAttendance}
              />
            </AuthenticatedLayout>
          ) : <Navigate to="/login" />
        }
      />
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default App;
