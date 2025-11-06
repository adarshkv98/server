const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    seats: [
      {
        type: String,
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    bookingRef: {
      type: String,
      unique: true,
      default: () => `BOOK-${Date.now()}`,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },
    showtime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Showtime",
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
