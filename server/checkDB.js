const mongoose = require('mongoose');
require('dotenv').config();
const Bike = require('./models/Bike');

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await Bike.countDocuments();
        console.log('Current Bike Count:', count);
        if (count > 0) {
            const bikes = await Bike.find({});
            console.log('Bikes found:', JSON.stringify(bikes, null, 2));
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDB();
