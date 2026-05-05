const User = require('../models/User');

exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please select a file to upload." });
        }

        // The URL path where the frontend can access the file
        const resumePath = `/uploads/${req.file.filename}`;

        // Find the logged-in user and update their resume field
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { resume: resumePath },
            { new: true } // Return the updated document
        );

        res.status(200).json({ 
            message: "Resume uploaded successfully!", 
            resumeUrl: updatedUser.resume 
        });

    } catch (error) {
        res.status(500).json({ message: "Error uploading file.", error: error.message });
    }
};



// --- FETCH ALL CANDIDATES (For Employers) ---
exports.getAllCandidates = async (req, res) => {
    try {
        // We changed the .select() to simply exclude the password (-password), 
        // meaning it will now send the bio, education, experience, etc!
        const candidates = await User.find({ role: 'User' }).select('-password');
            
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ message: "Error fetching candidates", error: error.message });
    }
};

// GET USER PROFILE
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
};

// UPDATE USER PROFILE
exports.updateUserProfile = async (req, res) => {
    try {
        const { name, phone, bio, education, experience, portfolioUrl, skills } = req.body;

        // Convert comma-separated skills into an array if it's a string
        let skillsArray = skills;
        if (typeof skills === 'string') {
            skillsArray = skills.split(',').map(skill => skill.trim());
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, phone, bio, education, experience, portfolioUrl, skills: skillsArray },
            { new: true }
        ).select('-password');

        res.status(200).json({ message: "Profile updated successfully!", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

// --- SAVE QUIZ RESULT ---
exports.saveQuizResult = async (req, res) => {
    try {
        const { testName, score } = req.body;
        
        // Find the user and push the new quiz result to their assessments array
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $push: { assessments: { testName, score } } },
            { new: true }
        ).select('-password');

        res.status(200).json({ message: "Quiz score saved successfully!", user });
    } catch (error) {
        res.status(500).json({ message: "Error saving quiz result", error: error.message });
    }
};

exports.saveQuizResult = async (req, res) => {
    try {
        const { testName, score } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $push: { assessments: { testName, score } } },
            { new: true }
        ).select('-password');
        res.status(200).json({ message: "Quiz score saved successfully!", user });
    } catch (error) {
        res.status(500).json({ message: "Error saving quiz result", error: error.message });
    }
};