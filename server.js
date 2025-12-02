import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import userRoutes from './routes/userRoutes.js';
import movieRoutes from "./routes/movieRoutes.js";
import theaterRoutes from './routes/theaterRoutes.js';
import showtimeRoutes from './routes/showtimeRoutes.js';

import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import seatRoutes from "./routes/seatRoutes.js";

// ✅ Load environment variables first
dotenv.config();

// ✅ Connect MongoDB once
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    
  " https://client-gamma-plum.vercel.app"

  ],
  credentials: true
}));


app.get('/', (req, res) => res.send('🎬 Movie Booking App Backend is Running...'));

// ✅ Routes
app.use('/api/users', userRoutes);
app.use("/api/movies", movieRoutes);
app.use('/api/theaters', theaterRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use("/api/seats", seatRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
