const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);