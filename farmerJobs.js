const express = require('express');
const router = express.Router();
const FarmerJob = require('../models/FarmerJob');

router.get('/', async (req, res) => {
  res.json(await FarmerJob.find().sort({ createdAt: -1 }));
});

router.post('/', async (req, res) => {
  const job = await FarmerJob.create(req.body);
  res.json(job);
});

router.post('/:id/respond', async (req, res) => {
  const { farmerId, farmerName, action, phone } = req.body;
  const job = await FarmerJob.findOne({ id: req.params.id });
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const existing = job.applicants.find((a) => a.farmerId === farmerId);
  if (existing) {
    existing.status = action;
  } else {
    job.applicants.push({
      farmerId,
      farmerName,
      phone,
      appliedAt: new Date().toISOString(),
      status: action
    });
  }
  await job.save();
  res.json(job);
});

module.exports = router;