import Theater from '../models/theaterModel.js';

// ✅ CREATE THEATER (Admin only)
export const createTheater = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const { name, location, screens, contact, movies } = req.body;

    if (!name || !location || !location.address || !location.city || !screens) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const newTheater = new Theater({
      name,
      location,
      screens,
      contact,
      movies,
    });

    const savedTheater = await newTheater.save();
    res.status(201).json({
      message: "Theater created successfully",
      theater: savedTheater,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create theater", error: error.message });
  }
};

// ✅ GET ALL THEATERS
export const getTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find().populate('movies').sort({ createdAt: -1 });
    res.status(200).json({ theaters });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get theaters', error: error.message });
  }
};

// ✅ GET THEATER BY ID
export const getTheater = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id).populate('movies');
    if (!theater) return res.status(404).json({ message: 'Theater not found' });
    res.status(200).json({ theater });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get theater', error: error.message });
  }
};

// ✅ UPDATE THEATER (screens now update properly)
export const updateTheater = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }

    const { name, location, screens, contact, movies } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (location) updateData.location = location;
    if (contact) updateData.contact = contact;
    if (movies) updateData.movies = movies;

    // ✅ Handle screens properly
    if (Array.isArray(screens) && screens.length > 0) {
      updateData.screens = screens;
    }

    const updatedTheater = await Theater.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedTheater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    res.status(200).json({
      message: "Theater updated successfully",
      theater: updatedTheater,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update theater",
      error: error.message,
    });
  }
};

// ✅ DELETE THEATER
export const deleteTheater = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }
    const theater = await Theater.findByIdAndDelete(req.params.id);
    if (!theater) return res.status(404).json({ message: 'Theater not found' });
    res.status(200).json({ message: 'Theater deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete theater', error: error.message });
  }
};
