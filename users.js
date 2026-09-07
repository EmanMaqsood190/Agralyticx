const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');

router.get('/', async (req, res) => {
  res.json(await UserProfile.find());
});

router.get('/:userId', async (req, res) => {
  const user = await UserProfile.findOne({ userId: req.params.userId });
  res.json(user);
});

router.post('/', async (req, res) => {
  const { userId, ...rest } = req.body;
  const existing = await UserProfile.findOne({ userId });
  const merged = existing ? { ...existing.toObject(), ...rest } : { userId, ...rest };
  const updated = await UserProfile.findOneAndUpdate(
    { userId },
    merged,
    { upsert: true, new: true }
  );
  res.json(updated);
});

module.exports = router;