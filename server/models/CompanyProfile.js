const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    profileId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    userId: {
      type: String,
      required: true,
      index: true
    },

    companyName: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    industry: {
      type: String,
      required: true
    },

    researchTopic: {
      type: String,
      required: true
    },

    researchDescription: {
      type: String,
      required: true
    },

    companyDescription: {
      type: String,
      required: true
    },

    researchOffer: {
      type: String,
      enum: ['free', 'stipend', 'both'],
      required: true
    },

    workEmail: {
      type: String,
      required: true
    },

    createdAt: {
      type: String,
      required: true
    },

    updatedAt: {
      type: String,
      required: true
    },

    /*
     * Legacy fields are kept temporarily so your existing
     * Student ↔ Company matching code does not break.
     */
    email: String,
    phone: String,
    specialization: String,
    city: String,
    description: String,
    currentNeeds: [String],
    problemsChallenges: [String],
    opportunities: [String],
    researchKeywords: [String],
    collaborationPreference: {
      type: String,
      enum: ['free', 'stipend', 'either']
    }
  },
  {
    collection: 'companyprofiles'
  }
);

module.exports = mongoose.model('CompanyProfile', companySchema);