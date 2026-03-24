const express = require('express');
const router = express.Router();
const Bike = require('../models/Bike');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

const vendorOnly = (req, res, next) => {
  if (req.user.role !== 'Vendor') {
    return res.status(403).json({ message: 'Access denied. Vendors only.' });
  }
  next();
};

// GET / with filters
router.get('/', async (req, res) => {
  try {
    const { city, bikeType, priceMin, priceMax, startDate, endDate } = req.query;
    const now = new Date();
    let query = { 
      isApproved: true, 
      isAvailable: true,
      // Only show bikes whose availability window covers today
      $or: [
        { availableFrom: { $exists: false } },  // no window set = always available
        { availableFrom: { $lte: now }, availableTo: { $gte: now } }
      ]
    };

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

// POST / (add new bike - vendor only)
router.post('/', auth, vendorOnly, async (req, res) => {
  try {
    const {
      title, brand, model, bikeType, year, cc, fuelType, mileage, color,
      licensePlate, description, pricePerHour, pricePerDay,
      city, state, address, availableFrom, availableTo, images
    } = req.body;

    const bike = new Bike({
      ownerId: req.user.id,
      title, brand, model, bikeType,
      year: Number(year), cc: Number(cc),
      fuelType, mileage, color, licensePlate, description,
      pricePerHour: Number(pricePerHour),
      pricePerDay:  Number(pricePerDay),
      city, state, address, availableFrom, availableTo,
      images: images || [],
      isApproved: false,
      isAvailable: true,
    });

    await bike.save();
    res.status(201).json({ message: 'Bike submitted for admin approval.', bike });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /vendor/my-bikes (get vendor's own bikes)
router.get('/vendor/my-bikes', auth, vendorOnly, async (req, res) => {
  try {
    const bikes = await Bike.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /:id (update bike)
router.put('/:id', auth, vendorOnly, async (req, res) => {
  try {
    const bike = await Bike.findOne({ _id: req.params.id, ownerId: req.user.id });
    if (!bike) return res.status(404).json({ message: 'Bike not found or not yours' });

    const fields = [
      'title','brand','model','bikeType','year','cc','fuelType','mileage','color',
      'licensePlate','description','pricePerHour','pricePerDay',
      'city','state','address','availableFrom','availableTo','images','isAvailable'
    ];
    fields.forEach(f => { if (req.body[f] !== undefined) bike[f] = req.body[f]; });

    await bike.save();
    res.json({ message: 'Bike updated successfully', bike });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /:id (delete bike)
router.delete('/:id', auth, vendorOnly, async (req, res) => {
  try {
    const bike = await Bike.findOneAndDelete({ _id: req.params.id, ownerId: req.user.id });
    if (!bike) return res.status(404).json({ message: 'Bike not found or not yours' });
    res.json({ message: 'Bike deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /:id/toggle (toggle availability)
router.patch('/:id/toggle', auth, vendorOnly, async (req, res) => {
  try {
    const bike = await Bike.findOne({ _id: req.params.id, ownerId: req.user.id });
    if (!bike) return res.status(404).json({ message: 'Bike not found or not yours' });
    bike.isAvailable = !bike.isAvailable;
    await bike.save();
    res.json({ message: 'Availability toggled', isAvailable: bike.isAvailable });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
