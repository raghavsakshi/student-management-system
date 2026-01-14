import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
    examName: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    description: {
        type: String
    },
    examDate: {
        type: Date,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Exam = mongoose.model('Exam', examSchema);

export default Exam;
