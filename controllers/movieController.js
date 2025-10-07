const Movie = require('../models/movieModel');

// ADD MOVIE //
const addMovie = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }

    const { title, description, genre, duration, releaseDate, posterUrl, language, rating, cast } = req.body;

    const newMovie = new Movie({
      title,
      description,
      genre,
      duration,
      releaseDate,
      posterUrl,
      language,
      rating,
      cast,
    });

    await newMovie.save();
    res.status(201).json({ message: "Movie added successfully", movie: newMovie });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE MOVIE //
const updateMovie = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }

    const movieId = req.params.id;
    const updatedMovie = await Movie.findByIdAndUpdate(movieId, req.body, { new: true });

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({ message: "Movie updated successfully", movie: updatedMovie });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE MOVIE //
const deleteMovie = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }

    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL MOVIES //
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({ movies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MOVIE BY ID //
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addMovie, updateMovie, deleteMovie, getAllMovies, getMovieById };
