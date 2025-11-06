import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: "YOUR_RAZORPAY_KEY_ID",
  key_secret: "YOUR_RAZORPAY_SECRET",
});

router.post("/orders", async (req, res) => {
  const { amount } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency: "INR",
      payment_capture: 1,
    });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating Razorpay order");
  }
});

export default router;
