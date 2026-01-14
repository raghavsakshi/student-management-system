import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true
    },
    courseCode: {
        type: String,
        required: true,
        unique: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        default: null
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }]
}, {
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
