const express = require('express');
const router = express.Router();
const Bike = require('../models/Bike');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Middleware: ensure user is Vendor
const vendorOnly = (req, res, next) => {
  if (req.user.role !== 'Vendor') {
    return res.status(403).json({ message: 'Access denied. Vendors only.' });
  }
  next();
};

// ─── GET /api/vendor/stats ── dashboard overview numbers ──────────────────────
router.get('/stats', auth, vendorOnly, async (req, res) => {
  try {
    const bikes = await Bike.find({ ownerId: req.user.id });
    const bikeIds = bikes.map(b => b._id);

    const allBookings = await Booking.find({ bikeId: { $in: bikeIds } });
    const totalEarnings = allBookings
      .filter(b => b.bookingStatus === 'completed')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    const pendingBookings = allBookings.filter(b => b.bookingStatus === 'upcoming').length;

    const totalBikes = await Bike.countDocuments({ ownerId: req.user.id, isApproved: true });
    const pendingBikes = await Bike.countDocuments({ ownerId: req.user.id, isApproved: false });

    res.json({
      totalBikes,
      totalBookings: allBookings.length,
      totalEarnings,
      pendingBikes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/vendor/bikes ── all bikes by this vendor ─────────────────────────
router.get('/bikes', auth, vendorOnly, async (req, res) => {
  try {
    const bikes = await Bike.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/vendor/bikes ── add a new bike ─────────────────────────────────
router.post('/bikes', auth, vendorOnly, async (req, res) => {
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

// ─── PUT /api/vendor/bikes/:id ── edit a bike ────────────────────────────────
router.put('/bikes/:id', auth, vendorOnly, async (req, res) => {
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

// ─── DELETE /api/vendor/bikes/:id ── delete a bike ──────────────────────────
router.delete('/bikes/:id', auth, vendorOnly, async (req, res) => {
  try {
    const bike = await Bike.findOneAndDelete({ _id: req.params.id, ownerId: req.user.id });
    if (!bike) return res.status(404).json({ message: 'Bike not found or not yours' });
    res.json({ message: 'Bike deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PATCH /api/vendor/bikes/:id/toggle ── toggle availability ───────────────
router.patch('/bikes/:id/toggle', auth, vendorOnly, async (req, res) => {
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

// ─── GET /api/vendor/bookings ── all bookings for vendor bikes ────────────────
router.get('/bookings', auth, vendorOnly, async (req, res) => {
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

// ─── GET /api/vendor/earnings ── completed bookings with earnings ─────────────
router.get('/earnings', auth, vendorOnly, async (req, res) => {
  try {
    const bikes = await Bike.find({ ownerId: req.user.id }).select('_id');
    const bikeIds = bikes.map(b => b._id);
    const bookings = await Booking.find({ bikeId: { $in: bikeIds }, bookingStatus: 'completed' })
      .populate('bikeId', 'brand model images')
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    const totalEarnings = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    res.json({ bookings, totalEarnings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
