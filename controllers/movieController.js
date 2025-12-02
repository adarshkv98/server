import Movie from "../models/movieModel.js";

// ✅ ADD MOVIE
export const addMovie = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }

    const {
      title,
      description,
      genre,
      duration,
      releaseDate,
      language,
      rating,
      cast,
    } = req.body;

    // ✅ use uploaded file URL or fallback to posterUrl from body
    const posterUrl = req.file ? req.file.path : req.body.posterUrl;

    if (!posterUrl) {
      return res.status(400).json({ message: "Poster image is required" });
    }

    const newMovie = new Movie({
      title,
      description,
      genre,
      duration,
      releaseDate,
      language,
      rating,
      cast,
      posterUrl,
    });

    await newMovie.save();
    res.status(201).json({ message: "Movie added successfully", movie: newMovie });
  } catch (error) {
    console.error("❌ Movie add error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE MOVIE
export const updateMovie = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }

    const movieId = req.params.id;
    const updateData = { ...req.body };

    // ✅ If new file uploaded, update posterUrl
    if (req.file) {
      updateData.posterUrl = req.file.path;
    }

    const updatedMovie = await Movie.findByIdAndUpdate(movieId, updateData, { new: true });

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({ message: "Movie updated successfully", movie: updatedMovie });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE MOVIE
export const deleteMovie = async (req, res) => {
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

// ✅ GET ALL MOVIES
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({ movies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET MOVIE BY ID
export const getMovieById = async (req, res) => {
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
