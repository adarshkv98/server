import express from 'express';
import {
  addMovie,
  updateMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
} from '../controllers/movieController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ADD MOVIE - admin only
router.post('/', protect, addMovie);

// UPDATE MOVIE - admin only
router.put('/:id', protect, updateMovie);

// DELETE MOVIE - admin only
router.delete('/:id', protect, deleteMovie);

// GET ALL MOVIES - public route
router.get('/', getAllMovies);

// GET MOVIE BY ID - public route
router.get('/:id', getMovieById);

export default router;
