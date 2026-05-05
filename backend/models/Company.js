const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  industry: { type: String },
  role: { type: String, default: 'Company' }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);