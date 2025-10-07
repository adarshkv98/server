const Booking = require('../models/bookingModel');
const Showtime = require('../models/showtimeModel');
const Movie = require('../models/movieModel');
const Theater = require('../models/theaterModel');
const User = require('../models/userModel');

// CREATE BOOKING //
exports.createBooking = async (req, res) => {
  try {
    const { seats, totalPrice, movie, theater, showtime } = req.body;
    const userId = req.user._id;

    // Optional: validate movie, theater, showtime exist
    const movieExists = await Movie.findById(movie);
    const theaterExists = await Theater.findById(theater);
    const showtimeExists = await Showtime.findById(showtime);

    if (!movieExists || !theaterExists || !showtimeExists) {
      return res.status(400).json({ message: 'Invalid movie, theater, or showtime ID' });
    }

    const newBooking = await Booking.create({
      seats,
      totalPrice,
      movie,
      theater,
      showtime,
      user: userId,
      status: 'pending',
    });

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
};

// GET ALL BOOKINGS (ADMIN ONLY) //
exports.getAllBookings = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admin only' });
    }

    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('movie', 'title')
      .populate('theater', 'name location')
      .populate('showtime', 'startTime endTime')
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};

// GET USER BOOKINGS //
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({ user: userId })
      .populate('movie', 'title')
      .populate('theater', 'name location')
      .populate('showtime', 'startTime endTime')
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user bookings', error: error.message });
  }
};

// GET BOOKING BY ID //
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('movie', 'title')
      .populate('theater', 'name location')
      .populate('showtime', 'startTime endTime');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Optional: allow only admin or owner to view
    if (!req.user.isAdmin && booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({ booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch booking', error: error.message });
  }
};

// UPDATE BOOKING (ADMIN ONLY) //
exports.updateBooking = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admin only' });
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.status(200).json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update booking', error: error.message });
  }
};

// DELETE BOOKING (ADMIN OR USER) //
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Only admin or booking owner can delete
    if (!req.user.isAdmin && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await booking.deleteOne();
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete booking', error: error.message });
  }
};
