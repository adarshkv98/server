const express = require('express');
const { register, login, updateUser, deleteUser, logoutUser, getAllUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

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


module.exports = router; // ✅ proper CommonJS export
