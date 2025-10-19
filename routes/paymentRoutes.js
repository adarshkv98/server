import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create Razorpay order
router.post('/order', protect, createOrder);

// Verify Razorpay payment
router.post('/verify', protect, verifyPayment);

export default router;
