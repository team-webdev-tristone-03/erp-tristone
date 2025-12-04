const mongoose = require('mongoose');

const staffAttendanceSchema = new mongoose.Schema({
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  staffName: { type: String, required: true },
  staffEmail: { type: String, required: true },
  staffSubject: { type: String },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent', 'late'], required: true },
  remarks: String
}, { timestamps: true });

module.exports = mongoose.model('StaffAttendance', staffAttendanceSchema);