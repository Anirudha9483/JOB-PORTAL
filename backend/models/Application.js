const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    // Links to other collections
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // Strict ATS Status Flow
    status: { 
        type: String, 
        enum: ['Applied', 'Test Sent', 'Test Completed', 'Interview Scheduled', 'Accepted', 'Rejected'],
        default: 'Applied' 
    },

    // Interview & Scoring Fields
    testScore: { type: Number, default: null },
    interviewDate: { type: Date, default: null },
    interviewLink: { type: String, default: '' },
    
    // --- THIS IS THE CRITICAL LINE THAT WAS MISSING ---
    // It tells MongoDB to save the Custom Test ID so the user can take it!
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', default: null }

}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);