const Job = require('../models/Job');

// GET ALL JOBS (Public)
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('companyId', 'companyName email');
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching jobs", error: error.message });
    }
};

// CREATE A JOB (Protected - Company Only)
exports.createJob = async (req, res) => {
    try {
        const { title, type, industry, description } = req.body;
        
        const newJob = new Job({
            companyId: req.user.id, // Comes from the JWT token middleware
            title,
            type,
            industry,
            description
        });

        await newJob.save();
        res.status(201).json({ message: "Job posted successfully!", job: newJob });
    } catch (error) {
        res.status(500).json({ message: "Error creating job", error: error.message });
    }
};

// @desc    Get all jobs posted by the logged-in company
exports.getCompanyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ companyId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Update a job
exports.updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Ensure user owns the job
        if (job.companyId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to update this job" });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Job updated", job });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Delete a job
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Ensure user owns the job
        if (job.companyId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to delete this job" });
        }

        await job.deleteOne();
        res.status(200).json({ message: "Job removed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};