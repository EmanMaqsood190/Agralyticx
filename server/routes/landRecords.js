const express = require('express');
const router = express.Router();
const LandRecord = require('../models/LandRecord');

router.get('/:userId', async (req, res) => {
  res.json(await LandRecord.find({ userId: req.params.userId }));
});

router.post('/', async (req, res) => {
  const updated = await LandRecord.findOneAndUpdate(
    { id: req.body.id },
    req.body,
    { upsert: true, new: true }
  );
  res.json(updated);
});

module.exports = router;