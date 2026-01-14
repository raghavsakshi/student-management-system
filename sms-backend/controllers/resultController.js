import Result from '../models/Result.js';
import Exam from '../models/Exam.js';
import Student from '../models/Student.js';

const calculateGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
};

// @desc    Add marks for a student
// @route   POST /api/results
// @access  Private/Admin/Teacher
export const addResult = async (req, res) => {
    try {
        const { exam: examId, student: studentId, marksObtained, remarks } = req.body;

        // Check if exam exists
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Check if student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if result already exists for this student and exam
        const resultExists = await Result.findOne({ exam: examId, student: studentId });
        if (resultExists) {
            return res.status(400).json({ message: 'Result already recorded for this student in this exam' });
        }

        const percentage = (marksObtained / exam.totalMarks) * 100;
        const grade = calculateGrade(percentage);

        const result = await Result.create({
            exam: examId,
            student: studentId,
            marksObtained,
            totalMarks: exam.totalMarks,
            percentage: percentage.toFixed(2),
            grade,
            remarks
        });

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get results for a specific exam
// @route   GET /api/results/exam/:examId
// @access  Private/Admin/Teacher
export const getResultsByExam = async (req, res) => {
    try {
        const results = await Result.find({ exam: req.params.examId })
            .populate('student', 'name rollNumber class')
            .populate('exam', 'examName totalMarks');
        res.json(results);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get results for the logged in student
// @route   GET /api/results/my-results
// @access  Private/Student
export const getMyResults = async (req, res) => {
    try {
        // Find the student record associated with the logged in user's email
        const student = await Student.findOne({ email: req.user.email });
        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        const results = await Result.find({ student: student._id })
            .populate('exam', 'examName examDate totalMarks');
        res.json(results);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all results (Admin management)
// @route   GET /api/results
// @access  Private/Admin
export const getAllResults = async (req, res) => {
    try {
        const results = await Result.find()
            .populate('student', 'name rollNumber class')
            .populate('exam', 'examName');
        res.json(results);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
