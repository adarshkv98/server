import express from 'express';
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// CREATE BOOKING - any logged-in user
router.post('/', protect, createBooking);


// GET ALL BOOKINGS - admin only
router.get('/', protect, getAllBookings);

// GET LOGGED-IN USER BOOKINGS
router.get('/my', protect, getUserBookings);

// GET BOOKING BY ID
router.get('/:id', protect, getBookingById);

// UPDATE BOOKING - admin only
router.put('/:id', protect, updateBooking);

// DELETE BOOKING - admin or booking owner
router.delete('/:id', protect, deleteBooking);
// ✅ my bookings fetch cheyyanrouter.get("/my", protect, getUserBookings);

export default router;
