import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    marksObtained: {
        type: Number,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    remarks: {
        type: String
    }
}, {
    timestamps: true
});

const Result = mongoose.model('Result', resultSchema);

export default Result;
