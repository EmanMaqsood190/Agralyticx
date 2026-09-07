const express = require('express');
const router = express.Router();
const FarmData = require('../models/FarmData');

router.get('/:userId', async (req, res) => {
  const farm = await FarmData.findOne({ userId: req.params.userId });
  res.json(farm);
});

router.post('/', async (req, res) => {
  const { userId, ...rest } = req.body;
  const updated = await FarmData.findOneAndUpdate(
    { userId },
    { userId, ...rest },
    { upsert: true, new: true }
  );
  res.json(updated);
});

module.exports = router;