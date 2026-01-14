import Student from '../models/Student.js';

// @desc    Add a new student
// @route   POST /api/students
// @access  Private/Admin
const addStudent = async (req, res) => {
    try {
        const { name, rollNumber, email, class: studentClass, course, parentContact } = req.body;

        const studentExists = await Student.findOne({ rollNumber });

        if (studentExists) {
            res.status(400);
            throw new Error('Student with this roll number already exists');
        }

        const student = await Student.create({
            name,
            rollNumber,
            email,
            class: studentClass,
            course,
            parentContact
        });

        res.status(201).json(student);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Private
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({});
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (student) {
            student.name = req.body.name || student.name;
            student.rollNumber = req.body.rollNumber || student.rollNumber;
            student.email = req.body.email || student.email;
            student.class = req.body.class || student.class;
            student.course = req.body.course || student.course;
            student.parentContact = req.body.parentContact || student.parentContact;

            const updatedStudent = await student.save();
            res.json(updatedStudent);
        } else {
            res.status(404);
            throw new Error('Student not found');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (student) {
            await student.deleteOne();
            res.json({ message: 'Student removed' });
        } else {
            res.status(404);
            throw new Error('Student not found');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

export { addStudent, getAllStudents, updateStudent, deleteStudent };
