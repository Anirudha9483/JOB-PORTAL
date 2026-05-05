const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: { type: String, default: '' },
  role: { type: String, default: 'User' },
  
  // --- CORE PROFILE SECTIONS ---
  phone: { type: String, default: '' },
  location: { type: String, default: '' }, 
  bio: { type: String, default: '' },
  education: { type: String, default: '' },
  experience: { type: String, default: '' },
  projects: { type: String, default: '' }, 
  
  // --- JOB PREFERENCES ---
  expectedSalary: { type: String, default: '' }, // NEW
  preferredJobType: { type: String, default: 'Full-time' }, // NEW
  
  // --- LINKS & MEDIA ---
  portfolioUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' }, // NEW
  githubUrl: { type: String, default: '' }, // NEW
  twitterUrl: { type: String, default: '' }, // NEW
  resume: { type: String, default: '' },

  // --- ARRAYS ---
  skills: [{ type: String }],
  
  // --- FOR QUIZZES & ASSESSMENTS ---
  assessments: [{ 
    testName: String, 
    score: String, 
    dateTaken: { type: Date, default: Date.now } 
  }]
  
}, { timestamps: true }); 

module.exports = mongoose.model('User', userSchema);