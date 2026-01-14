import express from 'express';
import { addStudent, getAllStudents, updateStudent, deleteStudent } from '../controllers/studentController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getAllStudents)
    .post(protect, authorize('admin', 'teacher'), addStudent);

router.route('/:id')
    .put(protect, authorize('admin', 'teacher'), updateStudent)
    .delete(protect, authorize('admin', 'teacher'), deleteStudent);

export default router;
