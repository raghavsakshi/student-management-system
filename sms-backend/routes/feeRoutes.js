import express from 'express';
import { addFeeRecord, updatePayment, getFeeStatus } from '../controllers/feeController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, authorize('admin'), addFeeRecord)
    .get(protect, getFeeStatus);

router.route('/:id')
    .put(protect, authorize('admin'), updatePayment);

export default router;
