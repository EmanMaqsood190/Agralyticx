const mongoose = require('mongoose');

const transportBookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  requesterId: String,
  requesterName: String,
  requesterRole: String,
  phone: String,
  pickupLocation: String,
  destination: String,
  cropCargo: String,
  quantityTons: Number,
  vehicleRequirement: String,
  scheduledDate: String,
  status: String,
  estimatedCostPkr: Number,
  assignedTransporterId: String,
  assignedTransporterName: String,
  createdAt: String
});

module.exports = mongoose.model('TransportBooking', transportBookingSchema);