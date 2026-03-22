const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Bike = require('../models/Bike');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

// GET /api/admin/stats
router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'User' });
    const totalVendors = await User.countDocuments({ role: 'Vendor' });
    const approvedBikes = await Bike.countDocuments({ approvalStatus: 'Approved' });
    const pendingBikes = await Bike.countDocuments({ approvalStatus: { $nin: ['Approved', 'Rejected'] } });
    const bookings = await Booking.find();
    const totalBookings = bookings.length;
    const totalRevenue = bookings
      .filter(b => b.bookingStatus === 'completed')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    res.json({ totalUsers, totalVendors, approvedBikes, pendingBikes, totalBookings, totalRevenue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'Admin' } }).sort({ createdAt: -1 }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/users/:id/block
router.put('/users/:id/block', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'Admin') return res.status(400).json({ message: 'Cannot block admins' });
    
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: user.isBlocked ? 'User blocked' : 'User unblocked', isBlocked: user.isBlocked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/bikes/pending
router.get('/bikes/pending', auth, adminOnly, async (req, res) => {
  try {
    const bikes = await Bike.find({ approvalStatus: { $nin: ['Approved', 'Rejected'] } })
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });
    console.log("Pending bikes found:", bikes.length);
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/bikes
router.get('/bikes', auth, adminOnly, async (req, res) => {
  try {
    const bikes = await Bike.find()
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/bikes/:id/approve
router.put('/bikes/:id/approve', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const bike = await Bike.findById(req.params.id);
    if (!bike) return res.status(404).json({ message: 'Bike not found' });
    
    bike.approvalStatus = status;
    bike.isApproved = (status === 'Approved');
    
    await bike.save();
    res.json({ message: `Bike ${status}`, bike });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/bookings
router.get('/bookings', auth, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('bikeId', 'brand model images')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
