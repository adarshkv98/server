const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
    },
    screens: [
      {
        screenNumber: { type: Number, required: true },
        totalSeats: { type: Number, required: true },
        seatLayout: [
          {
            row: { type: String, required: true },
            seat: { type: Number, required: true },
          },
        ],
      },
    ],
    contact: {
      phone: { type: String },
      email: { type: String }, // ✅ fixed capitalization
    },
    movies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Theater = mongoose.model('Theater', theaterSchema);
module.exports = Theater;
