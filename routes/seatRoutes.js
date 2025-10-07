import express from 'express';
import {
  getAvailableSeats,
  bookSeats,
  cancelBooking,
} from '../controllers/seatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET AVAILABLE SEATS for a showtime (any logged-in user)
router.get('/:showtimeId', protect, getAvailableSeats);

// BOOK SEATS for a showtime (any logged-in user)
router.post('/book', protect, bookSeats);

// CANCEL BOOKING (admin or booking owner)
router.put('/cancel/:id', protect, cancelBooking);

export default router;
