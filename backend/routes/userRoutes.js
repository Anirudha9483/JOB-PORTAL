const express = require('express');
const router = express.Router();
const { uploadResume, getAllCandidates, getUserProfile, updateUserProfile,saveQuizResult } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Job Seeker Routes
router.get('/profile', protect(['User']), getUserProfile);
router.put('/profile', protect(['User']), updateUserProfile);
router.post('/upload-resume', protect(['User']), upload.single('resume'), uploadResume);
// --- ADD THIS LINE FOR THE QUIZ ---
router.post('/quiz', protect(['User']), saveQuizResult);


// Employer Routes
router.get('/candidates', protect(['Company', 'Admin']), getAllCandidates);

module.exports = router;