const Showtime = require('../models/showtimeModel');
const Movie = require('../models/movieModel');
const Theater = require('../models/theaterModel');

// CREATE SHOWTIME //
exports.createShowtime = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }

    const { movie, theater, startTime, endTime, seats, pricePerSeat } = req.body;

    
    const movieExists = await Movie.findById(movie);
    const theaterExists = await Theater.findById(theater);
    if (!movieExists || !theaterExists) {
      return res.status(400).json({ message: "Invalid movie or theater ID" });
    }

    const newShowtime = await Showtime.create({
      movie,
      theater,
      startTime,
      endTime,
      seats,
      pricePerSeat,
      status: 'scheduled',
    });

    res.status(201).json({ message: "Showtime created successfully", showtime: newShowtime });
  } catch (error) {
    res.status(500).json({ message: "Failed to create showtime", error: error.message });
  }
};

// GET ALL SHOWTIMES //
exports.getAllShowtimes = async (req, res) => {
  try {
    const showtimes = await Showtime.find()
      .populate('movie')
      .populate('theater')
      .sort({ startTime: 1 });
    res.status(200).json({ showtimes });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch showtimes", error: error.message });
  }
};

// GET SHOWTIME BY ID //
exports.getShowtimeById = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id)
      .populate('movie')
      .populate('theater');

    if (!showtime) return res.status(404).json({ message: "Showtime not found" });

    res.status(200).json({ showtime });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch showtime", error: error.message });
  }
};

// UPDATE SHOWTIME //
exports.updateShowtime = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }

    const showtime = await Showtime.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!showtime) return res.status(404).json({ message: "Showtime not found" });

    res.status(200).json({ message: "Showtime updated successfully", showtime });
  } catch (error) {
    res.status(500).json({ message: "Failed to update showtime", error: error.message });
  }
};

// DELETE SHOWTIME //
exports.deleteShowtime = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }

    const showtime = await Showtime.findByIdAndDelete(req.params.id);

    if (!showtime) return res.status(404).json({ message: "Showtime not found" });

    res.status(200).json({ message: "Showtime deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete showtime", error: error.message });
  }
};
