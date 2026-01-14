import express from 'express';
import { createExam, getAllExams, getExamById } from '../controllers/examController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, authorize('admin', 'teacher'), createExam)
    .get(protect, getAllExams);

router.route('/:id')
    .get(protect, getExamById);

export default router;
