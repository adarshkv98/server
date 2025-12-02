const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    seats: [
      {
        type: String, // e.g. "A1", "A2"
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending', // ✅ must be string
    },
    bookingRef: {
      type: String,
      unique: true,
      default: () => `BOOK-${Date.now()}`, // auto-generate unique ID
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater', // ✅ must match model name
      required: true,
    },
    showtime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showtime', // optional relation to showtime model
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
