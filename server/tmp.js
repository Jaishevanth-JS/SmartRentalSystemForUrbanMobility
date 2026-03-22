const fs = require('fs');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/bikerentalsystem').then(async () => {
  const Bike = require('./models/Bike');
  const bikes = await Bike.find().select('title approvalStatus isApproved');
  fs.writeFileSync('out.json', JSON.stringify(bikes, null, 2));
  process.exit(0);
});
