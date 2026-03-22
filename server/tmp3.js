const fs = require('fs');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/bikerentalsystem').then(async () => {
  const Bike = require('./models/Bike');
  const bikes = await Bike.find({ approvalStatus: { $nin: ['Approved', 'Rejected'] } })
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });
  fs.writeFileSync('out3.json', JSON.stringify(bikes, null, 2));
  process.exit(0);
});
