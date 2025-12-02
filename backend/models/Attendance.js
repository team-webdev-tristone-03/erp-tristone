const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent', 'late'], required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  remarks: String
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
