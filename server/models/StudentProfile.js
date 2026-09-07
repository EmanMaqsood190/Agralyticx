const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    // User account ID
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    // Basic information
    name: String,

    email: String,

    phone: String,

    university: String,

    degree: String,

    semester: String,

    // Main research information
    researchArea: String,

    researchTopic: String,

    projectTitle: String,

    // Research keywords entered by the student
    researchKeywords: [String],

    // Research interests
    researchInterests: String,

    // Research category/niche
    researchNiches: [String],

    // Used when student selects a custom research niche
    customResearchNiche: String,

    // Skills
    skills: [String],

    // Profile description / bio
    description: String,

    bio: String,

    // Funding preference
    fundingPreference: {
      type: String,
      enum: ['free', 'stipend', 'either'],
      default: 'either'
    },

    // Collaboration
    availableForCollaboration: {
      type: Boolean,
      default: true
    },

    // Portfolio
    portfolioUrl: String,

    // Last profile update
    updatedAt: String
  },
  {
    collection: 'studentprofiles'
  }
);

module.exports = mongoose.model(
  'StudentProfile',
  studentSchema
);
