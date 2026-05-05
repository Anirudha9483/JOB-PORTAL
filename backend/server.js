const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();



// Initialize Express App
const app = express();

// Middleware
app.use(cors()); // Allow requests from our React app
app.use(express.json()); // Parse incoming JSON data
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/uploads', express.static('uploads'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/tests', require('./routes/testRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.log('❌ MongoDB Connection Error: ', err));

// Basic Test Route
app.get('/', (req, res) => {
  res.send('Job Portal API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
