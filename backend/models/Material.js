const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  fileUrl: { type: String, required: true },
  fileType: String,
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  class: String
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
