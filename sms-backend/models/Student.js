import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    class: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    parentContact: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
