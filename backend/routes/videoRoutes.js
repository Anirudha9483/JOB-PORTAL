const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const protect = require('../middleware/authMiddleware');

// --- ADD A NEW VIDEO ---
router.post('/', protect(['Company']), async (req, res) => {
    try {
        const { title, url } = req.body;
        const newVideo = new Video({ companyId: req.user.id, title, url });
        await newVideo.save();
        res.status(201).json({ message: "Video added!", video: newVideo });
    } catch (error) {
        res.status(500).json({ message: "Error adding video", error: error.message });
    }
});

// --- GET ALL VIDEOS FOR THIS COMPANY ---
router.get('/company', protect(['Company']), async (req, res) => {
    try {
        const videos = await Video.find({ companyId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: "Error fetching videos", error: error.message });
    }
});

// --- GET ALL VIDEOS FOR USERS ---
router.get('/', protect(['User', 'Company']), async (req, res) => {
    try {
        // Fetch all videos and attach the company name so the user knows who posted it
        const videos = await Video.find().populate('companyId', 'companyName').sort({ createdAt: -1 });
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: "Error fetching videos", error: error.message });
    }
});

// --- DELETE A VIDEO ---
router.delete('/:id', protect(['Company']), async (req, res) => {
    try {
        await Video.findOneAndDelete({ _id: req.params.id, companyId: req.user.id });
        res.status(200).json({ message: "Video deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting video", error: error.message });
    }
});



module.exports = router;