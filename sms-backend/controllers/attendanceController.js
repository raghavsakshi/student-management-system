import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private/Teacher/Admin
const markAttendance = async (req, res) => {
    try {
        const { studentId, courseId, date, status } = req.body;

        const attendanceExists = await Attendance.findOne({
            student: studentId,
            course: courseId,
            date: new Date(date)
        });

        if (attendanceExists) {
            // Update existing record
            attendanceExists.status = status;
            const updatedAttendance = await attendanceExists.save();
            return res.json(updatedAttendance);
        }

        const attendance = await Attendance.create({
            student: studentId,
            course: courseId,
            date: new Date(date),
            status
        });

        res.status(201).json(attendance);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res) => {
    try {
        const { studentId, courseId, startDate, endDate } = req.query;
        let query = {};

        // If student is requesting, force their own ID
        if (req.user.role === 'student') {
            // Assuming the Student model is linked to User via email or another field.
            // For simplicity here, we assume the req.user is the student User object,
            // but we might need to find the specific Student document if IDs differ.
            // Let's assume User.email matches Student.email for linkage.
            const studentProfile = await Student.findOne({ email: req.user.email });
            if (studentProfile) {
                query.student = studentProfile._id;
            } else {
                return res.status(404).json({ message: 'Student profile not found' });
            }
        } else if (studentId) {
            query.student = studentId;
        }

        if (courseId) query.course = courseId;
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const attendance = await Attendance.find(query)
            .populate('student', 'name rollNumber')
            .populate('course', 'courseName courseCode')
            .sort({ date: -1 });

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get monthly attendance report
// @route   GET /api/attendance/report
// @access  Private/Admin/Teacher
const getMonthlyAttendanceReport = async (req, res) => {
    try {
        const { month, year, courseId } = req.query; // month is 1-12

        if (!month || !year || !courseId) {
            return res.status(400).json({ message: 'Please provide month, year, and courseId' });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // Last day of month

        const report = await Attendance.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$student',
                    presentCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] }
                    },
                    absentCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] }
                    },
                    totalClasses: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'students',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'studentInfo'
                }
            },
            {
                $unwind: '$studentInfo'
            },
            {
                $project: {
                    _id: 1,
                    studentName: '$studentInfo.name',
                    presentCount: 1,
                    absentCount: 1,
                    totalClasses: 1,
                    percentage: { $multiply: [{ $divide: ['$presentCount', '$totalClasses'] }, 100] }
                }
            }
        ]);

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { markAttendance, getAttendance, getMonthlyAttendanceReport };
