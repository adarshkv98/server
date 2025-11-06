import express from 'express';
import {
  createTheater,
  getTheaters,
  getTheater,
  updateTheater,
  deleteTheater,
} from '../controllers/theaterController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// CREATE THEATER - admin only
router.post('/', protect, createTheater);

// GET ALL THEATERS - public
router.get('/', getTheaters);

// GET THEATER BY ID - public
router.get('/:id', getTheater);

// UPDATE THEATER - admin only
router.put('/:id', protect, updateTheater);

// DELETE THEATER - admin only
router.delete('/:id', protect, deleteTheater);




export default router;
