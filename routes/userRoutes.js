import express from 'express';
import {
  register,
  login,
  updateUser,
  deleteUser,
  logoutUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// REGISTER USER
router.post('/register', register);

// LOGIN USER
router.post('/login', login);

// LOGOUT USER
router.post('/logout', protect, logoutUser);

// UPDATE USER (only logged-in user)
router.put('/update', protect, updateUser);

// DELETE USER (only logged-in user)
router.delete('/delete', protect, deleteUser);

export default router;
