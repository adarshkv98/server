import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
  },
  row: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    default: 150,
  },
  seatType: {
    type: String,
    enum: ['Regular', 'VIP', 'Premium'],
    default: 'Regular',
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true,
  },
});

// ✅ Create a compound unique index (theater + seatNumber)
seatSchema.index({ theater: 1, seatNumber: 1 }, { unique: true });

const Seat = mongoose.model('Seat', seatSchema);

export default Seat;
