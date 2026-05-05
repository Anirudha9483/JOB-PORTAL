const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

exports.getPlatformStats = async (req, res) => {
    try {
        // 1. Calculate top-level KPIs using countDocuments()
        const totalUsers = await User.countDocuments({ role: 'User' });
        const totalCompanies = await Company.countDocuments({ role: 'Company' });
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();

        // 2. Aggregate jobs by Industry for the Pie Chart
        // This groups all jobs by their "industry" field and counts them!
        const industryData = await Job.aggregate([
            { $group: { _id: "$industry", value: { $sum: 1 } } },
            { $project: { name: "$_id", value: 1, _id: 0 } } // Renames _id to "name" for Recharts
        ]);

        // 3. For the Bar Chart: Count accepted vs total applications
        const acceptedApps = await Application.countDocuments({ status: 'Accepted' });
        
        // (In a production app, you would group these by month. We will send a simplified trend array here)
        const applicationsData = [
            { name: 'Total Apps', applications: totalApplications, accepted: acceptedApps }
        ];

        res.status(200).json({
            kpiData: { totalUsers, totalCompanies, totalJobs, totalApplications },
            industryData,
            applicationsData
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching admin stats", error: error.message });
    }
};

// --- ADD THESE FUNCTIONS TO THE BOTTOM OF adminController.js ---

// GET ALL USERS (Job Seekers)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'User' }).select('-password'); // Exclude passwords
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

// GET ALL COMPANIES
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find({ role: 'Company' }).select('-password');
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: "Error fetching companies", error: error.message });
    }
};

// GET ALL APPLICATIONS GLOBALLY
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('userId', 'name email')
            .populate('jobId', 'title')
            .populate('companyId', 'companyName');
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching applications", error: error.message });
    }
};

// DELETE A COMPANY
exports.deleteCompany = async (req, res) => {
    try {
        await Company.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Company deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting company", error: error.message });
    }
};