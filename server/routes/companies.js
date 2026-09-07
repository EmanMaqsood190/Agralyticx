const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const CompanyProfile = require('../models/CompanyProfile');

// ============================================================
// GET ALL PROFILES
// ============================================================
router.get('/', async (req, res) => {
  try {
    const profiles = await CompanyProfile.find().sort({
      createdAt: -1
    });

    res.json(profiles);
  } catch (error) {
    console.error('GET company profiles error:', error);
    res.status(500).json({
      message: 'Failed to fetch company profiles'
    });
  }
});

// ============================================================
// GET PROFILES FOR ONE COMPANY
// ============================================================
router.get('/user/:userId', async (req, res) => {
  try {
    const profiles = await CompanyProfile.find({
      userId: req.params.userId
    }).sort({
      createdAt: -1
    });

    res.json(profiles);
  } catch (error) {
    console.error('GET company user profiles error:', error);
    res.status(500).json({
      message: 'Failed to fetch company profiles'
    });
  }
});

// ============================================================
// CREATE NEW PROFILE
// ============================================================
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      companyName,
      location,
      industry,
      researchTopic,
      researchDescription,
      companyDescription,
      researchOffer,
      workEmail
    } = req.body;

    if (
      !userId ||
      !companyName ||
      !location ||
      !industry ||
      !researchTopic ||
      !researchDescription ||
      !companyDescription ||
      !researchOffer ||
      !workEmail
    ) {
      return res.status(400).json({
        message: 'All required fields must be provided'
      });
    }

    const now = new Date().toISOString();

    const profile = new CompanyProfile({
      profileId: new mongoose.Types.ObjectId().toString(),
      userId,
      companyName: companyName.trim(),
      location: location.trim(),
      industry: industry.trim(),
      researchTopic: researchTopic.trim(),
      researchDescription: researchDescription.trim(),
      companyDescription: companyDescription.trim(),
      researchOffer,
      workEmail: workEmail.trim(),

      createdAt: now,
      updatedAt: now,

      // Compatibility with existing matching system
      email: workEmail.trim(),
      specialization: industry.trim(),
      city: location.trim(),
      description: companyDescription.trim(),
      currentNeeds: [researchTopic.trim()],
      problemsChallenges: [],
      opportunities: [],
      researchKeywords: researchTopic
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      collaborationPreference:
        researchOffer === 'both' ? 'either' : researchOffer
    });

    const saved = await profile.save();

    res.status(201).json(saved);
  } catch (error) {
    console.error('CREATE company profile error:', error);

    res.status(500).json({
      message: 'Failed to create company profile'
    });
  }
});

// ============================================================
// UPDATE ONE PROFILE
// ============================================================
router.put('/:profileId', async (req, res) => {
  try {
    const {
      companyName,
      location,
      industry,
      researchTopic,
      researchDescription,
      companyDescription,
      researchOffer,
      workEmail
    } = req.body;

    const profile = await CompanyProfile.findOne({
      profileId: req.params.profileId
    });

    if (!profile) {
      return res.status(404).json({
        message: 'Research profile not found'
      });
    }

    profile.companyName = companyName.trim();
    profile.location = location.trim();
    profile.industry = industry.trim();
    profile.researchTopic = researchTopic.trim();
    profile.researchDescription = researchDescription.trim();
    profile.companyDescription = companyDescription.trim();
    profile.researchOffer = researchOffer;
    profile.workEmail = workEmail.trim();

    // Compatibility fields
    profile.email = workEmail.trim();
    profile.specialization = industry.trim();
    profile.city = location.trim();
    profile.description = companyDescription.trim();
    profile.currentNeeds = [researchTopic.trim()];
    profile.researchKeywords = researchTopic
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    profile.collaborationPreference =
      researchOffer === 'both' ? 'either' : researchOffer;

    profile.updatedAt = new Date().toISOString();

    const updated = await profile.save();

    res.json(updated);
  } catch (error) {
    console.error('UPDATE company profile error:', error);

    res.status(500).json({
      message: 'Failed to update company profile'
    });
  }
});

// ============================================================
// DELETE ONE PROFILE
// ============================================================
router.delete('/:profileId', async (req, res) => {
  try {
    const deleted = await CompanyProfile.findOneAndDelete({
      profileId: req.params.profileId
    });

    if (!deleted) {
      return res.status(404).json({
        message: 'Research profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Research profile deleted successfully',
      profileId: deleted.profileId
    });
  } catch (error) {
    console.error('DELETE company profile error:', error);

    res.status(500).json({
      message: 'Failed to delete company profile'
    });
  }
});

module.exports = router;