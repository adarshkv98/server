import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/paymentModel.js';
import Booking from '../models/bookingModel.js';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// CREATE PAYMENT ORDER
export const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const options = {
      amount: booking.totalPrice * 100, // amount in paisa
      currency: 'INR',
      receipt: `rcpt_${booking._id}`,
    };

    const order = await razorpay.orders.create(options);

    // Save in DB
    const payment = await Payment.create({
      booking: booking._id,
      user: userId,
      amount: booking.totalPrice,
      currency: 'INR',
      razorpayOrderId: order.id,
    });

    res.status(201).json({
      message: 'Razorpay order created successfully',
      order,
      paymentId: payment._id,
      key: process.env.RAZORPAY_KEY_ID, // send public key to frontend
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

// VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature using HMAC SHA256
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: 'Invalid signature, payment failed' });
    }

    // Update payment & booking status
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid',
      },
      { new: true }
    ).populate('booking');

    if (payment.booking) {
      payment.booking.status = 'confirmed';
      await payment.booking.save();
    }

    res.status(200).json({
      message: 'Payment verified successfully',
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
};
