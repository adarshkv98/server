import Seat from '../models/seatModel.js';
import Theater from '../models/theaterModel.js';

Seat.syncIndexes();

//
// 🎯 CREATE a single seat
//
export const createSeat = async (req, res) => {
  try {
    const { seatNumber, row, price, seatType, theater } = req.body;

    if (!seatNumber || !row || !theater) {
      return res.status(400).json({ message: "seatNumber, row, and theater are required" });
    }

    const existing = await Seat.findOne({ seatNumber, theater });
    if (existing) {
      return res.status(400).json({ message: "Seat already exists in this theater" });
    }

    const newSeat = await Seat.create({ seatNumber, row, price, seatType, theater });
    res.status(201).json({ message: "Seat created successfully", seat: newSeat });
  } catch (error) {
    res.status(500).json({ message: "Failed to create seat", error: error.message });
  }
};

//
// 🎯 GET all seats
//
export const getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find().populate("theater", "name location");
    res.status(200).json(seats);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch seats", error: error.message });
  }
};

//
// 🎯 GET seat by ID
//
export const getSeatById = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id).populate("theater", "name location");
    if (!seat) return res.status(404).json({ message: "Seat not found" });
    res.status(200).json(seat);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch seat", error: error.message });
  }
};

//
// 🎯 UPDATE a seat
//
export const updateSeat = async (req, res) => {
  try {
    const updatedSeat = await Seat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSeat) return res.status(404).json({ message: "Seat not found" });
    res.status(200).json({ message: "Seat updated successfully", seat: updatedSeat });
  } catch (error) {
    res.status(500).json({ message: "Failed to update seat", error: error.message });
  }
};

//
// 🎯 DELETE a seat
//
export const deleteSeat = async (req, res) => {
  try {
    const seat = await Seat.findByIdAndDelete(req.params.id);
    if (!seat) return res.status(404).json({ message: "Seat not found" });
    res.status(200).json({ message: "Seat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete seat", error: error.message });
  }
};

//
// 🎯 GET all seats by theater
//
export const getSeatsByTheater = async (req, res) => {
  try {
    const { theaterId } = req.params;
    const seats = await Seat.find({ theater: theaterId }).populate("theater", "name location");

    if (!seats || seats.length === 0) {
      return res.status(404).json({ message: "No seats found for this theater" });
    }

    res.status(200).json(seats);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch seats", error: error.message });
  }
};

//
// 🚀 CREATE BULK SEATS (20 per row)
//
export const createBulkSeats = async (req, res) => {
  try {
    const { theaterId, totalRows = 10, seatsPerRow = 20 } = req.body;

    // ✅ Validate theater
    const theater = await Theater.findById(theaterId);
    if (!theater) {
      return res.status(404).json({ message: "Theater not found" });
    }

    const seats = [];

    // 🔁 Generate seats row by row
    for (let r = 0; r < totalRows; r++) {
      const rowLetter = String.fromCharCode(65 + r); // A, B, C...

      for (let i = 1; i <= seatsPerRow; i++) {
        const seatNumber = `${rowLetter}${i}`;
        seats.push({
          seatNumber,
          row: rowLetter,
          theater: theaterId,
          price:
            r < 2 ? 250 : r < 5 ? 200 : 150, // Price tiers (Premium/VIP/Regular)
          seatType:
            r < 2 ? "Premium" : r < 5 ? "VIP" : "Regular",
        });
      }
    }

    // ✅ Avoid duplicate seat creation
    const existingSeats = await Seat.find({ theater: theaterId });
    const existingSeatNumbers = new Set(existingSeats.map((s) => s.seatNumber));
    const newSeats = seats.filter((s) => !existingSeatNumbers.has(s.seatNumber));

    if (newSeats.length === 0) {
      return res.status(400).json({ message: "All seats already exist for this theater" });
    }

    // ✅ Insert seats in bulk
    await Seat.insertMany(newSeats);

    res.status(201).json({
      message: `${newSeats.length} new seats created successfully (${seatsPerRow} per row)`,
    });
  } catch (error) {
    console.error("Error creating bulk seats:", error);
    res.status(500).json({ message: "Failed to create bulk seats", error: error.message });
  }
};
