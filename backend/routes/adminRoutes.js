const express = require('express');
const router = express.Router();
const { 
    getPlatformStats, 
    getAllUsers, 
    getAllCompanies, 
    getAllApplications,
    deleteCompany
} = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');

// Protect all admin routes
router.use(protect(['Admin']));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.get('/companies', getAllCompanies);
router.get('/applications', getAllApplications);
router.delete('/companies/:id', deleteCompany);

module.exports = router;