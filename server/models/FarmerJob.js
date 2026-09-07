const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  farmerId: String,
  farmerName: String,
  phone: String,
  appliedAt: String,
  status: String
}, { _id: false });

const farmerJobSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  landownerId: String,
  landownerName: String,
  phone: String,
  jobType: String,
  crop: String,
  location: String,
  district: String,
  farmersNeeded: Number,
  hourlyRate: Number,
  workingHours: String,
  date: String,
  budget: Number,
  status: String,
  createdAt: String,
  applicants: [applicantSchema]
});

module.exports = mongoose.model('FarmerJob', farmerJobSchema);