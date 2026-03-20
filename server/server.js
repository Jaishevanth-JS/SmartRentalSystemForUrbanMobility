require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoute = require('./routes/authRoute');
const bikeRoute = require('./routes/bikeRoute');
const bookingRoute = require('./routes/bookingRoute');
const reviewRoute = require('./routes/reviewRoute');
const paymentRoute = require('./routes/paymentRoute');

const app = express();

// Stripe webhook needs raw body
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use('/api/auth', authRoute);
app.use('/api/bikes', bikeRoute);
app.use('/api/bookings', bookingRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/payment', paymentRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
