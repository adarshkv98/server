const Showtime = require('../models/showtimeModel');
const Booking = require('../models/bookingModel');

// GET AVAILABLE SEATS FOR A SHOWTIME
exports.getAvailableSeats = async (req, res) => {
  try {
    const { showtimeId } = req.params;

    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) return res.status(404).json({ message: 'Showtime not found' });

    // Find all bookings for this showtime
    const bookings = await Booking.find({ showtime: showtimeId });

    const bookedSeats = bookings.flatMap(b => b.seats);

    const totalSeats = showtime.seats; // total seat count
    const seatNumbers = Array.from({ length: totalSeats }, (_, i) => `S${i + 1}`);

    const availableSeats = seatNumbers.filter(seat => !bookedSeats.includes(seat));

    res.status(200).json({ availableSeats, bookedSeats });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get seats', error: error.message });
  }
};

// BOOK SEATS
exports.bookSeats = async (req, res) => {
  try {
    const { showtimeId, seats } = req.body;
    const userId = req.user._id;

    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) return res.status(404).json({ message: 'Showtime not found' });

    // check if seats already booked
    const existingBookings = await Booking.find({ showtime: showtimeId });
    const bookedSeats = existingBookings.flatMap(b => b.seats);

    const alreadyBooked = seats.filter(seat => bookedSeats.includes(seat));
    if (alreadyBooked.length > 0) {
      return res.status(400).json({ message: 'Seats already booked', seats: alreadyBooked });
    }

    const totalPrice = seats.length * showtime.pricePerSeat;

    const newBooking = await Booking.create({
      seats,
      totalPrice,
      showtime: showtimeId,
      movie: showtime.movie,
      theater: showtime.theater,
      user: userId,
      status: 'confirmed',
    });

    res.status(201).json({ message: 'Seats booked successfully', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to book seats', error: error.message });
  }
};

// CANCEL BOOKING
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (!req.user.isAdmin && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel booking', error: error.message });
  }
};
