const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// POST / submit review
router.post('/', auth, async (req, res) => {
  try {
    const { bikeId, bookingId, rating, comment } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.bookingStatus !== 'completed') {
      return res.status(400).json({ message: 'Reviews only allowed for completed bookings' });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const newReview = new Review({
      userId: req.user.id,
      bikeId,
      bookingId,
      rating,
      comment
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// GET /bike/:bikeId
router.get('/bike/:bikeId', async (req, res) => {
  try {
    const reviews = await Review.find({ bikeId: req.params.bikeId }).populate('userId', 'name profileImage');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;
