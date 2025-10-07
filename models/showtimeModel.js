const mongoose = require('mongoose');
const Movie = require('./movieModel');
const Theater = require('./theaterModel'); // fixed capitalization

const showtimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie', // must match your Movie model name
      required: true,
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater', // must match your Theater model name
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    seats: {
      type: Number, // changed to Number (string isn’t suitable for seat count)
      required: true,
    },
    pricePerSeat: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'running', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

const Showtime = mongoose.model('Showtime', showtimeSchema);
module.exports = Showtime;
