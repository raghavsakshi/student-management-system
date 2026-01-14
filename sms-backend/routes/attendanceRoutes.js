import express from 'express';
import { markAttendance, getAttendance, getMonthlyAttendanceReport } from '../controllers/attendanceController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getAttendance)
    .post(protect, authorize('admin', 'teacher'), markAttendance);

router.get('/report', protect, getMonthlyAttendanceReport);

export default router;
