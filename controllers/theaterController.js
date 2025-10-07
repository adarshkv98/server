const Theater = require('../models/Theater');

// CREATE THEATER //
exports.createTheater = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }
    const theater = await Theater.create(req.body);
    res.status(201).json({ message: 'Theater created successfully', theater });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create theater', error: error.message });
  }
};

// GET ALL THEATERS //
exports.getTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find().populate('movies').sort({ createdAt: -1 });
    res.status(200).json({ theaters });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get theaters', error: error.message });
  }
};

// GET THEATER BY ID //
exports.getTheater = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id).populate('movies');
    if (!theater) return res.status(404).json({ message: 'Theater not found' });
    res.status(200).json({ theater });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get theater', error: error.message });
  }
};

// UPDATE THEATER //
exports.updateTheater = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }
    const theater = await Theater.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!theater) return res.status(404).json({ message: 'Theater not found' });
    res.status(200).json({ message: 'Theater updated successfully', theater });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update theater', error: error.message });
  }
};

// DELETE THEATER //
exports.deleteTheater = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }
    const theater = await Theater.findByIdAndDelete(req.params.id);
    if (!theater) return res.status(404).json({ message: 'Theater not found' });
    res.status(200).json({ message: 'Theater deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete theater', error: error.message });
  }
};
