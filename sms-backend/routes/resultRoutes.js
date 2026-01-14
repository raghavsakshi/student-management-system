import express from 'express';
import {
    addResult,
    getResultsByExam,
    getMyResults,
    getAllResults
} from '../controllers/resultController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, authorize('admin', 'teacher'), addResult)
    .get(protect, authorize('admin'), getAllResults);

router.get('/my-results', protect, authorize('student'), getMyResults);
router.get('/exam/:examId', protect, authorize('admin', 'teacher'), getResultsByExam);

export default router;
