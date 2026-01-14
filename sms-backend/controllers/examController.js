import Exam from '../models/Exam.js';
import Course from '../models/Course.js';

// @desc    Create a new exam
// @route   POST /api/exams
// @access  Private/Admin/Teacher
export const createExam = async (req, res) => {
    try {
        const { examName, course, description, examDate, totalMarks } = req.body;

        // Check if course exists
        const courseExists = await Course.findById(course);
        if (!courseExists) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const exam = await Exam.create({
            examName,
            course,
            description,
            examDate,
            totalMarks
        });

        res.status(201).json(exam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
export const getAllExams = async (req, res) => {
    try {
        const exams = await Exam.find().populate('course', 'courseName courseCode');
        res.json(exams);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get exam by ID
// @route   GET /api/exams/:id
// @access  Private
export const getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id).populate('course', 'courseName courseCode');
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        res.json(exam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
