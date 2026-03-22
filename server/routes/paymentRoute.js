const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');

// POST /create-payment-intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { totalAmount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // amount in cents/paisa
      currency: 'inr',
      description: 'Bike Rental Payment',
      metadata: { integration_check: 'accept_a_payment' },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: 'Stripe error: ' + error.message });
  }
});

// POST /webhook
// Note: This route needs raw body for Stripe signature verification
// I will handle the response simply here, but I'll add the necessary setup in server.js
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    // Update booking paymentStatus to 'paid'
    await Booking.findOneAndUpdate({ paymentIntentId: paymentIntent.id }, { paymentStatus: 'paid' });
  }

  res.json({ received: true });
});

// POST /refund
router.post('/refund', auth, async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    if (booking.paymentIntentId) {
      await stripe.refunds.create({
        payment_intent: booking.paymentIntentId,
      });
      booking.paymentStatus = 'refunded';
      await booking.save();
      res.json({ message: 'Refund issued successfully' });
    } else {
      res.status(400).json({ message: 'No payment intent found for this booking' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Stripe refund error: ' + error.message });
  }
});

module.exports = router;
