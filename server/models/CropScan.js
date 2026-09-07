const mongoose = require('mongoose');

const cropScanSchema = new mongoose.Schema({
  userId: { type: String, required: true }
}, { strict: false });

module.exports = mongoose.model('CropScan', cropScanSchema);