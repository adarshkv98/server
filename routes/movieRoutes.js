import express from "express";
import {
  addMovie,
  updateMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
} from "../controllers/movieController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";

const router = express.Router();

// ADD MOVIE - admin only
router.post("/", protect, upload.single("poster"), addMovie);

// UPDATE MOVIE - admin only
router.put("/:id", protect, upload.single("poster"), updateMovie);

// DELETE MOVIE - admin only
router.delete("/:id", protect, deleteMovie);

// GET ALL MOVIES - public
router.get("/", getAllMovies);

// GET MOVIE BY ID - public
router.get("/:id", getMovieById);

export default router;
