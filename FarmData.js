const mongoose = require('mongoose');

const farmDataSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }
}, { strict: false });

module.exports = mongoose.model('FarmData', farmDataSchema);