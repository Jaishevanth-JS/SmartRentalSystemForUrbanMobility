const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Bike = require('../models/Bike');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

const vendorOnly = (req, res, next) => {
  if (req.user.role !== 'Vendor') {
    return res.status(403).json({ message: 'Access denied. Vendors only.' });
  }
  next();
};

// Auto-sync booking statuses based on current date/time
// This runs before fetching bookings to ensure statuses are always accurate
const syncBookingStatuses = async (filter = {}) => {
  const now = new Date();

  // upcoming -> active: startDate has passed but endDate hasn't
  await Booking.updateMany(
    { ...filter, bookingStatus: 'upcoming', startDate: { $lte: now }, endDate: { $gt: now } },
    { $set: { bookingStatus: 'active' } }
  );

  // upcoming -> completed: both startDate and endDate have passed
  await Booking.updateMany(
    { ...filter, bookingStatus: 'upcoming', endDate: { $lte: now } },
    { $set: { bookingStatus: 'completed' } }
  );

  // active -> completed: endDate has passed
  await Booking.updateMany(
    { ...filter, bookingStatus: 'active', endDate: { $lte: now } },
    { $set: { bookingStatus: 'completed' } }
  );
};

// GET / check availability
router.post('/check-availability', auth, async (req, res) => {
  try {
    const { bikeId, startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return res.status(400).json({ message: 'Invalid date range' });
    }

    const overlap = await Booking.findOne({
      bikeId,
      bookingStatus: { $ne: 'cancelled' },
      $or: [
        { startDate: { $lt: end }, endDate: { $gt: start } }
      ]
    });

    res.json({ available: !overlap });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST / create new booking
router.post('/', auth, async (req, res) => {
  try {
    const { bikeId, startDate, endDate, paymentIntentId } = req.body;
    const bike = await Bike.findById(bikeId);
    if (!bike) return res.status(404).json({ message: 'Bike not found' });

    // Prevent vendor from booking own bike
    if (bike.ownerId.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot book your own bike' });
    }


    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return res.status(400).json({ message: 'End date/time cannot be before start date/time' });
    }

    // Validate no date overlap for that bike
    const existingBookings = await Booking.find({
      bikeId,
      bookingStatus: { $ne: 'cancelled' },
      $or: [
        { startDate: { $lt: end }, endDate: { $gt: start } }
      ]
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({ message: 'This bike is already booked for the selected time slot. Please choose different dates or times.' });
    }

    // Auto-calculate totalAmount
    const diffTime = Math.abs(end - start);
    let totalAmount = 0;
    if (diffTime < (24 * 60 * 60 * 1000)) {
        const diffHours = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60)));
        totalAmount = diffHours * (bike.pricePerHour || Math.ceil(bike.pricePerDay / 24));
    } else {
        const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        totalAmount = diffDays * bike.pricePerDay;
    }

    const newBooking = new Booking({
      userId: req.user.id,
      bikeId,
      startDate: start,
      endDate: end,
      totalAmount,
      paymentIntentId,
      paymentStatus: paymentIntentId ? 'paid' : 'pending' 
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
    // Sync statuses for this user's bookings before fetching
    await syncBookingStatuses({ userId: req.user.id });

    const bookings = await Booking.find({ userId: req.user.id })
      .populate('bikeId')
      .sort({ createdAt: -1 });

    // Attach hasReview flag to each booking
    const bookingIds = bookings.map(b => b._id);
    const existingReviews = await Review.find({ bookingId: { $in: bookingIds } }).select('bookingId');
    const reviewedBookingIds = new Set(existingReviews.map(r => r.bookingId.toString()));

    const bookingsWithReviewFlag = bookings.map(b => {
      const obj = b.toObject();
      obj.hasReview = reviewedBookingIds.has(b._id.toString());
      return obj;
    });

    res.json(bookingsWithReviewFlag);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// GET /vendor/bookings
router.get('/vendor/bookings', auth, vendorOnly, async (req, res) => {
  try {
    const bikes = await Bike.find({ ownerId: req.user.id }).select('_id');
    const bikeIds = bikes.map(b => b._id);

    // Sync statuses for this vendor's bike bookings before fetching
    await syncBookingStatuses({ bikeId: { $in: bikeIds } });

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
