import express from 'express';
import { addTeacher, getAllTeachers, updateTeacher, deleteTeacher } from '../controllers/teacherController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getAllTeachers)
    .post(protect, authorize('admin'), addTeacher);

router.route('/:id')
    .put(protect, authorize('admin'), updateTeacher)
    .delete(protect, authorize('admin'), deleteTeacher);

export default router;
