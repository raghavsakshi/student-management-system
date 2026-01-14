import Fee from '../models/Fee.js';
import Student from '../models/Student.js';

// @desc    Add a fee record for a student
// @route   POST /api/fees
// @access  Private/Admin
const addFeeRecord = async (req, res) => {
    try {
        const { studentId, totalFees } = req.body;

        const student = await Student.findById(studentId);
        if (!student) {
            res.status(404);
            throw new Error('Student not found');
        }

        const fee = await Fee.create({
            student: studentId,
            totalFees
        });

        res.status(201).json(fee);
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

// @desc    Update payment for a fee record
// @route   PUT /api/fees/:id
// @access  Private/Admin
const updatePayment = async (req, res) => {
    try {
        const { amountPaid, paymentDate } = req.body;
        const fee = await Fee.findById(req.params.id);

        if (fee) {
            fee.paidAmount += Number(amountPaid);
            fee.paymentDate = paymentDate || Date.now();

            const updatedFee = await fee.save();
            res.json(updatedFee);
        } else {
            res.status(404);
            throw new Error('Fee record not found');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ message: error.message });
    }
};

// @desc    Get fee status
// @route   GET /api/fees
// @access  Private
const getFeeStatus = async (req, res) => {
    try {
        let query = {};

        // If student is requesting, filter for their record
        if (req.user.role === 'student') {
            const studentProfile = await Student.findOne({ email: req.user.email });
            if (studentProfile) {
                query.student = studentProfile._id;
            } else {
                return res.status(404).json({ message: 'Student profile not found' });
            }
        } else if (req.query.studentId) {
            query.student = req.query.studentId;
        }

        const fees = await Fee.find(query)
            .populate('student', 'name rollNumber email class')
            .sort({ createdAt: -1 });

        res.json(fees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { addFeeRecord, updatePayment, getFeeStatus };
