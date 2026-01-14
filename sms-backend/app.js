import express from "express";
import cors from "cors";
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import examRoutes from './routes/examRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import feeRoutes from './routes/feeRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/fees', feeRoutes);

app.get("/", (req, res) => {
    res.send("Backend running successfully 🚀");
});

export default app;
