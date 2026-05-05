const express = require('express');
const router = express.Router();
const { 
    getAllJobs, 
    createJob, 
    deleteJob, 
    updateJob, 
    getCompanyJobs 
} = require('../controllers/jobController');
const protect = require('../middleware/authMiddleware');

// --- PUBLIC ROUTES ---
// Anyone can see the global job board
router.get('/', getAllJobs);

// --- PROTECTED COMPANY ROUTES ---
// All routes below this line require a 'Company' role
router.use(protect(['Company'])); 

// Get only the jobs posted by the logged-in company (For Manage Jobs page)
router.get('/my-jobs', getCompanyJobs);

// Post a new job
router.post('/', createJob);

// Update an existing job
router.put('/:id', updateJob);

// Delete a job
router.delete('/:id', deleteJob);

module.exports = router;