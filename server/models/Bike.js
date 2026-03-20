const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  bikeType: { type: String }, // NEW
  year: { type: Number, required: true },
  cc: { type: Number },
  fuelType: { type: String },
  mileage: { type: String },
  color: { type: String },
  pricePerHour: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  city: { type: String, required: true },
  images: [{ type: String }],
  isApproved: { type: Boolean, default: true }, // Auto-approved for now
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Bike', bikeSchema);
