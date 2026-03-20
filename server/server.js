require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoute = require('./routes/authRoute');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use('/api/auth', authRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
