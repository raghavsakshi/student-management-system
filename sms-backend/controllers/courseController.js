import Course from '../models/Course.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
    try {
        const { courseName, courseCode, teacher, students } = req.body;

        const courseExists = await Course.findOne({ courseCode });

        if (courseExists) {
            res.status(400);
            throw new Error('Course with this code already exists');
        }

        const course = await Course.create({
            courseName,
            courseCode,
            teacher,
            students
        });

        res.status(201).json(course);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({})
            .populate('teacher', 'name email')
            .populate('students', 'name email rollNumber');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Assign teacher to course
// @route   PUT /api/courses/:id/assign-teacher
// @access  Private/Admin
const assignTeacher = async (req, res) => {
    try {
        const { teacherId } = req.body;
        const course = await Course.findById(req.params.id);

        if (!course) {
            res.status(404);
            throw new Error('Course not found');
        }

        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            res.status(404);
            throw new Error('Teacher not found');
        }

        course.teacher = teacherId;
        await course.save();

        res.json({ message: 'Teacher assigned successfully', course });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

// @desc    Assign students to course
// @route   PUT /api/courses/:id/assign-students
// @access  Private/Admin
const assignStudents = async (req, res) => {
    try {
        const { studentIds } = req.body; // Array of student IDs
        const course = await Course.findById(req.params.id);

        if (!course) {
            res.status(404);
            throw new Error('Course not found');
        }

        // Optional: Verify all students exist
        // const count = await Student.countDocuments({ '_id': { $in: studentIds } });
        // if (count !== studentIds.length) { ... }

        // Add new students to existing list, avoiding duplicates
        const updatedStudents = [...new Set([...course.students.map(s => s.toString()), ...studentIds])];

        course.students = updatedStudents;
        await course.save();

        res.json({ message: 'Students assigned successfully', course });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            await course.deleteOne();
            res.json({ message: 'Course removed' });
        } else {
            res.status(404);
            throw new Error('Course not found');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

export { createCourse, getAllCourses, assignTeacher, assignStudents, deleteCourse };
