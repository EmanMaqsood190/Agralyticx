const mongoose = require('mongoose');

const landRecordSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true }
}, { strict: false });

module.exports = mongoose.model('LandRecord', landRecordSchema);