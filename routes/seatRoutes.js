import express from "express";
import {
  createSeat,
  getAllSeats,
  getSeatById,
  updateSeat,
  deleteSeat,
  getSeatsByTheater,
  createBulkSeats,
} from "../controllers/seatController.js";

const router = express.Router();

router.post("/", createSeat);
router.get("/", getAllSeats);
router.get("/:id", getSeatById);
router.put("/:id", updateSeat);
router.delete("/:id", deleteSeat);
router.get("/theater/:theaterId", getSeatsByTheater);

// 🔥 Bulk seat creation (20 per row)
router.post("/bulk", createBulkSeats);

export default router;
