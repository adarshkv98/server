const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createBooking, getBookedSeats } = require("../controllers/bookingController");

// ✅ Create booking (protected)
router.post("/", protect, createBooking);

// ✅ Get booked seats for a show (public or protected)
router.get("/booked", getBookedSeats);

module.exports = router;
