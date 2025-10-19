import express from 'express';
import {
  createSeat,
  getAllSeats,
  getSeatById,
  updateSeat,
  upgradeSeat,
  deleteSeat,
  getSeatsByTheater
} from '../controllers/seatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createSeat);
router.get('/', getAllSeats);
router.get('/theater/:theaterId', getSeatsByTheater); // 👈 New route
router.get('/:id', getSeatById);
router.put('/:id', protect, updateSeat);
router.patch('/upgrade/:id', protect, upgradeSeat);
router.delete('/:id', protect, deleteSeat);

export default router;
