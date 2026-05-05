const multer = require('multer');
const path = require('path');

// Configure how and where Multer saves files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files to the "uploads" folder
    },
    filename: (req, file, cb) => {
        // Name the file securely: UserId - Timestamp - OriginalExtension (.pdf)
        cb(null, req.user.id + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Filter to only accept PDFs and Word documents
const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only PDF and Word documents are allowed!'));
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
    fileFilter: fileFilter
});

module.exports = upload;