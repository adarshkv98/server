import Seat from '../models/seatModel.js';

Seat.syncIndexes();



// CREATE seat
export const createSeat = async (req, res) => {
  try {
    const { seatNumber, row, price, seatType, theater } = req.body;

    const existing = await Seat.findOne({ seatNumber, theater });
    if (existing)
      return res.status(400).json({ message: 'Seat already exists in this theater' });

    const newSeat = await Seat.create({ seatNumber, row, price, seatType, theater });
    res.status(201).json({ message: 'Seat created successfully', seat: newSeat });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create seat', error: error.message });
  }
};

// GET all seats
export const getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find().populate('theater', 'name location');
    res.status(200).json(seats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch seats', error: error.message });
  }
};

// GET seat by ID
export const getSeatById = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id).populate('theater', 'name location');
    if (!seat) return res.status(404).json({ message: 'Seat not found' });
    res.status(200).json(seat);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch seat', error: error.message });
  }
};

// UPDATE seat (full update)
export const updateSeat = async (req, res) => {
  try {
    const updatedSeat = await Seat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSeat) return res.status(404).json({ message: 'Seat not found' });
    res.status(200).json({ message: 'Seat updated successfully', seat: updatedSeat });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update seat', error: error.message });
  }
};

// UPGRADE seat (for example, change type/price)
export const upgradeSeat = async (req, res) => {
  try {
    const { seatType, price } = req.body;
    const seat = await Seat.findById(req.params.id);
    if (!seat) return res.status(404).json({ message: 'Seat not found' });

    seat.seatType = seatType || seat.seatType;
    seat.price = price || seat.price;
    await seat.save();

    res.status(200).json({ message: 'Seat upgraded successfully', seat });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upgrade seat', error: error.message });
  }
};

// DELETE seat
export const deleteSeat = async (req, res) => {
  try {
    const seat = await Seat.findByIdAndDelete(req.params.id);
    if (!seat) return res.status(404).json({ message: 'Seat not found' });
    res.status(200).json({ message: 'Seat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete seat', error: error.message });
  }
};

// GET SEATS BY THEATER ID
export const getSeatsByTheater = async (req, res) => {
  try {
    const { theaterId } = req.params;

    // Find all seats for this theater
    const seats = await Seat.find({ theater: theaterId }).populate('theater', 'name location');

    if (!seats || seats.length === 0) {
      return res.status(404).json({ message: 'No seats found for this theater' });
    }

    res.status(200).json(seats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch seats', error: error.message });
  }
};

