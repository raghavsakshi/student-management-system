import express from 'express';
import { createCourse, getAllCourses, assignTeacher, assignStudents, deleteCourse } from '../controllers/courseController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getAllCourses)
    .post(protect, authorize('admin', 'teacher'), createCourse);

router.route('/:id')
    .delete(protect, authorize('admin', 'teacher'), deleteCourse);

router.route('/:id/assign-teacher')
    .put(protect, authorize('admin', 'teacher'), assignTeacher);

router.route('/:id/assign-students')
    .put(protect, authorize('admin', 'teacher'), assignStudents);

export default router;
