const Application = require('../models/Application');
const Job = require('../models/Job');
const Test = require('../models/Test');
const mongoose = require('mongoose');

// --- 1. USER: APPLY FOR A JOB ---
exports.applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.user?.id;

        if (!jobId) return res.status(400).json({ message: "Job ID is required." });
        if (!mongoose.Types.ObjectId.isValid(jobId)) return res.status(400).json({ message: "Invalid job ID." });
        if (!userId) return res.status(401).json({ message: "Invalid or expired token." });

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found." });
        if (!job.companyId) return res.status(400).json({ message: "This job is missing company details." });

        const existingApp = await Application.findOne({ jobId, userId });
        if (existingApp) return res.status(400).json({ message: "You have already applied for this position." });

        const newApplication = new Application({
            jobId,
            userId,                     
            companyId: job.companyId,   
            status: 'Applied'
        });

        await newApplication.save();
        res.status(201).json({ message: "Application submitted successfully!", application: newApplication });

    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid application data.", error: error.message });
        }
        res.status(500).json({ message: "Error applying for job", error: error.message });
    }
};

// --- 2. USER: GET MY APPLICATIONS ---
exports.getUserApplications = async (req, res) => {
    try {
        const applications = await Application.find({ userId: req.user.id })
            .populate('jobId', 'title') 
            .populate('companyId', 'name email companyName') 
            .populate('testId', 'testName duration') // Populate test details so the UI can show the name
            .sort({ createdAt: -1 });
            
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user applications", error: error.message });
    }
};

// --- 3. COMPANY: GET APPLICATIONS FOR MY JOBS ---
exports.getCompanyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ companyId: req.user.id })
            .populate('userId', 'name email skills resume')
            .populate('jobId', 'title type')
            .populate('testId', 'testName'); // Let the company see which test was assigned
            
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching applicants", error: error.message });
    }
};

// --- 4. COMPANY: UPDATE APPLICATION STATUS ---
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        const application = await Application.findOneAndUpdate(
            { _id: applicationId, companyId: req.user.id },
            { status },
            { new: true }
        );

        if (!application) return res.status(404).json({ message: "Application not found or unauthorized." });
        res.status(200).json({ message: `Application status updated to ${status}`, application });
    } catch (error) {
        res.status(500).json({ message: "Error updating status", error: error.message });
    }
};

// --- 5. COMPANY: SEND SPECIFIC TEST TO APPLICANT ---
exports.sendTest = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const requestedTestId = req.body?.testId;
        let selectedTestId = requestedTestId;

        // If frontend did not pass testId, pick the latest active company test
        if (!selectedTestId) {
            const latestTest = await Test.findOne({ companyId: req.user.id, isActive: true })
                .sort({ createdAt: -1 })
                .select('_id');

            if (!latestTest) {
                return res.status(400).json({ message: "No assessment found. Please create a test first." });
            }
            selectedTestId = latestTest._id;
        } else {
            // Safety: ensure the selected test belongs to this company
            const ownedTest = await Test.findOne({ _id: selectedTestId, companyId: req.user.id }).select('_id');
            if (!ownedTest) {
                return res.status(403).json({ message: "You can only send assessments created by your company." });
            }
        }

        const application = await Application.findOneAndUpdate(
            { _id: applicationId, companyId: req.user.id },
            { status: 'Test Sent', testId: selectedTestId },
            { new: true }
        );

        if (!application) return res.status(404).json({ message: "Application not found." });
        res.status(200).json({ message: "Assessment securely dispatched to candidate!", application });
    } catch (error) {
        res.status(500).json({ message: "Error sending test", error: error.message });
    }
};
// --- 6. USER: GET SPECIFIC TEST FOR CANDIDATE ---
exports.getApplicationTest = async (req, res) => {
    try {
        // Find the application and populate the full test object
        const application = await Application.findOne({ _id: req.params.id, userId: req.user.id }).populate('testId');
        
        if (!application) {
            return res.status(404).json({ message: "Application not found." });
        }

        if (!application.testId) {
            return res.status(404).json({ message: "No test has been assigned to this application yet." });
        }

        /* SECURITY NOTE: For a highly secure production app, you would strip out `correctAnswer` here 
          and validate the score on the backend. Since our frontend calculates the score locally for now, 
          we send the full object.
        */
        res.status(200).json(application.testId);
    } catch (error) {
        res.status(500).json({ message: "Error fetching test details", error: error.message });
    }
};

// --- 7. USER: SUBMIT TIMED TEST ---
exports.submitApplicationTest = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { score } = req.body;

        const application = await Application.findOneAndUpdate(
            { _id: applicationId, userId: req.user.id },
            { status: 'Test Completed', testScore: score },
            { new: true }
        );

        if (!application) return res.status(404).json({ message: "Application not found or unauthorized." });
        res.status(200).json({ message: "Test submitted successfully!", application });
    } catch (error) {
        res.status(500).json({ message: "Error submitting test", error: error.message });
    }
};

// --- 8. COMPANY: SCHEDULE INTERVIEW ---
exports.scheduleInterview = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { interviewDate, interviewLink } = req.body;

        const application = await Application.findOneAndUpdate(
            { _id: applicationId, companyId: req.user.id },
            {
                status: 'Interview Scheduled',
                interviewDate,
                interviewLink
            },
            { new: true }
        );

        if (!application) return res.status(404).json({ message: "Application not found." });
        res.status(200).json({ message: "Interview scheduled successfully!", application });
    } catch (error) {
        res.status(500).json({ message: "Error scheduling interview", error: error.message });
    }
};


exports.getUserApplications = async (req, res) => {
    try {
        const applications = await Application.find({ userId: req.user.id })
            .populate('jobId') // This brings in all job details (title, description, etc.)
            .populate('companyId', 'companyName email') 
            .sort({ createdAt: -1 });
            
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching history", error: error.message });
    }
};
