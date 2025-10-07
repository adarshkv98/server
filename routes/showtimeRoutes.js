import express from 'express';
import {
  createShowtime,
  getAllShowtimes,
  getShowtimeById,
  updateShowtime,
  deleteShowtime,
} from '../controllers/showtimeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// CREATE SHOWTIME - admin only
router.post('/', protect, createShowtime);

// GET ALL SHOWTIMES - public
router.get('/', getAllShowtimes);

// GET SHOWTIME BY ID - public
router.get('/:id', getShowtimeById);

// UPDATE SHOWTIME - admin only
router.put('/:id', protect, updateShowtime);

// DELETE SHOWTIME - admin only
router.delete('/:id', protect, deleteShowtime);

export default router;
