const fs = require('fs');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/bikerentalsystem').then(async () => {
  const Bike = require('./models/Bike');
  const pending1 = await Bike.find({ approvalStatus: { $nin: ['Approved', 'Rejected'] } });
  const pending2 = await Bike.find({ approvalStatus: 'Pending' });
  const pending3 = await Bike.find({ isApproved: false });
  fs.writeFileSync('out2.json', JSON.stringify({
    q1: pending1.length,
    q2: pending2.length,
    q3: pending3.length
  }, null, 2));
  process.exit(0);
});
