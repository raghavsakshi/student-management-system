import Teacher from '../models/Teacher.js';

// @desc    Add a new teacher
// @route   POST /api/teachers
// @access  Private/Admin
const addTeacher = async (req, res) => {
    try {
        const { name, email, subject, assignedClasses } = req.body;

        const teacherExists = await Teacher.findOne({ email });

        if (teacherExists) {
            res.status(400);
            throw new Error('Teacher with this email already exists');
        }

        const teacher = await Teacher.create({
            name,
            email,
            subject,
            assignedClasses
        });

        res.status(201).json(teacher);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private
const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find({});
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update teacher
// @route   PUT /api/teachers/:id
// @access  Private/Admin
const updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);

        if (teacher) {
            teacher.name = req.body.name || teacher.name;
            teacher.email = req.body.email || teacher.email;
            teacher.subject = req.body.subject || teacher.subject;
            teacher.assignedClasses = req.body.assignedClasses || teacher.assignedClasses;

            const updatedTeacher = await teacher.save();
            res.json(updatedTeacher);
        } else {
            res.status(404);
            throw new Error('Teacher not found');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

// @desc    Delete teacher
// @route   DELETE /api/teachers/:id
// @access  Private/Admin
const deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);

        if (teacher) {
            await teacher.deleteOne();
            res.json({ message: 'Teacher removed' });
        } else {
            res.status(404);
            throw new Error('Teacher not found');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

export { addTeacher, getAllTeachers, updateTeacher, deleteTeacher };
