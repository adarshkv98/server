const Booking = require("../models/bookingModel");
const Movie = require("../models/movieModel");
const Theater = require("../models/theaterModel");

// ✅ CREATE BOOKING (Prevents duplicate booking)
exports.createBooking = async (req, res) => {
  try {
    const { seats, totalPrice, movie, theater, showtime, date, time } = req.body;
    const userId = req.user._id;

    if (!seats || seats.length === 0) {
      return res.status(400).json({ message: "No seats selected" });
    }

    const movieExists = await Movie.findById(movie);
    const theaterExists = await Theater.findById(theater);

    if (!movieExists || !theaterExists) {
      return res.status(400).json({ message: "Invalid movie or theater ID" });
    }

    // ✅ Check if any seat is already booked for this show
    const existingBookings = await Booking.find({
      movie,
      theater,
      date,
      time,
      seats: { $in: seats },
      status: { $ne: "cancelled" },
    });

    if (existingBookings.length > 0) {
      const bookedSeats = existingBookings.flatMap((b) => b.seats);
      const alreadyBooked = seats.filter((seat) => bookedSeats.includes(seat));
      return res.status(400).json({
        message: "Some seats are already booked",
        alreadyBooked,
      });
    }

    // ✅ Create booking
    const newBooking = await Booking.create({
      seats,
      totalPrice,
      movie,
      theater,
      showtime,
      user: userId,
      date,
      time,
      status: "confirmed",
    });

    res.status(201).json({
      message: "Booking successful",
      booking: newBooking,
    });
  } catch (error) {
    console.error("❌ Booking creation error:", error);
    res.status(500).json({ message: "Failed to create booking", error: error.message });
  }
};

// ✅ Get all booked seats for specific movie/theater/date/time
exports.getBookedSeats = async (req, res) => {
  try {
    const { movieId, theaterId, date, time } = req.query;

    const bookings = await Booking.find({
      movie: movieId,
      theater: theaterId,
      date,
      time,
      status: { $ne: "cancelled" },
    });

    const bookedSeats = bookings.flatMap((b) => b.seats);
    res.json({ bookedSeats });
  } catch (error) {
    res.status(500).json({ message: "Error fetching booked seats", error: error.message });
  }
};
