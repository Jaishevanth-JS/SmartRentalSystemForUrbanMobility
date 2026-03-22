const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Bike = require('../models/Bike');
const auth = require('../middleware/auth');

const vendorOnly = (req, res, next) => {
  if (req.user.role !== 'Vendor') {
    return res.status(403).json({ message: 'Access denied. Vendors only.' });
  }
  next();
};

// POST / create new booking
router.post('/', auth, async (req, res) => {
  try {
    const { bikeId, startDate, endDate, paymentIntentId } = req.body;
    const bike = await Bike.findById(bikeId);
    if (!bike) return res.status(404).json({ message: 'Bike not found' });

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate no date overlap for that bike
    const existingBookings = await Booking.find({
      bikeId,
      bookingStatus: { $ne: 'cancelled' },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({ message: 'Bike is not available for these dates' });
    }

    // Auto-calculate totalAmount
    const diffTime = Math.abs(end - start);
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const totalAmount = diffDays * bike.pricePerDay;

    const newBooking = new Booking({
      userId: req.user.id,
      bikeId,
      startDate: start,
      endDate: end,
      totalAmount,
      paymentIntentId,
      paymentStatus: paymentIntentId ? 'paid' : 'pending' // Usually 'paid' if coming from Stripe, but status is updated by webhook or immediate success
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// GET /my-bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('bikeId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// GET /vendor/bookings
router.get('/vendor/bookings', auth, vendorOnly, async (req, res) => {
  try {
    const bikes = await Bike.find({ ownerId: req.user.id }).select('_id');
    const bikeIds = bikes.map(b => b._id);
    const bookings = await Booking.find({ bikeId: { $in: bikeIds } })
      .populate('bikeId', 'brand model images city')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /:id/status (Accept or reject booking)
router.put('/:id/status', auth, vendorOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('bikeId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    if (booking.bikeId.ownerId.toString() !== req.user.id) {
       return res.status(403).json({ message: 'Unauthorized' });
    }
    
    booking.bookingStatus = status;
    await booking.save();
    res.json({ message: 'Booking status updated successfully', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /:id/cancel
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    booking.bookingStatus = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;
