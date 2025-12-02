const express = require('express');
const { 
  register, 
  login, 
  updateUser, 
  deleteUser, 
  logoutUser, 
  getAllUsers, 
  getUserProfile 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// REGISTER USER
router.post('/register', register);

// LOGIN USER
router.post('/login', login);

// LOGOUT USER
router.post('/logout', logoutUser);

// GET ALL USERS (admin only)
router.get('/', getAllUsers);

// ✅ GET LOGGED-IN USER PROFILE
router.get('/profile/me', protect, getUserProfile);

// ✅ UPDATE USER PROFILE
router.put('/:id', protect, updateUser);

// ✅ DELETE USER
router.delete('/:id', protect, deleteUser);

module.exports = router;
