const express = require('express');
const router = express.Router();
const Bike = require('../models/Bike');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// GET / with filters
router.get('/', async (req, res) => {
  try {
    const { city, bikeType, priceMin, priceMax, startDate, endDate } = req.query;
    let query = { isApproved: true, isAvailable: true };

    if (city) query.city = new RegExp(city, 'i');
    if (bikeType) query.bikeType = bikeType;
    if (priceMin || priceMax) {
      query.pricePerDay = {};
      if (priceMin) query.pricePerDay.$gte = Number(priceMin);
      if (priceMax) query.pricePerDay.$lte = Number(priceMax);
    }

    // Filter by availability if dates are provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const conflictingBookings = await Booking.find({
        bookingStatus: { $ne: 'cancelled' },
        $or: [
          { startDate: { $lte: end }, endDate: { $gte: start } }
        ]
      }).select('bikeId');

      const bookedBikeIds = conflictingBookings.map(b => b.bikeId);
      query._id = { $nin: bookedBikeIds };
    }

    const bikes = await Bike.find(query).populate('ownerId', 'name');

    // Enrich with ratings
    const enrichedBikes = await Promise.all(bikes.map(async (bike) => {
      const reviews = await Review.find({ bikeId: bike._id });
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews 
        : 0;
      
      return {
        ...bike.toObject(),
        averageRating,
        totalReviews
      };
    }));

    res.json(enrichedBikes);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// GET /:id — single bike with owner info and reviews populated
router.get('/:id', async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id).populate('ownerId', 'name profileImage createdAt');
    if (!bike) return res.status(404).json({ message: 'Bike not found' });

    const reviews = await Review.find({ bikeId: req.params.id }).populate('userId', 'name profileImage');
    
    res.json({ bike, reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;
