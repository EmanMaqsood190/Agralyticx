const express = require('express');
const router = express.Router();
const CropScan = require('../models/CropScan');

router.get('/:userId', async (req, res) => {
  res.json(await CropScan.find({ userId: req.params.userId }).sort({ createdAt: -1 }));
});

router.post('/:userId', async (req, res) => {
  const scan = await CropScan.create({ userId: req.params.userId, ...req.body });
  res.json(scan);
});

module.exports = router;