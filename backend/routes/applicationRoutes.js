const express = require('express');
const router = express.Router();
const { 
    applyForJob, 
    getUserApplications, 
    getCompanyApplications, 
    updateApplicationStatus,
    sendTest,
    getApplicationTest, 
    submitApplicationTest,
    scheduleInterview
} = require('../controllers/applicationController');
const protect = require('../middleware/authMiddleware'); // Your JWT middleware

// --- JOB SEEKER (USER) ROUTES ---
router.post('/apply', protect(['User']), applyForJob);
router.get('/user', protect(['User']), getUserApplications);

// The Assessment endpoints
router.get('/:id/test', protect(['User']), getApplicationTest); // Fetch custom test questions
router.put('/:id/submit-test', protect(['User']), submitApplicationTest); // Submit score

// --- EMPLOYER (COMPANY) ROUTES ---
router.get('/company', protect(['Company']), getCompanyApplications);
router.put('/:id/status', protect(['Company']), updateApplicationStatus); 
router.put('/:id/send-test', protect(['Company']), sendTest); 
router.put('/:id/schedule', protect(['Company']), scheduleInterview); 

module.exports = router;