const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
  ownerId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:        { type: String },
  brand:        { type: String, required: true },
  model:        { type: String, required: true },
  bikeType:     { type: String, enum: ['Scooter','Sports','Cruiser','Commuter','Adventure','Electric','Classic','Other'] },
  year:         { type: Number, required: true },
  cc:           { type: Number },
  fuelType:     { type: String, enum: ['Petrol','Diesel','Electric','CNG'] },
  mileage:      { type: String },
  color:        { type: String },
  licensePlate: { type: String },
  description:  { type: String },
  pricePerHour: { type: Number, required: true },
  pricePerDay:  { type: Number, required: true },
  city:         { type: String, required: true },
  state:        { type: String },
  address:      { type: String },
  availableFrom:{ type: Date },
  availableTo:  { type: Date },
  images:       [{ type: String }],
  approvalStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  isApproved:   { type: Boolean, default: false },
  isAvailable:  { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Bike', bikeSchema);
