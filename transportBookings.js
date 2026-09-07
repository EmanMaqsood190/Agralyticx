const express = require('express');
const router = express.Router();
const TransportBooking = require('../models/TransportBooking');

router.get('/', async (req, res) => {
  res.json(await TransportBooking.find().sort({ createdAt: -1 }));
});

router.post('/', async (req, res) => {
  const booking = await TransportBooking.create(req.body);
  res.json(booking);
});

router.post('/:id/status', async (req, res) => {
  const { status, transporterId, transporterName } = req.body;
  const update = { status };
  if (transporterId) update.assignedTransporterId = transporterId;
  if (transporterName) update.assignedTransporterName = transporterName;

  const booking = await TransportBooking.findOneAndUpdate(
    { id: req.params.id },
    update,
    { new: true }
  );
  res.json(booking);
});

module.exports = router;