const express = require('express');
const { register, login, updateUser, deleteUser, logoutUser, getAllUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { getUserProfile } = require('../controllers/userController');


const router = express.Router();

// REGISTER USER
router.post('/register', register);

// LOGIN USER
router.post('/login', login);

// LOGOUT USER
router.post('/logout',  logoutUser);

// UPDATE USER
router.put('/:id', updateUser);

// DELETE USER
router.delete('/:id',  deleteUser);

// GET ALL USERS
router.get('/', getAllUsers);


// GET USER PROFILE
router.get('/:id', protect, getUserProfile);


router.get('/profile/me', protect, getUserProfile);


module.exports = router; // ✅ proper CommonJS export
